import {
  put,
  takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import useCombineEstimateCalculations from '../../hooks/useCombineEstimateCalculations';
import removeTimestamps from '../../hooks/removeTimestamps';
import { ExpansionPanelActions } from '@material-ui/core';


// ⬇ Saga Worker to create a GET request for combining three estimates. 
function* fetchThreeEstimatesQuery(action) {
  console.log('*** in fetchThreeEstimatesQuery, action.payload:', action.payload);
  
  // ⬇ Declaring variables:
  const licenseeId = action.payload.licensee_id;
  const firstEstimateNumber = action.payload.first_estimate_number;
  const secondEstimateNumber = action.payload.second_estimate_number;
  const thirdEstimateNumber = action.payload.third_estimate_number;
  // ⬇ Putting them in an array to loop through:
  const estimateNumberArray = [
    firstEstimateNumber,
    secondEstimateNumber,
    thirdEstimateNumber
  ]; // End estimateNumberArray
  // ⬇ Creating an array to push to: 
  const estimatesArray = [];
  try {
    // ⬇ We loop through each estimate number in the array and make a GET request for it, which adds it to an estimates array. 
    for (let i = 0; i < estimateNumberArray.length; i++) {
      const response = yield axios.get('/api/estimates/lookup/:estimates', {
        params: {
          estimateNumber: estimateNumberArray[i],
          licenseeId: licenseeId
        } // End params
      }) // End response      
      // ⬇ Run the timestamp removal function on the returned array of estimates:
      console.log('*** in for loop, response.data is:', response.data);
      
      const estimateWithoutTimestamps = removeTimestamps(response.data);
      console.log('*** in for loop, estimateWithoutTimestamps is:', estimateWithoutTimestamps);

      // ⬇ If a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it:
      const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
      console.log('*** in for loop, calculatedResponse is:', calculatedResponse);
      // ⬇ Save it to the estimatesArray for later use. 
      estimatesArray.push(calculatedResponse);
    } // End for loop
    // ⬇ Sending each estimate to a reducer to display on the combine table:
    yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: estimatesArray[0] });
    yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: estimatesArray[1] });
    yield put({ type: "SET_THIRD_COMBINED_ESTIMATE", payload: estimatesArray[2] });
    // ⬇ Making an empty/zero'd out object to hold the tallies for each total amount needed. 
    const totalsObjectHolder = {
      primx_cpea_total_amount_needed: 0,
      primx_dc_total_amount_needed: 0,
      primx_flow_total_amount_needed: 0,
      primx_steel_fibers_total_amount_needed: 0,
      primx_ultracure_blankets_total_amount_needed: 0
    }; // End totalsObjectHolder
    // ⬇ Looping through the estimatesArray, which is full of estimates from the DB, and tallying those total amounts needed to the object holding container above. 
    for (let estimate of estimatesArray) {
      totalsObjectHolder.primx_cpea_total_amount_needed += estimate.primx_cpea_total_amount_needed;
      totalsObjectHolder.primx_dc_total_amount_needed += estimate.primx_dc_total_amount_needed;
      totalsObjectHolder.primx_flow_total_amount_needed += estimate.primx_flow_total_amount_needed;
      totalsObjectHolder.primx_steel_fibers_total_amount_needed += estimate.primx_steel_fibers_total_amount_needed;
      totalsObjectHolder.primx_ultracure_blankets_total_amount_needed += estimate.primx_ultracure_blankets_total_amount_needed;
    } // End for loop
    // ⬇ Creating a 'deep copy' container to copy the first estimate in the array, which is the one we use for shipping/quote pricing:
    // ⬇ The JSON.parse(JSON.stringify) will rip apart and create a new object copy.  Only works with objects. 
    let talliedCombinedEstimate = JSON.parse(JSON.stringify(estimatesArray[0]));
    // ⬇ Setting the tallied amount to the object to feed through the math machine: 
    talliedCombinedEstimate.primx_cpea_total_amount_needed = totalsObjectHolder.primx_cpea_total_amount_needed;
    talliedCombinedEstimate.primx_dc_total_amount_needed = totalsObjectHolder.primx_dc_total_amount_needed;
    talliedCombinedEstimate.primx_flow_total_amount_needed = totalsObjectHolder.primx_flow_total_amount_needed;
    talliedCombinedEstimate.primx_steel_fibers_total_amount_needed = totalsObjectHolder.primx_steel_fibers_total_amount_needed;
    talliedCombinedEstimate.primx_ultracure_blankets_total_amount_needed = totalsObjectHolder.primx_ultracure_blankets_total_amount_needed;
    // ⬇ Run the timestamp removal function on the returned array of estimates:
    const estimateWithoutTimestamps = removeTimestamps([talliedCombinedEstimate]);
    // ⬇ If a response came back successfully, there is one estimate object in an array. 
    // ⬇ Run the updated Combine Estimates Calc on it:
    const calculatedResponse = yield useCombineEstimateCalculations(estimateWithoutTimestamps[0]);
    // ⬇ Send that data to the reducer, and set the show table to true:
    yield put({
      type: "SET_CALCULATED_COMBINED_ESTIMATE",
      payload: calculatedResponse
    }); // End yield put
    yield put({ type: "SHOW_COMBINED_TABLE" });
  } catch (error) {
    console.error('fetchThreeEstimatesQuery failed:', error);
  } // End try/catch
} // End fetchThreeEstimatesQuery Saga


