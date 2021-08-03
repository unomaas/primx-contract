import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* fetchFieldSelect() {

    // Fetching company/licensee name and id
    try {
      const response = yield axios.get('/api/companies');
      // set companies used in reducer
      yield put({
        type: 'SET_COMPANIES',
        payload: response.data
      });
    } catch (error) {
      console.log('error with fetchCompanies in field select saga', error);
    }

    // Fetching placement type
    try {
        const placementTypes = yield axios.get('/api/placementtypes');
        console.log('placementTypes.data', placementTypes.data);

        //send results to placementTypes reducer
        yield put({type: 'SET_PLACEMENT_TYPES', payload: placementTypes.data});
    } catch (error) {
        console.log('error with fetchAllPlacementTypes in field select saga', error);
        
    }

    // Fetching products
    try {
        const response = yield axios.get('/api/products');

        const productObject = {};
        response.data.forEach(product => {
          productObject[product.product_identifier] = product.product_price
        })
        
        // set products used in reducer
        yield put({
          type: 'SET_PRODUCTS_OBJECT',
          payload: productObject
        });
      } catch (error) {
        console.log('error with fetchProducts in field select saga', error);
      }

      // Fetching shipping costs/state
      try {
        //GET all shipping costs
        const shippingCosts = yield axios.get('/api/shippingcosts');
        console.log('shippingCosts.data -->', shippingCosts.data);

        //send results to shippingCosts reducer
        yield put({type: 'SET_SHIPPING_COSTS', payload: shippingCosts.data});
    } catch (error) {
        console.log('error with fetchShippingCosts in field select saga', error);   
    }

    // Fetching floor types
    try {
        //GET all floor types
        const floorTypes = yield axios.get('/api/floortypes');
        console.log('floorTypes.data', floorTypes.data);

        //send results to floorTypes reducer
        yield put({type: 'SET_FLOOR_TYPES', payload: floorTypes.data});
    } catch (error) {
        console.log('error with fetchAllFloorTypes in field select saga', error);    
    }

  }


function* fieldSelectSaga() {
    yield takeLatest('FETCH_FIELD_SELECT', fetchFieldSelect);
}

export default fieldSelectSaga;