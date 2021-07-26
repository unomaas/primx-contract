import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

//worker saga to GET all placement types
function* fetchAllPlacementTypes() {
    try {
        //GET all placement types
        const placementTypes = yield axios.get('/api/placementTypes');
        console.log('placementTypes.data', placementTypes.data);

        //send results to floorTypes reducer
        yield put({type: 'SET_PLACEMENT_TYPES', payload: placementTypes.data});
    } catch (error) {
        console.log('error with fetchAllPlacementTypes in placementTypes saga', error);
        
    }
}

function* placementTypesSaga() {
    yield takeLatest('FETCH_PLACEMENT_TYPES', fetchAllPlacementTypes);
}

export default placementTypesSaga;