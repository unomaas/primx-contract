import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


// Saga Worker to add estimate into table
function* AddEstimate(action) {
    try {
        yield axios.post('/api/estimates', action.payload);
        // reset state to update estimates from dom with adminEstimate reducer
        yield put({ type: "SET_ESTIMATE" });
    }

    catch (error) {
        console.log('User POST request failed', error);
    }
}

// companies saga to fetch companies
function* licenseeFormSaga() {
    yield takeLatest('ADD_ESTIMATE', AddEstimate);
}

export default licenseeFormSaga;