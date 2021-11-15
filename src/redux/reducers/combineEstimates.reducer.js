import {
  combineReducers
} from 'redux';

// const today = new Date().toISOString().substring(0, 10);


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

// export const estimatesCombinedReducer = (state = {
//   date_created: today,
//   project_name: "",
//   licensee_id: 0,
//   project_general_contractor: "",
//   project_manager_name: "",
//   project_manager_email: "",
//   project_manager_phone: "",
//   floor_types_id: 0,
//   placement_types_id: 0,
//   measurement_units: "",
//   anticipated_first_pour_date: "",
//   ship_to_address: "",
//   ship_to_city: "",
//   shipping_costs_id: 0,
//   zip_postal_code: "",
//   country: 0,
//   square_feet: "",
//   thickened_edge_perimeter_lineal_feet: "0",
//   primx_flow_dosage_liters: "3",
//   thickness_inches: "",
//   thickened_edge_construction_joint_lineal_feet: "0",
//   primx_steel_fibers_dosage_lbs: "60",
//   primx_cpea_dosage_liters: "",
//   square_meters: "",
//   thickened_edge_perimeter_lineal_meters: "0",
//   thickness_millimeters: "",
//   thickened_edge_construction_joint_lineal_meters: "0",
//   primx_steel_fibers_dosage_kgs: "40",
//   waste_factor_percentage: 5
// }, action) => {
//   switch (action.type) {
//     case 'SET_COMBINED_ESTIMATE':
//       // validation for waste factor percentage: value can't go below 3
//       if (action.payload.key == 'waste_factor_percentage' && action.payload.value < 3) {
//         action.payload.value = 3;
//       }
//       return {
//         ...state,
//         [action.payload.key]: action.payload.value
//       };
//     // case 'SET_EDIT_DATA':
//     //   return action.payload;
//     case 'CLEAR__COMBINED_ESTIMATE':
//       return {
//         date_created: today,
//         project_name: "",
//         licensee_id: 0,
//         project_general_contractor: "",
//         project_manager_name: "",
//         project_manager_email: "",
//         project_manager_phone: "",
//         floor_types_id: 0,
//         placement_types_id: 0,
//         measurement_units: "",
//         anticipated_first_pour_date: "",
//         ship_to_address: "",
//         ship_to_city: "",
//         shipping_costs_id: 0,
//         zip_postal_code: "",
//         country: 0,
//         square_feet: "",
//         thickened_edge_perimeter_lineal_feet: "0",
//         primx_flow_dosage_liters: "3",
//         thickness_inches: "",
//         thickened_edge_construction_joint_lineal_feet: "0",
//         primx_steel_fibers_dosage_lbs: "60",
//         primx_cpea_dosage_liters: "",
//         square_meters: "",
//         thickened_edge_perimeter_lineal_meters: "0",
//         thickness_millimeters: "",
//         thickened_edge_construction_joint_lineal_meters: "0",
//         primx_steel_fibers_dosage_kgs: "40",
//         waste_factor_percentage: 5
//       };
//     default:
//       return state;
//   } // End switch
// }; // End estimatesCombinedReducer


export default combineReducers({
  combineQuery, // ⬅ The query search from the combined estimates page.
  calcCombinedEstimate, // ⬅ The mutated object with all the totals and math.
  firstCombinedEstimate, // ⬅ The first estimate used in the combination.
  secondCombinedEstimate, // ⬅ The second estimate used in the combination.
  thirdCombinedEstimate, // ⬅ The third estimate used in the combination.
  showCombinedTable, // ⬅ The show table state for the combined estimates. 
  // estimatesCombinedReducer, // reducer to send info to DB unmutated
});
