import {
    put,
    takeLatest
  } from 'redux-saga/effects';
  import axios from 'axios';
  import useEstimateCalculations from '../../hooks/useEstimateCalculations';
  import removeTimestamps from '../../hooks/removeTimestamps';

// Saga Worker to create a GET request for Estimate DB at estimate number & licensee ID
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
        type: 'SET_ESTIMATE_QUERY_RESULT',
        payload: calculatedResponse
      });
    } catch (error) {
      console.log('User get request failed', error);
    }
  }
  
  // Saga Worker to create a GET request for Estimate DB at estimate number & licensee ID
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
        type: 'SET_ESTIMATE_QUERY_RESULT',
        payload: calculatedResponse
      });
    } catch (error) {
      console.log('User get request failed', error);
    }
  }
  
  // Saga Worker to create a GET request for Estimate DB at estimate number & licensee ID
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
function* licenseeFormSaga() {
    // Makes a POST request for a new estimate
    yield takeLatest('FETCH_FIRST_ESTIMATE_QUERY', fetchFirstEstimateQuery);
    // Makes a GET request to get a single estimate from the DB after being searched in the estimate lookup view
    yield takeLatest('FETCH_SECOND_ESTIMATE_QUERY', fetchSecondEstimateQuery);
    // Runs a number of functions to recalculate an old estimate with updated pricing data before creating a new estimate in the DB
    yield takeLatest('FETCH_THIRD_ESTIMATE_QUERY', fetchThirdEstimateQuery);
  }
  
  export default licenseeFormSaga;