// Saga Worker to create a GET request for combining two estimates. 
function* fetchTwoEstimatesQuery(action) {
  // ⬇ Clearing the third estimate reducer, just in case it has zombie data from a prior search:
  yield put({ type: "CLEAR_THIRD_COMBINED_ESTIMATE" });
  // ⬇ Declaring variables:
  const licenseeId = action.payload.licensee_id;
  const firstEstimateNumber = action.payload.first_estimate_number;
  const secondEstimateNumber = action.payload.second_estimate_number;
  // ⬇ Putting them in an array to loop through:
  const estimateNumberArray = [
    firstEstimateNumber,
    secondEstimateNumber
  ]; // End estimateNumberArray
  // ⬇ Creating an array to push to: 
  const estimatesArray = [];
  try {
    // ⬇ We loop through each estimate number in the array and make a GET request for it, which adds it to an estimates array. 
    for (let i = 0; i < estimateNumberArray.length; i++) {
      const response = yield axios.get('/api/estimates/lookup/:estimates', {
        params: {
          estimateNumber: estimateNumberArray[i],
          licenseeId: licenseeId
        } // End params
      }) // End response      
      // ⬇ Run the timestamp removal function on the returned array of estimates:
      const estimateWithoutTimestamps = removeTimestamps(response.data);
      // ⬇ If a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it:
      const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
      // ⬇ Save it to the estimatesArray for later use. 
      estimatesArray.push(calculatedResponse);
    } // End for loop
    // ⬇ Sending each estimate to a reducer to display on the combine table:
    yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: estimatesArray[0] });
    yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: estimatesArray[1] });
    // ⬇ Making an empty/zero'd out object to hold the tallies for each total amount needed. 
    const totalsObjectHolder = {
      primx_cpea_total_amount_needed: 0,
      primx_dc_total_amount_needed: 0,
      primx_flow_total_amount_needed: 0,
      primx_steel_fibers_total_amount_needed: 0,
      primx_ultracure_blankets_total_amount_needed: 0
    }; // End totalsObjectHolder
    // ⬇ Looping through the estimatesArray, which is full of estimates from the DB, and tallying those total amounts needed to the object holding container above. 
    for (let estimate of estimatesArray) {
      totalsObjectHolder.primx_cpea_total_amount_needed += estimate.primx_cpea_total_amount_needed;
      totalsObjectHolder.primx_dc_total_amount_needed += estimate.primx_dc_total_amount_needed;
      totalsObjectHolder.primx_flow_total_amount_needed += estimate.primx_flow_total_amount_needed;
      totalsObjectHolder.primx_steel_fibers_total_amount_needed += estimate.primx_steel_fibers_total_amount_needed;
      totalsObjectHolder.primx_ultracure_blankets_total_amount_needed += estimate.primx_ultracure_blankets_total_amount_needed;
    } // End for loop
    // ⬇ Creating a deep copy container to copy the first estimate in the array, which is the one we use for shipping/quote pricing:
    // ⬇ The JSON.parse(JSON.stringify) will rip apart and create a new object copy.  Only works with objects. 
    let talliedCombinedEstimate = JSON.parse(JSON.stringify(estimatesArray[0]));
    // ⬇ Setting the tallied amount to the object to feed through the math machine: 
    talliedCombinedEstimate.primx_cpea_total_amount_needed = totalsObjectHolder.primx_cpea_total_amount_needed;
    talliedCombinedEstimate.primx_dc_total_amount_needed = totalsObjectHolder.primx_dc_total_amount_needed;
    talliedCombinedEstimate.primx_flow_total_amount_needed = totalsObjectHolder.primx_flow_total_amount_needed;
    talliedCombinedEstimate.primx_steel_fibers_total_amount_needed = totalsObjectHolder.primx_steel_fibers_total_amount_needed;
    talliedCombinedEstimate.primx_ultracure_blankets_total_amount_needed = totalsObjectHolder.primx_ultracure_blankets_total_amount_needed;
    // ⬇ Run the timestamp removal function on the returned array of estimates:
    const estimateWithoutTimestamps = removeTimestamps([talliedCombinedEstimate]);
    // ⬇ If a response came back successfully, there is one estimate object in an array. 
    // ⬇ Run the updated Combine Estimates Calc on it:
    const calculatedResponse = yield useCombineEstimateCalculations(estimateWithoutTimestamps[0]);
    // ⬇ Send that data to the reducer, and set the show table to true:
    yield put({ type: "SET_CALCULATED_COMBINED_ESTIMATE", payload: calculatedResponse });
    yield put({ type: "SHOW_COMBINED_TABLE" });
  } catch (error) {
    console.error('fetchTwoEstimatesQuery failed:', error);
  } // End try/catch
} // End fetchTwoEstimatesQuery Saga


