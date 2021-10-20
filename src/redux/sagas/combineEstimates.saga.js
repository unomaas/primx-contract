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
    //take response from DB and insert into Admin Reducer
    yield put({
      type: 'SET_FIRST_ESTIMATE_QUERY_RESULT',
      payload: calculatedResponse
    });
  } catch (error) {
    console.log('User get request failed', error);
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
    //take response from DB and insert into Admin Reducer
    yield put({
      type: 'SET_SECOND_ESTIMATE_QUERY_RESULT',
      payload: calculatedResponse
    });
  } catch (error) {
    console.log('User get request failed', error);
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
    //take response from DB and insert into Admin Reducer
    yield put({
      type: 'SET_THIRD_ESTIMATE_QUERY_RESULT',
      payload: calculatedResponse
    });
  } catch (error) {
    console.log('User get request failed', error);
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
}

export default combineEstimatesSaga;