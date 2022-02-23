import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* licenseePortalSaga() {
	yield takeLatest('INITIAL_LOAD_LICENSEE_PORTAL', initialLoadLicenseePortal);
	// yield takeLatest('ADD_PLACEMENT_TYPE', postPlacementType);
}

//worker saga to GET all placement types
function* initialLoadLicenseePortal() {
	try {
		//GET all placement types
		// const placementTypes = yield axios.get('/api/placementtypes');
		//send results to placementTypes reducer
		// yield put({type: 'SET_PLACEMENT_TYPES', payload: placementTypes.data});
	} catch (error) {
		alert("Error with loading:", error)
		console.error('Error in initialLoadLicenseePortal', error);
	} // End try/catch
} // End initialLoadLicenseePortal



export default licenseePortalSaga;