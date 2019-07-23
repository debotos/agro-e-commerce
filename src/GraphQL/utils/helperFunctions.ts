export const getCloudinaryPublicId = (url: string): string => {
	const projectName: string = process.env.PROJECT_NAME || ''
	const urlPortion = url
		.split(projectName)[1]
		.replace('.jpg', '')
		.replace('.png', '')
		.replace('.jpeg', '')

	return projectName + urlPortion
}
