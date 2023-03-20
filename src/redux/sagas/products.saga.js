import {
	put,
	takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import createProductPriceObject from '../../hooks/createProductPriceObject';
import useCalculateProjectCost from '../../hooks/useCalculateProjectCost';

// companies saga to fetch companies
function* productsSaga() {
	yield takeLatest('FETCH_PRODUCTS_ARRAY', fetchProductsArray);
	yield takeLatest('FETCH_PRODUCTS_OBJECT', fetchProductsObject)
	// yield takeLatest('UPDATE_PRODUCT', updateProduct);
	yield takeLatest('ADD_PRODUCT', addProduct);
	yield takeLatest('FETCH_PRODUCT_COST_HISTORY_RECENT', fetchProductCostRecent);
	yield takeLatest('PRODUCT_COSTS_SAVE_HISTORY_LOG', saveProductCostHistoryLog);
	yield takeLatest('UPDATE_PRODUCT_COSTS', updateProductCosts);

	yield takeLatest('FETCH_MARKUP_MARGIN', fetchMarkupMargin);
	yield takeLatest('FETCH_MARKUP_HISTORY_RECENT', fetchRecentMarkupHistory);
	yield takeLatest('EDIT_MARKUP_MARGIN', editMarkupMargin);
	yield takeLatest('MARKUP_SAVE_HISTORY_LOG', saveMarkupHistoryLog);

	yield takeLatest('CALCULATE_MONTHLY_MARKUP', calculateMonthlyMarkup);

}; // end productsSaga

//#region - Products Saga Routes below: 
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

// ⬇ saveMarkupHistoryLog and send to Reducer:
function* saveMarkupHistoryLog(action) {
	try {
		const currentMarkup = action.payload;
		const result = yield axios.post(`/api/products/submit-markup-history`, currentMarkup[0]);
		if (result.status === 201) {
			// ⬇ Refresh the markup history recent data:
			// yield put({ type: 'FETCH_MARKUP_HISTORY_RECENT' });
			// yield put({ type: 'HIDE_TOP_LOADING_DIV' });
			yield put({ type: 'CALCULATE_MONTHLY_MARKUP' });
			yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
		} // End if
	} catch (error) {
		console.error('Error with saveMarkupHistoryLog in markup saga', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} // End try/catch
} // End saveMarkupHistoryLog


// ⬇ Calculate the unit price for all active shipping destinations:
function* calculateMonthlyMarkup(action) {
	try {
		yield put({ type: 'SHOW_TOP_LOADING_DIV' });

		const markupHistory12Months = yield axios.get(`/api/products/get-recent-markup-history`);
		const shippingCostHistory12Months = yield axios.get(`/api/shippingcosts/get-one-year-of-shipping-cost-history`);
		const productCostHistory12Months = yield axios.get(`/api/products/get-one-year-of-product-cost-history`);
		const customsDutiesHistory12Months = yield axios.get(`/api/customsduties/get-one-year-of-customs-duties-history`);
		console.log(`Ryan Here 0 top of saga: calculateMonthlyMarkup\n `, { markupHistory12Months, shippingCostHistory12Months, productCostHistory12Months, customsDutiesHistory12Months });

		const products = yield axios.get('/api/products');
		const shippingDestinations = yield axios.get('/api/shippingdestinations/active');
		const currentMarkup = yield axios.get('/api/products/get-markup-margin');
		const shippingCosts = yield axios.get('/api/shippingcosts');
		const productContainers = yield axios.get('/api/productContainer/fetch-product-container');
		const dosageRates = yield axios.get('/api/dosageRates/fetch-dosage-rates');
		const customsDuties = yield axios.get('/api/customsduties/fetch-customs-duties');

		const options = {
			products: JSON.parse(JSON.stringify(products.data)),
			shippingDestinations: JSON.parse(JSON.stringify(shippingDestinations.data)),
			currentMarkup: JSON.parse(JSON.stringify(currentMarkup.data)),
			shippingCosts: JSON.parse(JSON.stringify(shippingCosts.data)),
			productContainers: JSON.parse(JSON.stringify(productContainers.data)),
			dosageRates: JSON.parse(JSON.stringify(dosageRates.data)),
			customsDuties: JSON.parse(JSON.stringify(customsDuties.data)),
		}; // End options



		console.log(`Ryan Here 1 Pre Calc: calculateMonthlyMarkup saga \n `, {
			options,
			markupHistory12Months: markupHistory12Months.data,
		});

		markupHistory12Months.data.unshift({
			markup_history_id: 0,
			margin_applied: currentMarkup.data[0].margin_applied,
			date_saved: 'Current',
		});

		const monthHolderObject = {};
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		markupHistory12Months.data.forEach((month) => {

			// ⬇ Setup for date labels:
			const yearMonth = month.date_saved.slice(0, 7);
			const monthLabel = months[+yearMonth.split('-')[1] - 1] + ', ' + yearMonth.split('-')[0];

			if (!monthHolderObject[month.date_saved]) {
				monthHolderObject[month.date_saved] = {
					date_saved: month.date_saved,
					margin_applied: month.margin_applied,
					month_year_label: month.date_saved === 'Current' ? 'Current' : monthLabel,
					rows: [],
				}; // End monthHolderObject
			}; // End if


			// if (month.date_saved === 'Current') {
				// ⬇ Loop through the shippingDestinations, and for each destination, run the useEstimateCalculations function:
				options.currentMarkup[0].margin_applied = month.margin_applied;

				shippingDestinations.data.forEach((destination) => {
					const estimate = {};

					if (destination.destination_country == "USA") {
						estimate.measurement_units = "imperial";
						estimate.design_cubic_yards_total = 1000;
						estimate.units_label = "USD/Cubic Yard";
					} else {
						estimate.measurement_units = "metric";
						estimate.design_cubic_meters_total = 1000;
						estimate.units_label = "USD/Cubic Meter";
					}; // End if/else

					estimate.destination_id = destination.destination_id;
					estimate.destination_name = destination.destination_name;

					const calculatedEstimate = useCalculateProjectCost(estimate, options);

					monthHolderObject[month.date_saved].rows.push({
						destination_id: calculatedEstimate.destination_id,
						destination_name: calculatedEstimate.destination_name,
						measurement_units: calculatedEstimate.measurement_units,
						units_label: calculatedEstimate.units_label,
						price_per_unit_75_50: calculatedEstimate.price_per_unit_75_50,
						price_per_unit_90_60: calculatedEstimate.price_per_unit_90_60,
					}); // End monthHolderObject
				}); // End shippingDestinations.forEach

			// } else {
				// if (month.date_saved < productCostHistory12Months.data[0].date_saved) {
				// 	console.log(`Ryan Here: IT IS GREATER \n `, { month, productCostHistory12Months: productCostHistory12Months.data[0] });
				// }

			// }

			// ⬇ Set the historical costs to calculate the price at the time:
			// ! Ryan Here.
			// ! I need to set the historical shipping costs, product costs, and customs duties here.




		}); // End markupHistory12Months.forEach

		console.log(`Ryan Here 2 Post Calc: calculateMonthlyMarkup saga \n `, {
			options,
			monthHolderObject,
		});

		yield put({ type: 'SET_MARKUP_MARGIN', payload: currentMarkup.data });
		yield put({ type: 'SET_MONTHLY_MARKUP_PRICING', payload: monthHolderObject });
		yield put({ type: 'SET_MARKUP_HISTORY_RECENT', payload: markupHistory12Months.data });
		yield put({ type: 'SET_ACTIVE_SHIPPING_DESTINATIONS', payload: shippingDestinations.data });
		yield put({ type: 'SET_MARKUP_IS_LOADING', payload: false });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} catch (error) {
		console.error('Error with calculateMonthlyMarkup in product saga', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	}; // End try/catch
}; // End calculateMonthlyMarkup



//#endregion - Markup Saga Routes above.


export default productsSaga;