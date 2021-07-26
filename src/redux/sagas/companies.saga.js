import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// fetchCompanies generator to use get from the db
function* fetchCompanies() {
    try {
      
      const response = yield axios.get('/api/companies');
        // set companies used in reducer
      yield put({ type: 'SET_COMPANIES', payload: response.data });
    } catch (error) {
      console.log('User get request failed', error);
    }
  }
  // companies saga to fetch companies
  function* companiesSaga() {
    yield takeLatest('FETCH_COMPANIES', fetchCompanies);
  }
  
  export default companiesSaga;