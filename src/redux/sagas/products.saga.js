import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// fetchProducts generator to use get from the db
function* fetchProducts() {
  try {

    const response = yield axios.get('/api/products');
    // set products used in reducer
    yield put({
      type: 'SET_PRODUCTS',
      payload: response.data
    });
  } catch (error) {
    console.log('product get request failed', error);
  }
}

function* updateProduct(action) {
  try {
    // takes payload to database to update product
    yield axios.put(`/api/products/${action.payload.id}`, action.payload);
    // fetches products
    yield put({
      type: 'FETCH_PRODUCTS'
    });
  } catch (error) {
    console.log('Error in update product saga: ', error);
  }
}

function* addProduct(action) {

  try {
    // takes company name input payload and posts to database
    yield axios.post('/api/products', action.payload);
    // refresh products with new product post
    yield put({ type: 'FETCH_PRODUCTS'});
  } catch (error) {
    console.log('Error in post product saga:', error);
  }
}

// companies saga to fetch companies
function* productsSaga() {
  yield takeLatest('FETCH_PRODUCTS', fetchProducts);
  yield takeLatest('UPDATE_PRODUCT', updateProduct);
  yield takeLatest('ADD_PRODUCT', addProduct);
}

export default productsSaga;