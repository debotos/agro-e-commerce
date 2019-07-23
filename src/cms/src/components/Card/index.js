import styled from 'styled-components'

export const Card = styled.div`
	background: #ece9e6; /* fallback for old browsers */
	background: -webkit-linear-gradient(to right, #ffffff, #ece9e6); /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(
		to right,
		#ffffff,
		#ece9e6
	); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	padding: 1.2rem;
	min-height: 200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border: none;
	border-radius: 5px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	&:hover {
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	}
`
