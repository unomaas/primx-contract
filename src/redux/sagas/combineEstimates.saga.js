import {
	put,
	takeLatest
} from 'redux-saga/effects';
import axios from 'axios';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import useCombineEstimateCalculations from '../../hooks/useCombineEstimateCalculations';

// Create our number formatter to format our money quantities back into standard looking currency values.
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',

	// These options are needed to round to whole numbers if that's what you want.
	//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

// Combined estimate saga to fetch estimate for combined cost
function* combineEstimatesSaga() {
	yield takeLatest('FETCH_MANY_ESTIMATES_QUERY', fetchManyEstimatesQuery);
	yield takeLatest('FETCH_COMBINED_ESTIMATE_QUERY', fetchCombinedEstimatesQuery);
	yield takeLatest('MARK_COMBINED_ESTIMATE_ORDERED', markCombinedEstimateOrdered);
	yield takeLatest('CLEAR_ALL_STALE_DATA', clearAllStaleData);
	yield takeLatest('COMBINE_ESTIMATE_TOTALS', combineEstimateTotals);
	yield takeLatest('EDIT_COMBINED_ESTIMATE', editCombinedEstimate);
} // End combineEstimatesSaga //

// Saga Worker to create a a new combined estimated quote: 
function* combineEstimateTotals(action) {
	yield put({ type: "SHOW_TOP_LOADING_DIV" });

	const {
		firstEstimate,
		secondEstimate,
		thirdEstimate,
		combinedEstimate
	} = action.payload;

	try {
		// ⬇ Total the estimates' design_cubic measurements:
		const totalsObjectHolder = {
			design_cubic_yards_total: 0,
			design_cubic_meters_total: 0,
			total_project_cost_75_50: 0,
			total_project_cost_90_60: 0,
			combined_total_project_cost: 0,
		};

		if (firstEstimate.measurement_units === 'imperial') {

			totalsObjectHolder.design_cubic_yards_total += parseFloat(firstEstimate.design_cubic_yards_total?.replaceAll(',', ''));
			totalsObjectHolder.design_cubic_yards_total += parseFloat(secondEstimate.design_cubic_yards_total?.replaceAll(',', ''));
			if (thirdEstimate) totalsObjectHolder.design_cubic_yards_total += parseFloat(thirdEstimate?.design_cubic_yards_total?.replaceAll(',', ''));

		} else if (firstEstimate.measurement_units === 'metric') {

			totalsObjectHolder.design_cubic_meters_total += parseFloat(firstEstimate.design_cubic_meters_total?.replaceAll(',', ''));
			totalsObjectHolder.design_cubic_meters_total += parseFloat(secondEstimate.design_cubic_meters_total?.replaceAll(',', ''));
			if (thirdEstimate) totalsObjectHolder.design_cubic_meters_total += parseFloat(thirdEstimate.design_cubic_meters_total?.replaceAll(',', ''));

		} // End if/else

		const firstSFDosage = firstEstimate.selected_steel_fiber_dosage;
		const secondSFDosage = secondEstimate.selected_steel_fiber_dosage;
		const thirdSFDosage = thirdEstimate?.selected_steel_fiber_dosage;

		totalsObjectHolder.combined_total_project_cost += parseFloat(firstEstimate[`total_project_cost_${firstSFDosage}`]);
		totalsObjectHolder.combined_total_project_cost += parseFloat(secondEstimate[`total_project_cost_${secondSFDosage}`]);
		if (thirdEstimate) totalsObjectHolder.combined_total_project_cost += parseFloat(thirdEstimate[`total_project_cost_${thirdSFDosage}`]);

		combinedEstimate.total_project_cost_75_50 = Math.floor(totalsObjectHolder.combined_total_project_cost * 100) / 100;
		combinedEstimate.total_project_cost_75_50_display = formatter.format(combinedEstimate.total_project_cost_75_50);

		combinedEstimate.total_project_cost_90_60 = Math.floor(totalsObjectHolder.combined_total_project_cost * 100) / 100;
		combinedEstimate.total_project_cost_90_60_display = formatter.format(combinedEstimate.total_project_cost_90_60);
		combinedEstimate.design_cubic_yards_total = totalsObjectHolder.design_cubic_yards_total;
		combinedEstimate.design_cubic_yards_total_display = totalsObjectHolder.design_cubic_yards_total.toLocaleString('en-US');
		combinedEstimate.design_cubic_meters_total = totalsObjectHolder.design_cubic_meters_total;
		combinedEstimate.design_cubic_meters_total_display = totalsObjectHolder.design_cubic_meters_total.toLocaleString('en-US');

		// const calculatedResponse = yield useCombineEstimateCalculations(talliedCombinedEstimate);
		// ⬇ Send that data to the reducer, and set the show table to true:
		yield put({ type: "CLEAR_CALCULATED_COMBINED_ESTIMATE", });
		yield put({ type: "SET_CALCULATED_COMBINED_ESTIMATE", payload: combinedEstimate });
		// yield put({ type: "SHOW_DATA_TABLE" });
		yield put({ type: "HIDE_TOP_LOADING_DIV" });
	} catch (error) {
		console.error('fetchManyEstimatesQuery failed:', error);
		yield put({ type: "HIDE_TOP_LOADING_DIV" });
	} // End try/catch
} // End  Saga

