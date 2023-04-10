import {
	put,
	takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import useCalculateProjectCost from '../../hooks/useCalculateProjectCost';
import createProductPriceObject from '../../hooks/createProductPriceObject';
import useDifferenceBetweenDates from '../../hooks/useDifferenceBetweenDates';
// import swal from 'sweetalert';


// companies saga to fetch companies
function* licenseeFormSaga() {
	// Makes a POST request for a new estimate
	yield takeLatest('ADD_ESTIMATE', AddEstimate);
	// Makes a GET request to get a single estimate from the DB after being searched in the estimate lookup view
	yield takeLatest('FETCH_ESTIMATE_QUERY', fetchEstimateQuery);
	// Runs a number of functions to recalculate an old estimate with updated pricing data before creating a new estimate in the DB
	yield takeLatest('RECALCULATE_ESTIMATE', recalculateEstimate);
	yield takeLatest('RECALCULATE_COMBINED_ESTIMATE', recalculateCombinedEstimate);
	// Marks an estimate as ordered in the DB and attaches a supplied P.O. number to it
	yield takeLatest('MARK_ESTIMATE_ORDERED', markEstimateOrdered);
	// Will let a licensee edit their previous estimate values:
	yield takeLatest('EDIT_ESTIMATE', editEstimate);
	// Takes in a working estimate and runs the calculation function on it before saving the new calculated object in a reducer
	yield takeLatest('HANDLE_CALCULATED_ESTIMATE', handleCalculatedEstimate);
}


// Saga Worker to create a GET request for Estimate DB at estimate number & licensee ID
function* fetchEstimateQuery(action) {
	const licenseeId = action.payload.licensee_id;
	const estimateNumber = action.payload.estimate_number;
	try {
		const response = yield axios.get('/api/estimates/lookup/:estimates', {
			params: {
				estimateNumber: estimateNumber,
				licenseeId: licenseeId
			} // End params
		}) // End response
		// if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it before sending it to the reducer
		const calculatedResponse = yield useEstimateCalculations(response.data[0]);
		// Depending on if the estimate is a combined or single, it will push the appropriate data and show the correct table: 
		if (estimateNumber?.charAt(estimateNumber?.length - 1) === "C") {
			yield put({ type: "SHOW_COMBINED_ESTIMATE" });
			yield put({
				type: 'SET_ESTIMATE_QUERY_RESULT',
				payload: calculatedResponse
			});
			yield put({
				type: "SET_CALCULATED_COMBINED_ESTIMATE",
				payload: calculatedResponse
			});
		} else {
			yield put({ type: "SHOW_SINGLE_ESTIMATE" });
			yield put({
				type: 'SET_ESTIMATE_QUERY_RESULT',
				payload: calculatedResponse
			});
		}
	} catch (error) {
		console.error('fetchEstimateQuery error', error);
	}
}

// Saga Worker to add estimate into table
function* AddEstimate(action) {
	try {
		const response = yield axios.post('/api/estimates/add-new-estimate', action.payload);
		// ⬇ action.payload contains the history object from useHistory:
		const history = action.payload.history;
		// ⬇ Saving the response and action.payload to variables for easier reading:
		const returnedEstimate = response.data;
		// ⬇ If we just saved a combined estimate:
		if (returnedEstimate.estimate_number.charAt(returnedEstimate.estimate_number.length - 1) === "C") {
			// ⬇ Update the calc combined object with the new estimate number: 
			action.payload.estimate_number = returnedEstimate.estimate_number;
			// ⬇ Update the DB with all estimate numbers involved:
			yield axios.put(`/api/estimates/usedincombine`, action.payload);
			// ⬇ Push to the lookup view: 
			yield history.push(`/lookup/${returnedEstimate.licensee_id}/${returnedEstimate.estimate_number}`);
		} else {
			yield history.push(`/lookup/${returnedEstimate.licensee_id}/${returnedEstimate.estimate_number}`);
		} // End if/else
		yield put({ type: 'SNACK_SAVE_ESTIMATE_SUCCESS' });
	} catch (error) {
		console.error('AddEstimate POST request failed', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	} // End try/catch
}

// yield put({ type: 'RECALCULATE_ESTIMATE', payload: action.payload });

// Saga Worker to edit estimate into table
function* editEstimate(action) {
	try {
		const res = yield axios.put(`/api/estimates/clientupdates/${action.payload.id}`, action.payload);
		if (res.status === 200) {
			const history = action.payload.history;
			yield history.push(`/lookup/${action.payload.licensee_id}/${action.payload.estimate_number}`);
			yield put({ type: 'SNACK_SAVE_ESTIMATE_SUCCESS' });
		}
	} catch (error) {
		console.error('editEstimate error', error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}
}

// to the new estimate page for their new calculation data, and allow them to click the Submit Order button
function* recalculateEstimate(action) {
	yield put({ type: 'SHOW_TOP_LOADING_DIV' });
	const currentEstimate = action.payload;
	currentEstimate.force_recalculate = true;
	try {
		const products = yield axios.get('/api/products/get-current-products');
		const shippingDestinations = yield axios.get('/api/shippingdestinations/active');
		const currentMarkup = yield axios.get('/api/products/get-markup-margin');
		const shippingCosts = yield axios.get('/api/shippingcosts/get-current-shipping-costs');
		const productContainers = yield axios.get('/api/productContainer/fetch-product-container');
		const dosageRates = yield axios.get('/api/dosageRates/fetch-dosage-rates');
		const customsDuties = yield axios.get('/api/customsduties/fetch-customs-duties');

		const options = {
			products: products.data,
			shippingDestinations: shippingDestinations.data,
			currentMarkup: currentMarkup.data,
			shippingCosts: shippingCosts.data,
			productContainers: productContainers.data,
			dosageRates: dosageRates.data,
			customsDuties: customsDuties.data,
		}; // End options

		const calculatedEstimate = useEstimateCalculations(currentEstimate, options);

		const response = yield axios.put(`/api/estimates/recalculate/${currentEstimate.estimate_id}`, currentEstimate);
		calculatedEstimate.date_created = response.data.split('T')[0];

		switch (calculatedEstimate?.options?.order) {
			case 'firstEstimate':
				yield put({ type: "CLEAR_FIRST_COMBINED_ESTIMATE" });
				yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: calculatedEstimate });
				break;
			case 'secondEstimate':
				yield put({ type: "CLEAR_SECOND_COMBINED_ESTIMATE" });
				yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: calculatedEstimate });
				break;
			case 'thirdEstimate':
				yield put({ type: "CLEAR_SECOND_COMBINED_ESTIMATE" });
				yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: calculatedEstimate });
				break;
			default:
				yield put({ type: 'CLEAR_ESTIMATE_QUERY_RESULT' });
				yield put({ type: 'SET_ESTIMATE_QUERY_RESULT', payload: calculatedEstimate });
				break;
		}

		yield put({ type: 'GET_RECALCULATE_INFO' });

		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} catch (error) {
		console.error('recalculate estimate failed', error);
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' })
	}; // End try/catch
}; // End recalculateEstimate

