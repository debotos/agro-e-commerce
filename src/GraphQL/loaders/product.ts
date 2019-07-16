const batchProducts = async (keys: string[], models: any) => {
	const products = await models.Product.findAll({ where: { id: keys } })

	return keys.map(key => products.find((product: any) => product.id === key))
}

export default batchProducts
