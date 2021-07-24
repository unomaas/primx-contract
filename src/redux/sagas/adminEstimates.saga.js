import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker saga to GET all estimates
function* fetchAllEstimates() {
    try {
        // GET all estimates
        const estimates = yield axios.get('/api/estimates/all');
        // OPTION: run the math function on the saved array of objects here to mutate them into more complete objects

        // send results to adminEstimates reducer
        yield put({ type: 'SET_ADMIN_ESTIMATES', payload: estimates.data });
        

    }
    catch (error) {
        console.log('Error with fetchAllEstimates in adminEstimates Saga:', error);
    }
    
}



// watcher saga to look for admin estimate requests
function* adminEstimatesSaga() {
    // request to GET all estimates
    yield takeLatest('FETCH_ALL_ESTIMATES', fetchAllEstimates);
}

export default adminEstimatesSaga;