// to the new estimate page for their new calculation data, and allow them to click the Submit Order button
function* recalculateCombinedEstimate(action) {
	yield put({ type: 'SHOW_TOP_LOADING_DIV' });
	const combinedEstimate = action.payload;
	const licenseeId = combinedEstimate.licensee_id;
	combinedEstimate.force_recalculate = true;

	let firstEstimateNumber, secondEstimateNumber, thirdEstimateNumber = null;
	firstEstimateNumber = combinedEstimate.estimate_number_combined_1;
	secondEstimateNumber = combinedEstimate.estimate_number_combined_2;
	if (combinedEstimate.estimate_number_combined_3) thirdEstimateNumber = combinedEstimate.estimate_number_combined_3;

	try {
		const products = yield axios.get('/api/products/get-current-products');
		const shippingDestinations = yield axios.get('/api/shippingdestinations/active');
		const currentMarkup = yield axios.get('/api/products/get-markup-margin');
		const shippingCosts = yield axios.get('/api/shippingcosts/get-current-shipping-costs');
		const productContainers = yield axios.get('/api/productContainer/fetch-product-container');
		const dosageRates = yield axios.get('/api/dosageRates/fetch-dosage-rates');
		const customsDuties = yield axios.get('/api/customsduties/fetch-customs-duties');

		const options = {
			products: products.data,
			shippingDestinations: shippingDestinations.data,
			currentMarkup: currentMarkup.data,
			shippingCosts: shippingCosts.data,
			productContainers: productContainers.data,
			dosageRates: dosageRates.data,
			customsDuties: customsDuties.data,
		}; // End options

		const firstResponse = yield axios.get('/api/estimates/lookup/:estimates', {
			params: {
				estimateNumber: firstEstimateNumber,
				licenseeId: licenseeId
			} // End params
		}); // End response   
		const firstEstimate = firstResponse.data[0];
		firstEstimate.force_recalculate = true;
		const recalculatedFirstEstimate = useEstimateCalculations(firstEstimate, options);
		yield axios.put(`/api/estimates/recalculate/${recalculatedFirstEstimate.estimate_id}`, recalculatedFirstEstimate);
		yield put({ type: "CLEAR_FIRST_COMBINED_ESTIMATE" });
		yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: recalculatedFirstEstimate });

		const secondResponse = yield axios.get('/api/estimates/lookup/:estimates', {
			params: {
				estimateNumber: secondEstimateNumber,
				licenseeId: licenseeId
			} // End params
		}); // End response
		const secondEstimate = secondResponse.data[0];
		secondResponse.force_recalculate = true;
		const recalculatedSecondEstimate = useEstimateCalculations(secondEstimate, options);
		yield axios.put(`/api/estimates/recalculate/${recalculatedSecondEstimate.estimate_id}`, recalculatedSecondEstimate);
		yield put({ type: "CLEAR_SECOND_COMBINED_ESTIMATE" });
		yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: recalculatedSecondEstimate });

		if (thirdEstimateNumber) {
			const thirdResponse = yield axios.get('/api/estimates/lookup/:estimates', {
				params: {
					estimateNumber: thirdEstimateNumber,
					licenseeId: licenseeId
				} // End params
			}); // End response
			const thirdEstimate = thirdResponse.data[0];
			thirdEstimate.force_recalculate = true;
			const recalculatedThirdEstimate = useEstimateCalculations(thirdEstimate, options);
			yield axios.put(`/api/estimates/recalculate/${recalculatedThirdEstimate.estimate_id}`, recalculatedThirdEstimate);
			yield put({ type: "CLEAR_THIRD_COMBINED_ESTIMATE" });
			yield put({ type: "SET_THIRD_COMBINED_ESTIMATE", payload: recalculatedThirdEstimate });
		}

		const recalculatedCombinedEstimate = useEstimateCalculations(combinedEstimate, options);
		const response = yield axios.put(`/api/estimates/recalculate/${recalculatedCombinedEstimate.estimate_id}`, recalculatedCombinedEstimate);
		recalculatedCombinedEstimate.date_created = response.data.split('T')[0];

		yield put({ type: 'CLEAR_CALCULATED_COMBINED_ESTIMATE' });
		yield put({ type: 'SET_CALCULATED_COMBINED_ESTIMATE', payload: recalculatedCombinedEstimate });

		yield put({ type: 'GET_RECALCULATE_INFO' });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
	} catch (error) {
		console.error('recalculate estimate failed', error);
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' })
	}; // End try/catch
}; // End recalculateEstimate
// Worker saga to take in an estimate from the estimate lookup view, create a new estimate using updated shipping data, bring the user
// // to the new estimate page for their new calculation data, and allow them to click the Submit Order button
// function* recalculateEstimate(action) {
// 	const currentEstimate = action.payload;
// 	try {
// 		// get updated shipping and product pricing data from the DB
// 		const shippingCosts = yield axios.get('/api/shippingcosts/get-current-shipping-costs');
// 		const productCosts = yield axios.get('/api/products/get-current-products');

