import {
  put,
  takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import useCombineEstimateCalculations from '../../hooks/useCombineEstimateCalculations';
import removeTimestamps from '../../hooks/removeTimestamps';
import { ExpansionPanelActions } from '@material-ui/core';


// Saga Worker to create a a new combined estimated quote: 
function* fetchManyEstimatesQuery(action) {
  // Saving history for navigation:
  const history = action.payload.history;
  // ⬇ Clearing the third estimate reducer, just in case it has zombie data from a prior search:
  yield put({ type: "CLEAR_THIRD_COMBINED_ESTIMATE" });
  // ⬇ Declaring variables:
  const licenseeId = action.payload.licensee_id;
  const firstEstimateNumber = action.payload.first_estimate_number;
  const secondEstimateNumber = action.payload.second_estimate_number;
  const thirdEstimateNumber = action.payload.third_estimate_number;
  // ⬇ Putting them in an array to loop through:
  const estimateNumberArray = [
    firstEstimateNumber,
    secondEstimateNumber
  ]; // End estimateNumberArray
  // ⬇ If the third estimate exists, add it:
  if (thirdEstimateNumber) {
    estimateNumberArray.push(thirdEstimateNumber);
  } // End if
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
    // ⬇ Saving the estimates from the array to variables: 
    const firstEstimate = estimatesArray[0];
    const secondEstimate = estimatesArray[1];
    if (firstEstimate.estimate_number_combined_1) {
      // If this estimate has already been saved in a combined estimate: 
      if (firstEstimate.estimate_number_combined_1.charAt(firstEstimate.estimate_number_combined_1.length - 1) === "C") {
        // And they're both the same estimate number: 
        if (firstEstimate.estimate_number_combined_1 === secondEstimate.estimate_number_combined_1) {
          // Push them to that estimate:
          history.push(`/lookup/${firstEstimate.licensee_id}/${firstEstimate.estimate_number_combined_1}`)
          // And stop this code block:
          return;
        } // End if 
      } // End if
    } // End if 
    // ⬇ Sending each estimate to a reducer to display on the combine table:
    yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: firstEstimate });
    yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: secondEstimate });
    // ⬇ If the third estimate exists, send it:
    if (thirdEstimateNumber) {
      const thirdEstimate = estimatesArray[2];
      yield put({ type: "SET_THIRD_COMBINED_ESTIMATE", payload: thirdEstimate });
    } // End if 
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
    // ⬇ If a response came back successfully, there is one estimate object in an array. Run the updated Combine Estimates Calc on it:
    const calculatedResponse = yield useCombineEstimateCalculations(estimateWithoutTimestamps[0]);
    // ⬇ Send that data to the reducer, and set the show table to true:
    yield put({ type: "SET_CALCULATED_COMBINED_ESTIMATE", payload: calculatedResponse });
    yield put({ type: "SHOW_DATA_TABLE" });
    yield put({ type: "LOADING_SCREEN_OFF" });
  } catch (error) {
    console.error('fetchManyEstimatesQuery failed:', error);
  } // End try/catch
} // End fetchManyEstimatesQuery Saga


