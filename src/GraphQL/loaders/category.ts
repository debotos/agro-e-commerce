const batchCategories = async (keys: string[], models: any) => {
	const categories = await models.Category.findAll({ where: { id: keys }, raw: true })

	return keys.map(key => categories.find((category: any) => category.id === key))
}

export default batchCategories
