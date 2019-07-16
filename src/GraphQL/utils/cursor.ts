/* 
	The client shouldn’t care about the format or the actual value of the cursor, 
	so we’ll ask the cursor with a hash function that uses a base64 encoding 
*/
const toCursorHash = (string: string) => {
	return Buffer.from(string).toString('base64')
}
const fromCursorHash = (string: string) => {
	return Buffer.from(string, 'base64').toString('ascii')
}

export { toCursorHash, fromCursorHash }
