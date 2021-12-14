import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

//worker saga to GET all placement types
function* fetchAllPlacementTypes() {
    try {
        //GET all placement types
        const placementTypes = yield axios.get('/api/placementtypes');
        //send results to placementTypes reducer
        yield put({type: 'SET_PLACEMENT_TYPES', payload: placementTypes.data});
    } catch (error) {
        console.error('Error with fetchAllPlacementTypes in placementTypes saga', error);
    }
}

//worker saga to add placement types
function* postPlacementType(action) {
    try {
      //tells placement types router to add placement type to DB
      yield axios.post(`/api/placementtypes`, action.payload);
      //fecthes placement types again so the DOM shows the current placement types as well as the one just added to DB
      yield put({type: 'FETCH_PLACEMENT_TYPES'});
      yield put({type: 'SNACK_SUCCESS_PLACEMENT_TYPES'});
    } catch (error) {
      console.error('Error in post placement type SAGA -->', error);
    }
  }

function* placementTypesSaga() {
    yield takeLatest('FETCH_PLACEMENT_TYPES', fetchAllPlacementTypes);
    yield takeLatest('ADD_PLACEMENT_TYPE', postPlacementType);
}

export default placementTypesSaga;