import axios from 'axios';
import {
	put,
	takeLatest,
	takeEvery,
	select
} from 'redux-saga/effects';
import dayjs from 'dayjs';

// import { useClasses } from '../../components/MuiStyling/MuiStyling';

import useCalculateProjectCost from '../../hooks/useCalculateProjectCost';



const errorText = 'Error in Pricing Log Saga: ';

function* pricingLogSaga() {
	yield takeLatest('PRICING_LOG_INITIAL_LOAD', pricingLogInitialLoad);
	yield takeLatest('UPDATE_PRICING_INITIAL_LOAD', updatePricingInitialLoad);
	yield takeLatest('MARKUP_SAVE_HISTORY_LOG', saveMarkupHistoryLog);
	yield takeLatest('SUBMIT_NEW_PRICING_CHANGES', submitNewPricingChanges);
}

function* pricingLogInitialLoad() {
	// const classes = useClasses();
	try {
		const user = yield select(state => state.user);

		const customsDutiesHistoryAll = yield axios.get('/api/customsduties/get-all-customs-duties-history');
		const markupHistoryAll = yield axios.get('/api/products/get-all-markup-history');
		const productCostHistoryAll = yield axios.get('/api/products/get-all-product-cost-history');
		const shippingCostHistoryAll = yield axios.get('/api/shippingcosts/get-all-shipping-cost-history');

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

		const markupHistoryDictionary = {};
		Object.keys(markupHistory12Months.data).forEach(month => {
			markupHistoryDictionary[month] = markupHistory12Months.data[month].reduce((acc, markup) => {
				acc[markup.destination_country] = markup;
				return acc;
			}, {});
		});

		//#region - Calculate historical pricing data for 12 months: 
		const monthHolderObject = {
			current: {
				month_year_label: 'Current Pricing',
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
					date_saved_full: (markupHistory12Months.data[date][0].date_saved_full),
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

				if (i !== 'current') {
					let hasProductCostData = productCostHistory12Months.data[i].some(item => item.destination_country === destination.destination_country);
					let hasCustomsDutyData = customsDutiesHistory12Months.data[i].some(item => item.destination_country === destination.destination_country);

					// Skip this destination if either historical product cost data or customs duty data is missing
					if (!hasProductCostData || !hasCustomsDutyData) {
						console.warn(`Skipping destination ${destination.destination_country} for month ${i} due to missing data.`);
						continue;
					};
				}

				if (destination.default_measurement == "imperial") {
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
					destination_country: calculatedEstimate.destination_country,
					destination_name: calculatedEstimate.destination_name,
					measurement_units: calculatedEstimate.measurement_units,
					units_label: calculatedEstimate.units_label,
					price_per_unit_75_50: calculatedEstimate.price_per_unit_75_50,
					price_per_unit_90_60: calculatedEstimate.price_per_unit_90_60,
					markup_percentage: calculatedEstimate.markup_percentage,
				}); // End month.destinationsCosts.push
			}; // End for loop
		}; // End for loop
		//#endregion - Calculate historical pricing data.

		const pricingLogPerUnitTopHeader = [
			{ month_year_value: "" },
			{ month_year_label: null, month_year_value: "" },
			{ month_year_value: "" },
		];

		const pricingLogPerUnitBottomHeader = [
			{
				headerName: "Destination",
				field: 'destination_name',
			},
			{
				headerName: "Region",
				field: 'destination_country',
			},
			{
				headerName: "Measurement Units",
				field: 'measurement_units',
			},
		];
		// const pricingLogPerUnitRows = [];
		const pricingLogPerUnitRowsObject = {};

		let lastMonth = null;
		// ⬇ Loop through the monthHolderObject and create the top header:
		for (const i in monthHolderObject) {
			const month = monthHolderObject[i];

			pricingLogPerUnitTopHeader.push({
				month_year_label: month.month_year_label,
				month_year_value: month.month_year_value,
				date_saved_full: month.date_saved_full,
			}); // End pricingLogPerUnitTopHeader.push

			// ⬇ Loop through the destinationsCosts array and create the bottom header:
			if (!user.is_region_admin) pricingLogPerUnitBottomHeader.push(
				{
					headerName: `Markup - ${month.month_year_label}`,
					field: `markup_${month.month_year_value}`,
				},
			);

			pricingLogPerUnitBottomHeader.push(
				{
					headerName: `60lbs/35kg Price - ${month.month_year_label}`,
					field: `lower_${month.month_year_value}`,
				},
				{
					headerName: `Change from Last Month`,
					field: `lower_diff_${month.month_year_value}`,
				},
				{
					headerName: `68lbs/40kg Price - ${month.month_year_label}`,
					field: `higher_${month.month_year_value}`,
				},
				{
					headerName: `Change from Last Month`,
					field: `higher_diff_${month.month_year_value}`,
				},
			); // End pricingLogPerUnitBottomHeader.push

			// ⬇ Loop through the destinationsCosts array and create the rows:
			for (const destination of month.destinationsCosts) {
				if (!pricingLogPerUnitRowsObject[destination.destination_id]) {
					pricingLogPerUnitRowsObject[destination.destination_id] = {
						destination_id: destination.destination_id,
						destination_name: destination.destination_name,
						destination_country: destination.destination_country,
						measurement_units: (destination.measurement_units).charAt(0).toUpperCase() + (destination.measurement_units).slice(1),
						units_label: destination.units_label,
						[`markup_${month.month_year_value}`]: destination.markup_percentage,
						[`lower_${month.month_year_value}`]: destination.price_per_unit_75_50,
						[`lower_diff_${month.month_year_value}`]: 0,
						[`higher_${month.month_year_value}`]: destination.price_per_unit_90_60,
						[`higher_diff_${month.month_year_value}`]: 0,
					};
				} else {
					pricingLogPerUnitRowsObject[destination.destination_id][`lower_${month.month_year_value}`] = destination.price_per_unit_75_50;
					pricingLogPerUnitRowsObject[destination.destination_id][`higher_${month.month_year_value}`] = destination.price_per_unit_90_60;
					pricingLogPerUnitRowsObject[destination.destination_id][`markup_${month.month_year_value}`] = destination.markup_percentage;
				}; // End if/else

				if (pricingLogPerUnitRowsObject[destination.destination_id] && lastMonth && lastMonth.month_year_value != month.month_year_value) {

					const destinationLastMonth = lastMonth.destinationsCosts.find(element => destination.destination_id == element.destination_id);

					pricingLogPerUnitRowsObject[destination.destination_id][`lower_diff_${lastMonth.month_year_value}`] = (destinationLastMonth.price_per_unit_75_50 - destination.price_per_unit_75_50) / destination.price_per_unit_75_50;
					pricingLogPerUnitRowsObject[destination.destination_id][`higher_diff_${lastMonth.month_year_value}`] = (destinationLastMonth.price_per_unit_90_60 - destination.price_per_unit_90_60) / destination.price_per_unit_90_60;
				}; // End if
				// lastDestination = destination;
			}; // End for loop

			lastMonth = month;
		}; // End for loop

		const pricingLogPerUnitRows = Object.values(pricingLogPerUnitRowsObject);

		yield put({
			type: 'SET_PRICING_LOG_DATA', payload: {
				customsDutiesHistoryAll: customsDutiesHistoryAll.data,
				markupHistoryAll: markupHistoryAll.data,
				productCostHistoryAll: productCostHistoryAll.data,
				shippingCostHistoryAll: shippingCostHistoryAll.data,
				pricePerUnitHistory12Months: {
					pricingLogPerUnitTopHeader,
					pricingLogPerUnitBottomHeader,
					pricingLogPerUnitRows,
				},
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
		const activeRegions = yield axios.get(`/api/regions/get-regions`, { params: { active: true } });
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
				month_year_label: 'Current Pricing',
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
					date_saved_full: (markupHistory12Months.data[date][0].date_saved_full),
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

				if (i !== 'current') {
					let hasProductCostData = productCostHistory12Months.data[i].some(item => item.destination_country === destination.destination_country);
					let hasCustomsDutyData = customsDutiesHistory12Months.data[i].some(item => item.destination_country === destination.destination_country);

					if (!hasProductCostData || !hasCustomsDutyData) {
						// Skip this destination if either historical product cost data or customs duty data is missing
						console.warn(`Skipping destination ${destination.destination_country} for month ${i} due to missing data.`);
						continue;
					}
				}; // End if

				if (destination.default_measurement == "imperial") {
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
					destination_country: calculatedEstimate.destination_country,
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
		};

		const monthOptions = [];
		const saveMonthOptions = [];

		for (const i in monthHolderObject) {
			const month = monthHolderObject[i];
			const element = {
				label: month.month_year_label,
				value: month.month_year_value,
				date_saved_full: month.date_saved_full,
			};
			monthOptions.push(element);

			if (month.month_year_value != 'current' && month.month_year_value != 'new') {
				saveMonthOptions.push({
					...element,
					saved: true,
				});
			}; // End if
		}; // End for loop
		monthOptions.unshift(monthOptions.pop());
		//#endregion - Calculate historical pricing data.

		// ⬇ Calculate the next month (i.e., if it's 2023-03, calculate 2023-04) with day.js:
		const nextMonth = dayjs().add(1, 'month').format('YYYY-MM');
		const nextMonthLabel = months[+nextMonth.split('-')[1] - 1] + ', ' + nextMonth.split('-')[0];
		const thisMonth = dayjs().format('YYYY-MM');
		const thisMonthLabel = months[+thisMonth.split('-')[1] - 1] + ', ' + thisMonth.split('-')[0];

		// ⬇ Check if this month is already in the saveMonthOptions array:
		if (!monthHolderObject[thisMonth]) {
			saveMonthOptions.push({
				label: thisMonthLabel,
				value: thisMonth,
				saved: false,
			});
		} else if (!monthHolderObject[nextMonth]) {
			saveMonthOptions.push({
				label: nextMonthLabel,
				value: nextMonth,
				saved: false,
			});
		}; // End if/else
		// } else {
		// 	saveMonthOptions.push({
		// 		label: nextMonthLabel,
		// 		value: nextMonth,
		// 		saved: false,
		// 	});
		// }; // End if/else

		// ⬇ Sort saveMonthOptions by date:
		saveMonthOptions.sort((a, b) => {
			const aDate = new Date(a.value);
			const bDate = new Date(b.value);
			return bDate - aDate;
		});


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
				activeRegions: activeRegions.data,
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
				saveMonthOptions: saveMonthOptions,
				monthToSaveTo: saveMonthOptions[0].value,
				// nextMonthToSave: nextMonthToSave,
			}, // End payload
		}); // End yield put
	} catch (error) {
		console.error(errorText, error);
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}; // End try/catch
} // End updatePricingInitialLoad



function* submitNewPricingChanges(action) {
	try {
		yield put({ type: "SHOW_TOP_LOADING_DIV" });

		// ⬇ Submit the new pricing changes:
		const result = yield axios.post(`/api/pricingLog/submit-new-pricing-changes`, action.payload);

		yield put({
			type: 'SET_PRICING_LOG_VIEW', payload: {
				updatePricingIsLoading: true,
				updatePricingStep: 1,
			}
		});
		yield put({ type: 'SNACK_GENERIC_REQUEST_SUCCESS' });
		yield put({ type: "HIDE_TOP_LOADING_DIV" });
		yield put({ type: 'UPDATE_PRICING_INITIAL_LOAD' });

	} catch (error) {
		console.error(errorText, error);
		yield put({ type: "HIDE_TOP_LOADING_DIV" });
		yield put({ type: 'SNACK_GENERIC_REQUEST_ERROR' });
	}; // End try/catch
} // End submitNewPricingChanges



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