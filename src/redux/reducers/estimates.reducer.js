import { combineReducers } from 'redux';

const today = new Date().toISOString().substring(0, 10);

// ⬇ estimatesReducer:
export const estimatesReducer = (state = {
  // measurement_units: 'imperial',
  // country: 'United States',
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
  country: "",
  square_feet: "",
  thickened_edge_perimeter_lineal_feet: "",
  primx_flow_dosage_liters: "",
  thickness_inches: "",
  thickened_edge_construction_joint_lineal_feet: "",
  primx_steel_fibers_dosage_lbs: "",
  primx_cpea_dosage_liters: "",
  square_meters: "",
  thickened_edge_perimeter_lineal_meters: "",
  thickness_millimeters: "",
  thickened_edge_construction_joint_lineal_meters: "",
  primx_steel_fibers_dosage_kgs: ""
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
export const searchedEstimate = (state = {
  licensee_id: 0, 
  estimate_number: ""
}, action) => {
  switch (action.type) {
    case 'SET_ESTIMATE_QUERY_RESULT':
      return action.payload;
    default:
      return state;
  }
};

export const hasRecalculated = (state = false, action) => {
  switch (action.type) {
    case 'SET_RECALCULATED_TRUE':
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  estimatesReducer,
  buttonState,
  tableState,
  searchedEstimate,
  hasRecalculated
});

// export default estimatesReducer;