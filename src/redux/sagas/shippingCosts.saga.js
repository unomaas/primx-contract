import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

function* shippingCostsSaga() {
	yield takeLatest('FETCH_SHIPPING_COSTS', fetchShippingCosts);
	yield takeEvery('ADD_SHIPPING_COSTS', postShippingCosts);
	yield takeLatest('UPDATE_SHIPPING_COSTS', updateShippingCosts);
}

//worker saga to GET all shipping costs
function* fetchShippingCosts() {
	try {
		//GET all shipping costs
		const shippingCosts = yield axios.get('/api/shippingcosts');

		//send results to shippingCosts reducer
		yield put({
			type: 'SET_SHIPPING_COSTS',
			payload: shippingCosts.data
		});
	} catch (error) {
		console.error('Error with fetchShippingCosts in shippingCosts saga', error);
	}
}

//worker saga to add shipping costs
function* postShippingCosts(action) {

	try {
		//add shipping costs
		yield axios.post(`/api/shippingcosts`, action.payload);
		//send results to shippingCosts reducer
		yield put({
			type: 'FETCH_SHIPPING_COSTS'
		});
		yield put({
			type: 'SET_SUCCESS_SHIPPING'
		})
	} catch (error) {
		console.error('Error in postShippingCosts SAGA -->', error);
	}
}

//worker saga to update shipping costs
function* updateShippingCosts(action) {
	try {
		// ⬇ Update the shipping costs: 
		yield axios.put(`/api/shippingcosts/edit-shipping-costs`, action.payload);
		// ⬇ Close the edit modal, hide the loading div, show the success message, and refresh the data:
		yield put({ type: 'FETCH_SHIPPING_COSTS' });
		yield put({ type: 'SHIPPING_COSTS_SHOW_EDIT_MODAL', payload: false },);
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SHIPPING_COSTS_EDIT_SUCCESS' });
	} catch (error) {
		console.error('Error in updateShippingCosts saga', error);
		yield put({ type: 'SHIPPING_COSTS_EDIT_ERROR', payload: false });
	} // End try/catch
} // End updateShippingCosts


export default shippingCostsSaga;