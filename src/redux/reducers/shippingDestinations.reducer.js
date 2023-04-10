import {
	combineReducers
} from 'redux';

const shippingActiveDestinations = (state = [], action) => {

	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_ACTIVE_SHIPPING_DESTINATIONS':
			return action.payload;
		default:
			return state;
	}
}

const shippingAllDestinations = (state = [], action) => {

	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_ALL_SHIPPING_DESTINATIONS':
			return action.payload;
		default:
			return state;
	}
}

export const showEditModal = (state = false, action) => {
	switch (action.type) {
		case 'SHIPPING_DESTINATIONS_SHOW_EDIT_MODAL':
			return action.payload;
		default:
			return state;
	} // End switch
}; // End 

export default combineReducers({
	shippingActiveDestinations,
	shippingAllDestinations,
	showEditModal,
});