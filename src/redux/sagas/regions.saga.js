import {
	put,
	takeLatest
} from 'redux-saga/effects';
import axios from 'axios';


function* regionsSaga() {
	yield takeLatest('FETCH_ACTIVE_REGIONS', fetchActiveRegions);
	

}; 

function* fetchActiveRegions() {
	try {
		const response = yield axios.get('/api/regions/get-active-regions');
		yield put({
			type: 'SET_ACTIVE_REGIONS',
			payload: response.data
		});
	} catch (error) {
		console.error('product get request failed', error);
	}
}



export default regionsSaga;