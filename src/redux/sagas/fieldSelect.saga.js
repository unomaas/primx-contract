import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchFieldSelect() {
    // fetch all active companies for estimate create Select menu
    yield put({type: 'FETCH_ACTIVE_COMPANIES'});
    // fetch all placement types for estimate create Select menu
    yield put({type: 'FETCH_PLACEMENT_TYPES'});
    // fetch the product pricing object
    yield put({type: 'FETCH_PRODUCTS_OBJECT'});
    // fetch the shipping costs for each ship-to state or province
    yield put({type: 'FETCH_ACTIVE_SHIPPING_DESTINATIONS'});
    // fetch the floor types for the estimate create Select menu
    yield put({type: 'FETCH_FLOOR_TYPES'});

    // yield put({ type: "LOADING_SCREEN_OFF"});

  }

function* fieldSelectSaga() {
    yield takeLatest('FETCH_FIELD_SELECT', fetchFieldSelect);
}

export default fieldSelectSaga;