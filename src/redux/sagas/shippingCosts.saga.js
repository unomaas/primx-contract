import axios from 'axios';
import { put, takeLatest, takeEvery } from 'redux-saga/effects';

//worker saga to GET all shipping costs
function* fetchShippingCosts() {
    try {
        //GET all shipping costs
        const shippingCosts = yield axios.get('/api/shippingcosts');
        console.log('shippingCosts.data -->', shippingCosts.data);

        //send results to shippingCosts reducer
        yield put({type: 'SET_SHIPPING_COSTS', payload: shippingCosts.data});
    } catch (error) {
        console.log('error with fetchShippingCosts in shippingCosts saga', error);
        
    }
}

//worker saga to add shipping costs
function* postShippingCosts(action) {
    console.log('in postShippingCosts, action.payload is -->', action.payload);
    
    try {
        //add shipping costs
      yield axios.post(`/api/shippingcosts`, action.payload);
      //send results to shippingCosts reducer
      yield put({type: 'FETCH_SHIPPING_COSTS'});
    } catch (error) {
      console.log('error in postShippingCosts SAGA -->', error);
    }
  }

  //worker saga to update shipping costs
function* updateShippingCosts(action) {
    try {
        //update shipping cost
        yield axios.put(`/api/shippingcosts/edit/${action.payload.id}`, action.payload);
        //send results to shippingCosts reducer
    } catch (error) {
        console.log('error in updateShippingCosts saga', error); 
    }
}

function* shippingCostsSaga() {
    yield takeLatest('FETCH_SHIPPING_COSTS', fetchShippingCosts);
    yield takeEvery('ADD_SHIPPING_COSTS', postShippingCosts);
    yield takeLatest('UPDATE_SHIPPING_COSTS', updateShippingCosts);
}

export default shippingCostsSaga;