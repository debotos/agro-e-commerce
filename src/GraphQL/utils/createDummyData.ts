import * as Data from './dummyStore'

const addDummyData = async (models: any) => {
	for (let entry of Data.UserWithMessageData) {
		await models.User.create(entry, {
			include: [models.Message]
		})
	}

	/* 1. User & Message */
	// let userId
	// for (let entry of Data.UserWithMessageData) {
	// 	if (entry.user_name === 'debotos') {
	// 		const user = await models.User.create(entry, {
	// 			include: [models.Message]
	// 		})
	// 		userId = user.id
	// 	} else {
	// 		await models.User.create(entry, {
	// 			include: [models.Message]
	// 		})
	// 	}
	// }

	/* 2. Category & Products */
	/* For now it's not possible because image is required field to add a category */
	// for (let entry of Data.CategoryWithProductData(userId)) {
	// 	await models.Category.create(entry, {
	// 		include: [models.Product]
	// 	})
	// }
}

export { addDummyData }
