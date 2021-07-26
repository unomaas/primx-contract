import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// fetchCompanies generator to use get from the db
function* fetchCompanies() {
    try {
      
      const response = yield axios.get('/api/companies');
        // set companies used in reducer
      yield put({ type: 'SET_COMPANIES', payload: response.data });
    } catch (error) {
      console.log('company get request failed', error);
    }
  }

  function* updateCompany(action) {
    try {
        // takes payload to database to update company
        yield axios.put(`/api/companies/${action.payload.id}`, action.payload);
        // fetches companies
        yield put({ type: 'FETCH_COMPANIES'});
    } catch (error) {
        console.log('Error in update company saga: ', error);
    }
    }

  // companies saga to fetch companies
  function* companiesSaga() {
    yield takeLatest('FETCH_COMPANIES', fetchCompanies);
    yield takeLatest('UPDATE_COMPANY', updateCompany);
  }
  
  export default companiesSaga;