import {
	combineReducers
} from 'redux';

const pricingLog = (state = {
	viewState: {
		isLoading: true,
	},
	dataState: {}
}, action) => {
	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'PRICING_LOG_SET_INITIAL_DATA':
			return {
				viewState: {
					...state.viewState,
					isLoading: false,
				},
				dataState: {
					...state.dataState,
					customsDutiesHistoryAll: action.payload.customsDutiesHistoryAll,
					markupHistoryAll: action.payload.markupHistoryAll,
					productCostHistoryAll: action.payload.productCostHistoryAll,
					shippingCostHistoryAll: action.payload.shippingCostHistoryAll,
				},
			};
		default:
			return state;
	}
}

export default pricingLog;


