export default function createKey(input) {
	return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input
}
