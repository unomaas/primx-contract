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
}; // End handleEditModal


// export default shippingCostsReducer;

export default combineReducers({
	shippingCostsArray,
	showEditModal,
});