import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

const errorText = 'Error in Customs Duties: ';

function* customsDutiesSaga() {
	yield takeLatest('FETCH_DOSAGE_RATES', fetchDosageRates);
	yield takeLatest('EDIT_DOSAGE_RATES', editDosageRates);

}

function* fetchDosageRates() {
	try {
		const response = yield axios.get('/api/dosagerates/fetch-dosage-rates');
		yield put({ type: 'SET_DOSAGE_RATES', payload: response.data });
	} catch (error) {
		console.error(errorText, error);
	}
}

function* editDosageRates(action) {
	try {
		yield axios.put(`/api/dosagerates/edit-dosage-rates`, action.payload);
		yield put({ type: 'FETCH_DOSAGE_RATES' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	}
}



export default customsDutiesSaga;