// Saga Worker to create a a new combined estimated quote: 
function* fetchManyEstimatesQuery(action) {
	// Saving history for navigation:
	const history = action.payload.history;
	// ⬇ Clearing the third estimate reducer, just in case it has zombie data from a prior search:
	yield put({ type: "CLEAR_THIRD_COMBINED_ESTIMATE" });
	// ⬇ Declaring variables:
	const licenseeId = action.payload.licensee_id;
	const firstEstimateNumber = action.payload.first_estimate_number;
	const secondEstimateNumber = action.payload.second_estimate_number;
	const thirdEstimateNumber = action.payload.third_estimate_number;
	// ⬇ Putting them in an array to loop through:
	const estimateNumberArray = [
		firstEstimateNumber,
		secondEstimateNumber
	]; // End estimateNumberArray
	// ⬇ If the third estimate exists, add it:
	if (thirdEstimateNumber) {
		estimateNumberArray.push(thirdEstimateNumber);
	} // End if
	// ⬇ Creating an array to push to: 
	const estimatesArray = [];
	try {
		// ⬇ We loop through each estimate number in the array and make a GET request for it, which adds it to an estimates array. 
		for (let i = 0; i < estimateNumberArray.length; i++) {
			const response = yield axios.get('/api/estimates/lookup/:estimates', {
				params: {
					estimateNumber: estimateNumberArray[i],
					licenseeId: licenseeId
				} // End params
			}) // End response      
			// ⬇ If a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it:
			const calculatedResponse = yield useEstimateCalculations(response.data[0]);
			// ⬇ Save it to the estimatesArray for later use:
			estimatesArray.push(calculatedResponse);
		} // End for loop
		// ⬇ Saving the estimates from the array to variables: 
		const firstEstimate = estimatesArray[0];
		const secondEstimate = estimatesArray[1];
		if (firstEstimate.estimate_number_combined_1) {
			// ⬇ If this estimate has already been saved in a combined estimate: 
			if (firstEstimate.estimate_number_combined_1.charAt(firstEstimate.estimate_number_combined_1.length - 1) === "C") {
				// ⬇ And they're both the same estimate number: 
				if (firstEstimate.estimate_number_combined_1 === secondEstimate.estimate_number_combined_1) {
					// ⬇ Push them to that estimate:
					history.push(`/lookup/${firstEstimate.licensee_id}/${firstEstimate.estimate_number_combined_1}`)
					// ⬇ And stop this code block:
					return;
				} // End if 
			} // End if
		} // End if 
		// ⬇ Sending each estimate to a reducer to display on the combine table:
		yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: firstEstimate });
		yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: secondEstimate });
		// ⬇ If the third estimate exists, send it:
		if (thirdEstimateNumber) {
			const thirdEstimate = estimatesArray[2];
			yield put({ type: "SET_THIRD_COMBINED_ESTIMATE", payload: thirdEstimate });
		} // End if 
		// ⬇ Making an empty/zero'd out object to hold the tallies for each total amount needed. 
		const totalsObjectHolder = {
			primx_cpea_total_project_amount: 0,
			primx_dc_total_project_amount: 0,
			primx_flow_total_project_amount: 0,
			primx_steel_fibers_total_project_amount: 0,
			primx_ultracure_blankets_total_project_amount: 0,
			square_feet: 0,
			square_meters: 0,
			primx_dc_on_hand_lbs: 0,
			primx_dc_on_hand_kgs: 0,
			primx_flow_on_hand_liters: 0,
			primx_steel_fibers_on_hand_lbs: 0,
			primx_steel_fibers_on_hand_kgs: 0,
			primx_ultracure_blankets_on_hand_sq_ft: 0,
			primx_ultracure_blankets_on_hand_sq_m: 0,
			primx_cpea_on_hand_liters: 0,
		}; // End totalsObjectHolder
		// ⬇ Looping through the estimatesArray, which is full of estimates from the DB, and tallying those total amounts needed to the object holding container above. 
		for (let estimate of estimatesArray) {
			totalsObjectHolder.primx_cpea_total_project_amount += parseFloat(estimate?.primx_cpea_total_project_amount?.replaceAll(',', ''));
			totalsObjectHolder.primx_dc_total_project_amount += parseFloat(estimate?.primx_dc_total_project_amount?.replaceAll(',', ''));
			totalsObjectHolder.primx_flow_total_project_amount += parseFloat(estimate?.primx_flow_total_project_amount?.replaceAll(',', ''));
			totalsObjectHolder.primx_steel_fibers_total_project_amount += parseFloat(estimate?.primx_steel_fibers_total_project_amount?.replaceAll(',', ''));
			totalsObjectHolder.primx_ultracure_blankets_total_project_amount += parseFloat(estimate?.primx_ultracure_blankets_total_project_amount?.replaceAll(',', ''));
			totalsObjectHolder.square_feet += parseFloat(estimate?.square_feet);
			totalsObjectHolder.square_meters += parseFloat(estimate?.square_meters);
			// ⬇ If any of the estimates used in the combine are marked as having Materials On Hand:
			if (estimate.materials_on_hand) {
				// ⬇ Tally up the totals: 
				totalsObjectHolder.primx_dc_on_hand_lbs += parseFloat(estimate?.primx_dc_on_hand_lbs);
				totalsObjectHolder.primx_dc_on_hand_kgs += parseFloat(estimate?.primx_dc_on_hand_kgs);
				totalsObjectHolder.primx_flow_on_hand_liters += parseFloat(estimate?.primx_flow_on_hand_liters);
				totalsObjectHolder.primx_steel_fibers_on_hand_lbs += parseFloat(estimate?.primx_steel_fibers_on_hand_lbs);
				totalsObjectHolder.primx_steel_fibers_on_hand_kgs += parseFloat(estimate?.primx_steel_fibers_on_hand_kgs);
				totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_ft += parseFloat(estimate?.primx_ultracure_blankets_on_hand_sq_ft);
				totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_m += parseFloat(estimate?.primx_ultracure_blankets_on_hand_sq_m);
				totalsObjectHolder.primx_cpea_on_hand_liters += parseFloat(estimate?.primx_cpea_on_hand_liters);
				// ⬇ Mark the first estimate used as true for having them as well, as that's the one that gets deep cloned and shown on the page: 
				estimatesArray[0].materials_on_hand = true;
			} // End if 
		} // End for loop
		// ⬇ Creating a deep copy container to copy the first estimate in the array, which is the one we use for shipping/quote pricing. The JSON.parse(JSON.stringify) will rip apart and create a new object copy. Only works with objects: 
		let talliedCombinedEstimate = JSON.parse(JSON.stringify(estimatesArray[0]));
		// ⬇ Setting the tallied amount to the object to feed through the math machine: 
		talliedCombinedEstimate.primx_cpea_total_project_amount = totalsObjectHolder.primx_cpea_total_project_amount;
		talliedCombinedEstimate.primx_dc_total_project_amount = totalsObjectHolder.primx_dc_total_project_amount;
		talliedCombinedEstimate.primx_flow_total_project_amount = totalsObjectHolder.primx_flow_total_project_amount;
		talliedCombinedEstimate.primx_steel_fibers_total_project_amount = totalsObjectHolder.primx_steel_fibers_total_project_amount;
		talliedCombinedEstimate.primx_ultracure_blankets_total_project_amount = totalsObjectHolder.primx_ultracure_blankets_total_project_amount;
		talliedCombinedEstimate.square_feet = totalsObjectHolder.square_feet;
		talliedCombinedEstimate.square_meters = totalsObjectHolder.square_meters;
		// ⬇ If any of the estimates used in the combine are marked as having Materials On Hand:
		if (talliedCombinedEstimate.materials_on_hand) {
			// ⬇ Set the tallied totals to the new estimate object: 
			talliedCombinedEstimate.primx_dc_on_hand_lbs = totalsObjectHolder.primx_dc_on_hand_lbs;
			talliedCombinedEstimate.primx_dc_on_hand_kgs = totalsObjectHolder.primx_dc_on_hand_kgs;
			talliedCombinedEstimate.primx_flow_on_hand_liters = totalsObjectHolder.primx_flow_on_hand_liters;
			talliedCombinedEstimate.primx_steel_fibers_on_hand_lbs = totalsObjectHolder.primx_steel_fibers_on_hand_lbs;
			talliedCombinedEstimate.primx_steel_fibers_on_hand_kgs = totalsObjectHolder.primx_steel_fibers_on_hand_kgs;
			talliedCombinedEstimate.primx_ultracure_blankets_on_hand_sq_ft = totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_ft;
			talliedCombinedEstimate.primx_ultracure_blankets_on_hand_sq_m = totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_m;
			talliedCombinedEstimate.primx_cpea_on_hand_liters = totalsObjectHolder.primx_cpea_on_hand_liters;
		} // End if 
		// ⬇ Run the updated Combine Estimates Calc on it:
		const calculatedResponse = yield useCombineEstimateCalculations(talliedCombinedEstimate);
		// ⬇ Send that data to the reducer, and set the show table to true:
		yield put({ type: "SET_CALCULATED_COMBINED_ESTIMATE", payload: calculatedResponse });
		yield put({ type: "SHOW_DATA_TABLE" });
		yield put({ type: "LOADING_SCREEN_OFF" });
	} catch (error) {
		console.error('fetchManyEstimatesQuery failed:', error);
	} // End try/catch
} // End fetchManyEstimatesQuery Saga


