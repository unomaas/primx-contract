import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

function* shippingCostsSaga() {
	yield takeLatest('FETCH_SHIPPING_COSTS', fetchShippingCosts);
	yield takeLatest('ADD_SHIPPING_COSTS', postShippingCosts);
	yield takeLatest('UPDATE_SHIPPING_COSTS', updateShippingCosts);
	yield takeLatest('FETCH_SHIPPING_COST_HISTORY_ALL', fetchAllShippingCostHistory);
	yield takeLatest('FETCH_SHIPPING_COST_HISTORY_RECENT', fetchRecentShippingCostHistory);
	yield takeLatest('SHIPPING_COSTS_SAVE_HISTORY_LOG', saveShippingCostHistoryLog);
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
		yield put({ type: 'SHIPPING_COSTS_SHOW_EDIT_MODAL', payload: false });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SHIPPING_COSTS_EDIT_SUCCESS' });
	} catch (error) {
		console.error('Error in updateShippingCosts saga', error);
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'COSTS_EDIT_ERROR', payload: false });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} // End try/catch
} // End updateShippingCosts

//worker saga to get shipping cost history
function* fetchAllShippingCostHistory() {
	try {
		//GET shipping cost history
		const shippingCostHistory = yield axios.get(`/api/shippingcosts/get-all-shipping-cost-history`);
		//send results to shippingCosts reducer
		yield put({ type: 'SET_SHIPPING_COST_HISTORY_ALL', payload: shippingCostHistory.data });
	} catch (error) {
		console.error('Error with fetchShippingCostHistory in shippingCosts saga', error);
	} // End try/catch
} // End fetchShippingCostHistory

//worker saga to get shipping cost history
function* fetchRecentShippingCostHistory() {
	try {
		//GET shipping cost history
		const shippingCostHistory = yield axios.get(`/api/shippingcosts/get-recent-shipping-cost-history`);
		//send results to shippingCosts reducer
		yield put({ type: 'SET_SHIPPING_COST_HISTORY_RECENT', payload: shippingCostHistory.data });
	} catch (error) {
		console.error('Error with fetchShippingCostHistory in shippingCosts saga', error);
	} // End try/catch
} // End fetchShippingCostHistory

//worker saga to get shipping cost history
function* saveShippingCostHistoryLog(action) {
	try {
		const shippingCosts = action.payload;
		const result = yield axios.post(`/api/shippingcosts/submit-shipping-cost-history`, shippingCosts);
		if (result.status === 201) {
			// ⬇ Refresh the shipping cost history recent data:
			yield put({ type: 'FETCH_SHIPPING_COST_HISTORY_RECENT' });
			yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		} // End if 
	} catch (error) {
		console.error('Error with saveShippingCostHistoryLog in shippingCosts saga', error);
	} // End try/catch
} // End fetchShippingCostHistory



export default shippingCostsSaga;