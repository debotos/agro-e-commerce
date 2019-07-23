const cropCloudinayImage = (url, height = 120, width = 120) => {
	let urlArray = url.split('upload')
	let finalUrl = urlArray[0] + `upload/w_${width},h_${height}` + urlArray[1]
	return finalUrl
}

export default cropCloudinayImage
