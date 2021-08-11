import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import removeTimestamps from '../../hooks/removeTimestamps';

// worker saga to GET all estimates
function* fetchAllEstimates() {
    try {
        // GET all estimates
        const estimates = yield axios.get('/api/estimates/all');
        // remove the timestamps from dates for all the estimates
        const updatedEstimates = removeTimestamps(estimates.data);
        // send results to adminEstimates reducer
        yield put({ type: 'SET_ADMIN_ESTIMATES', payload: updatedEstimates });
    }
    catch (error) {
        console.log('Error with fetchAllEstimates in adminEstimates Saga:', error);
    }
    
}

// worker saga to make a PUT request to update that was changed in the AdminEstimatesGrid Data Grid
function* editEstimateData(action) {
    try {
        // action.payload is an object with the id, a dbColumn that tells column to be edited, and a newValue that contains the requested change
        yield axios.put(`/api/estimates/edit/${action.payload.id}`, action.payload);
    }
    catch (error) {
        console.log('Error with editEstimateData in the adminEstimates Saga', error);
    }
}

// worker saga to make a PUT request to mark a pending order as processed, and assign the estimate the name of the admin who clicked the button
function* editProcessOrder(action) {
    try {
        // action.payload is an object with various details about the data grid row, including the id of the estimate to be changed. action.payload.row
        // contains all the data involved for the estimate being processed
        yield axios.put(`/api/estimates/process/${action.payload.id}`, action.payload.row);
        // update data grids now that data in DB has changed
        yield put({type: 'FETCH_ALL_ESTIMATES'});
    }
    catch (error) {
        console.log('Error with editProcessOrder in the adminEstimates Saga', error);
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
}

export default adminEstimatesSaga;