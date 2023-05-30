import axios from 'axios';
import {
  put,
  takeEvery
} from 'redux-saga/effects';

function* userInfoSaga() {
  yield takeEvery('FETCH_ADMIN_INFO', fetchAllUsers);
  yield takeEvery('DELETE_ADMIN', deleteAdmin);
	yield takeEvery('FETCH_LICENSEE_INFO', fetchAllLicensees);
	yield takeEvery('DELETE_LICENSEE', deleteLicensee);
}

//worker saga to get all user info of all users
function* fetchAllUsers() {
  try {
    const users = yield axios.get('/api/userInfo');
    //sends the results / info to the reducer
    yield put({
      type: 'SET_ADMIN_INFO',
      payload: users.data
    })
  } catch (error) {
    console.error('fetchAllUsers get request failed -->', error);
  }
}

//worker saga to delete users if you are the super admin
function* deleteAdmin(action) {
  try {
    //tells userInfo router to delete a user based on their id#
    yield axios.delete(`/api/userInfo/${action.payload.id}`)
    //sends results to reducer
    yield put({
      type: 'FETCH_ADMIN_INFO'
    })
		// dispatch({ type: 'SET_SUCCESS_DELETE_ADMIN' });
  } catch (error) {
    console.error('Error deleting admin in userInfo.SAGA -->', error);
  }
}

//worker saga to get all user info of all users
function* fetchAllLicensees() {
	try {
		const response = yield axios.get('/api/userInfo/licensees');
		//sends the results / info to the reducer
		yield put({
			type: 'SET_LICENSEE_INFO',
			payload: response.data,
		})
	} catch (error) {
		console.error('fetchAllUsers get request failed -->', error);
	}
}

//worker saga to delete users if you are the super admin
function* deleteLicensee(action) {
	try {
		//tells userInfo router to delete a user based on their id#
		yield axios.delete(`/api/userInfo/licensees/${action.payload.licensee_id}`)
		//sends results to reducer
		yield put({
			type: 'FETCH_LICENSEE_INFO'
		})
		// dispatch({ type: 'SET_SUCCESS_DELETE_ADMIN' });
	} catch (error) {
		console.error('Error deleting admin in userInfo.SAGA -->', error);
	}
}


export default userInfoSaga;