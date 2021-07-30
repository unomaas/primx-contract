import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


// Saga Worker to create a GET request for Estimate DB at estimate number & licensee ID
function* LookupEstimate(action) {
    const estimateNumber = action.payload.estimateNumber
    const licenseeId = action.payload.licenseeId

    console.log('IN SAGA -->Estimate Order For Lookup:', estimateNumber, ' Licensee ID:', licenseeId);

    try {
        const response = yield axios.get('/api/estimates/lookup/:estimates',
            {
                params: {
                    estimateNumber: estimateNumber,
                    licenseeId: licenseeId
                }
            })

        //take response from DB and insert into Admin Reducer
        yield put({ type: 'SET_ADMIN_ESTIMATES', payload: response.data });
    }

    catch (error) {
        console.log('User get request failed', error);
    }
}

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
    yield takeLatest('LOOKUP_ESTIMATE', LookupEstimate)
}

export default licenseeFormSaga;