// ⬇ Saga Worker to handle looking up a saved combined estimate:
function* pushToCombineEstimates(action) {
  // Pulling the variables from the payload: 
  const licenseeId = action.payload.licenseeId;
  const estimateNumber = action.payload.estimateNumber;
  // Saving history for the navigation from Saga:
  const history = action.payload.history;
  try {
    // Ping the server with combined estimate to pull the estimate numbers:
    const response = yield axios.get('/api/estimates/lookup/:estimates', {
      params: {
        estimateNumber: estimateNumber,
        licenseeId: licenseeId
      } // End params
    }); // End response    
    // Saving the response to get the other data from: 
    const returnedEstimate = response.data[0];
    // Pulling the estimate numbers from it: 
    const firstEstimateNumber = returnedEstimate.combined_estimate_number_1;
    const secondEstimateNumber = returnedEstimate.combined_estimate_number_2;
    const thirdEstimateNumber = returnedEstimate.combined_estimate_number_3;
    // If three estimate numbers were combined, push to three and do the math engines: 
    if (thirdEstimateNumber) {
      yield history.push(`/combine/${licenseeId}/${firstEstimateNumber}/${secondEstimateNumber}/${thirdEstimateNumber}`);
    } else { // ⬇ If they only entered two estimate numbers: 
      yield history.push(`/combine/${licenseeId}/${firstEstimateNumber}/${secondEstimateNumber}`);
    } // End if/else statement
  } catch (error) {
    console.error('pushToCombineEstimates failed:', error);
  } // End try/catch
} // End lookupEstimateNumbers Saga


// Combined estimate saga to fetch estimate for combined cost
function* combineEstimatesSaga() {
  yield takeLatest('FETCH_THREE_ESTIMATES_QUERY', fetchThreeEstimatesQuery);
  yield takeLatest('FETCH_TWO_ESTIMATES_QUERY', fetchTwoEstimatesQuery);
  yield takeLatest('PUSH_TO_COMBINE_ESTIMATE', pushToCombineEstimates);
} // End combineEstimatesSaga


export default combineEstimatesSaga;