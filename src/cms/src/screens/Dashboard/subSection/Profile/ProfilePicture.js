import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Avatar from '@atlaskit/avatar'
import { Spin } from 'antd'

import { notifyGraphQLError, notifySuccess } from '../../../../utils/notify'
import { Column } from '../../../../components/Common'
import cropCloudinayImage from '../../../../utils/cropImage'
import './index.css'

const CHANGE_PROFILE_IMAGE = gql`
	mutation($image: Upload!) {
		changeProfileImage(image: $image) {
			image {
				secure_url
			}
			token
		}
	}
`

class ProfilePicture extends Component {
	render() {
		const { setUser, user } = this.props
		return (
			<Mutation
				mutation={CHANGE_PROFILE_IMAGE}
				onError={error => {
					const notice = notifyGraphQLError(error)
					if (notice && notice.logoutAction) {
						setTimeout(() => this.props.setUser(null), 3500)
					}
				}}
				update={(cache, { data: { changeProfileImage } }) => {
					console.log(changeProfileImage)
					/* Just Update the UI */
					setUser({ ...user, image: changeProfileImage.image.secure_url })
					localStorage.setItem('AUTH_TOKEN', changeProfileImage.token)
					notifySuccess('Profile picture updated!')
				}}
			>
				{(changeProfileImage, { loading, data }) => {
					if (loading) return <Spin style={{ marginLeft: '15px' }} size="small" />
					return (
						<>
							<Column>
								<Avatar
									name={user.user_name}
									size="xxlarge"
									src={user.image ? cropCloudinayImage(user.image, 210, 210) : null}
									borderColor="transparent"
									isActive={false}
									isHover={false}
								/>
								<input
									style={{ marginLeft: '10px', marginTop: '5px' }}
									type="file"
									className="custom-profile-image-input"
									accept="image/png, image/jpeg, image/jpg"
									onChange={e => {
										const images = e.target.files
										if (images.length > 0) {
											changeProfileImage({ variables: { image: images[0] } })
										}
									}}
								/>
							</Column>
						</>
					)
				}}
			</Mutation>
		)
	}
}

export default ProfilePicture
