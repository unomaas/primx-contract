import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

function* shippingDestinationsSaga() {
	yield takeLatest('FETCH_ACTIVE_SHIPPING_DESTINATIONS', fetchActiveShippingDestinations);
	yield takeLatest('FETCH_ALL_SHIPPING_DESTINATIONS', fetchAllShippingDestinations);
	yield takeLatest('TOGGLE_SHIPPING_DESTINATION_ACTIVE', toggleShippingDestinationActive);
	yield takeLatest('TOGGLE_SHIPPING_DESTINATION_ACTIVE_SET_PRICES', toggleShippingDestinationActiveSetPrices);

};

//worker saga to GET all shipping costs
function* fetchActiveShippingDestinations() {
	try {
		//GET all shipping costs
		const shippingDestinations = yield axios.get('/api/shippingDestinations/active');

		// ⬇ Sort shippingDestinations.data by destination_country descending then destination name ascending:
		shippingDestinations.data.sort((a, b) => {
			if (a.destination_country < b.destination_country) {
				return 1;
			} else if (a.destination_country > b.destination_country) {
				return -1;
			} else {
				if (a.destination_name < b.destination_name) {
					return -1;
				} else if (a.destination_name > b.destination_name) {
					return 1;
				} else {
					return 0;
				}
			}
		});

		//send results to shippingCosts reducer
		yield put({
			type: 'SET_ACTIVE_SHIPPING_DESTINATIONS',
			payload: shippingDestinations.data
		});
	} catch (error) {
		console.error('Error with fetchActiveShippingDestinations in shippingDestinations saga', error);
	}
}

//worker saga to GET all shipping costs
function* fetchAllShippingDestinations() {
	try {
		//GET all shipping costs
		const shippingDestinations = yield axios.get('/api/shippingDestinations/all');

		// ⬇ Sort shippingDestinations.data by destination_country descending then destination name ascending:
		shippingDestinations.data.sort((a, b) => {
			if (a.destination_country < b.destination_country) {
				return 1;
			} else if (a.destination_country > b.destination_country) {
				return -1;
			} else {
				if (a.destination_name < b.destination_name) {
					return -1;
				} else if (a.destination_name > b.destination_name) {
					return 1;
				} else {
					return 0;
				}
			}
		});

		//send results to shippingCosts reducer
		yield put({ type: 'SET_ALL_SHIPPING_DESTINATIONS', payload: shippingDestinations.data });
	} catch (error) {
		console.error('Error with fetchAllShippingDestinations in shippingDestinations saga', error);
	}
}

function* toggleShippingDestinationActiveSetPrices(action) {
	try {
		//GET all shipping costs
		const response = yield axios.post(`/api/shippingDestinations/toggle-active-set-prices`, action.payload);
		if (response) {
			// ⬇ Refresh shipping destinations and hide loading div:
			yield put({ type: "FETCH_ALL_SHIPPING_DESTINATIONS" });
			yield put({ type: 'SHIPPING_DESTINATIONS_SHOW_EDIT_MODAL', payload: false });
			yield put({ type: 'HIDE_TOP_LOADING_DIV' });
			yield put({ type: "SNACK_GENERIC_REQUEST_SUCCESS" })
		}
	} catch (error) {
		console.error('Error with toggleShippingDestinationActive in shippingDestinations saga', error);
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SHIPPING_DESTINATIONS_SHOW_EDIT_MODAL', payload: false });
		yield put({ type: "SNACK_GENERIC_REQUEST_ERROR" })
	}
}


function* toggleShippingDestinationActive(action) {
	try {
		const destinationId = action.payload;

		//GET all shipping costs
		const response = yield axios.put(`/api/shippingDestinations/toggle-active/${destinationId}`);
		if (response) {
			// ⬇ Refresh shipping destinations and hide loading div:
			yield put({ type: "FETCH_ALL_SHIPPING_DESTINATIONS" });
			yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		}
	} catch (error) {
		console.error('Error with toggleShippingDestinationActive in shippingDestinations saga', error);
	}
}



export default shippingDestinationsSaga;