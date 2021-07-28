const shippingCostsReducer = (state = [], action) => {
    
    switch (action.type) {
        // request from adminEstimates saga, payload is an array of estimate objects
        case 'SET_SHIPPING_COSTS':
            console.log('in shipping costs reducer, action.payload -->', action.payload);
            
            return action.payload;
        default:
            return state;
    }
}

export default shippingCostsReducer;