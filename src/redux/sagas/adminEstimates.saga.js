import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker saga to GET all estimates
function* fetchAllEstimates() {
	try {
		// GET all estimates
		const response = yield axios.get('/api/estimates/all');
		const estimates = response.data;
		// remove the timestamps from dates for all the estimates
		estimates.forEach(estimate => {
			Object.assign(estimate, {
				date_created: estimate.date_created.split('T')[0],
				anticipated_first_pour_date: estimate.anticipated_first_pour_date.split('T')[0],
			}); // End Object.assign
		}); // End estimates.forEach
		// send results to adminEstimates reducer
		yield put({ type: 'SET_ADMIN_ESTIMATES', payload: estimates });
	}
	catch (error) {
		console.error('Error with fetchAllEstimates in adminEstimates Saga:', error);
	}
}

// worker saga to make a PUT request to update that was changed in the AdminEstimatesGrid Data Grid
function* editEstimateData(action) {
	try {
		// action.payload is an object with the id, a dbColumn that tells column to be edited, and a newValue that contains the requested change
		yield axios.put(`/api/estimates/edit/${action.payload.id}`, action.payload);
	}
	catch (error) {
		console.error('Error with editEstimateData in the adminEstimates Saga', error);
	}
}

// worker saga to make a PUT request to mark a pending order as processed, and assign the estimate the name of the admin who clicked the button
function* editProcessOrder(action) {
	try {
		// action.payload is an object with various details about the data grid row, including the id of the estimate to be changed. action.payload.row
		// contains all the data involved for the estimate being processed
		yield axios.put(`/api/estimates/process/${action.payload.id}`, action.payload.row);
		// update data grids now that data in DB has changed
		yield put({ type: 'FETCH_ALL_ESTIMATES' });
	}
	catch (error) {
		console.error('Error with editProcessOrder in the adminEstimates Saga', error);
	}
}

function* archiveEstimate(action) {
	try {

		yield axios.put(`/api/estimates/archive/${action.payload.id}`, action.payload.row)

		// update data grids now that data in DB has changed
		yield put({ type: 'FETCH_ALL_ESTIMATES' });

	}
	catch (error) {
		console.error('Error with archiveEstimate in adminEstimates Saga:', error);
	}
}
// worker saga to make a DELETE request at for estimates
function* deleteEstimate(action) {
	try {
		yield axios.delete(`/api/estimates/delete/${action.payload.id}`, { params: { id: action.payload.id } })
		// update data grids now that data in DB has changed
		yield put({ type: 'FETCH_ALL_ESTIMATES' });
	}
	catch (error) {
		console.error('Error with Delete Order in adminEstimates Saga', error);
	}
}



// watcher saga to look for admin estimate requests
function* adminEstimatesSaga() {
	// request to GET all estimates
	yield takeLatest('FETCH_ALL_ESTIMATES', fetchAllEstimates);
	// request to edit a single piece of data in an estimate
	yield takeLatest('EDIT_ESTIMATE_DATA', editEstimateData);
	// request to mark an order estimate that is pending as processed in the database
	yield takeLatest('EDIT_PROCESS_ORDER', editProcessOrder);
	// request to mark an estimate as archived
	yield takeLatest('ARCHIVE_ESTIMATE', archiveEstimate);
	// request to delete an estimate
	yield takeLatest('DELETE_ESTIMATE', deleteEstimate);
}

export default adminEstimatesSaga;