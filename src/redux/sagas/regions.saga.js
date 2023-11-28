import {
	put,
	takeLatest
} from 'redux-saga/effects';
import axios from 'axios';

function* regionsSaga() {
	yield takeLatest('FETCH_REGIONS', fetchRegions);
	yield takeLatest('REGIONS_INITIAL_LOAD', regionsInitialLoad);
	yield takeLatest('SUBMIT_REGION', submitRegion);
};

function* fetchRegions(action) {
	const params = {};
	let key = `allRegions`;
	if (action.payload === 'active') {
		params.active = true;
		key = `activeRegions`;
	}
	try {
		const response = yield axios.get(`/api/regions/get-regions`, { params: params });
		yield put({
			type: 'SET_REGIONS_DATA',
			payload: { [key]: response.data }
		});
	} catch (error) {
		console.error('product get request failed', error);
	}
}

function* regionsInitialLoad() {
	try {
		const allRegionsPromise = yield axios.get(`/api/regions/get-regions`);
		const customsDutiesPromise = yield axios.get(`/api/customsduties/get-duties-for-regions`);
		const productsPromise = yield axios.get(`/api/products/get-products-for-regions`);

		yield put({
			type: 'SET_REGIONS_DATA',
			payload: {
				allRegions: allRegionsPromise.data,
				customsDuties: customsDutiesPromise.data,
				products: productsPromise.data
			}
		});
	} catch (error) {
		console.error('product get request failed', error);
	}
	yield put({ type: 'HIDE_TOP_LOADING_DIV' });
}

function* submitRegion(action) {
	try {
		const endpoint = action.payload.edit ? '/api/regions/edit-existing-region' : '/api/regions/create-new-region';
		yield axios.post(endpoint, action.payload);
		yield put({ type: 'REGIONS_INITIAL_LOAD' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
	} catch (error) {
		console.error('Error in post licensee saga:', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}
	yield put({ type: 'HIDE_TOP_LOADING_DIV' });
}



export default regionsSaga;