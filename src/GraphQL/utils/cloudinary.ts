// @ts-ignore: '@types/cloudinary officially not available'
import cloudinary from 'cloudinary'
import uuid from 'uuid/v4'

import logger from '../../common/logger'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOneImage = async (stream: any, path: string) => {
	try {
		return new Promise((resolve, reject) => {
			const streamLoad = cloudinary.v2.uploader.upload_stream(
				{ folder: `${process.env.PROJECT_NAME}/${path}`, public_id: uuid() },
				function(error: any, result: any) {
					if (result) {
						resolve(result)
					} else {
						reject(error)
					}
				}
			)
			stream.pipe(streamLoad)
		})
	} catch (err) {
		throw new Error(`Failed to upload the image ! Err:${err.message}`)
	}
}

export const deleteImages = async (public_ids: string[]) => {
	try {
		return new Promise((resolve, reject) => {
			cloudinary.v2.api.delete_resources(public_ids, function(error: any, result: any) {
				if (error) {
					logger.error('Delete image action failed. Error: ' + error.message)
					reject(error)
				} else {
					logger.info('Delete image action successful!')
					resolve(result)
				}
			})
		})
	} catch (err) {
		throw new Error(`Failed to delete the image ! Err:${err.message}`)
	}
}

export default cloudinary
