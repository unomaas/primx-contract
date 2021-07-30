import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

//worker saga to GET all placement types
function* fetchAllPlacementTypes() {
    try {
        //GET all placement types
        const placementTypes = yield axios.get('/api/placementtypes');
        console.log('placementTypes.data', placementTypes.data);

        //send results to placementTypes reducer
        yield put({type: 'SET_PLACEMENT_TYPES', payload: placementTypes.data});
    } catch (error) {
        console.log('error with fetchAllPlacementTypes in placementTypes saga', error);
        
    }
}

function* postPlacementType(action) {
    console.log('in postPlacementType, action.payload is -->', action.payload);
    
    try {
      yield axios.post(`/api/placementtypes`, action.payload);
      yield put({type: 'FETCH_PLACEMENT_TYPES'});
      yield put({type: 'SET_SUCCESS_PLACEMENT_TYPES'});
    } catch (error) {
      console.log('error in post placement type SAGA -->', error);
    }
  }

function* placementTypesSaga() {
    yield takeLatest('FETCH_PLACEMENT_TYPES', fetchAllPlacementTypes);
    yield takeLatest('ADD_PLACEMENT_TYPE', postPlacementType);
}

export default placementTypesSaga;