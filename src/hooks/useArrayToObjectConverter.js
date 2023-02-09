/**
 * @param {Array} array
 * @param {String} key
 * @returns {Object} object
 * @description Takes an array of objects and converts it to an object with the key being the value of the key parameter.
 * @example
 * const array = [
 * 	{
 * 		id: 1,
 * 		name: 'John',
 * 		age: 25,
 * 	},
 * 	{
 * 		id: 2,
 * 		name: 'Jane',
 * 		age: 30,
 * 	},
 * ];
 * 	 		const result = arrayToObjectConverter(array, 'id');
 * 	 		console.log(result);
 * 	 		// {
 * 	 		// 	1: {
 * 	 		// 		id: 1,
 * 	 		// 		name: 'John',
 * 	 		// 		age: 25,
 * 	 		// 	},
 * 	 		// 	2: {
 * 	 		// 		id: 2,
 * 	 		// 		name: 'Jane',
 * 	 		// 		age: 30,
 * 				// 	},
 * 	 		// };
 */
export default function useArrayToObjectConverter(array, key) {
	const result = Object.assign({}, ...array.map(property => ({ [property[key]]: property })));
	return result;
}

