import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';






// watcher saga to look for admin estimate requests
function* adminEstimatesSaga() {
    // request to GET all estimates
    yield takeLatest('FETCH_ALL_ESTIMATES', fetchAllEstimates);
}

export default adminEstimatesSaga;