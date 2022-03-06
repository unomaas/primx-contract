import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* licenseePortalSaga() {
	yield takeLatest('INITIAL_LOAD_LICENSEE_PORTAL', initialLoadLicenseePortal);
}


function* initialLoadLicenseePortal(action) {
	try {
		// ⬇ Save the licensee id: 
		const licensee_id = action.payload;
		// ⬇ Get all the estimates and companies associated with this licensee:
		const response = yield axios.get(`/api/licenseePortal/${licensee_id}`);
		// ⬇ Send the results to the data reducers: 
		yield put({ type: 'SET_DATA_LICENSEE_PORTAL', payload: response.data });
		yield put({ type: 'SET_BUTTON_STATE', payload: 'SavedEstimates' });
		// ⬇ Turned off until I setup loading screens across the app: 
		// yield put({ type: 'LOADING_SCREEN_OFF' });
	} catch (error) {
		alert(`initialLoadLicenseePortal ${error}`);
		console.error('Error in initialLoadLicenseePortal', error);
	} // End try/catch
} // End initialLoadLicenseePortal


export default licenseePortalSaga;