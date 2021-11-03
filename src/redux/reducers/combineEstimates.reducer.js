import {
  combineReducers
} from 'redux';

// export const combineEstimatesReducer = (state = {}, action) => {
//   switch (action.type) {
//     case 'NOTHING':
//       return action.payload;
//     default:
//       return state;
//   } // End switch
// }; // End searchedEstimate

// Handles the query of a user entering estimate numbers to combine:
export const combineQuery = (state = {
  licensee_id: 0,
  first_estimate_number: "",
  second_estimate_number: "",
  third_estimate_number: ""
}, action) => {
  switch (action.type) {
    case 'SET_COMBINE_QUERY':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    // case 'CLEAR_COMBINED_ESTIMATES_DATA':
    //   return {
    //     licensee_id: 0,
    //     first_estimate_number: "",
    //     second_estimate_number: "",
    //     third_estimate_number: ""
    //   };
    default:
      return state;
  } // End switch
}; // End searchQuery

// searchedEstimate comes from the licenseeForm saga, which sends back a single estimate object from the DB after running the useEstimateCalculations
// function on it
export const firstCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FIRST_ESTIMATE_QUERY_RESULT':
      return action.payload;
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {};
    default:
      return state;
  } // End switch
}; // End searchedEstimate

// secondSearchedEstimate comes from multipleEstimate Saga, which adds returns another estimate object from DB after running useEstimateCalculations
export const secondCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_SECOND_ESTIMATE_QUERY_RESULT':
      return action.payload;
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {};
    default:
      return state;
  } // End switch
}; // End searchedEstimate

// ThirdSearchedEstimate comes from multipleEstimate Saga, which adds returns another estimate object from DB after running useEstimateCalculations
export const thirdCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_THIRD_ESTIMATE_QUERY_RESULT':
      return action.payload;
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {};
    default:
      return state;
  } // End switch
}; // End searchedEstimate

// This reducer holds an array of objects (which are existing estimates), which is then looped through to build the totals for the estimate math machine:
export const combinedEstimatesArray = (state = [], action) => {
  switch (action.type) {
    case 'SET_ESTIMATE_COMBINED_DATA':
      return [...state, action.payload];
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return [];
    default:
      return state;
  } // End switch
}; // End searchedEstimate

// This reducer sets the object with the mutated/mathed data from all of hte combined estimates:
export const setCalcCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CALCULATED_COMBINED_ESTIMATE':            
        return action.payload;
    default:
        return state;
  } // End switch
}; // End setCalcEstimate

// This reducer sets the object with the mutated/mathed data from all of hte combined estimates:
export const combinedEstimateTotals = (state = {}, action) => {
  switch (action.type) {
    case 'SET_TOTALS_COMBINED_ESTIMATE':            
        return action.payload;
    default:
        return state;
  } // End switch
}; // End setCalcEstimate


export default combineReducers({
  combineQuery,
  firstCombinedEstimate,
  secondCombinedEstimate,
  thirdCombinedEstimate,
  combinedEstimatesArray,
  setCalcCombinedEstimate,
  combinedEstimateTotals,
});
