const createUsersWithMessages = async (models: any) => {
	await models.User.create(
		{
			user_name: 'debotos',
			email: 'debotosdas@gmail.com',
			password: 'passmedeb',
			role: 'ADMIN',
			full_name: 'Debotos Das',
			phone: '01790015380',
			division: 'Barishal',
			region: 'Barishal Sodor',
			address: 'Kazipara, 2nd lane',
			messages: [
				{
					text: 'Published the agro-e-commerce API'
				}
			]
		},
		{
			include: [models.Message]
		}
	)

	await models.User.create(
		{
			user_name: 'ripon',
			email: 'ripondas49@gmail.com',
			password: 'passmedeb',
			role: 'CONSUMER',
			full_name: 'Ripon Das',
			phone: '01982134040',
			division: 'Barishal',
			region: 'Barishal Sodor',
			address: 'Kazipara, 2nd lane',
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

	await models.User.create(
		{
			user_name: 'sourav',
			email: 'souravcse@gmail.com',
			password: 'souravcse',
			role: 'ADMIN',
			full_name: 'Sourav Das',
			phone: '01715761574',
			division: 'Barishal',
			region: 'Barishal Sodor',
			address: 'Bazar road, 2nd lane',
			messages: [
				{
					text: 'Checking the API ...'
				}
			]
		},
		{
			include: [models.Message]
		}
	)
}

export { createUsersWithMessages }
