import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

const errorText = 'Error in Customs Duties: ';

function* customsDutiesSaga() {
	yield takeLatest('FETCH_CUSTOMS_DUTIES', fetchCustomsDuties);
	yield takeLatest('FETCH_EACH_CUSTOMS_DUTIES', fetchEachCustomsDuties);
	yield takeLatest('EDIT_CUSTOMS_DUTIES', editCustomsDuties);
	yield takeLatest('FETCH_CUSTOMS_DUTIES_HISTORY_ALL', fetchAllCustomsDutiesHistory);
	yield takeLatest('FETCH_CUSTOMS_DUTIES_HISTORY_RECENT', fetchRecentCustomsDutiesHistory);
	yield takeLatest('CUSTOMS_DUTIES_SAVE_HISTORY_LOG', saveCustomsDutiesHistoryLog);
}

function* fetchCustomsDuties() {
	try {
		const response = yield axios.get('/api/customsduties/fetch-customs-duties');
		yield put({ type: 'SET_CUSTOMS_DUTIES', payload: response.data });
	} catch (error) {
		console.error(errorText, error);
	}
}

function* fetchEachCustomsDuties() {
	try {
		const response = yield axios.get('/api/customsduties/fetch-each-customs-duties');
		yield put({ type: 'SET_EACH_CUSTOMS_DUTIES', payload: response.data });
	} catch (error) {
		console.error(errorText, error);
	}
}

function* editCustomsDuties(action) {
	try {
		yield axios.put(`/api/customsduties/edit-customs-duties`, action.payload);
		yield put({ type: 'FETCH_CUSTOMS_DUTIES' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	}
}

function* fetchAllCustomsDutiesHistory() {
	try {
		const response = yield axios.get(`/api/customsduties/get-all-customs-duties-history`);
		yield put({ type: 'SET_CUSTOMS_DUTIES_HISTORY_ALL', payload: response.data });
	} catch (error) {
		console.error(errorText, error);
	} // End try/catch
} // End 

function* fetchRecentCustomsDutiesHistory() {
	try {
		const response = yield axios.get(`/api/customsduties/get-recent-customs-duties-history`);
		yield put({ type: 'SET_CUSTOMS_DUTIES_HISTORY_RECENT', payload: response.data });
	} catch (error) {
		console.error('Error with fetchRecentCustomsDutiesHistory saga', error);
	} // End try/catch
} // End fetchRecentCustomsDutiesHistory

function* saveCustomsDutiesHistoryLog(action) {
	try {
		yield axios.post(`/api/customsduties/submit-customs-duties-history`, action.payload);
		yield put({ type: 'FETCH_CUSTOMS_DUTIES_HISTORY_RECENT' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
	} catch (error) {
		console.error('Error with saveCustomsDutiesHistoryLog saga', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} // End try/catch
} // End saveCustomsDutiesHistoryLog



export default customsDutiesSaga;