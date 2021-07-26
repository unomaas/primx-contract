const placementTypesReducer = (state = [], action) => {
    switch (action.type) {
        // request from adminEstimates saga, payload is an array of estimate objects
        case 'SET_PLACEMENT_TYPES':
            return action.payload;
        default:
            return state;
    }
}

export default placementTypesReducer;