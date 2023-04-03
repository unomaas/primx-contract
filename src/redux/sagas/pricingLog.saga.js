import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery
} from 'redux-saga/effects';

import useCalculateProjectCost from '../../hooks/useCalculateProjectCost';

const errorText = 'Error in Pricing Log Saga: ';

function* pricingLogSaga() {
	yield takeLatest('PRICING_LOG_INITIAL_LOAD', pricingLogInitialLoad);
	yield takeLatest('UPDATE_PRICING_INITIAL_LOAD', updatePricingInitialLoad);
	// yield takeLatest('CALCULATE_MONTHLY_MARKUP', calculateMonthlyMarkup);
	yield takeLatest('MARKUP_SAVE_HISTORY_LOG', saveMarkupHistoryLog);
}

function* pricingLogInitialLoad() {
	try {
		const customsDutiesHistoryAll = yield axios.get('/api/customsduties/get-all-customs-duties-history');
		const markupHistoryAll = yield axios.get('/api/products/get-all-markup-history');
		const productCostHistoryAll = yield axios.get('/api/products/get-all-product-cost-history');
		const shippingCostHistoryAll = yield axios.get('/api/shippingcosts/get-all-shipping-cost-history');

		const markupHistory12Months = yield axios.get(`/api/products/get-one-year-of-markup-history`);
		const shippingCostHistory12Months = yield axios.get(`/api/shippingcosts/get-one-year-of-shipping-cost-history`);
		const productCostHistory12Months = yield axios.get(`/api/products/get-one-year-of-product-cost-history`);
		const customsDutiesHistory12Months = yield axios.get(`/api/customsduties/get-one-year-of-customs-duties-history`);

		yield put({
			type: 'SET_PRICING_LOG_DATA', payload: {
				customsDutiesHistoryAll: customsDutiesHistoryAll.data,
				markupHistoryAll: markupHistoryAll.data,
				productCostHistoryAll: productCostHistoryAll.data,
				shippingCostHistoryAll: shippingCostHistoryAll.data
			}, // End payload
		}); // End put

		yield put({ type: 'SET_PRICING_LOG_VIEW', payload: { pricingLogIsLoading: false } })
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}
}

