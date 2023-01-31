import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

const errorText = 'Error in Customs Duties: ';

function* pricingLogSaga() {
	yield takeLatest('PRICING_LOG_INITIAL_LOAD', pricingLogInitialLoad);
	// yield takeLatest('EDIT_PRODUCT_CONTAINERS', editProductContainers);
}

function* pricingLogInitialLoad() {
	try {
		const customsDutiesHistoryAll = yield axios.get('/api/customsduties/get-all-customs-duties-history');
		const markupHistoryAll = yield axios.get('/api/products/get-all-markup-history');
		const productCostHistoryAll = yield axios.get('/api/products/get-all-product-cost-history');
		const shippingCostHistoryAll = yield axios.get('/api/shippingcosts/get-all-shipping-cost-history');

		yield put({
			type: 'PRICING_LOG_SET_INITIAL_DATA', payload: {
				customsDutiesHistoryAll: customsDutiesHistoryAll.data,
				markupHistoryAll: markupHistoryAll.data,
				productCostHistoryAll: productCostHistoryAll.data,
				shippingCostHistoryAll: shippingCostHistoryAll.data
			}
		});
		// yield put({ type: 'SET_PRODUCT_CONTAINERS', payload: response.data });
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}
}

// function* editProductContainers(action) {
// 	try {
// 		yield put({ type: 'SHOW_TOP_LOADING_DIV' });
// 		yield axios.put(`/api/productcontainer/edit-product-container`, action.payload);
// 		yield put({ type: 'FETCH_PRODUCT_CONTAINERS' });
// 		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
// 		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
// 	} catch (error) {
// 		console.error(errorText, error);
// 		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
// 		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
// 	}
// }



export default pricingLogSaga;