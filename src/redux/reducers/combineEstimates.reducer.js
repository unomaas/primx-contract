import {
  combineReducers
} from 'redux';

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
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {
        licensee_id: 0,
        first_estimate_number: "",
        second_estimate_number: "",
        third_estimate_number: ""
      };
    default:
      return state;
  } // End switch
}; // End searchQuery


// This reducer sets the object with the mutated/mathed data from all of hte combined estimates:
export const calcCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CALCULATED_COMBINED_ESTIMATE':
      return action.payload;
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {};
    default:
      return state;
  } // End switch
}; // End setCalcEstimate


// This reducer sets the object with the first estimate data from all of hte combined estimates:
export const firstCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FIRST_COMBINED_ESTIMATE':
      return action.payload;
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {};
    default:
      return state;
  } // End switch
}; // End firstCombinedEstimate


// This reducer sets the object with the second estimate data from all of hte combined estimates:
export const secondCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_SECOND_COMBINED_ESTIMATE':
      return action.payload;
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {};
    default:
      return state;
  } // End switch
}; // End secondCombinedEstimate


// This reducer sets the object with the third estimate data from all of hte combined estimates:
export const thirdCombinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_THIRD_COMBINED_ESTIMATE':
      return action.payload;
    case 'CLEAR_THIRD_COMBINED_ESTIMATE':
      return {};
    case 'CLEAR_COMBINED_ESTIMATES_DATA':
      return {};
    default:
      return state;
  } // End switch
}; // End thirdCombinedEstimate


// This reducer sets the object with the first estimate data from all of hte combined estimates:
export const showCombinedTable = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_COMBINED_TABLE':
      return true;
    case 'HIDE_COMBINED_TABLE':
      return false;
    default:
      return state;
  } // End switch
}; // End showCombinedTable


export default combineReducers({
  combineQuery, // ⬅ The query search from the combined estimates page.
  calcCombinedEstimate, // ⬅ The mutated object with all the totals and math.
  firstCombinedEstimate, // ⬅ The first estimate used in the combination.
  secondCombinedEstimate, // ⬅ The second estimate used in the combination.
  thirdCombinedEstimate, // ⬅ The third estimate used in the combination.
  showCombinedTable, // ⬅ The show table state for the combined estimates. 
});
