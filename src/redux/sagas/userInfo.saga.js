import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

//worker saga to get all user info of all users
function* fetchAllUsers() {
    try {
        const users = yield axios.get('/api/userInfo');
        //sends the results / info to the reducer
        yield put({type: 'SET_USERINFO', payload: users.data})
    } catch (error) {
        console.log('fetchAllUsers get request failed -->', error);   
    }
}

//worker saga to delete users if you are the super admin
function* deleteAdmin(action) {
    try {
      console.log('in deleteAdmin in userInfo.saga, action.payload.id is -->', action.payload.id);
      //tells userInfo router to delete a user based on their id#
      yield axios.delete(`/api/userInfo/${action.payload.id}`)
      //sends results to reducer
      yield put({type: 'FETCH_USERINFO'})
    } catch(error) {
      console.log('error deleting admin in userInfo.SAGA -->', error);
    }
  }

function* userInfoSaga() {
    yield takeEvery('FETCH_USERINFO', fetchAllUsers);
    yield takeEvery('DELETE_ADMIN', deleteAdmin);
}

export default userInfoSaga;