// 		// Loop through shippingCosts, find the matching id, and update the shipping costs of the current estimate with the current shipping costs
// 		shippingCosts.data.forEach(shippingState => {
// 			if (shippingState.shipping_costs_id == currentEstimate.shipping_costs_id) {
// 				Object.assign(currentEstimate, {
// 					primx_dc_shipping_estimate: shippingState.dc_price,
// 					primx_flow_shipping_estimate: shippingState.flow_cpea_price,
// 					primx_steel_fibers_shipping_estimate: shippingState.fibers_price,
// 					primx_cpea_shipping_estimate: shippingState.flow_cpea_price
// 				})
// 			}
// 		}) // end forEach
// 		// run the createProductPriceObject on the returned product costs to create the pricing object
// 		const productObject = createProductPriceObject(productCosts.data);

// 		// Update product costs with whatever is current in the products DB table
// 		// Start with values shared between imperial and metric
// 		Object.assign(currentEstimate, {
// 			primx_flow_unit_price: productObject.flow_liters,
// 			primx_cpea_unit_price: productObject.cpea_liters,
// 		}) // add in the imperial specific costs
// 		if (currentEstimate.measurement_units == 'imperial') {
// 			Object.assign(currentEstimate, {
// 				primx_dc_unit_price: productObject.dc_lbs,
// 				primx_steel_fibers_unit_price: productObject.steel_fibers_lbs,
// 				primx_ultracure_blankets_unit_price: productObject.blankets_sqft,
// 			}) // or add in the metric specific costs
// 		} else if (currentEstimate.measurement_units == 'metric') {
// 			Object.assign(currentEstimate, {
// 				primx_dc_unit_price: productObject.dc_kgs,
// 				primx_steel_fibers_unit_price: productObject.steel_fibers_kgs,
// 				primx_ultracure_blankets_unit_price: productObject.blankets_sqmeters,
// 			})
// 		}
// 		// Make a PUT request to update the given estimate with mutated pricing data.
// 		const response = yield axios.put(`/api/estimates/recalculate/${action.payload.id}`, currentEstimate);
// 		// Now that the current estimate has updated pricing data, send an action to the estimates reducer that will set a recalculated boolean
// 		// from false to true, allowing the user to click the place order button on the estimate lookup view
// 		yield put({ type: 'SET_RECALCULATED_TRUE' })
// 		// Refresh data on DOM by fetching the new data
// 		yield put({
// 			type: 'FETCH_ESTIMATE_QUERY', payload: {
// 				licensee_id: currentEstimate.licensee_id,
// 				estimate_number: currentEstimate.estimate_number
// 			}
// 		})
// 	} catch (error) {
// 		console.error('recalculate estimate failed', error)
// 	}
// } // End recalculateEstimate

function* handleCalculatedEstimate(action) {
	// Save a mutated object with the calculation values
	const calculatedEstimate = useEstimateCalculations(action.payload.estimate, action.payload.options);

	yield put({
		type: 'SET_CALCULATED_ESTIMATE',
		payload: calculatedEstimate
	});
} // End

// Worker saga that is supplied an estimate id number and a user-created P.O. number that marks an estimate as ordered in the database to then be processed by an admin user
function* markEstimateOrdered(action) {
	yield put({ type: 'SHOW_TOP_LOADING_DIV' });
	try {
		yield axios.put(`/api/estimates/order/${action.payload.estimate_id}`, action.payload);
		// fetch updated estimate data for the search view to allow for proper conditional rendering once the licensee has placed an order
		yield put({ type: 'FETCH_ESTIMATE_QUERY', payload: action.payload });
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_PLACE_ESTIMATE_SUCCESS' })
	} catch (error) {
		console.error('markEstimateOrdered failed', error)
		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' })
	}
}



export default licenseeFormSaga;