function* updatePricingInitialLoad() {
	try {
		const currentShippingCosts = yield axios.get('/api/shippingcosts/get-current-shipping-costs');
		const currentProductCosts = yield axios.get('/api/products/get-current-products');
		const currentCustomsDuties = yield axios.get('/api/customsduties/fetch-customs-duties');
		const currentMarkup = yield axios.get('/api/products/get-markup-margin');

		const shippingDestinations = yield axios.get('/api/shippingdestinations/active');
		const productContainers = yield axios.get('/api/productContainer/fetch-product-container');
		const dosageRates = yield axios.get('/api/dosageRates/fetch-dosage-rates');

		const markupHistory12Months = yield axios.get(`/api/products/get-one-year-of-markup-history`);
		const shippingCostHistory12Months = yield axios.get(`/api/shippingcosts/get-one-year-of-shipping-cost-history`);
		const productCostHistory12Months = yield axios.get(`/api/products/get-one-year-of-product-cost-history`);
		const customsDutiesHistory12Months = yield axios.get(`/api/customsduties/get-one-year-of-customs-duties-history`);

		//#region - Calculate historical pricing data for 12 months: 
		const monthHolderObject = {
			current: {
				month_year_label:  'Current Pricing',
				month_year_value: 'current',
				pricing: {
					products: JSON.parse(JSON.stringify(currentProductCosts.data)),
					currentMarkup: JSON.parse(JSON.stringify(currentMarkup.data)),
					shippingCosts: JSON.parse(JSON.stringify(currentShippingCosts.data)),
					customsDuties: JSON.parse(JSON.stringify(currentCustomsDuties.data)),
					shippingDestinations: JSON.parse(JSON.stringify(shippingDestinations.data)),
					productContainers: JSON.parse(JSON.stringify(productContainers.data)),
					dosageRates: JSON.parse(JSON.stringify(dosageRates.data)),
				},
			},
		};

		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		Object.keys(markupHistory12Months.data).forEach((date) => {
			if (!monthHolderObject[date]) {
				const monthLabel = months[+date.split('-')[1] - 1] + ', ' + date.split('-')[0];
				monthHolderObject[date] = {
					month_year_label: monthLabel,
					month_year_value: date,
					pricing: {
						products: JSON.parse(JSON.stringify(productCostHistory12Months.data[date])),
						currentMarkup: JSON.parse(JSON.stringify(markupHistory12Months.data[date])),
						shippingCosts: JSON.parse(JSON.stringify(shippingCostHistory12Months.data[date])),
						customsDuties: JSON.parse(JSON.stringify(customsDutiesHistory12Months.data[date])),
						shippingDestinations: JSON.parse(JSON.stringify(shippingDestinations.data)),
						productContainers: JSON.parse(JSON.stringify(productContainers.data)),
						dosageRates: JSON.parse(JSON.stringify(dosageRates.data)),
					},
				}; // End monthHolderObject[date]
			}; // End if
		}); // End forEach

		// ⬇ Create a double loop.  First loop is each month in the monthHolderObject.  Second loop is each shippingDestination in the shippingDestinations.data array. 
		for (const i in monthHolderObject) {
			const month = monthHolderObject[i];

			month.destinationsCosts = [];

			for (const destination of shippingDestinations.data) {
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

				const calculatedEstimate = useCalculateProjectCost(estimate, month.pricing);

				month.destinationsCosts.push({
					destination_id: calculatedEstimate.destination_id,
					destination_name: calculatedEstimate.destination_name,
					measurement_units: calculatedEstimate.measurement_units,
					units_label: calculatedEstimate.units_label,
					price_per_unit_75_50: calculatedEstimate.price_per_unit_75_50,
					price_per_unit_90_60: calculatedEstimate.price_per_unit_90_60,
				}); // End month.destinationsCosts.push
			}; // End for loop
		}; // End for loop

		monthHolderObject['new'] = {
			month_year_label: 'New Pricing',
			month_year_value: 'new',
			// destinationsCosts: [],
			// pricing: {},
		};

		const monthOptions = [];
		for (const i in monthHolderObject) {
			const month = monthHolderObject[i];
			const element = {
				label: month.month_year_label,
				value: month.month_year_value
			};
			monthOptions.push(element);
		}; // End for loop
		monthOptions.unshift(monthOptions.pop());
		//#endregion - Calculate historical pricing data.


		yield put({
			type: 'SET_PRICING_LOG_DATA', payload: {
				currentShippingCosts: currentShippingCosts.data,
				currentProductCosts: currentProductCosts.data,
				currentCustomsDuties: currentCustomsDuties.data,
				currentMarkup: currentMarkup.data,
				shippingDestinations: shippingDestinations.data,
				productContainers: productContainers.data,
				dosageRates: dosageRates.data,
				pricingData12Months: monthHolderObject,
			}, // End payload
		}); // End yield put

		yield put({
			type: 'SET_PRICING_LOG_VIEW', payload: {
				updatePricingIsLoading: false,
				newShippingCosts: currentShippingCosts.data,
				newProductCosts: currentProductCosts.data,
				newCustomsDuties: currentCustomsDuties.data,
				newMarkup: currentMarkup.data,
				monthOptions: monthOptions,
			}, // End payload
		}); // End yield put
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}; // End try/catch
} // End

// function* calculateMonthlyMarkupNew() {
// 	try {
// 		const markupHistory12Months = yield axios.get(`/api/products/get-one-year-of-markup-history`);
// 		const shippingCostHistory12Months = yield axios.get(`/api/shippingcosts/get-one-year-of-shipping-cost-history`);
// 		const productCostHistory12Months = yield axios.get(`/api/products/get-one-year-of-product-cost-history`);
// 		const customsDutiesHistory12Months = yield axios.get(`/api/customsduties/get-one-year-of-customs-duties-history`);

// 		console.log(`Ryan Here: calculateMonthlyMarkupNew \n `, {
// 			markupHistory12Months: markupHistory12Months.data,
// 			shippingCostHistory12Months: shippingCostHistory12Months.data,
// 			productCostHistory12Months: productCostHistory12Months.data,
// 			customsDutiesHistory12Months: customsDutiesHistory12Months.data,

// 		});
// 	} catch (error) {
// 		console.error(errorText, error);
// 		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
// 	}


// }; // End calculateMonthlyMarkupNew

// // ⬇ Calculate the unit price for all active shipping destinations:
// function* calculateMonthlyMarkup(action) {
// 	try {
// 		yield put({ type: 'SHOW_TOP_LOADING_DIV' });

// 		const markupHistory12Months = yield axios.get(`/api/products/get-one-year-of-markup-history`);
// 		const shippingCostHistory12Months = yield axios.get(`/api/shippingcosts/get-one-year-of-shipping-cost-history`);
// 		const productCostHistory12Months = yield axios.get(`/api/products/get-one-year-of-product-cost-history`);
// 		const customsDutiesHistory12Months = yield axios.get(`/api/customsduties/get-one-year-of-customs-duties-history`);