// ⬇ Saga Worker to handle looking up a saved combined estimate:
function* fetchCombinedEstimatesQuery(action) {
	// ⬇ Clearing the third estimate reducer, just in case it has zombie data from a prior search:
	yield put({ type: "CLEAR_THIRD_COMBINED_ESTIMATE" });
	// ⬇ Pulling the variables from the payload: 
	const licenseeId = action.payload.licenseeId;
	const combinedEstimateNumber = action.payload.estimateNumber;
	// ⬇ Saving history for the navigation from Saga:
	// const history = action.payload.history;
	// ⬇ Creating an array to push to: 
	const estimatesArray = [];
	// ⬇ Putting them in an array to loop through:
	const estimateNumberArray = []; // End estimateNumberArray
	try {
		// ⬇ Ping the server with combined estimate to pull the estimate numbers:
		const firstResponse = yield axios.get('/api/estimates/lookup/:estimates', {
			params: {
				estimateNumber: combinedEstimateNumber,
				licenseeId: licenseeId
			} // End params
		}); // End response        
		const combinedEstimateData = firstResponse.data[0];
		// ⬇ Pulling the estimate numbers from : 
		const firstEstimateNumber = combinedEstimateData.estimate_number_combined_1;
		const secondEstimateNumber = combinedEstimateData.estimate_number_combined_2;
		const thirdEstimateNumber = combinedEstimateData.estimate_number_combined_3;
		// ⬇ Putting them in an array to loop through:
		estimateNumberArray.push(firstEstimateNumber, secondEstimateNumber);
		// ⬇ If the third estimate exists, add it too:
		if (thirdEstimateNumber) {
			estimateNumberArray.push(thirdEstimateNumber);
		} // End if
		for (let i = 0; i < estimateNumberArray.length; i++) {
			const response = yield axios.get('/api/estimates/lookup/:estimates', {
				params: {
					estimateNumber: estimateNumberArray[i],
					licenseeId: licenseeId
				} // End params
			}) // End response      
			// ⬇ If a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it:
			const calculatedResponse = yield useEstimateCalculations(response.data[0]);
			// ⬇ Save it to the estimatesArray for later use. 
			estimatesArray.push(calculatedResponse);
		} // End for loop
		// ⬇ Saving the estimates from the array to variables: 
		const firstEstimate = estimatesArray[0];
		const secondEstimate = estimatesArray[1];
		// ⬇ Sending each estimate to a reducer to display on the combine table:
		yield put({ type: "SET_FIRST_COMBINED_ESTIMATE", payload: firstEstimate });
		yield put({ type: "SET_SECOND_COMBINED_ESTIMATE", payload: secondEstimate });
		// ⬇ If the third estimate exists, send it:
		if (thirdEstimateNumber) {
			const thirdEstimate = estimatesArray[2];
			yield put({ type: "SET_THIRD_COMBINED_ESTIMATE", payload: thirdEstimate });
		} // End if 
		// // ⬇ Making an empty/zero'd out object to hold the tallies for each total amount needed. 
		// const totalsObjectHolder = {
		// 	primx_cpea_total_project_amount: 0,
		// 	primx_dc_total_project_amount: 0,
		// 	primx_flow_total_project_amount: 0,
		// 	primx_steel_fibers_total_project_amount: 0,
		// 	primx_ultracure_blankets_total_project_amount: 0,
		// 	square_feet: 0,
		// 	square_meters: 0,
		// 	primx_dc_on_hand_lbs: 0,
		// 	primx_dc_on_hand_kgs: 0,
		// 	primx_flow_on_hand_liters: 0,
		// 	primx_steel_fibers_on_hand_lbs: 0,
		// 	primx_steel_fibers_on_hand_kgs: 0,
		// 	primx_ultracure_blankets_on_hand_sq_ft: 0,
		// 	primx_ultracure_blankets_on_hand_sq_m: 0,
		// 	primx_cpea_on_hand_liters: 0,
		// }; // End totalsObjectHolder
		// // ⬇ Looping through the estimatesArray, which is full of estimates from the DB, and tallying those total amounts needed to the object holding container above. 
		// for (let estimate of estimatesArray) {
		// 	totalsObjectHolder.primx_cpea_total_project_amount += parseFloat(estimate?.primx_cpea_total_project_amount?.replaceAll(',', ''));
		// 	totalsObjectHolder.primx_dc_total_project_amount += parseFloat(estimate?.primx_dc_total_project_amount?.replaceAll(',', ''));
		// 	totalsObjectHolder.primx_flow_total_project_amount += parseFloat(estimate?.primx_flow_total_project_amount?.replaceAll(',', ''));
		// 	totalsObjectHolder.primx_steel_fibers_total_project_amount += parseFloat(estimate?.primx_steel_fibers_total_project_amount?.replaceAll(',', ''));
		// 	totalsObjectHolder.primx_ultracure_blankets_total_project_amount += parseFloat(estimate?.primx_ultracure_blankets_total_project_amount?.replaceAll(',', ''));
		// 	totalsObjectHolder.square_feet += parseFloat(estimate?.square_feet);
		// 	totalsObjectHolder.square_meters += parseFloat(estimate?.square_meters);
		// 	// ⬇ If any of the estimates used in the combine are marked as having Materials On Hand:
		// 	if (estimate.materials_on_hand) {
		// 		// ⬇ Tally up the totals: 
		// 		totalsObjectHolder.primx_dc_on_hand_lbs += parseFloat(estimate.primx_dc_on_hand_lbs);
		// 		totalsObjectHolder.primx_dc_on_hand_kgs += parseFloat(estimate?.primx_dc_on_hand_kgs);
		// 		totalsObjectHolder.primx_flow_on_hand_liters += parseFloat(estimate.primx_flow_on_hand_liters);
		// 		totalsObjectHolder.primx_steel_fibers_on_hand_lbs += parseFloat(estimate.primx_steel_fibers_on_hand_lbs);
		// 		totalsObjectHolder.primx_steel_fibers_on_hand_kgs += parseFloat(estimate.primx_steel_fibers_on_hand_kgs);
		// 		totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_ft += parseFloat(estimate.primx_ultracure_blankets_on_hand_sq_ft);
		// 		totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_m += parseFloat(estimate.primx_ultracure_blankets_on_hand_sq_m);
		// 		totalsObjectHolder.primx_cpea_on_hand_liters += parseFloat(estimate.primx_cpea_on_hand_liters);
		// 		// ⬇ Mark the first estimate used as true for having them as well, as that's the one that gets deep cloned and shown on the page: 
		// 		estimatesArray[0].materials_on_hand = true;
		// 	} // End if 
		// } // End for loop
		// // ⬇ Creating a deep copy container to copy the first estimate in the array, which is the one we use for shipping/quote pricing. The JSON.parse(JSON.stringify) will rip apart and create a new object copy. Only works with objects: 
		// let talliedCombinedEstimate = JSON.parse(JSON.stringify(estimatesArray[0]));
		// // ⬇ We want the updated "-C" combined estimate number on our deep copy though: 
		// talliedCombinedEstimate.estimate_number = combinedEstimateNumber;
		// // ⬇ Setting the tallied amount to the object to feed through the math machine: 
		// talliedCombinedEstimate.primx_cpea_total_project_amount = totalsObjectHolder.primx_cpea_total_project_amount;
		// talliedCombinedEstimate.primx_dc_total_project_amount = totalsObjectHolder.primx_dc_total_project_amount;
		// talliedCombinedEstimate.primx_flow_total_project_amount = totalsObjectHolder.primx_flow_total_project_amount;
		// talliedCombinedEstimate.primx_steel_fibers_total_project_amount = totalsObjectHolder.primx_steel_fibers_total_project_amount;
		// talliedCombinedEstimate.primx_ultracure_blankets_total_project_amount = totalsObjectHolder.primx_ultracure_blankets_total_project_amount;
		// talliedCombinedEstimate.square_feet = totalsObjectHolder.square_feet;
		// talliedCombinedEstimate.square_meters = totalsObjectHolder.square_meters;
		// // ⬇ If any of the estimates used in the combine are marked as having Materials On Hand:
		// if (talliedCombinedEstimate.materials_on_hand) {
		// 	// ⬇ Set the tallied totals to the new estimate object: 
		// 	talliedCombinedEstimate.primx_dc_on_hand_lbs = totalsObjectHolder.primx_dc_on_hand_lbs;
		// 	talliedCombinedEstimate.primx_dc_on_hand_kgs = totalsObjectHolder.primx_dc_on_hand_kgs;
		// 	talliedCombinedEstimate.primx_flow_on_hand_liters = totalsObjectHolder.primx_flow_on_hand_liters;
		// 	talliedCombinedEstimate.primx_steel_fibers_on_hand_lbs = totalsObjectHolder.primx_steel_fibers_on_hand_lbs;
		// 	talliedCombinedEstimate.primx_steel_fibers_on_hand_kgs = totalsObjectHolder.primx_steel_fibers_on_hand_kgs;
		// 	talliedCombinedEstimate.primx_ultracure_blankets_on_hand_sq_ft = totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_ft;
		// 	talliedCombinedEstimate.primx_ultracure_blankets_on_hand_sq_m = totalsObjectHolder.primx_ultracure_blankets_on_hand_sq_m;
		// 	talliedCombinedEstimate.primx_cpea_on_hand_liters = totalsObjectHolder.primx_cpea_on_hand_liters;
		// } // End if 
		// // ⬇ Run the updated Combine Estimates Calc on it:
		// const calculatedResponse = yield useCombineEstimateCalculations(talliedCombinedEstimate);
		// ⬇ Send that data to the reducer, and set the show table to true:
		yield put({ type: "SET_CALCULATED_COMBINED_ESTIMATE", payload: combinedEstimateData });
		yield put({ type: 'SET_ESTIMATE_QUERY_RESULT', payload: combinedEstimateData });
		yield put({ type: "SHOW_COMBINED_ESTIMATE" });
		// yield put({ type: "LOADING_SCREEN_OFF" });
	} catch (error) {
		console.error('fetchCombinedEstimatesQuery failed:', error);
	} // End try/catch
} // End fetchCombinedEstimatesQuery Saga


