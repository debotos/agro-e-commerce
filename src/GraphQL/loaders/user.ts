const batchUsers = async (keys: string[], models: any) => {
	const users = await models.User.findAll({ where: { id: keys }, raw: true })

	return keys.map(key => users.find((user: any) => user.id === key))
}

export default batchUsers
