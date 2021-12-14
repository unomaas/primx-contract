import {
  put,
  takeLatest
} from 'redux-saga/effects';
import axios from 'axios';

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
      type: 'FETCH_USERINFO'
    });
    yield put({
      type: 'SNACK_SUCCESS_REGISTER_ADMIN'
    });
  } catch (error) {
    console.error('Error with user registration:', error);
    yield put({
      type: 'REGISTRATION_FAILED'
    });
  }
}

function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
}

export default registrationSaga;