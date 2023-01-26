import {
	combineReducers
} from 'redux';

export const dosageRatesArray = (state = [], action) => {
	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_DOSAGE_RATES':
			return action.payload;
		default:
			return state;
	}
}


export default combineReducers({
	dosageRatesArray,
});