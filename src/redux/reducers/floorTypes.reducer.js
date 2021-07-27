const floorTypesReducer = (state = [], action) => {
    switch (action.type) {
        // request from adminEstimates saga, payload is an array of estimate objects
        case 'SET_FLOOR_TYPES':
            return action.payload;
        default:
            return state;
    }
}

export default floorTypesReducer;