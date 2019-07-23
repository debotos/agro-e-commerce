import styled, { keyframes } from 'styled-components'

const dividerAnimation = keyframes`
  0% {
			background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

export const Divider = styled.hr`
	width: ${props => (props.width ? props.width : '100%')};
	height: ${props => (props.height ? props.height : '3px')};
	background: linear-gradient(
		60deg,
		#f79533,
		#f37055,
		#ef4e7b,
		#a166ab,
		#5073b8,
		#1098ad,
		#07b39b,
		#6fba82
	);
	background-size: 300% 300%;
	animation: ${dividerAnimation} 3s ease alternate infinite;
	outline: none;
	border: none;
`
