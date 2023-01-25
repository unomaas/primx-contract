import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

const errorText = 'Error in Customs Duties: ';

function* customsDutiesSaga() {
	yield takeLatest('FETCH_PRODUCT_CONTAINERS', fetchProductContainers);
	yield takeLatest('EDIT_PRODUCT_CONTAINERS', editProductContainers);
}

function* fetchProductContainers() {
	try {
		const response = yield axios.get('/api/productcontainer/fetch-product-container');
		yield put({ type: 'SET_PRODUCT_CONTAINERS', payload: response.data });
	} catch (error) {
		console.error(errorText, error);
	}
}

function* editProductContainers(action) {
	try {
		yield axios.put(`/api/productcontainer/edit-product-container`, action.payload);
		yield put({ type: 'FETCH_PRODUCT_CONTAINERS' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	}
}



export default customsDutiesSaga;