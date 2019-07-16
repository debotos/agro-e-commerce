import * as Data from './dummyStore'

const createUsersWithMessages = async (models: any) => {
	/* 1. User & Message */
	for (let entry of Data.UserWithMessageData) {
		await models.User.create(entry, {
			include: [models.Message]
		})
	}

	/* 2. Category & Products */
	for (let entry of Data.CategoryWithProductData) {
		await models.Category.create(entry, {
			include: [models.Product]
		})
	}
}

export { createUsersWithMessages }
