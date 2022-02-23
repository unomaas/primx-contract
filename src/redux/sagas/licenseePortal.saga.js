import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* licenseePortalSaga() {
	yield takeLatest('INITIAL_LOAD_LICENSEE_PORTAL', initialLoadLicenseePortal);
	// yield takeLatest('ADD_PLACEMENT_TYPE', postPlacementType);
}

//worker saga to GET all placement types
function* initialLoadLicenseePortal(action) {
	try {
		// ⬇ Save the licensee id: 
		const licensee_id = action.payload;
		// ⬇ Get all the estimates associated with this licensee company:
		const response = yield axios.get(`/api/licenseePortal/${licensee_id}`);
		console.log('***', {response});
		

		// TODO: When you come back, build out the reducer to hold the data.  Also explore how to sort the data on the back-end server before returning, similar to how Nexera does itw ith indices.  
		// ⬇ Send the results to the licenseePortal data reducer: 
		// yield put({type: 'SET_DATA_LICENSEE_PORTAL', payload: response.data});
	} catch (error) {
		alert(`initialLoadLicenseePortal ${error}`);
		console.error('Error in initialLoadLicenseePortal', error);
	} // End try/catch
} // End initialLoadLicenseePortal



export default licenseePortalSaga;