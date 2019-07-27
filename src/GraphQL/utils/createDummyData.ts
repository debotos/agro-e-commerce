import * as Data from './dummyStore'

const addDummyData = async (models: any) => {
	/* 1. User & Message */
	let userIds: string[] = []
	for (let entry of Data.UserWithMessageData) {
		const user = await models.User.create(entry, {
			include: [models.Message]
		})
		for (let index = 0; index < 2; index++) {
			userIds.push(user.id)
		}
	}

	/* 2. Category & Products */
	let count = 0
	for (let entry of Data.CategoryWithProductData()) {
		const data = {
			...entry,
			products: entry.products.map((x: any) => ({ ...x, userId: userIds[count] }))
		}
		await models.Category.create(data, {
			include: [models.Product]
		})
		count++
	}
}

export { addDummyData }
