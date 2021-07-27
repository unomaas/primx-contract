const shippingCostsReducer = (state = [], action) => {
    switch (action.type) {
        // request from adminEstimates saga, payload is an array of estimate objects
        case 'SET_SHIPPING_COSTS':
            return action.payload;
        default:
            return state;
    }
}

export default shippingCostsReducer;