// ⬇ Saga Worker to handle looking up a saved combined estimate:
function* fetchCombinedEstimatesQuery(action) {
  // ⬇ Clearing the third estimate reducer, just in case it has zombie data from a prior search:
  yield put({ type: "CLEAR_THIRD_COMBINED_ESTIMATE" });
  // ⬇ Pulling the variables from the payload: 
  const licenseeId = action.payload.licenseeId;
  const combinedEstimateNumber = action.payload.estimateNumber;
  // ⬇ Saving history for the navigation from Saga:
  // const history = action.payload.history;
  // ⬇ Creating an array to push to: 
  const estimatesArray = [];
  // ⬇ Putting them in an array to loop through:
  const estimateNumberArray = []; // End estimateNumberArray
  try {
    // ⬇ Ping the server with combined estimate to pull the estimate numbers:
    const firstResponse = yield axios.get('/api/estimates/lookup/:estimates', {
      params: {
        estimateNumber: combinedEstimateNumber,
        licenseeId: licenseeId
      } // End params
    }); // End response        
    const firstEstimateWithoutTimestamps = removeTimestamps(firstResponse.data);
    // ⬇ If a response came back successfully, there is one estimate object in an array. The JSON.parse(JSON.stringify) will rip apart and create a new object copy.  Only works with objects. 
    let deepCopy = JSON.parse(JSON.stringify(firstEstimateWithoutTimestamps[0]));
    // ⬇ Run the original math engin on it, as it's from the DB and not a tallied object:
    const calculatedCombinedResponse = yield useEstimateCalculations(deepCopy);
    // ⬇ Sending this to the calc combined reducer and the query result, as both will be referenced: 
    yield put({ type: "SET_CALCULATED_COMBINED_ESTIMATE", payload: calculatedCombinedResponse });
    yield put({ type: 'SET_ESTIMATE_QUERY_RESULT', payload: calculatedCombinedResponse });
    // ⬇ Pulling the estimate numbers from : 
    const firstEstimateNumber = calculatedCombinedResponse.estimate_number_combined_1;
    const secondEstimateNumber = calculatedCombinedResponse.estimate_number_combined_2;
    const thirdEstimateNumber = calculatedCombinedResponse.estimate_number_combined_3;
    // ⬇ Putting them in an array to loop through:
    estimateNumberArray.push(firstEstimateNumber, secondEstimateNumber);
    // ⬇ If the third estimate exists, add it too:
    if (thirdEstimateNumber) {
      estimateNumberArray.push(thirdEstimateNumber);
    } // End if
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
    // ⬇ Saving the estimates from the array to variables: 
    const firstEstimate = estimatesArray[0];
    const secondEstimate = estimatesArray[1];
    // ⬇ Sending each estimate to a reducer to display on the combine table:
    yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: firstEstimate });
    yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: secondEstimate });
    // ⬇ If the third estimate exists, send it:
    if (thirdEstimateNumber) {
      const thirdEstimate = estimatesArray[2];
      yield put({ type: "SET_THIRD_COMBINED_ESTIMATE", payload: thirdEstimate });
    } // End if 
    yield put({ type: "SHOW_COMBINED_ESTIMATE" });
    yield put({ type: "LOADING_SCREEN_OFF" });
  } catch (error) {
    console.error('fetchCombinedEstimatesQuery failed:', error);
  } // End try/catch
} // End fetchCombinedEstimatesQuery Saga

// Worker saga that is supplied an estimate id number and a user-created P.O. number that marks an estimate as ordered in the database to then be processed by an admin user
function* markCombinedEstimateOrdered(action) {
  try {
    const id = action.payload.calcCombinedEstimate.id;
    const calcCombinedEstimate = action.payload.calcCombinedEstimate;
    // Update all of the estimates as marked ordered and link them together: 
    yield axios.put(`/api/estimates/combine-order/${id}`, action.payload);
    // fetch updated estimate data for the search view to allow for proper conditional rendering once the licensee has placed an order
    yield put({
      type: 'FETCH_ESTIMATE_QUERY',
      payload: calcCombinedEstimate
    });
    yield put({
      type: 'SET_RECALCULATE_FALSE'
    });
  } catch (error) {
    console.error('markEstimateOrdered failed', error)
  }
}

// Worker Saga to server as a shortcut to clear all of the stale data reduers on page navigation:
function* clearAllStaleData(action) {
  try {
    yield put({ type: "CLEAR_ESTIMATE" });
    yield put({ type: "CLEAR_COMBINED_ESTIMATES_DATA" });
    yield put({ type: "CLEAR_ESTIMATE_QUERY_RESULT" });
    yield put({ type: "SET_RECALCULATED_FALSE" });
  } catch (error) {
    console.error('clearAllStaleData failed', error)
  }
}

// Combined estimate saga to fetch estimate for combined cost
function* combineEstimatesSaga() {
  yield takeLatest('FETCH_MANY_ESTIMATES_QUERY', fetchManyEstimatesQuery);
  yield takeLatest('FETCH_COMBINED_ESTIMATE_QUERY', fetchCombinedEstimatesQuery);
  yield takeLatest('MARK_COMBINED_ESTIMATE_ORDERED', markCombinedEstimateOrdered);
  yield takeLatest('CLEAR_ALL_STALE_DATA', clearAllStaleData);
} // End combineEstimatesSaga


export default combineEstimatesSaga;