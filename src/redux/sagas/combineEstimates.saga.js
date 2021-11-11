import {
  put,
  takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import useCombineEstimateCalculations from '../../hooks/useCombineEstimateCalculations';
import removeTimestamps from '../../hooks/removeTimestamps';

// Saga Worker to create a GET request for combining three estimates. 
function* fetchThreeEstimatesQuery(action) {
  // Declaring variables:
  const licenseeId = action.payload.licensee_id;
  const firstEstimateNumber = action.payload.first_estimate_number;
  const secondEstimateNumber = action.payload.second_estimate_number;
  const thirdEstimateNumber = action.payload.third_estimate_number;
  // Putting them in an array to loop through:
  const estimateNumberArray = [
    firstEstimateNumber,
    secondEstimateNumber,
    thirdEstimateNumber
  ];
  // Creating an array to push to: 
  const estimatesArray = [];
  try {
    // We loop through each estimate number in the array and make a GET request for it, which adds it to an estimates array. 
    for (let i = 0; i < estimateNumberArray.length; i++) {
      const response = yield axios.get('/api/estimates/lookup/:estimates', {
        params: {
          estimateNumber: estimateNumberArray[i],
          licenseeId: licenseeId
        } // End params
      }) // End response      
      // Run the timestamp removal function on the returned array of estimates:
      const estimateWithoutTimestamps = removeTimestamps(response.data);      
      // If a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it:
      const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
      // Save it to the estimatesArray for later use. 
      estimatesArray.push(calculatedResponse);
    } // End for loop
    // Making an empty/zero'd out object to hold the tallies for each total amount needed. 
    const totalsObjectHolder = {
      primx_cpea_total_amount_needed: 0,
      primx_dc_total_amount_needed: 0,
      primx_flow_total_amount_needed: 0,
      primx_steel_fibers_total_amount_needed: 0,
      primx_ultracure_blankets_total_amount_needed: 0
    };
    // Looping through the estimatesArray, which is full of estimates from the DB, and tallying those total amounts needed to the object holding container above. 
    for (let estimate of estimatesArray) {
      totalsObjectHolder.primx_cpea_total_amount_needed += estimate.primx_cpea_total_amount_needed;
      totalsObjectHolder.primx_dc_total_amount_needed += estimate.primx_dc_total_amount_needed;
      totalsObjectHolder.primx_flow_total_amount_needed += estimate.primx_flow_total_amount_needed;
      totalsObjectHolder.primx_steel_fibers_total_amount_needed += estimate.primx_steel_fibers_total_amount_needed;
      totalsObjectHolder.primx_ultracure_blankets_total_amount_needed += estimate.primx_ultracure_blankets_total_amount_needed;
    } // End for loop
    // Creating a deep copy container to copy the first estimate in the array, which is the one we use for shipping/quote pricing:
    // The JSON.parse(JSON.stringify) will rip apart and create a new object copy.  Only works with objects. 
    let talliedCombinedEstimate = JSON.parse(JSON.stringify(estimatesArray[0]));
    // Setting the tallied amount to the object to feed through the math machine: 
    talliedCombinedEstimate.primx_cpea_total_amount_needed = totalsObjectHolder.primx_cpea_total_amount_needed;
    talliedCombinedEstimate.primx_dc_total_amount_needed = totalsObjectHolder.primx_dc_total_amount_needed;
    talliedCombinedEstimate.primx_flow_total_amount_needed = totalsObjectHolder.primx_flow_total_amount_needed;
    talliedCombinedEstimate.primx_steel_fibers_total_amount_needed = totalsObjectHolder.primx_steel_fibers_total_amount_needed;
    talliedCombinedEstimate.primx_ultracure_blankets_total_amount_needed = totalsObjectHolder.primx_ultracure_blankets_total_amount_needed;
    // Run the timestamp removal function on the returned array of estimates:
    const estimateWithoutTimestamps = removeTimestamps([talliedCombinedEstimate]);
    // If a response came back successfully, there is one estimate object in an array. 
    // Run the updated Combine Estimates Calc on it:
    const calculatedResponse = yield useCombineEstimateCalculations(estimateWithoutTimestamps[0]);
    console.log('*** FINAL Estimate is:', calculatedResponse);
    yield put({
      type: "SET_CALCULATED_COMBINED_ESTIMATE",
      payload: calculatedResponse
    }); // End dispatch
  } catch (error) {
    console.log('fetchThreeEstimatesQuery failed', error);
  } // End try/catch
} // End fetchThreeEstimatesQuery Saga

// Saga Worker to create a GET request for combining two estimates. 
function* fetchTwoEstimatesQuery(action) {
  // Declaring variables:
  const licenseeId = action.payload.licensee_id;
  const firstEstimateNumber = action.payload.first_estimate_number;
  const secondEstimateNumber = action.payload.second_estimate_number;
  // Putting them in an array to loop through:
  const estimateNumberArray = [
    firstEstimateNumber,
    secondEstimateNumber,
  ];
  // Creating an array to push to: 
  const estimatesArray = [];
  try {
    // We loop through each estimate number in the array and make a GET request for it, which adds it to an estimates array. 
    for (let i = 0; i < estimateNumberArray.length; i++) {
      const response = yield axios.get('/api/estimates/lookup/:estimates', {
        params: {
          estimateNumber: estimateNumberArray[i],
          licenseeId: licenseeId
        } // End params
      }) // End response      
      // Run the timestamp removal function on the returned array of estimates:
      const estimateWithoutTimestamps = removeTimestamps(response.data);      
      // If a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it:
      const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
      // Save it to the estimatesArray for later use. 
      estimatesArray.push(calculatedResponse);
    } // End for loop
    // Making an empty/zero'd out object to hold the tallies for each total amount needed. 
    const totalsObjectHolder = {
      primx_cpea_total_amount_needed: 0,
      primx_dc_total_amount_needed: 0,
      primx_flow_total_amount_needed: 0,
      primx_steel_fibers_total_amount_needed: 0,
      primx_ultracure_blankets_total_amount_needed: 0
    };
    // Looping through the estimatesArray, which is full of estimates from the DB, and tallying those total amounts needed to the object holding container above. 
    for (let estimate of estimatesArray) {
      totalsObjectHolder.primx_cpea_total_amount_needed += estimate.primx_cpea_total_amount_needed;
      totalsObjectHolder.primx_dc_total_amount_needed += estimate.primx_dc_total_amount_needed;
      totalsObjectHolder.primx_flow_total_amount_needed += estimate.primx_flow_total_amount_needed;
      totalsObjectHolder.primx_steel_fibers_total_amount_needed += estimate.primx_steel_fibers_total_amount_needed;
      totalsObjectHolder.primx_ultracure_blankets_total_amount_needed += estimate.primx_ultracure_blankets_total_amount_needed;
    } // End for loop
    // Creating a deep copy container to copy the first estimate in the array, which is the one we use for shipping/quote pricing:
    // The JSON.parse(JSON.stringify) will rip apart and create a new object copy.  Only works with objects. 
    let talliedCombinedEstimate = JSON.parse(JSON.stringify(estimatesArray[0]));
    // Setting the tallied amount to the object to feed through the math machine: 
    talliedCombinedEstimate.primx_cpea_total_amount_needed = totalsObjectHolder.primx_cpea_total_amount_needed;
    talliedCombinedEstimate.primx_dc_total_amount_needed = totalsObjectHolder.primx_dc_total_amount_needed;
    talliedCombinedEstimate.primx_flow_total_amount_needed = totalsObjectHolder.primx_flow_total_amount_needed;
    talliedCombinedEstimate.primx_steel_fibers_total_amount_needed = totalsObjectHolder.primx_steel_fibers_total_amount_needed;
    talliedCombinedEstimate.primx_ultracure_blankets_total_amount_needed = totalsObjectHolder.primx_ultracure_blankets_total_amount_needed;
    // Run the timestamp removal function on the returned array of estimates:
    const estimateWithoutTimestamps = removeTimestamps([talliedCombinedEstimate]);
    // If a response came back successfully, there is one estimate object in an array. 
    // Run the updated Combine Estimates Calc on it:
    const calculatedResponse = yield useCombineEstimateCalculations(estimateWithoutTimestamps[0]);
    console.log('*** FINAL Estimate is:', calculatedResponse);
    yield put({
      type: "SET_CALCULATED_COMBINED_ESTIMATE",
      payload: calculatedResponse
    }); // End dispatch
  } catch (error) {
    console.log('fetchThreeEstimatesQuery failed', error);
  } // End try/catch
} // End fetchTwoEstimatesQuery Saga

// Combined estimate saga to fetch estimate for combined cost
function* combineEstimatesSaga() {
  // Makes a GET request for the first search Query
  yield takeLatest('FETCH_THREE_ESTIMATES_QUERY', fetchThreeEstimatesQuery);
  yield takeLatest('FETCH_TWO_ESTIMATES_QUERY', fetchTwoEstimatesQuery);

}

export default combineEstimatesSaga;