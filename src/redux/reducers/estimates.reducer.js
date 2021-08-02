import { combineReducers } from 'redux';

const today = new Date().toISOString().substring(0, 10);

// ⬇ estimatesReducer:
export const estimatesReducer = (state = {
  // measurement_units: 'imperial',
  country: 'United States',
  date_created: today,
}, action) => {
  switch (action.type) {
    // Commented out deprecated action that's not being used
    // case 'FETCH_ESTIMATE':
    //   return action.payload;
    case 'SET_ESTIMATE':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    case 'CLEAR_ESTIMATE':
      return {
        // measurement_units: 'imperial',
        country: 'United States',
        date_created: today,
      };
    default:
      return state;
  } // End switch
}; // End estimatesReducer

export const buttonState = (state = `create`, action) => {
  switch (action.type) {
    case 'SET_BUTTON_STATE':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End kitsReducer

export const tableState = (state = false, action) => {
  switch (action.type) {
    case 'SET_TABLE_STATE':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End kitsReducer

// searchedEstimate comes from the licenseeForm saga, which sends back a single estimate object from the DB after running the useEstimateCalculations
// function on it
export const searchedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ESTIMATE_QUERY_RESULT':
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  estimatesReducer,
  buttonState,
  tableState,
  searchedEstimate
});

// export default estimatesReducer;