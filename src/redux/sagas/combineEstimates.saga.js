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
}

export default combineEstimatesSaga;