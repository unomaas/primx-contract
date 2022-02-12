import {
  put,
  takeLatest,
	takeEvery,
} from 'redux-saga/effects';
import axios from 'axios';

function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
  yield takeEvery('REGISTER_LICENSEE', registerLicensee);

}

// worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  try {
    // clear any existing error on the registration page
    yield put({
      type: 'CLEAR_REGISTRATION_ERROR'
    });
    // passes the username and password from the payload to the server
    yield axios.post('/api/user/register', action.payload);
    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({
      type: 'FETCH_USER_INFO'
    });
    yield put({
      type: 'SET_SUCCESS_REGISTER_ADMIN'
    });
  } catch (error) {
    console.error('Error with user registration:', error);
    yield put({
      type: 'REGISTRATION_FAILED'
    });
  }
}

// worker Saga: will be fired on "REGISTER" actions
function* registerLicensee(action) {
  try {
    // clear any existing error on the registration page
    yield put({
      type: 'CLEAR_REGISTRATION_ERROR'
    });
    // passes the username and password from the payload to the server
    yield axios.post('/api/user/register_licensee', action.payload);
    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({
      type: 'FETCH_ADMIN_INFO'
    });
    yield put({
      type: 'SET_SUCCESS_REGISTER_ADMIN'
    });
  } catch (error) {
    console.error('Error with user registration:', error);
    yield put({
      type: 'REGISTRATION_FAILED'
    });
  }
} // End registerUser

export default registrationSaga;