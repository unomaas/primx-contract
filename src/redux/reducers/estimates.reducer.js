import {
  combineReducers
} from 'redux';

const today = new Date().toISOString().substring(0, 10);

// ⬇ estimatesReducer:
export const estimatesReducer = (state = {
  date_created: today,
  project_name: "",
  licensee_id: 0,
  project_general_contractor: "",
  project_manager_name: "",
  project_manager_email: "",
  project_manager_phone: "",
  floor_types_id: 0,
  placement_types_id: 0,
  measurement_units: "",
  anticipated_first_pour_date: "",
  ship_to_address: "",
  ship_to_city: "",
  shipping_costs_id: 0,
  zip_postal_code: "",
  country: 0,
  square_feet: "",
  thickened_edge_perimeter_lineal_feet: "0",
  primx_flow_dosage_liters: "3",
  thickness_inches: "",
  thickened_edge_construction_joint_lineal_feet: "0",
  primx_steel_fibers_dosage_lbs: "60",
  primx_cpea_dosage_liters: "",
  square_meters: "",
  thickened_edge_perimeter_lineal_meters: "0",
  thickness_millimeters: "",
  thickened_edge_construction_joint_lineal_meters: "0",
  primx_steel_fibers_dosage_kgs: "40",
  waste_factor_percentage: 5
}, action) => {
  switch (action.type) {
    case 'SET_ESTIMATE':
      // validation for waste factor percentage: value can't go below 3
      if (action.payload.key == 'waste_factor_percentage' && action.payload.value < 3) {
        action.payload.value = 3;
      }
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    case 'SET_EDIT_DATA':
      return action.payload;
    case 'CLEAR_ESTIMATE':
      return {
        date_created: today,
        project_name: "",
        licensee_id: 0,
        project_general_contractor: "",
        project_manager_name: "",
        project_manager_email: "",
        project_manager_phone: "",
        floor_types_id: 0,
        placement_types_id: 0,
        measurement_units: "",
        anticipated_first_pour_date: "",
        ship_to_address: "",
        ship_to_city: "",
        shipping_costs_id: 0,
        zip_postal_code: "",
        country: 0,
        square_feet: "",
        thickened_edge_perimeter_lineal_feet: "0",
        primx_flow_dosage_liters: "3",
        thickness_inches: "",
        thickened_edge_construction_joint_lineal_feet: "0",
        primx_steel_fibers_dosage_lbs: "60",
        primx_cpea_dosage_liters: "",
        square_meters: "",
        thickened_edge_perimeter_lineal_meters: "0",
        thickness_millimeters: "",
        thickened_edge_construction_joint_lineal_meters: "0",
        primx_steel_fibers_dosage_kgs: "40",
        waste_factor_percentage: 5
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
}; // End buttonState

export const tableState = (state = false, action) => {
  switch (action.type) {
    case 'SET_TABLE_STATE':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End tableState

export const editState = (state = false, action) => {
  switch (action.type) {
    case 'SET_EDIT_STATE':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End editState

// searchedEstimate comes from the licenseeForm saga, which sends back a single estimate object from the DB after running the useEstimateCalculations
// function on it
export const searchedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FIRST_ESTIMATE_QUERY_RESULT':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End searchedEstimate

// secondSearchedEstimate comes from multipleEstimate Saga, which adds returns another estimate object from DB after running useEstimateCalculations
export const secondSearchedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_SECOND_ESTIMATE_QUERY_RESULT':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End searchedEstimate

// ThirdSearchedEstimate comes from multipleEstimate Saga, which adds returns another estimate object from DB after running useEstimateCalculations
export const thirdSearchedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_THIRD_ESTIMATE_QUERY_RESULT':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End searchedEstimate

// reducer that looks at whether a user has recalculated their estimate numbers on the lookup view before being able to place an order
export const hasRecalculated = (state = false, action) => {
  switch (action.type) {
    case 'SET_RECALCULATED_TRUE':
      return true;
    case 'SET_RECALCULATE_FALSE':
      return false;
    default:
      return state;
  } // End switch
}; // End hasRecalculated

export const searchQuery = (state = {
  licensee_id: 0,
  estimate_number: ""
}, action) => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    default:
      return state;
  } // End switch
}; // End searchQuery

export const combineQuery = (state = {
  licensee_id: 0,
  estimate_number: "",
  second_estimate_number: "",
  third_estimate_number: ""
}, action) => {
  switch (action.type) {
    case 'SET_COMBINE_QUERY':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    default:
      return state;
  } // End switch
}; // End searchQuery

export const combinedEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ESTIMATE_COMBINE_RESULT':
      return action.payload;
    default:
      return state;
  } // End switch
}; // End searchedEstimate

export const setCalcEstimate = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CALCULATED_ESTIMATE':            
        return action.payload;
    default:
        return state;
  } // End switch
}; // End setCalcEstimate

export default combineReducers({
  estimatesReducer,
  buttonState,
  tableState,
  editState,
  searchedEstimate,
  hasRecalculated,
  searchQuery,
  setCalcEstimate,
  combineQuery,
  combinedEstimate,
});
