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

// This reducer sets the object with the mutated/mathed data from all of hte combined estimates:
export const calcCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CALCULATED_COMBINED_ESTIMATE':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End setCalcEstimate




export default combineReducers({
  combineQuery,

  calcCombinedEstimate,
});
