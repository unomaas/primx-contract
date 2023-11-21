import {
	put,
	takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import createProductPriceObject from '../../hooks/createProductPriceObject';

// companies saga to fetch companies
function* productsSaga() {
	yield takeLatest('FETCH_PRODUCTS_ARRAY', fetchProductsArray);
	// yield takeLatest('FETCH_PRODUCTS_OBJECT', fetchProductsObject)
	// yield takeLatest('UPDATE_PRODUCT', updateProduct);
	yield takeLatest('ADD_PRODUCT', addProduct);
	yield takeLatest('FETCH_PRODUCT_COST_HISTORY_RECENT', fetchProductCostRecent);
	yield takeLatest('PRODUCT_COSTS_SAVE_HISTORY_LOG', saveProductCostHistoryLog);
	yield takeLatest('UPDATE_PRODUCT_COSTS', updateProductCosts);

	yield takeLatest('FETCH_MARKUP_MARGIN', fetchMarkupMargin);
	yield takeLatest('FETCH_MARKUP_HISTORY_RECENT', fetchRecentMarkupHistory);
	yield takeLatest('EDIT_MARKUP_MARGIN', editMarkupMargin);


}; // end productsSaga

//#region - Products Saga Routes below: 
// fetchProducts generator to get the array of all products data from the DB
function* fetchProductsArray() {
	try {
		const response = yield axios.get('/api/products/get-current-products');
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
// function* fetchProductsObject() {
// 	try {
// 		const response = yield axios.get('/api/products/get-current-products');

// 		// use the createProductPriceObject function to convert the returned product array into an object
// 		const productObject = createProductPriceObject(response.data);

// 		// set product object in reducer
// 		yield put({
// 			type: 'SET_PRODUCTS_OBJECT',
// 			payload: productObject
// 		});
// 	} catch (error) {
// 		console.error('Error with fetchProducts in field select saga', error);
// 	}
// }

function* updateProduct(action) {
	try {
		// takes payload to database to update product
		yield axios.put(`/api/products/${action.payload.product_id}`, action.payload);
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

//worker saga to get shipping cost history
function* fetchProductCostRecent() {
	try {
		const productCostHistoryRecent = yield axios.get(`/api/products/get-recent-product-cost-history`);
		//send results to shippingCosts reducer
		yield put({ type: 'SET_PRODUCT_COST_HISTORY_RECENT', payload: productCostHistoryRecent.data });
	} catch (error) {
		console.error('Error with fetchProductCostRecent in products saga', error);
	} // End try/catch
} // End fetchProductCostRecent


//worker saga to get shipping cost history
function* saveProductCostHistoryLog(action) {
	try {
		const productsArray = action.payload;
		const result = yield axios.post(`/api/products/submit-product-cost-history`, productsArray);
		if (result.status === 201) {
			// ⬇ Refresh the cost history recent data:
			yield put({ type: 'FETCH_PRODUCT_COST_HISTORY_RECENT' });
			yield put({ type: 'HIDE_TOP_LOADING_DIV' });
			yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
		} // End if 
	} catch (error) {
		console.error('Error with saveProductCostHistoryLog in shippingCosts saga', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} // End try/catch
} // End saveProductCostHistoryLog

//worker saga to update shipping costs
function* updateProductCosts(action) {
	try {
		// ⬇ Update the shipping costs: 
		yield axios.post(`/api/products/edit-products-costs`, action.payload);
		// ⬇ Close the edit modal, hide the loading div, show the success message, and refresh the data:
		yield put({ type: 'FETCH_PRODUCTS_ARRAY' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
	} catch (error) {
		console.error('Error in updateShippingCosts saga', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} // End try/catch
} // End updateShippingCosts
//#endregion - Products Saga Routes above. 


//#region - Markup Saga Routes below:
// ⬇ Fetch Markup Margin and send to Reducer:
function* fetchMarkupMargin() {
	try {
		const markupMargin = yield axios.get(`/api/products/get-markup-margin`);
		// ⬇ Send to reducer:
		yield put({ type: 'SET_MARKUP_MARGIN', payload: markupMargin.data });
	} catch (error) {
		console.error('Error with fetchMarkupMargin in markup saga', error);
	} // End try/catch
} // End fetchMarkupMargin

// ⬇ Fetch Recent Markup History and send to Reducer:
function* fetchRecentMarkupHistory() {
	try {
		const markupHistoryRecent = yield axios.get(`/api/products/get-recent-markup-history`);
		// ⬇ Send to reducer:
		yield put({ type: 'SET_MARKUP_HISTORY_RECENT', payload: markupHistoryRecent.data });
	} catch (error) {
		console.error('Error with fetchRecentMarkupHistory in markup saga', error);
	} // End try/catch
} // End fetchRecentMarkupHistory

// ⬇ Edit Markup Margin and send to Reducer:
function* editMarkupMargin(action) {
	try {
		// ⬇ Update the markup margin:
		yield axios.post(`/api/products/edit-markup-margin`, action.payload[0]);
		// ⬇ Close the edit modal, hide the loading div, show the success message, and refresh the data:
		// yield put({ type: 'FETCH_MARKUP_MARGIN' });
		yield put({ type: 'CALCULATE_MONTHLY_MARKUP' });

		// yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
	} catch (error) {
		console.error('Error in editMarkupMargin saga', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} // End try/catch
} // End editMarkupMargin






//#endregion - Markup Saga Routes above.


export default productsSaga;