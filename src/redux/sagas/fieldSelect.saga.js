import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchFieldSelect() {
	// fetch all active companies for estimate create Select menu
	yield put({ type: 'FETCH_ACTIVE_COMPANIES' });
	// fetch all placement types for estimate create Select menu
	yield put({ type: 'FETCH_PLACEMENT_TYPES' });
	// fetch the product pricing object
	// yield put({ type: 'FETCH_PRODUCTS_OBJECT' });
	// fetch the shipping costs for each ship-to state or province
	yield put({ type: 'FETCH_ACTIVE_SHIPPING_DESTINATIONS' });
	// fetch the floor types for the estimate create Select menu
	yield put({ type: 'FETCH_FLOOR_TYPES' });

	// yield put({ type: "LOADING_SCREEN_OFF"});

}

function* fetchAllForCalculate() {
	// ⬇ Fetch the following: products, shippingDestinations, currentMarkup, shippingCosts, productContainers, and dosageRates:
	yield put({ type: 'FETCH_PRODUCTS_ARRAY' });
	yield put({ type: 'FETCH_ACTIVE_SHIPPING_DESTINATIONS' });
	yield put({ type: 'FETCH_MARKUP_MARGIN' });
	yield put({ type: 'FETCH_SHIPPING_COSTS' });
	yield put({ type: 'FETCH_PRODUCT_CONTAINERS' });
	yield put({ type: 'FETCH_DOSAGE_RATES' });
	yield put({ type: 'FETCH_CUSTOMS_DUTIES' });
};

function* fieldSelectSaga() {
	yield takeLatest('FETCH_FIELD_SELECT', fetchFieldSelect);
	yield takeLatest('FETCH_ALL_FOR_CALCULATE', fetchAllForCalculate);
}

export default fieldSelectSaga;