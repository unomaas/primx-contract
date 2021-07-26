import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchCompanies() {
    try {
      
      const response = yield axios.get('/api/companies');

      yield put({ type: 'SET_COMPANIES', payload: response.data });
    } catch (error) {
      console.log('User get request failed', error);
    }
  }
  
  function* companiesSaga() {
    yield takeLatest('FETCH_COMPANIES', fetchCompanies);
  }
  
  export default companiesSaga;