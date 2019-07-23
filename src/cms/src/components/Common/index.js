import styled from 'styled-components'

export const Center = styled.div`
	display: flex;
	flex: ${props => props.fullHeight && 1};
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
`
export const CenterHorizontal = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`

export const Row = styled.div`
	display: flex;
	flex-direction: row; /* default */
`
export const Column = styled.div`
	display: flex;
	flex-direction: column;
`
export const RowCenter = styled.div`
	display: flex;
	flex-direction: row; /* default */
	justify-content: center;
	align-items: center;
	width: 100%;
`
