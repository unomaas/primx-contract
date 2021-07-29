import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchAllUsers() {
    try {
        const users = yield axios.get('/api/userInfo');
        yield put({type: 'SET_USERINFO', payload: users.data})
    } catch (error) {
        console.log('fetchAllUsers get request failed -->', error);   
    }
}

function* deleteAdmin(action) {
    try {
      console.log('in deleteAdmin in userInfo.saga, action.payload.id is -->', action.payload.id);
      
      yield axios.delete(`/api/userInfo/${action.payload.id}`)
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