// 		const products = yield axios.get('/api/products/get-current-products');
// 		const shippingDestinations = yield axios.get('/api/shippingdestinations/active');
// 		const currentMarkup = yield axios.get('/api/products/get-markup-margin');
// 		const shippingCosts = yield axios.get('/api/shippingcosts/get-current-shipping-costs');
// 		const productContainers = yield axios.get('/api/productContainer/fetch-product-container');
// 		const dosageRates = yield axios.get('/api/dosageRates/fetch-dosage-rates');
// 		const customsDuties = yield axios.get('/api/customsduties/fetch-customs-duties');

// 		const options = {
// 			products: JSON.parse(JSON.stringify(products.data)),
// 			shippingDestinations: JSON.parse(JSON.stringify(shippingDestinations.data)),
// 			currentMarkup: JSON.parse(JSON.stringify(currentMarkup.data)),
// 			shippingCosts: JSON.parse(JSON.stringify(shippingCosts.data)),
// 			productContainers: JSON.parse(JSON.stringify(productContainers.data)),
// 			dosageRates: JSON.parse(JSON.stringify(dosageRates.data)),
// 			customsDuties: JSON.parse(JSON.stringify(customsDuties.data)),
// 		}; // End options


// 		markupHistory12Months.data.unshift({
// 			markup_history_id: 0,
// 			margin_applied: currentMarkup.data[0].margin_applied,
// 			date_saved: 'Current',
// 		});

// 		const monthHolderObject = {};
// 		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 		markupHistory12Months.data.forEach((month) => {

// 			// ⬇ Setup for date labels:
// 			const yearMonth = month.date_saved.slice(0, 7);
// 			const monthLabel = months[+yearMonth.split('-')[1] - 1] + ', ' + yearMonth.split('-')[0];

// 			if (!monthHolderObject[month.date_saved]) {
// 				monthHolderObject[month.date_saved] = {
// 					date_saved: month.date_saved,
// 					margin_applied: month.margin_applied,
// 					month_year_label: month.date_saved === 'Current' ? 'Current' : monthLabel,
// 					rows: [],
// 				}; // End monthHolderObject
// 			}; // End if


// 			// if (month.date_saved === 'Current') {
// 			// ⬇ Loop through the shippingDestinations, and for each destination, run the useEstimateCalculations function:
// 			options.currentMarkup[0].margin_applied = month.margin_applied;

// 			shippingDestinations.data.forEach((destination) => {
// 				const estimate = {};

// 				if (destination.destination_country == "USA") {
// 					estimate.measurement_units = "imperial";
// 					estimate.design_cubic_yards_total = 1000;
// 					estimate.units_label = "USD/Cubic Yard";
// 				} else {
// 					estimate.measurement_units = "metric";
// 					estimate.design_cubic_meters_total = 1000;
// 					estimate.units_label = "USD/Cubic Meter";
// 				}; // End if/else

// 				estimate.destination_id = destination.destination_id;
// 				estimate.destination_name = destination.destination_name;

// 				const calculatedEstimate = useCalculateProjectCost(estimate, options);

// 				monthHolderObject[month.date_saved].rows.push({
// 					destination_id: calculatedEstimate.destination_id,
// 					destination_name: calculatedEstimate.destination_name,
// 					measurement_units: calculatedEstimate.measurement_units,
// 					units_label: calculatedEstimate.units_label,
// 					price_per_unit_75_50: calculatedEstimate.price_per_unit_75_50,
// 					price_per_unit_90_60: calculatedEstimate.price_per_unit_90_60,
// 				}); // End monthHolderObject
// 			}); // End shippingDestinations.forEach

// 			// } else {
// 			// if (month.date_saved < productCostHistory12Months.data[0].date_saved) {
// 			// 	console.log(`Ryan Here: IT IS GREATER \n `, { month, productCostHistory12Months: productCostHistory12Months.data[0] });
// 			// }

// 			// }

// 			// ⬇ Set the historical costs to calculate the price at the time:
// 			// ! Ryan Here. I need to set the historical shipping costs, product costs, and customs duties here.




// 		}); // End markupHistory12Months.forEach


// 		yield put({ type: 'SET_MARKUP_MARGIN', payload: currentMarkup.data });
// 		yield put({ type: 'SET_MONTHLY_MARKUP_PRICING', payload: monthHolderObject });
// 		yield put({ type: 'SET_MARKUP_HISTORY_RECENT', payload: markupHistory12Months.data });
// 		yield put({ type: 'SET_ACTIVE_SHIPPING_DESTINATIONS', payload: shippingDestinations.data });
// 		yield put({ type: 'SET_MARKUP_IS_LOADING', payload: false });
// 		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
// 	} catch (error) {
// 		console.error('Error with calculateMonthlyMarkup in product saga', error);
// 		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
// 		yield put({ type: 'HIDE_TOP_LOADING_DIV' });
// 	}; // End try/catch
// }; // End calculateMonthlyMarkup



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




export default pricingLogSaga;