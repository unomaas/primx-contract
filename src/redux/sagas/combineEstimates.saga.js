import {
  put,
  takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import removeTimestamps from '../../hooks/removeTimestamps';

// Saga Worker to create a GET request for first estimate
function* fetchFirstEstimateQuery(action) {
  const licenseeId = action.payload.licensee_id
  const estimateNumber = action.payload.estimate_number

  try {
    const response = yield axios.get('/api/estimates/lookup/:estimates', {
      params: {
        estimateNumber: estimateNumber,
        licenseeId: licenseeId
      }
    })
    // run the timestamp removal function on the returned array of estimates
    const estimateWithoutTimestamps = removeTimestamps(response.data);
    // if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it
    // before sending it to the reducer
    const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
    // Recalculate this estimates prices to be current before displaying:
    // yield put({
    //   type: 'RECALCULATE_ESTIMATE',
    //   payload: calculatedResponse
    // })
    // Send this data to the first estimate reducer:
    yield put({
      type: 'SET_FIRST_ESTIMATE_QUERY_RESULT',
      payload: calculatedResponse
    })
    // Also send this data to the combined estimate array reducer:
    yield put({
      type: 'SET_ESTIMATE_COMBINED_DATA',
      payload: calculatedResponse
    })
    // Also send this data to the 4th reducer to use as the combined totals: 
    yield put({
      type: 'SET_TOTALS_COMBINED_ESTIMATE',
      payload: calculatedResponse
    })
  } catch (error) {
    console.log('fetchFirstEstimateQuery failed', error);
  }
}

// Saga Worker to create a GET request for second estimate
function* fetchSecondEstimateQuery(action) {
  const licenseeId = action.payload.licensee_id
  const estimateNumber = action.payload.estimate_number

  try {
    const response = yield axios.get('/api/estimates/lookup/:estimates', {
      params: {
        estimateNumber: estimateNumber,
        licenseeId: licenseeId
      }
    })
    // run the timestamp removal function on the returned array of estimates
    const estimateWithoutTimestamps = removeTimestamps(response.data);
    // if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it
    // before sending it to the reducer
    const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
    // Recalculate this estimates prices to be current before displaying:
    // yield put({
    //   type: 'RECALCULATE_ESTIMATE',
    //   payload: calculatedResponse
    // })
    yield put({
      type: 'SET_SECOND_ESTIMATE_QUERY_RESULT',
      payload: calculatedResponse
    })
    yield put({
      type: 'SET_ESTIMATE_COMBINED_DATA',
      payload: calculatedResponse
    })
  } catch (error) {
    console.log('fetchSecondEstimateQuery failed', error);
  }
}

// Saga Worker to create a GET request for third estimate
function* fetchThirdEstimateQuery(action) {
  const licenseeId = action.payload.licensee_id
  const estimateNumber = action.payload.estimate_number

  try {
    const response = yield axios.get('/api/estimates/lookup/:estimates', {
      params: {
        estimateNumber: estimateNumber,
        licenseeId: licenseeId
      }
    })
    // run the timestamp removal function on the returned array of estimates
    const estimateWithoutTimestamps = removeTimestamps(response.data);
    // if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it
    // before sending it to the reducer
    const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
    // Recalculate this estimates prices to be current before displaying:
    // yield put({
    //   type: 'RECALCULATE_ESTIMATE',
    //   payload: calculatedResponse
    // })
    yield put({
      type: 'SET_THIRD_ESTIMATE_QUERY_RESULT',
      payload: calculatedResponse
    })
    yield put({
      type: 'SET_ESTIMATE_COMBINED_DATA',
      payload: calculatedResponse
    })
  } catch (error) {
    console.log('fetchThirdEstimateQuery failed', error);
  }
}

// Saga worker to run the math machine on the combined estimates object:
function* handleCalculatedCombinedEstimate(action) {
  // Save a mutated object with the calculation values
  const calculatedCombinedEstimate = useEstimateCalculations(action.payload);
  yield put({
    type: 'SET_CALCULATED_COMBINED_ESTIMATE',
    payload: calculatedCombinedEstimate
  });
} // End

// Saga Worker to create a GET request for first estimate
function* fetchThreeEstimatesQuery(action) {
  const licenseeId = action.payload.licensee_id;
  const firstEstimateNumber = action.payload.first_estimate_number;
  const secondEstimateNumber = action.payload.second_estimate_number;
  const thirdEstimateNumber = action.payload.third_estimate_number;
  const estimateNumberArray = [
    firstEstimateNumber,
    secondEstimateNumber,
    thirdEstimateNumber
  ];
  const estimatesArray = [];
  console.log('*** Action Payload is:', action.payload);
  try {
    // We loop through each estimate number in the array and make a GET request for it, which adds it to an estimates array. 
    for (let i = 0; i < estimateNumberArray.length; i++) {
      console.log('estimate  is:', i, estimateNumberArray[i]);
      const response = yield axios.get('/api/estimates/lookup/:estimates', {
        params: {
          estimateNumber: estimateNumberArray[i],
          licenseeId: licenseeId
        } // End params
      }) // End response
      // run the timestamp removal function on the returned array of estimates
      const estimateWithoutTimestamps = removeTimestamps(response.data);
      // if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it before sending it to the reducer
      const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
      console.log(`*** Calc Response Index ${i} is:`, calculatedResponse);
      // Save it to the estimatesArray for later use. 
      estimatesArray.push(calculatedResponse);
    } // End for loop
    console.log('*** estimatesArray is: ', estimatesArray);
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
      console.log('estimate is', estimate);
      totalsObjectHolder.primx_cpea_total_amount_needed += estimate.primx_cpea_total_amount_needed;
      totalsObjectHolder.primx_dc_total_amount_needed += estimate.primx_dc_total_amount_needed;
      totalsObjectHolder.primx_flow_total_amount_needed += estimate.primx_flow_total_amount_needed;
      totalsObjectHolder.primx_steel_fibers_total_amount_needed += estimate.primx_steel_fibers_total_amount_needed;
      totalsObjectHolder.primx_ultracure_blankets_total_amount_needed += estimate.primx_ultracure_blankets_total_amount_needed;
    }
    console.log('*** totalsObjectHolder is:', totalsObjectHolder);

    // Creating a dummy container to copy the first estimate in the array, which is the one we use for shipping/quote pricing:
    let talliedCombinedEstimate = estimatesArray[0];
    console.log('*** Test Estimate is:', talliedCombinedEstimate);
    // Setting the tallied amount to the object to feed through the math machine: 
    talliedCombinedEstimate.primx_cpea_total_amount_needed = totalsObjectHolder.primx_cpea_total_amount_needed;
    talliedCombinedEstimate.primx_dc_total_amount_needed = totalsObjectHolder.primx_dc_total_amount_needed;
    talliedCombinedEstimate.primx_flow_total_amount_needed = totalsObjectHolder.primx_flow_total_amount_needed;
    talliedCombinedEstimate.primx_steel_fibers_total_amount_needed = totalsObjectHolder.primx_steel_fibers_total_amount_needed;
    talliedCombinedEstimate.primx_ultracure_blankets_total_amount_needed = totalsObjectHolder.primx_ultracure_blankets_total_amount_needed;

    // Console logging the results to make sure: 
    // console.log('*** Real Estimate is:', talliedCombinedEstimate);
    console.log('*** Totals Estimate is:', talliedCombinedEstimate.primx_cpea_total_amount_needed);
    console.log('*** Totals Estimate is:', talliedCombinedEstimate.primx_dc_total_amount_needed);
    console.log('*** Totals Estimate is:', talliedCombinedEstimate.primx_flow_total_amount_needed);
    console.log('*** Totals Estimate is:', talliedCombinedEstimate.primx_steel_fibers_total_amount_needed);
    console.log('*** Totals Estimate is:', talliedCombinedEstimate.primx_ultracure_blankets_total_amount_needed);
    console.log('*** FINAL Estimate is:', talliedCombinedEstimate);

    // const finalCalculateResponse = yield put({ type: 'RECALCULATE_ESTIMATE', payload: talliedCombinedEstimate });

    // console.log('*** finalCalculateResponse', finalCalculateResponse.payload);
    

    // console.log('*** Real Estimate is:', testEstimate.primx_cpea_total_amount_needed);
    // console.log('*** Real Test is:', estimatesArray[0].primx_cpea_total_amount_needed);

    // run the timestamp removal function on the returned array of estimates
    const finalEstimateWithoutTimestamps = removeTimestamps(talliedCombinedEstimate);

    // if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it before sending it to the reducer
    // const finalCalculatedResponse = yield useEstimateCalculations(talliedCombinedEstimate);
    // console.log('*** finalCalculatedResponse', finalCalculatedResponse);



    // const response = yield axios.get('/api/estimates/lookup/:estimates', {
    //   params: {
    //     estimateNumber: firstEstimateNumber,
    //     licenseeId: licenseeId
    //   }
    // })
    // // run the timestamp removal function on the returned array of estimates
    // const estimateWithoutTimestamps = removeTimestamps(response.data);
    // // if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it
    // // before sending it to the reducer
    // const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);
    // // Recalculate this estimates prices to be current before displaying:
    // // yield put({
    // //   type: 'RECALCULATE_ESTIMATE',
    // //   payload: calculatedResponse
    // // })
    // // Send this data to the first estimate reducer:
    // yield put({
    //   type: 'SET_FIRST_ESTIMATE_QUERY_RESULT',
    //   payload: calculatedResponse
    // })
    // // Also send this data to the combined estimate array reducer:
    // yield put({
    //   type: 'SET_ESTIMATE_COMBINED_DATA',
    //   payload: calculatedResponse
    // })
    // // Also send this data to the 4th reducer to use as the combined totals: 
    // yield put({
    //   type: 'SET_TOTALS_COMBINED_ESTIMATE',
    //   payload: calculatedResponse
    // })
  } catch (error) {
    console.log('fetchFirstEstimateQuery failed', error);
  }
}

// Combined estimate saga to fetch estimate for combined cost
function* combineEstimatesSaga() {
  // Makes a GET request for the first search Query
  yield takeLatest('FETCH_FIRST_ESTIMATE_QUERY', fetchFirstEstimateQuery);
  // GET request for the second search Query
  yield takeLatest('FETCH_SECOND_ESTIMATE_QUERY', fetchSecondEstimateQuery);
  // GET request for third search Query
  yield takeLatest('FETCH_THIRD_ESTIMATE_QUERY', fetchThirdEstimateQuery);
  // Makes the math machine run on the combined estimates:
  yield takeLatest('HANDLE_CALCULATED_COMBINED_ESTIMATE', handleCalculatedCombinedEstimate);
  yield takeLatest('FETCH_THREE_ESTIMATES_QUERY', fetchThreeEstimatesQuery);
}

export default combineEstimatesSaga;