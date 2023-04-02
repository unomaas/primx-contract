import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

const errorText = 'Error in Customs Duties: ';

function* pricingLogSaga() {
	yield takeLatest('PRICING_LOG_INITIAL_LOAD', pricingLogInitialLoad);
	yield takeLatest('UPDATE_PRICING_INITIAL_LOAD', updatePricingInitialLoad);
	// yield takeLatest('EDIT_PRODUCT_CONTAINERS', editProductContainers);
}

function* pricingLogInitialLoad() {
	try {
		const customsDutiesHistoryAll = yield axios.get('/api/customsduties/get-all-customs-duties-history');
		const markupHistoryAll = yield axios.get('/api/products/get-all-markup-history');
		const productCostHistoryAll = yield axios.get('/api/products/get-all-product-cost-history');
		const shippingCostHistoryAll = yield axios.get('/api/shippingcosts/get-all-shipping-cost-history');

		yield put({
			type: 'SET_PRICING_LOG_DATA', payload: {
				customsDutiesHistoryAll: customsDutiesHistoryAll.data,
				markupHistoryAll: markupHistoryAll.data,
				productCostHistoryAll: productCostHistoryAll.data,
				shippingCostHistoryAll: shippingCostHistoryAll.data
			}, // End payload
		}); // End put

		yield put({ type: 'SET_PRICING_LOG_VIEW', payload: { pricingLogIsLoading: false } })
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}
}

function* updatePricingInitialLoad() {
	try {
		const currentShippingCosts = yield axios.get('/api/shippingcosts/get-current-shipping-costs');
		const currentProductCosts = yield axios.get('/api/products/get-current-products');
		const currentCustomsDuties = yield axios.get('/api/customsduties/fetch-customs-duties');
		const currentMarkup = yield axios.get('/api/products/get-markup-margin');
		const activeShippingDestinations = yield axios.get('/api/shippingdestinations/active');

		yield put({
			type: 'SET_PRICING_LOG_DATA', payload: {
				currentShippingCosts: currentShippingCosts.data,
				currentProductCosts: currentProductCosts.data,
				currentCustomsDuties: currentCustomsDuties.data,
				currentMarkup: currentMarkup.data,
				activeShippingDestinations: activeShippingDestinations.data,
			}
		});
		yield put({
			type: 'SET_PRICING_LOG_VIEW', payload: {
				updatePricingIsLoading: false,
				newShippingCosts: currentShippingCosts.data,
				newProductCosts: currentProductCosts.data,
				newCustomsDuties: currentCustomsDuties.data,
				newMarkup: currentMarkup.data,
			}
		})
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