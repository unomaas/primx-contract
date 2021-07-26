const adminEstimatesReducer = (state = [], action) => {
    switch (action.type) {
        // request from adminEstimates saga, payload is an array of estimate objects
        case 'SET_ADMIN_ESTIMATES':
            return action.payload;
        default:
            return state;
    }
}

export default adminEstimatesReducer;