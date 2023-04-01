import {
	combineReducers
} from 'redux';

const defaultViewState = {
	pricingLogIsLoading: true,
	updatePricingIsLoading: true,
	updatePricingStep: 1,
	newPricingObject: {},
};

const viewState = (state = { ...defaultViewState }, action) => {
	switch (action.type) {
		case 'SET_PRICING_LOG_VIEW':
			return {
				...state,
				...action.payload,
			};
		default: return state;
	}
}

const defaultDataState = {};

const dataState = (state = {...defaultDataState}, action) => {
	switch (action.type) {
		case 'SET_PRICING_LOG_DATA':
			return {
				...state,
				...action.payload,
			};
		default: return state;
	}
}

// export default pricingLog;

export default combineReducers({
	viewState,
	dataState,
});


