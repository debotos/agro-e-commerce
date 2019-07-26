import Sequelize from 'sequelize'
import { combineResolvers } from 'graphql-resolvers'
import { UserInputError } from 'apollo-server'

import pubsub, { EVENTS } from '../subscription'
import { isAuthenticated, isAdmin } from './middleware/authorization'
import { toCursorHash, fromCursorHash } from '../utils/cursor'

export default {
	Query: {
		pendingOrders: combineResolvers(
			isAdmin,
			async (_: any, { limit = 15, page = 1 }: any, { models }: any) => {
				const options: any = { where: { pending: true } }

				const orders = await models.Order.findAll({
					order: [['createdAt', 'DESC']],
					...options,
					raw: true
				})

				return Paginator(orders.map((x: any, i: number) => ({ ...x, serial: i + 1 })), limit, page)
			}
		),

		acceptedOrders: combineResolvers(
			isAdmin,
			async (_: any, { limit = 15, page = 1 }: any, { models }: any) => {
				const options: any = { where: { pending: false, accepted: true } }

				const orders = await models.Order.findAll({
					order: [['createdAt', 'DESC']],
					...options,
					raw: true
				})

				return Paginator(orders.map((x: any, i: number) => ({ ...x, serial: i + 1 })), limit, page)
			}
		),

		rejectedOrders: combineResolvers(
			isAdmin,
			async (_: any, { limit = 15, page = 1 }: any, { models }: any) => {
				const options: any = { where: { pending: false, accepted: false } }

				const orders = await models.Order.findAll({
					order: [['createdAt', 'DESC']],
					...options,
					raw: true
				})

				return Paginator(orders.map((x: any, i: number) => ({ ...x, serial: i + 1 })), limit, page)
			}
		),

		completeOrders: combineResolvers(
			isAdmin,
			async (_: any, { limit = 15, page = 1 }: any, { models }: any) => {
				const options: any = { where: { complete: true } }

				const orders = await models.Order.findAll({
					order: [['createdAt', 'DESC']],
					...options,
					raw: true
				})

				return Paginator(orders.map((x: any, i: number) => ({ ...x, serial: i + 1 })), limit, page)
			}
		),

		buyerOrders: combineResolvers(
			isAuthenticated,
			async (_: any, { buyer_id, cursor, offset = 0, limit = 15 }: any, { models }: any) => {
				if (!buyer_id) throw new UserInputError('Please provide the buyer id.')
				const options: any = { where: { complete: false, buyer_id } }
				if (limit) {
					/* Added 1 as it will help to calculate hasNextPage: Boolean! value */
					options.limit = limit + 1
				}
				if (cursor) {
					options.where = {
						...options.where,
						createdAt: {
							[Sequelize.Op.lt]: fromCursorHash(cursor)
						}
					}
				}

				const orders = await models.Order.findAll({
					order: [
						['createdAt', 'DESC']
					] /* First, the list should be ordered by createdAt date, otherwise the cursor won’t help */,
					offset,
					...options,
					raw: true
				})

				const hasNextPage = orders.length > limit
				const edges = hasNextPage ? orders.slice(0, -1) : orders

				return {
					edges,
					pageInfo: {
						hasNextPage,
						endCursor: hasNextPage
							? toCursorHash(
									edges[edges.length - 1].createdAt.toISOString()
							  ) /* toISOString() is a moment.js function */
							: 'Not available. You are end of the page!'
					}
				}
			}
		),

		buyerHistory: combineResolvers(
			isAuthenticated,
			async (_: any, { buyer_id, cursor, offset = 0, limit = 15 }: any, { models }: any) => {
				if (!buyer_id) throw new UserInputError('Please provide the buyer id.')
				const options: any = { where: { complete: true, buyer_id } }
				if (limit) {
					/* Added 1 as it will help to calculate hasNextPage: Boolean! value */
					options.limit = limit + 1
				}
				if (cursor) {
					options.where = {
						...options.where,
						createdAt: {
							[Sequelize.Op.lt]: fromCursorHash(cursor)
						}
					}
				}

				const orders = await models.Order.findAll({
					order: [
						['createdAt', 'DESC']
					] /* First, the list should be ordered by createdAt date, otherwise the cursor won’t help */,
					offset,
					...options,
					raw: true
				})

				const hasNextPage = orders.length > limit
				const edges = hasNextPage ? orders.slice(0, -1) : orders

				return {
					edges,
					pageInfo: {
						hasNextPage,
						endCursor: hasNextPage
							? toCursorHash(
									edges[edges.length - 1].createdAt.toISOString()
							  ) /* toISOString() is a moment.js function */
							: 'Not available. You are end of the page!'
					}
				}
			}
		),

		sellerOrders: combineResolvers(
			isAuthenticated,
			async (_: any, { seller_id, cursor, offset = 0, limit = 15 }: any, { models }: any) => {
				if (!seller_id) throw new UserInputError('Please provide the seller id.')
				const options: any = { where: { complete: false, seller_id } }
				if (limit) {
					/* Added 1 as it will help to calculate hasNextPage: Boolean! value */
					options.limit = limit + 1
				}
				if (cursor) {
					options.where = {
						...options.where,
						createdAt: {
							[Sequelize.Op.lt]: fromCursorHash(cursor)
						}
					}
				}

				const orders = await models.Order.findAll({
					order: [
						['createdAt', 'DESC']
					] /* First, the list should be ordered by createdAt date, otherwise the cursor won’t help */,
					offset,
					...options,
					raw: true
				})

				const hasNextPage = orders.length > limit
				const edges = hasNextPage ? orders.slice(0, -1) : orders

				return {
					edges,
					pageInfo: {
						hasNextPage,
						endCursor: hasNextPage
							? toCursorHash(
									edges[edges.length - 1].createdAt.toISOString()
							  ) /* toISOString() is a moment.js function */
							: 'Not available. You are end of the page!'
					}
				}
			}
		),

		sellerHistory: combineResolvers(
			isAuthenticated,
			async (_: any, { seller_id, cursor, offset = 0, limit = 15 }: any, { models }: any) => {
				if (!seller_id) throw new UserInputError('Please provide the seller id.')
				const options: any = { where: { complete: true, seller_id } }
				if (limit) {
					/* Added 1 as it will help to calculate hasNextPage: Boolean! value */
					options.limit = limit + 1
				}
				if (cursor) {
					options.where = {
						...options.where,
						createdAt: {
							[Sequelize.Op.lt]: fromCursorHash(cursor)
						}
					}
				}

				const orders = await models.Order.findAll({
					order: [
						['createdAt', 'DESC']
					] /* First, the list should be ordered by createdAt date, otherwise the cursor won’t help */,
					offset,
					...options,
					raw: true
				})

				const hasNextPage = orders.length > limit
				const edges = hasNextPage ? orders.slice(0, -1) : orders

				return {
					edges,
					pageInfo: {
						hasNextPage,
						endCursor: hasNextPage
							? toCursorHash(
									edges[edges.length - 1].createdAt.toISOString()
							  ) /* toISOString() is a moment.js function */
							: 'Not available. You are end of the page!'
					}
				}
			}
		),

		order: combineResolvers(isAuthenticated, async (_: any, { id }: any, { models }: any) => {
			return await models.Order.findByPk(id, { raw: true })
		})
	},

	Mutation: {
		createOrder: combineResolvers(
			isAuthenticated,
			async (_: any, { data }: any, { me, models }: any) => {
				const { product_id } = data
				if (!product_id) throw new UserInputError('Please provide the product id.')

				const product = await models.Product.findByPk(product_id, { raw: true })
				if (!product) throw new UserInputError("Product doesn't exist.")
				const seller = await models.User.findByPk(product.userId, { raw: true })

				const order = await models.Order.create({
					...data,
					buyer_id: me.id,
					seller_id: product.userId,
					buyer_name: me.full_name,
					seller_name: seller.full_name,
					product_name: product.name
				})

				pubsub.publish(EVENTS.ORDER.CREATED, {
					orderCreated: { order }
				})

				return order
			}
		),

		rejectOrder: combineResolvers(
			isAuthenticated,
			async (_: any, { id }: any, { me, models }: any) => {
				if (!id) throw new UserInputError('Provide a valid order id')
				const order = await models.Order.findByPk(id)
				if (!order) throw new UserInputError('No order found with the given id.')
				if (me.id !== order.seller_id) {
					throw new UserInputError('You are not authorized to reject this order.')
				}
				if (!order.pending) {
					throw new UserInputError('Action already taken for this order.')
				}
				await order.update({ pending: false, accepted: false })
				return true
			}
		),

		acceptOrder: combineResolvers(
			isAuthenticated,
			async (_: any, { id }: any, { me, models }: any) => {
				if (!id) throw new UserInputError('Provide a valid order id')
				const order = await models.Order.findByPk(id)
				if (!order) throw new UserInputError('No order found with the given id.')
				if (me.id !== order.seller_id) {
					throw new UserInputError('You are not authorized to accept this order.')
				}
				if (!order.pending) {
					throw new UserInputError('Action already taken for this order.')
				}
				await order.update({ pending: false, accepted: true })
				return true
			}
		),

		deleteOrder: combineResolvers(
			isAuthenticated,
			async (_: any, { id }: any, { me, models }: any) => {
				if (!id) throw new UserInputError('Provide a valid order id')
				const order = await models.Order.findByPk(id, { raw: true })
				if (!order) throw new UserInputError('No order found with the given id.')
				if (me.id !== order.buyer_id) {
					throw new UserInputError('You are not authorized to delete this order.')
				}
				if (!order.pending && order.accepted) {
					throw new UserInputError(
						'Seller already accepted this order. Contact with the seller to cancel it.'
					)
				}
				return await models.Order.destroy({ where: { id } })
			}
		),

		/* Only Seller can cencel the order */
		/* This function will just set accepted: false */
		cancelOrder: combineResolvers(
			isAuthenticated,
			async (_: any, { id }: any, { me, models }: any) => {
				if (!id) throw new UserInputError('Provide a valid order id')
				const order = await models.Order.findByPk(id)
				if (!order) throw new UserInputError('No order found with the given id.')
				if (me.id !== order.seller_id) {
					throw new UserInputError('You are not authorized to cancel this order.')
				}
				await order.update({ pending: false, accepted: false })
				return true
			}
		),

		updateOrder: combineResolvers(
			isAuthenticated,
			async (_: any, { id, data }: any, { me, models }: any) => {
				if (!id) throw new UserInputError('Provide a valid order id')
				const order = await models.Order.findByPk(id)
				if (!order) throw new UserInputError('No order found with the given id.')
				if (me.id !== order.buyer_id) {
					throw new UserInputError('You are not authorized to update this order.')
				}
				if (!order.pending) {
					throw new UserInputError(
						`Seller already took action on this order. So, You can't update it. Instead you can create a new order.`
					)
				}
				await order.update({ ...data })
				return true
			}
		)
	},

	Order: {
		buyer: async (order: any, __: any, { loaders }: any) => {
			return await loaders.user.load(order.buyer_id)
		},
		seller: async (order: any, __: any, { loaders }: any) => {
			return await loaders.user.load(order.seller_id)
		},
		product: async (order: any, __: any, { loaders }: any) => {
			return await loaders.product.load(order.product_id)
		}
	},

	Subscription: {
		orderCreated: {
			subscribe: () => pubsub.asyncIterator(EVENTS.ORDER.CREATED)
		}
	}
}

/* Helper Funtions */

// 'per_page' means 'limit'
function Paginator(items: any, per_page: number = 15, page: number = 1) {
	// console.log(page, per_page)
	let offset = (page - 1) * per_page,
		paginatedItems = items.slice(offset).slice(0, per_page),
		total_pages = Math.ceil(items.length / per_page)

	const result = {
		page: page,
		per_page: per_page,
		pre_page: page - 1 ? page - 1 : null,
		next_page: total_pages > page ? page + 1 : null,
		has_next_page: total_pages > page ? true : false,
		total: items.length,
		total_pages: total_pages,
		edges: paginatedItems
	}
	// console.log(result)
	return result
}
