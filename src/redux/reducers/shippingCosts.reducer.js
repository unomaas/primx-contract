import {
	combineReducers
} from 'redux';


export const shippingCostsArray = (state = [], action) => {
	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_SHIPPING_COSTS':
			return action.payload;
		default:
			return state;
	}
}
 
export const showEditModal = (state = false, action) => {
	switch (action.type) {
		case 'SHIPPING_COSTS_SHOW_EDIT_MODAL':
			return action.payload;
		default:
			return state;
	} // End switch
}; // End 

export const shippingCostHistoryAllArray = (state = [], action) => {
	switch (action.type) {
		case 'SET_SHIPPING_COST_HISTORY_ALL':
			return action.payload;
		default:
			return state;
	} // End switch
}; // End 

export const shippingCostHistoryRecentArray = (state = [], action) => {
	switch (action.type) {
		case 'SET_SHIPPING_COST_HISTORY_RECENT':
			return action.payload;
		default:
			return state;
	} // End switch
}; // End 


// export default shippingCostsReducer;

export default combineReducers({
	shippingCostsArray,
	showEditModal,
	shippingCostHistoryAllArray,
	shippingCostHistoryRecentArray
});