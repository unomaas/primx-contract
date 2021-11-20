import {
  put,
  takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import createProductPriceObject from '../../hooks/createProductPriceObject';

// fetchProducts generator to get the array of all products data from the DB
function* fetchProductsArray() {
  try {
    const response = yield axios.get('/api/products');
    // set products used in reducer
    yield put({
      type: 'SET_PRODUCTS_ARRAY',
      payload: response.data
    });
  } catch (error) {
    console.error('product get request failed', error);
  }
}

//worker saga to get all products data from DB and create the 
//custom product identifier/price object to be used in the 
//estimate create and lookup views
function* fetchProductsObject() {
  try {
    const response = yield axios.get('/api/products');

    // use the createProductPriceObject function to convert the returned product array into an object
    const productObject = createProductPriceObject(response.data);

    // set product object in reducer
    yield put({
      type: 'SET_PRODUCTS_OBJECT',
      payload: productObject
    });
  } catch (error) {
    console.error('Error with fetchProducts in field select saga', error);
  }
}

function* updateProduct(action) {
  try {
    // takes payload to database to update product
    yield axios.put(`/api/products/${action.payload.id}`, action.payload);
    // fetches products
    yield put({
      type: 'FETCH_PRODUCTS_ARRAY'
    });
  } catch (error) {
    console.error('Error in update product saga: ', error);
  }
}

function* addProduct(action) {
  try {
    // takes company name input payload and posts to database
    yield axios.post('/api/products', action.payload);
    // refresh products with new product post
    yield put({
      type: 'FETCH_PRODUCTS_ARRAY'
    });
  } catch (error) {
    console.error('Error in post product saga:', error);
  }
}

// companies saga to fetch companies
function* productsSaga() {
  yield takeLatest('FETCH_PRODUCTS_ARRAY', fetchProductsArray);
  yield takeLatest('FETCH_PRODUCTS_OBJECT', fetchProductsObject)
  yield takeLatest('UPDATE_PRODUCT', updateProduct);
  yield takeLatest('ADD_PRODUCT', addProduct);
}

export default productsSaga;