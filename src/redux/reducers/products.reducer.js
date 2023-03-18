import { combineReducers } from 'redux';

// Products array is the full array of product data as it comes back from the database. It's used in the AdminUpdateMaterials component
const productsArray = (state = [], action) => {
	switch (action.type) {
		case 'SET_PRODUCTS_ARRAY':
			return action.payload;
		default:
			return state;
	}
};

const productsObject = (state = {}, action) => {
	switch (action.type) {
		case 'SET_PRODUCTS_OBJECT':
			return action.payload;
		default:
			return state;
	}
};

const productCostHistoryRecent = (state = [], action) => {
	switch (action.type) {
		case 'SET_PRODUCT_COST_HISTORY_RECENT':
			return action.payload;
		default:
			return state;
	}
};

// ⬇ Set the current markup margin:
const currentMarkupMargin = (state = [], action) => {
	switch (action.type) {
		case 'SET_MARKUP_MARGIN':
			return action.payload;
		default:
			return state;
	}
};

const markupHistoryRecent = (state = [], action) => {
	switch (action.type) {
		case 'SET_MARKUP_HISTORY_RECENT':
			return action.payload;
		default:
			return state;
	}
};

const markupHistory12Months = (state = [], action) => {
	switch (action.type) {
		case 'SET_MONTHLY_MARKUP_PRICING':
			return action.payload;
		default:
			return state;
	}
};





// user will be on the redux state at:
// state.user
export default combineReducers({
	productsArray,
	productsObject,
	productCostHistoryRecent,
	currentMarkupMargin,
	markupHistoryRecent,
	markupHistory12Months,

});
