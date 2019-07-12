const createUsersWithMessages = async (models: any) => {
	await models.User.create(
		{
			username: 'debotos',
			email: 'debotosdas@gmail.com',
			password: 'passmedeb',
			role: 'ADMIN',
			messages: [
				{
					text: 'Published the boilerplate'
				}
			]
		},
		{
			include: [models.Message]
		}
	)

	await models.User.create(
		{
			username: 'ripon',
			email: 'ripondas49@gmail.com',
			password: 'passmedeb',
			role: 'CONSUMER',
			messages: [
				{
					text: 'Happy to see ...'
				},
				{
					text: 'is it complete?'
				}
			]
		},
		{
			include: [models.Message]
		}
	)
}

export { createUsersWithMessages }
