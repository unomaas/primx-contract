import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* licenseePortalSaga() {
	yield takeLatest('INITIAL_LOAD_LICENSEE_PORTAL', initialLoadLicenseePortal);
	// yield takeLatest('ADD_PLACEMENT_TYPE', postPlacementType);
}

//worker saga to GET all placement types
function* initialLoadLicenseePortal(action) {
	try {
		console.log('*** in initialLoadLicenseePortal', {action});

		const licensee_id = action.payload;
		
		//GET all placement types
		// const placementTypes = yield axios.get('/api/placementtypes');
		//send results to placementTypes reducer
		// yield put({type: 'SET_PLACEMENT_TYPES', payload: placementTypes.data});


		// ⬇ Get all the estimates associated with this licensee company:
		const response = yield axios.get(`/api/licenseePortal/${licensee_id}`);

		console.log('*** result is', {response});
		

		// ⬇ Send the results to the licenseePortal data reducer: 
		// yield put({type: 'SET_DATA_LICENSEE_PORTAL', payload: result.data});
	} catch (error) {
		alert(`initialLoadLicenseePortal ${error}`)
		console.error('Error in initialLoadLicenseePortal', error);
	} // End try/catch
} // End initialLoadLicenseePortal



export default licenseePortalSaga;