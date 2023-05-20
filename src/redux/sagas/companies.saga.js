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
		console.error('Error with fetchAllCompanies:', error);
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
		console.error('Error with fetchActiveCompanies:', error)
	}
}

function* toggleActiveInactiveLicensee(action) {
	try {
		// action.payload contains the id of the licensee, their name, and the boolean of whether active is true or false
		yield axios.put(`/api/companies/${action.payload.licensee_id}`, action.payload);
		// fetches all companies to refresh DOM data for licensee view
		yield put({
			type: 'FETCH_ALL_COMPANIES'
		});
	} catch (error) {
		console.error('Error in update company saga: ', error);
	}
}

function* addCompany(action) {

	try {
		// takes company name input payload and posts to database
		yield axios.post('/api/companies', { value: action.payload });
		// refresh companies with new company post
		yield put({ type: 'FETCH_ALL_COMPANIES' });
		yield put({ type: 'SET_SUCCESS_COMPANY' })
	} catch (error) {
		console.error('Error in post company saga:', error);
	}
}

// companies saga to fetch companies
function* companiesSaga() {
	yield takeLatest('FETCH_ALL_COMPANIES', fetchAllCompanies);
	yield takeLatest('FETCH_ACTIVE_COMPANIES', fetchActiveCompanies);
	yield takeLatest('TOGGLE_ACTIVE_INACTIVE_LICENSEE', toggleActiveInactiveLicensee);
	yield takeLatest('ADD_COMPANY', addCompany);
}

export default companiesSaga;