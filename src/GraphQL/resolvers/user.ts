import jwt from 'jsonwebtoken'
import { combineResolvers } from 'graphql-resolvers'
import { AuthenticationError, UserInputError } from 'apollo-server'

import { isAdmin, isAuthenticated } from './middleware/authorization'
import { uploadOneImage, deleteImages } from '../utils/cloudinary'
import logger from '../../common/logger'

const expiresTime: string = process.env.JWT_TIMEOUT || '60m'

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
				order: [['createdAt', 'DESC']]
			})
		},
		user: async (_: any, { id }: any, { models }: any) => {
			return await models.User.findByPk(id)
		},
		me: async (_: any, __: any, { models, me }: any) => {
			if (!me) return null
			return await models.User.findByPk(me.id)
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
			async (_: any, { image }: any, { me, models }: any) => {
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

				const { createReadStream }: any = await image
				const stream = createReadStream()
				const path = `${me.role}/${me.user_name}`
				const response = await uploadOneImage(stream, path)
				if (!response) {
					throw new Error('Failed to upload profile image.')
				}
				await models.User.update({ image: response }, { where: { id: me.id } })
				return response
			}
		),

		deleteUser: combineResolvers(isAdmin, async (_: any, { id }: any, { models }: any) => {
			if (!id) {
				throw new UserInputError('Invalid user id.')
			}
			const user = await models.User.findByPk(id)
			if (!user) throw new UserInputError('Invalid user id.')
			await deleteUserAsset(user, models)
			return await models.User.destroy({
				where: { id }
			})
		}),

		deleteMe: combineResolvers(isAuthenticated, async (_: any, __: any, { me, models }: any) => {
			const { id } = me
			const user = await models.User.findByPk(id)
			if (!user) {
				logger.error(`User with ${id} doesn't exist in DB.`)
			}
			await deleteUserAsset(user, models)
			return await models.User.destroy({
				where: { id }
			})
		})
	},

	User: {
		messages: async (user: any, __: any, { models }: any) => {
			return await models.Message.findAll({
				order: [['createdAt', 'DESC']],
				where: {
					userId: user.id
				}
			})
		},
		products: async (user: any, __: any, { models }: any) => {
			return await models.Product.findAll({
				order: [['createdAt', 'DESC']],
				where: {
					userId: user.id
				}
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
	const products = await models.Product.findAll({ where: { userId: user.id } })
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
