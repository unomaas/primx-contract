import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

//worker saga to GET all floor types
function* fetchAllFloorTypes() {
    try {
        //GET all floor types
        const floorTypes = yield axios.get('/api/floorTypes');
        console.log('floorTypes.data', floorTypes.data);

        //send results to floorTypes reducer
        yield put({type: 'SET_FLOOR_TYPES', payload: floorTypes.data});
    } catch (error) {
        console.log('error with fetchAllFloorTypes in floorTypes saga', error);
        
    }
}

function* floorTypesSaga() {
    yield takeLatest('FETCH_FLOOR_TYPES', fetchAllFloorTypes);
}

export default floorTypesSaga;