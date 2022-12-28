import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

function* shippingDestinationsSaga() {
	yield takeLatest('FETCH_SHIPPING_DESTINATIONS', fetchShippingDestinations);
};

//worker saga to GET all shipping costs
function* fetchShippingDestinations() {
	try {
		//GET all shipping costs
		const shippingDestinations = yield axios.get('/api/shippingDestinations');

		//send results to shippingCosts reducer
		yield put({
			type: 'SET_SHIPPING_DESTINATIONS',
			payload: shippingDestinations.data
		});
	} catch (error) {
		console.error('Error with fetchShippingDestinations in shippingDestinations saga', error);
	}
}



export default shippingDestinationsSaga;