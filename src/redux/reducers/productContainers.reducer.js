import {
	combineReducers
} from 'redux';

export const productContainersArray = (state = [], action) => {
	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_PRODUCT_CONTAINERS':
			return action.payload;
		default:
			return state;
	}
}

export default combineReducers({
	productContainersArray,
});