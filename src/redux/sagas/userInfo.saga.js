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

function* userInfoSaga() {
    yield takeEvery('FETCH_USERINFO', fetchAllUsers);
}

export default userInfoSaga;