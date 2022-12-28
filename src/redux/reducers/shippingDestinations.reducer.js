const shippingDestinationsReducer = (state = [], action) => {

	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_SHIPPING_DESTINATIONS':
			return action.payload;
		default:
			return state;
	}
}

export default shippingDestinationsReducer;