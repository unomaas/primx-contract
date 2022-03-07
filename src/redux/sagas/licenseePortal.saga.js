import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* licenseePortalSaga() {
	yield takeLatest('INITIAL_LOAD_LICENSEE_PORTAL', initialLoadLicenseePortal);
	yield takeLatest('ARCHIVE_ESTIMATE_LICENSEE', archiveEstimateLicensee);
	yield takeLatest('DELETE_ESTIMATE_LICENSEE', deleteEstimateLicensee);
}

function* initialLoadLicenseePortal(action) {
	try {
		// ⬇ Save the licensee id: 
		const licensee_id = action.payload;
		// ⬇ Get all the estimates and companies associated with this licensee:
		const response = yield axios.get(`/api/licenseePortal/${licensee_id}`);
		// ⬇ Send the results to the data reducers: 
		yield put({ type: 'SET_LICENSEE_PORTAL_DATA', payload: response.data });
		// ⬇ Turned off until I setup loading screens across the app: 
		// yield put({ type: 'LOADING_SCREEN_OFF' });
	} catch (error) {
		alert(`initialLoadLicenseePortal ${error}`);
		console.error('Error in initialLoadLicenseePortal', error);
	} // End try/catch
} // End initialLoadLicenseePortal

function* archiveEstimateLicensee(action) {
	try {
		// ⬇ Save the required ID's for easier ref: 
		const estimate_id = action.payload.id;
		const licensee_id = action.payload.row.licensee_id;
		// ⬇ Update the DB to archive the estimate: 
		yield axios.put(`/api/estimates/archive/${estimate_id}`);
		// ⬇ Refresh the page data to stay current: Î
		yield put({ type: 'INITIAL_LOAD_LICENSEE_PORTAL', payload: licensee_id });
	} catch (error) {
		alert(`archiveEstimateLicensee ${error}`);
		console.error('Error in archiveEstimateLicensee', error);
	} // End try/catch
} // End archiveEstimateLicensee

function* deleteEstimateLicensee(action) {
	try {
		// ⬇ Save the required ID's for easier ref: 
		const estimate_id = action.payload.id;
		const licensee_id = action.payload.row.licensee_id;
		// ⬇ Update the DB to delete the estimate: 
		yield axios.delete(`/api/estimates/delete/${estimate_id}`);
		// ⬇ Refresh the page data to stay current: Î
		yield put({ type: 'INITIAL_LOAD_LICENSEE_PORTAL', payload: licensee_id });
	} catch (error) {
		alert(`deleteEstimateLicensee ${error}`);
		console.error('Error in deleteEstimateLicensee', error);
	} // End try/catch
} // End deleteEstimateLicensee


export default licenseePortalSaga;