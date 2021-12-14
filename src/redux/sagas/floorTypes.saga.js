import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

//worker saga to GET all floor types
function* fetchAllFloorTypes() {
    try {
        //GET all floor types
        const floorTypes = yield axios.get('/api/floortypes');
        //send results to floorTypes reducer
        yield put({type: 'SET_FLOOR_TYPES', payload: floorTypes.data});
    } catch (error) {
        console.error('Error with fetchAllFloorTypes in floorTypes saga', error);
        
    }
}

//worker saga for adding new floor type
function* postFloorType(action) {
    try {
      //send new floor type
      yield axios.post(`/api/floortypes`, action.payload);
      //send results to floorTypes reducer
      yield put({type: 'FETCH_FLOOR_TYPES'});
      yield put({ type:'SNACK_SUCCESS_FLOOR_TYPES'})
    } catch (error) {
      console.error('Error in post floor type SAGA -->', error);
    }
  }

function* floorTypesSaga() {
    yield takeLatest('FETCH_FLOOR_TYPES', fetchAllFloorTypes);
    yield takeLatest('ADD_FLOOR_TYPE', postFloorType);
}

export default floorTypesSaga;