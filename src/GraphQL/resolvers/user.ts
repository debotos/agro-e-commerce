import jwt from 'jsonwebtoken'
import { combineResolvers } from 'graphql-resolvers'
import { AuthenticationError, UserInputError } from 'apollo-server'
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

import { isAdmin, isAuthenticated } from './middleware/authorization'
import { uploadOneImage, deleteImages } from '../utils/cloudinary'
import logger from '../../common/logger'

const expiresTime: string = process.env.JWT_TIMEOUT || '60m'
const MIN_PASSWORD_LENGTH: number = 8

const createToken = async (user: any, secret: string, expiresIn: string) => {
	const { id, user_name, full_name, email, phone, role, image, division, region, address } = user
	return await jwt.sign(
		{
			id,
			email,
			user_name,
			role,
			image: image ? image.secure_url : null,
			full_name,
			phone,
			address,
			region,
			division
		},
		secret,
		{
			expiresIn
		}
	)
}

export default {
	Query: {
		users: async (_: any, __: any, { models }: any) => {
			return await models.User.findAll({
				order: [['createdAt', 'DESC']],
				raw: true
			})
		},
		user: async (_: any, { id }: any, { models }: any) => {
			return await models.User.findByPk(id, { raw: true })
		},
		me: async (_: any, __: any, { models, me }: any) => {
			if (!me) return null
			return await models.User.findByPk(me.id, { raw: true })
		}
	},

	Mutation: {
		signUp: async (_: any, { data }: any, { models, jwtSecret }: any) => {
			interface signUpData {
				user_name: string
				full_name: string
				email: string
				phone: string
				password: string
				role?: string
				division: string
				region: string
				address: string
			}
			const { user_name, full_name, email, phone, password, division, region, address, role } = data
			/* Simple Validation */
			/* This is also handled by DB Model. But to make the calculation shorter it's here */
			if (password.toString().length < MIN_PASSWORD_LENGTH) {
				throw new UserInputError(
					`Passwords must be at least ${MIN_PASSWORD_LENGTH} characters long.`
				)
			}

			if (!phone) throw new UserInputError(`Invalid phone number.`)
			/* To catch NAN value error */
			try {
				if (!phoneUtil.isValidNumber(phoneUtil.parse(phone))) {
					throw new UserInputError(`Invalid phone number.`)
				}
			} catch (error) {
				logger.error(error.message)
				throw new UserInputError(error.message)
			}
			let newUser: signUpData = {
				user_name,
				full_name,
				email,
				phone,
				password,
				division,
				region,
				address
			}
			if (role) {
				if (role === 'ADMIN' || role === 'PARTNER') {
					if (process.env.ADMIN_MODE) {
						/* Add 'ADMIN' or 'PARTNER' account only if ADMIN_MODE is active via env */
						newUser['role'] = role
					} else {
						throw new UserInputError(`You are not permitted to create ${role} account.`)
					}
				} else if (role === 'CONSUMER') {
					newUser['role'] = role
				} else {
					throw new UserInputError(
						"Invalid role input. Must be one of ['ADMIN', 'PARTNER', 'CONSUMER']"
					)
				}
			}
			const user = await models.User.create(newUser)

			return { token: createToken(user, jwtSecret, expiresTime) }
		},

		signIn: async (_: any, { login, password }: any, { models, jwtSecret }: any) => {
			const user = await models.User.findByLogin(login)

			if (!user) {
				throw new UserInputError('No user found with this login credentials.')
			}

			const isValid = await user.validatePassword(password)

			if (!isValid) {
				throw new AuthenticationError('Invalid password.')
			}

			return { token: createToken(user, jwtSecret, expiresTime) }
		},

		changeProfileImage: combineResolvers(
			isAuthenticated,
			async (_: any, { image }: any, { me, models, jwtSecret }: any) => {
				/*
					const { createReadStream, filename, mimetype, encoding }: any = await image
					const stream = createReadStream()
					stream: The upload stream manages streaming the file(s) to a filesystem or any storage
									location of your choice. e.g. S3, Azure, Cloudinary, e.t.c.
					filename: The name of the uploaded file(s).
					mimetype: The MIME type of the file(s) such as text/plain, application/octet-stream, etc.
					encoding: The file encoding such as UTF-8.
				*/

				/* 1. Validate file metadata. */
				/* 2. Stream file contents into cloud storage(Here, cloudinary.com): https://nodejs.org/api/stream.html */
				/* 3. Save the uploaded file response in your DB. */
				const user = await models.User.findByPk(me.id, { raw: true })
				if (!user)
					throw new AuthenticationError('Session expired or your account has been deleted.')
				// Delete user existing profile image from cloudinary(if have)
				if (user.image) {
					const public_ids = [user.image.public_id]
					await deleteImages(public_ids)
					logger.info(`Profie image deleted of user ${user.email}`)
				}
				const { createReadStream }: any = await image
				const stream = createReadStream()
				const path = `${me.role}/${me.user_name}`
				const response = await uploadOneImage(stream, path)
				if (!response) {
					throw new Error('Failed to upload profile image.')
				}
				const [, [updatedUser]] = await models.User.update(
					{ image: response },
					{ returning: true, where: { id: me.id } }
				)
				return { token: createToken(updatedUser, jwtSecret, expiresTime), image: response }
			}
		),

		deleteUser: combineResolvers(isAdmin, async (_: any, { id }: any, { models }: any) => {
			if (!id) {
				throw new UserInputError('Invalid user id.')
			}
			const user = await models.User.findByPk(id, { raw: true })
			if (!user) throw new UserInputError('Invalid user id.')
			await deleteUserAsset(user, models)
			return await models.User.destroy({
				where: { id }
			})
		}),

		deleteMe: combineResolvers(isAuthenticated, async (_: any, __: any, { me, models }: any) => {
			const { id } = me
			const user = await models.User.findByPk(id, { raw: true })
			if (!user) {
				logger.error(`User with ${id} doesn't exist in DB.`)
			}
			await deleteUserAsset(user, models)
			return await models.User.destroy({
				where: { id }
			})
		}),

		updateProfile: combineResolvers(
			isAuthenticated,
			async (_: any, { data }: any, { me, models }: any) => {
				if (Object.keys(data).length === 0) {
					throw new UserInputError('Provide the data to update.')
				}
				/* If the user wants to update his phone number then first validate it */
				if (data.phone) {
					/* To catch NAN value error */
					try {
						if (!phoneUtil.isValidNumber(phoneUtil.parse(data.phone))) {
							throw new UserInputError(`Invalid phone number.`)
						}
					} catch (error) {
						logger.error(error.message)
						throw new UserInputError(error.message)
					}
				}
				const { id } = me
				const user = await models.User.findByPk(id, { raw: true })
				if (!user) {
					logger.error(`User with ${id} doesn't exist in DB.`)
					throw new UserInputError(`Your account has been deleted.`)
				}
				const [rowsUpdate, [updatedUser]] = await models.User.update(
					{ ...data },
					{ returning: true, where: { id: me.id } }
				)
				logger.info(`${rowsUpdate} Profile data updata associated with id: ${id}`)

				return updatedUser
			}
		),

		changeUserRole: combineResolvers(
			isAdmin,
			async (_: any, { id, role }: any, { models, me }: any) => {
				if (!id) throw new UserInputError('Invalid user id.')
				const user = await models.User.findByPk(id, { raw: true })
				if (!user) throw new UserInputError('No user found with this id.')
				if (id === me.id) throw new UserInputError(`You can't change your own role.`)
				const [rowsUpdate, [updatedUser]] = await models.User.update(
					{ role },
					{ returning: true, where: { id } }
				)
				logger.info(
					`${rowsUpdate} User with username '${user.user_name}' -> role updated from '${
						user.role
					}' to '${role}' `
				)
				return updatedUser
			}
		),

		changePassword: combineResolvers(
			isAuthenticated,
			async (_: any, { currentPassword, newPassword }: any, { me, models, jwtSecret }: any) => {
				if (!currentPassword || !newPassword) throw new UserInputError('Invalid data provided.')
				/* This is also handled by DB Model. But to make the calculation shorter it's here */
				if (newPassword.toString().length < MIN_PASSWORD_LENGTH) {
					throw new UserInputError(
						`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
					)
				}
				const { id } = me
				const user = await models.User.findByPk(id)
				if (!user) throw new AuthenticationError('Your account has been deleted.')
				const isValid = await user.validatePassword(currentPassword)
				if (!isValid) {
					throw new UserInputError('Invalid current password.')
				}
				await user.update({ password: newPassword })
				return { token: createToken(user, jwtSecret, expiresTime) }
			}
		)
	},

	User: {
		messages: async (user: any, __: any, { models }: any) => {
			return await models.Message.findAll({
				order: [['createdAt', 'DESC']],
				where: { userId: user.id },
				raw: true
			})
		},
		products: async (user: any, __: any, { models }: any) => {
			return await models.Product.findAll({
				order: [['createdAt', 'DESC']],
				where: { userId: user.id },
				raw: true
			})
		}
	}
}

/* Regular Helper Function */

const deleteUserAsset = async (user: any, models: any) => {
	// 1. Delete user profile image from cloudinary
	if (user.image) {
		const public_ids = [user.image.public_id]
		await deleteImages(public_ids)
		logger.info(`Profie image deleted of user ${user.email}`)
	}
	// 2. Delete user products image from cloudinary
	const products = await models.Product.findAll({ where: { userId: user.id }, raw: true })
	if (products) {
		const public_ids = products
			.map((x: any) => {
				if (x.images) {
					return x.images.map((image: any) => image.public_id)
				} else {
					return []
				}
			})
			.flat()
		if (public_ids.length > 0) {
			await deleteImages(public_ids)
			logger.info(`Total ${public_ids.length} images deleted from user ${user.email}`)
		}
		logger.info(`Total ${products.length} products deleted from user ${user.email}`)
	}
}