// Worker saga that is supplied an estimate id number and a user-created P.O. number that marks an estimate as ordered in the database to then be processed by an admin user
function* markCombinedEstimateOrdered(action) {
	try {
		const estimate_id = action.payload.calcCombinedEstimate.estimate_id;
		const calcCombinedEstimate = action.payload.calcCombinedEstimate;
		// Update all of the estimates as marked ordered and link them together: 
		yield axios.put(`/api/estimates/combine-order/${estimate_id}`, action.payload);
		// fetch updated estimate data for the search view to allow for proper conditional rendering once the licensee has placed an order
		yield put({
			type: 'FETCH_ESTIMATE_QUERY',
			payload: calcCombinedEstimate
		});
		yield put({ type: 'SET_RECALCULATE_FALSE' });

	} catch (error) {
		console.error('markEstimateOrdered failed', error)
	}
}

// Worker saga that is supplied an estimate id number and a user-created P.O. number that marks an estimate as ordered in the database to then be processed by an admin user
function* editCombinedEstimate(action) {
	yield put({ type: 'SHOW_TOP_LOADING_DIV' });
	try {
		const estimate_id = action.payload.estimate_id;
		const calcCombinedEstimate = action.payload;
		// Update all of the estimates as marked ordered and link them together: 
		yield axios.put(`/api/estimates/edit-combined-estimate/${estimate_id}`, calcCombinedEstimate);

		yield put({ type: "CLEAR_CALCULATED_COMBINED_ESTIMATE", });
		yield put({ type: "SET_CALCULATED_COMBINED_ESTIMATE", payload: calcCombinedEstimate });
		yield put({ type: "HIDE_TOP_LOADING_DIV" });
		yield put({ type: "SNACK_GENERIC_REQUEST_SUCCESS" })
	} catch (error) {
		console.error('editCombinedEstimate failed', error)
		yield put({ type: "SNACK_GENERIC_REQUEST_ERROR" })
		yield put({ type: "HIDE_TOP_LOADING_DIV" });
	}
}

// Worker Saga to server as a shortcut to clear all of the stale data reduers on page navigation:
function* clearAllStaleData(action) {
	try {
		yield put({ type: "CLEAR_ESTIMATE" });
		yield put({ type: "CLEAR_COMBINED_ESTIMATES_DATA" });
		yield put({ type: 'CLEAR_CALCULATED_ESTIMATE' });
		yield put({ type: "CLEAR_ESTIMATE_QUERY_RESULT" });
		yield put({ type: "SET_RECALCULATED_FALSE" });
		yield put({ type: "HIDE_LOOKUP_TABLES" });
		yield put({ type: "HIDE_DATA_TABLE" });
		yield put({ type: "SET_TABLE_STATE", payload: false });
		yield put({ type: 'SET_EDIT_STATE', payload: false });
	} catch (error) {
		console.error('clearAllStaleData failed', error)
	}
}

export default combineEstimatesSaga;