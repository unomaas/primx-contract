import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// fetchCompanies generator to GET all companies, both active and inactive, from the DB for the Admin views
function* fetchAllCompanies() {
  try {

    const response = yield axios.get('/api/companies/all');
    // set companies used in reducer
    yield put({
      type: 'SET_COMPANIES',
      payload: response.data
    });
  } catch (error) {
    console.log('Error with fetchAllCompanies:', error);
  }
}

// Worker saga to GET only the active licensee companies from the DB for estimate creation and estimate lookup views
function* fetchActiveCompanies() {
  try {
    const response = yield axios.get('/api/companies/active');
    // set the active companies in the companies reducer
    yield put({
      type: 'SET_COMPANIES',
      payload: response.data
    })
  }
  catch (error) {
    console.log('Error with fetchActiveCompanies:', error)
  }
}

function* updateCompany(action) {
  try {
    // takes payload to database to update company
    yield axios.put(`/api/companies/${action.payload.id}`, action.payload);
    // fetches companies
    yield put({
      type: 'FETCH_COMPANIES'
    });
  } catch (error) {
    console.log('Error in update company saga: ', error);
  }
}

function* addCompany(action) {

  try {
    // takes company name input payload and posts to database
    yield axios.post('/api/companies', {value:action.payload});
    // refresh companies with new company post
    yield put({ type: 'FETCH_COMPANIES'});
    yield put({ type: 'SET_SUCCESS_COMPANY'})
  } catch (error) {
    console.log('Error in post company saga:', error);
  }
}

// companies saga to fetch companies
function* companiesSaga() {
  yield takeLatest('FETCH_ALL_COMPANIES', fetchAllCompanies);
  yield takeLatest('FETCH_ACTIVE_COMPANIES', fetchActiveCompanies);
  yield takeLatest('UPDATE_COMPANY', updateCompany);
  yield takeLatest('ADD_COMPANY', addCompany);
}

export default companiesSaga;