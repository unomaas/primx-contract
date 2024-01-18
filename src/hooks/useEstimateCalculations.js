import useValueFormatter from "./useValueFormatter";
import useCalculateProjectCost from "./useCalculateProjectCost";

// ⬇ Custom hook to take in an estimate object and return a mutated object with new keys based on the necessary math needed for all the displays:
export default function useEstimateCalculations(estimate, options = null) {

	// ⬇ Remove the Time Stamps first: 
	estimate.date_created = estimate.date_created.split('T')[0];
	estimate.anticipated_first_pour_date = estimate.anticipated_first_pour_date.split('T')[0];

	// // ⬇ Setup for Materials On Hand. If false, make sure the values are zero:
	// if (!estimate.materials_on_hand) {
	// 	estimate.primx_dc_on_hand_lbs = 0;
	// 	estimate.primx_dc_on_hand_kgs = 0;
	// 	estimate.primx_flow_on_hand_liters = 0;
	// 	estimate.primx_steel_fibers_on_hand_lbs = 0;
	// 	estimate.primx_steel_fibers_on_hand_kgs = 0;
	// 	estimate.primx_ultracure_blankets_on_hand_sq_ft = 0;
	// 	estimate.primx_ultracure_blankets_on_hand_sq_m = 0;
	// 	estimate.primx_cpea_on_hand_liters = 0;
	// }; // End if


	// ⬇ Set a default value for waste factor percentage if one wasn't entered:
	if (!estimate.waste_factor_percentage) {
		estimate.waste_factor_percentage = 3;
	}; // End if 



	// // ⬇ Shipping prices come in with keys linked to the shipping_costs table if they're being calculated from the estimate creation view.  We need to change them to match the keys saved on the estimate table.  If estimates are being calculated from DB data, these keys already exist, since estimates all contain snapshots of the prices necessary for estimate calculations at the time the estimate was made:
	// if (!estimate.primx_dc_shipping_estimate) {
	// 	estimate.primx_dc_shipping_estimate = estimate.dc_price;
	// 	estimate.primx_flow_shipping_estimate = estimate.flow_cpea_price;
	// 	estimate.primx_steel_fibers_shipping_estimate = estimate.fibers_price;
	// 	estimate.primx_cpea_shipping_estimate = estimate.flow_cpea_price;
	// }; // End if 


	// ⬇ This block checks to see if a price estimate exists already, indicating that the calculations are being done on the edit view between Estimate.  Lookup and EstimateCreate. estimate.dc_price only exists if a new shipping state has been selected from the dropdown menu in EstimateCreate.  If both these conditions are met, it means a user is editing an estimate and is changing their desired shipping state. When this happens, set the shipping estimate keys to match the new keys set by the change in ship-to state or province.
	// TODO: We probably want to save this for the edit portion, but not sure we want dc_price as a check on it.  Come back later. 
	// if (estimate.design_total_price_estimate && estimate.dc_price) {
	// 	estimate.primx_dc_shipping_estimate = estimate.dc_price;
	// 	estimate.primx_flow_shipping_estimate = estimate.flow_cpea_price;
	// 	estimate.primx_steel_fibers_shipping_estimate = estimate.fibers_price;
	// 	estimate.primx_cpea_shipping_estimate = estimate.flow_cpea_price;
	// }; // End if 


	// TODO: I don't think this is necessary anymore either, as I'm not saving dollar signs to the DB anymore (for this reason). 
	// // ⬇ Start by running a loop on the entire object and removing dollar signs and commas from all money quantities from database:p
	// for (let property in estimate) {
	// 	// ⬇ Save the value of property being looped over:
	// 	let value = estimate[property]
	// 	// ⬇ If the value is a string and has a '$' in it, it came from a money column in the DB:
	// 	if (typeof (value) == 'string' && value.includes('$')) {
	// 		// ⬇ Remove all nonessential characters from DB fields with the "Money" data type and convert them into numbers for math later.  I found this RegEx solution at 'https://jsfiddle.net/jinglesthula/hdzTy/'
	// 		estimate[property] = Number(value.replace(/[^0-9\.-]+/g, ""));
	// 	}; // End if 
	// }; // End if 


	// TODO: This is where the meat and potatoes happens, we want to save these calculations. Though after looking through them, I'm not sure I need *all* of them.  I think I can get away with just the total cubic yards and total cubic meters.  I'll have to come back to this.
	// ⬇ Begin adding new calculated keys to the estimate, first by adding in keys specific to the unit of measurement that's being worked with.
	// ⬇ Imperial calculations below: 
	if (estimate.measurement_units == 'imperial') {
		// ⬇ Cubic yards base: original formula given to us for cubic yards divided quantity first by 12, then by 27:
		estimate.cubic_yards = (estimate.square_feet * estimate.thickness_inches / 324);

		// ⬇ Additional thickness for thickened edge.  If greater than 6 inches, no need for thickened edges:
		if (estimate.thickness_inches >= 6) {
			estimate.additional_thickness_inches = 0;
		} else {
			estimate.additional_thickness_inches = ((6 - estimate.thickness_inches) * .5);
		} // End if/else

		// ⬇ Calculate perimeter thickening and construction joint thickening based on calculated additional thickness, the 5 and 10 values below are provided by PrimX:
		estimate.perimeter_thickening_cubic_yards = (estimate.thickened_edge_perimeter_lineal_feet * 5) * (estimate.additional_thickness_inches / 324);
		estimate.construction_joint_thickening_cubic_yards = (estimate.thickened_edge_construction_joint_lineal_feet * 10) * (estimate.additional_thickness_inches / 324);

		// ⬇ Calculate subtotal based on above results, factor in waste factor percentage, and calculate the total design cubic yards:
		estimate.cubic_yards_subtotal = estimate.cubic_yards + estimate.perimeter_thickening_cubic_yards + estimate.construction_joint_thickening_cubic_yards;
		estimate.waste_factor_cubic_yards = estimate.cubic_yards_subtotal * (estimate.waste_factor_percentage / 100);
		estimate.design_cubic_yards_total = Math.ceil(estimate.cubic_yards_subtotal + estimate.waste_factor_cubic_yards);


		//#region - ⬇⬇ Imperial DC calculations below:
		// ⬇ Calculate amounts and prices of materials that are measured in pounds and square feet:

		// estimate.primx_dc_total_project_amount = estimate.design_cubic_yards_total * 68; // 67 is the factor provided by PrimX



		// estimate.primx_dc_total_project_amount = estimate.design_cubic_yards_total * estimate.primx_dc_dosage_lbs; // 67 is the factor provided by PrimX

		// ⬇ Dc comes in packages of 2756 lbs, need to round up:
		// ! Also explore pulling these numbers in.  
		// estimate.primx_dc_pallets_needed = Math.ceil(estimate.primx_dc_total_project_amount / 2756);



		// // ⬇ If they have materials on hand, calculate the new values: 
		// if (estimate.materials_on_hand) {
		// 	// ⬇ Total order amount is a new amount to display: 
		// 	estimate.primx_dc_total_order_amount = estimate.primx_dc_total_project_amount - estimate.primx_dc_on_hand_lbs;
		// 	// ⬇ Validation to disallow negative numbers: 
		// 	if (estimate.primx_dc_total_order_amount < 0) {
		// 		estimate.primx_dc_total_order_amount = 0;
		// 	} // End if 
		// 	// ⬇ Dc comes in packages of 2756 lbs, need to round up:
		// 	estimate.primx_dc_pallets_needed = Math.ceil(estimate.primx_dc_total_order_amount / 2756);
		// } // End if
		// estimate.primx_dc_final_order_amount = estimate.primx_dc_pallets_needed * 2756;
		// estimate.primx_dc_total_materials_price = estimate.primx_dc_final_order_amount * estimate.primx_dc_unit_price;

		// ⬇ Every shipping container can hold 14 packages of DC, need to round up:
		// estimate.primx_dc_containers_needed = Math.ceil(estimate.primx_dc_pallets_needed / 14);
		// estimate.primx_dc_calculated_shipping_estimate = estimate.primx_dc_containers_needed * estimate.primx_dc_shipping_estimate;
		// estimate.primx_dc_total_cost_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_dc_total_materials_price;
		//#endregion - Imperial DC calculations above. 

		//#region - ⬇⬇ Imperial Steel Fiber calculations below:

		// ⬇ Calculate amounts and prices of materials that are measured in pounds and square feet:
		// estimate.primx_steel_fibers_total_project_amount = estimate.design_cubic_yards_total * estimate.primx_steel_fibers_dosage_lbs;

		// estimate.primx_steel_fibers_total_project_amount_lower = estimate.design_cubic_yards_total * 60;


		// estimate.primx_steel_fibers_total_project_amount_higher = estimate.design_cubic_yards_total * 68;




		// ⬇ Steel fibers comes in packages of 42329 lbs, need to round up:
		// estimate.primx_steel_fibers_pallets_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 42329);

		// estimate.primx_steel_fibers_pallets_needed_lower = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 2475);
		// estimate.primx_steel_fibers_pallets_needed_higher = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 2475);

		// // ⬇ If they have materials on hand, calculate the new values: 
		// if (estimate.materials_on_hand) {
		// 	// ⬇ Total order amount is a new amount to display: 
		// 	estimate.primx_steel_fibers_total_order_amount = estimate.primx_steel_fibers_total_project_amount - estimate.primx_steel_fibers_on_hand_lbs;
		// 	// ⬇ Validation to disallow negative numbers: 
		// 	if (estimate.primx_steel_fibers_total_order_amount < 0) {
		// 		estimate.primx_steel_fibers_total_order_amount = 0;
		// 	} // End if 
		// 	// ⬇ Steel fibers comes in packages of 42329 lbs, need to round up:
		// 	estimate.primx_steel_fibers_pallets_needed = Math.ceil(estimate.primx_steel_fibers_total_order_amount / 42329);
		// } // End if
		// estimate.primx_steel_fibers_final_order_amount = estimate.primx_steel_fibers_pallets_needed * 42329;
		// estimate.primx_steel_fibers_total_materials_price = estimate.primx_steel_fibers_final_order_amount * estimate.primx_steel_fibers_unit_price;
		// // ⬇ Every shipping container can only hold 1 package of steel fibers:
		// estimate.primx_steel_fibers_containers_needed = estimate.primx_steel_fibers_pallets_needed;
		// estimate.primx_steel_fibers_calculated_shipping_estimate = estimate.primx_steel_fibers_containers_needed * estimate.primx_steel_fibers_shipping_estimate;
		// estimate.primx_steel_fibers_total_cost_estimate = estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_steel_fibers_total_materials_price;
		//#endregion - Imperial Steel Fibers calculations above. 

		//#region - ⬇⬇ Imperial Ultracure Blankets calculations below:
		// ⬇ Calculate values for PrimX Ultracure Blankets:
		// estimate.primx_ultracure_blankets_total_project_amount = estimate.square_feet * 1.2; // 1.2 is the factor provided by PrimX
		// // ⬇ Blankets come in rolls of 6458 sq feet, need to round up:
		// estimate.primx_ultracure_blankets_pallets_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 6458);
		// // ⬇ If they have materials on hand, calculate the new values: 
		// if (estimate.materials_on_hand) {
		// 	// ⬇ Total order amount is a new amount to display: 
		// 	estimate.primx_ultracure_blankets_total_order_amount = estimate.primx_ultracure_blankets_total_project_amount - estimate.primx_ultracure_blankets_on_hand_sq_ft;
		// 	// ⬇ Validation to disallow negative numbers: 
		// 	if (estimate.primx_ultracure_blankets_total_order_amount < 0) {
		// 		estimate.primx_ultracure_blankets_total_order_amount = 0;
		// 	} // End if 
		// 	// ⬇ Blankets come in rolls of 6458 sq feet, need to round up:
		// 	estimate.primx_ultracure_blankets_pallets_needed = Math.ceil(estimate.primx_ultracure_blankets_total_order_amount / 6458);
		// } // End if
		// estimate.primx_ultracure_blankets_final_order_amount = estimate.primx_ultracure_blankets_pallets_needed * 6458;
		// estimate.primx_ultracure_blankets_total_materials_price = estimate.primx_ultracure_blankets_final_order_amount * estimate.primx_ultracure_blankets_unit_price;
		// // ⬇ Blankets don't get charged shipping and don't have container limitations:
		// estimate.primx_ultracure_blankets_total_cost_estimate = estimate.primx_ultracure_blankets_total_materials_price;
		//#endregion - Imperial Ultracure Blankets calculations above. 

		// ⬇ Run the shared function to calculate PrimX flow and PrimX CPEA using the calculated design volume:
		// calculateFlowAndCpea(estimate.design_cubic_yards_total);

	} // ⬇ Metric calculations below: 
	else if (estimate.measurement_units == 'metric') {
		// ⬇ Cubic meters base:
		estimate.cubic_meters = (estimate.square_meters * estimate.thickness_millimeters / 1000);

		// ⬇ Additional thickness for thickened edges. If greater than 152.4 mm, no need for thickened edges:
		if (estimate.thickness_millimeters >= 152.4) {
			estimate.additional_thickness_millimeters = 0;
		} else {
			estimate.additional_thickness_millimeters = ((152.4 - estimate.thickness_millimeters) * .5);
		} // End if/else 

		// ⬇ Calculate perimeter thickening and construction joint thickening based on calculated additional thickness, the .0015 and .003 values below are provided by PrimX:
		estimate.perimeter_thickening_cubic_meters = estimate.thickened_edge_perimeter_lineal_meters * estimate.additional_thickness_millimeters * .0015;
		estimate.construction_joint_thickening_cubic_meters = estimate.thickened_edge_construction_joint_lineal_meters * estimate.additional_thickness_millimeters * .003;

		// ⬇ Calculate subtotal based on above results, factor in waste factor percentage, and calculate the total design cubic meters:
		estimate.cubic_meters_subtotal = estimate.cubic_meters + estimate.perimeter_thickening_cubic_meters + estimate.construction_joint_thickening_cubic_meters;
		estimate.waste_factor_cubic_meters = estimate.cubic_meters_subtotal * (estimate.waste_factor_percentage / 100);
		estimate.design_cubic_meters_total = Math.ceil(estimate.cubic_meters_subtotal + estimate.waste_factor_cubic_meters);

		//#region - ⬇⬇ Metric DC calculations below:
		// // ⬇ Calculate amounts and prices of materials that are measured in kgs and square meters:
		// estimate.primx_dc_total_project_amount = estimate.design_cubic_meters_total * estimate.primx_dc_dosage_kgs; // 40 is the factor provided by PrimX
		// // ⬇ DC comes in packages of 1250 kg, need to round up
		// estimate.primx_dc_pallets_needed = Math.ceil(estimate.primx_dc_total_project_amount / 1250);
		// // ⬇ If they have materials on hand, calculate the new values: 
		// if (estimate.materials_on_hand) {
		// 	// ⬇ Total order amount is a new amount to display: 
		// 	estimate.primx_dc_total_order_amount = estimate.primx_dc_total_project_amount - estimate.primx_dc_on_hand_kgs;
		// 	// ⬇ Validation to disallow negative numbers: 
		// 	if (estimate.primx_dc_total_order_amount < 0) {
		// 		estimate.primx_dc_total_order_amount = 0;
		// 	} // End if 
		// 	// ⬇ DC comes in packages of 1250 kg, need to round up
		// 	estimate.primx_dc_pallets_needed = Math.ceil(estimate.primx_dc_total_order_amount / 1250);
		// } // End if 
		// estimate.primx_dc_final_order_amount = estimate.primx_dc_pallets_needed * 1250;
		// estimate.primx_dc_total_materials_price = estimate.primx_dc_final_order_amount * estimate.primx_dc_unit_price;
		// // ⬇ Every shipping container can hold 14 packages of DC, need to round up:
		// estimate.primx_dc_containers_needed = Math.ceil(estimate.primx_dc_pallets_needed / 14);
		// estimate.primx_dc_calculated_shipping_estimate = estimate.primx_dc_containers_needed * estimate.primx_dc_shipping_estimate;
		// estimate.primx_dc_total_cost_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_dc_total_materials_price;
		//#endregion - Metric DC calculations above. 

		//#region - ⬇⬇ Metric Steel Fiber calculations below:
		// ⬇ Calculate values for PrimX steel fibers:
		// estimate.primx_steel_fibers_total_project_amount = estimate.design_cubic_meters_total * estimate.primx_steel_fibers_dosage_kgs;
		// // ⬇ Steel fibers comes in packages of 19200 kg, need to round up:
		// estimate.primx_steel_fibers_pallets_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 19200);
		// // ⬇ If they have materials on hand, calculate the new values: 
		// if (estimate.materials_on_hand) {
		// 	// ⬇ Total order amount is a new amount to display: 
		// 	estimate.primx_steel_fibers_total_order_amount = estimate.primx_steel_fibers_total_project_amount - estimate.primx_steel_fibers_on_hand_kgs;
		// 	// ⬇ Validation to disallow negative numbers: 
		// 	if (estimate.primx_steel_fibers_total_order_amount < 0) {
		// 		estimate.primx_steel_fibers_total_order_amount = 0;
		// 	} // End if 
		// 	// ⬇ Steel fibers comes in packages of 19200 kg, need to round up:
		// 	estimate.primx_steel_fibers_pallets_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 19200);
		// } // End if 
		// estimate.primx_steel_fibers_final_order_amount = estimate.primx_steel_fibers_pallets_needed * 19200;
		// estimate.primx_steel_fibers_total_materials_price = estimate.primx_steel_fibers_final_order_amount * estimate.primx_steel_fibers_unit_price;
		// // ⬇ Every shipping container can only hold 1 package of steel fibers:
		// estimate.primx_steel_fibers_containers_needed = estimate.primx_steel_fibers_pallets_needed;
		// estimate.primx_steel_fibers_calculated_shipping_estimate = estimate.primx_steel_fibers_containers_needed * estimate.primx_steel_fibers_shipping_estimate;
		// estimate.primx_steel_fibers_total_cost_estimate = estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_steel_fibers_total_materials_price;
		// //#endregion - Metric Steel Fibers calculations above. 

		// //#region - ⬇⬇ Metric Ultracure Blankets calculations below:
		// // ⬇ Calculate values for PrimX Ultracure Blankets:
		// estimate.primx_ultracure_blankets_total_project_amount = estimate.square_meters * 1.2; // 1.2 is the factor provided by PrimX
		// // ⬇ Blankets come in rolls of 600 square meters, need to round up:
		// estimate.primx_ultracure_blankets_pallets_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 600);
		// // ⬇ If they have materials on hand, calculate the new values: 
		// if (estimate.materials_on_hand) {
		// 	// ⬇ Total order amount is a new amount to display: 
		// 	estimate.primx_ultracure_blankets_total_order_amount = estimate.primx_ultracure_blankets_total_project_amount - estimate.primx_ultracure_blankets_on_hand_sq_m;
		// 	// ⬇ Validation to disallow negative numbers: 
		// 	if (estimate.primx_ultracure_blankets_total_order_amount < 0) {
		// 		estimate.primx_ultracure_blankets_total_order_amount = 0;
		// 	} // End if 
		// 	// ⬇ Blankets come in rolls of 600 square meters, need to round up:
		// 	estimate.primx_ultracure_blankets_pallets_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 600);
		// } // End if 
		// estimate.primx_ultracure_blankets_final_order_amount = estimate.primx_ultracure_blankets_pallets_needed * 600;
		// estimate.primx_ultracure_blankets_total_materials_price = estimate.primx_ultracure_blankets_final_order_amount * estimate.primx_ultracure_blankets_unit_price;
		// // Blankets don't get charged shipping and don't have container limitations
		// estimate.primx_ultracure_blankets_total_cost_estimate = estimate.primx_ultracure_blankets_total_materials_price;
		// //#endregion - Imperial Ultracure Blankets calculations above. 

		// // ⬇ Run the shared function to calculate PrimX flow and PrimX CPEA using the calculated design volume:
		// calculateFlowAndCpea(estimate.design_cubic_meters_total);
	} // End Imperial/Metric if/else


	// ⬇ Function for mutating the current estimate object to include calculations for PrimX Flow and CPEA, taking in the volume of the design being looked at. Works for both metric and imperial units since PrimX Flow and CPEA are measured in liters no matter what.
	// function calculateFlowAndCpea(designVolume) {
	// 	//#region - ⬇⬇ Flow calculations below:
	// 	// ⬇ Start by adding calculations data for PrimX Flow:
	// 	estimate.primx_flow_total_project_amount = designVolume * estimate.primx_flow_dosage_liters;
	// 	// ⬇ Flow comes in packages of 1000 liters, need to round up:
	// 	estimate.primx_flow_pallets_needed = Math.ceil(estimate.primx_flow_total_project_amount / 1000);
	// 	// ⬇ If they have materials on hand, calculate the new values: 
	// 	if (estimate.materials_on_hand) {
	// 		// ⬇ Total order amount is a new amount to display: 
	// 		estimate.primx_flow_total_order_amount = estimate.primx_flow_total_project_amount - estimate.primx_flow_on_hand_liters;
	// 		// ⬇ Validation to disallow negative numbers: 
	// 		if (estimate.primx_flow_total_order_amount < 0) {
	// 			estimate.primx_flow_total_order_amount = 0;
	// 		} // End if 
	// 		// ⬇ Flow comes in packages of 1000 liters, need to round up:
	// 		estimate.primx_flow_pallets_needed = Math.ceil(estimate.primx_flow_total_project_amount / 1000);
	// 	} // End if 
	// 	estimate.primx_flow_final_order_amount = estimate.primx_flow_pallets_needed * 1000;
	// 	estimate.primx_flow_total_materials_price = estimate.primx_flow_final_order_amount * estimate.primx_flow_unit_price;
	// 	// ⬇ Every shipping container can hold 10 packages of flow, need to round up:
	// 	estimate.primx_flow_containers_needed = Math.ceil(estimate.primx_flow_pallets_needed / 10);
	// 	estimate.primx_flow_calculated_shipping_estimate = estimate.primx_flow_containers_needed * estimate.primx_flow_shipping_estimate;
	// 	estimate.primx_flow_total_cost_estimate = estimate.primx_flow_calculated_shipping_estimate + estimate.primx_flow_total_materials_price;
	// 	//#endregion - Flow calculations above. 

	// 	//#region - ⬇⬇ CPEA calculations below:
	// 	// ⬇ Add calculations data for PrimX CPEA:
	// 	estimate.primx_cpea_total_project_amount = designVolume * estimate.primx_cpea_dosage_liters;
	// 	// ⬇ Cpea comes in packages of 1000 liters, need to round up:
	// 	estimate.primx_cpea_pallets_needed = Math.ceil(estimate.primx_cpea_total_project_amount / 1000);
	// 	// ⬇ If they have materials on hand, calculate the new values: 
	// 	if (estimate.materials_on_hand) {
	// 		// ⬇ Total order amount is a new amount to display: 
	// 		estimate.primx_cpea_total_order_amount = estimate.primx_cpea_total_project_amount - estimate.primx_cpea_on_hand_liters;
	// 		// ⬇ Validation to disallow negative numbers: 
	// 		if (estimate.primx_cpea_total_order_amount < 0) {
	// 			estimate.primx_cpea_total_order_amount = 0;
	// 		} // End if 
	// 		// ⬇ Cpea comes in packages of 1000 liters, need to round up:
	// 		estimate.primx_cpea_pallets_needed = Math.ceil(estimate.primx_cpea_total_project_amount / 1000);
	// 	} // End if
	// 	estimate.primx_cpea_final_order_amount = estimate.primx_cpea_pallets_needed * 1000;
	// 	estimate.primx_cpea_total_materials_price = estimate.primx_cpea_final_order_amount * estimate.primx_cpea_unit_price;
	// 	// ⬇ Every shipping container can hold 10 packages of cpea, need to round up:
	// 	estimate.primx_cpea_containers_needed = Math.ceil(estimate.primx_cpea_pallets_needed / 10);
	// 	estimate.primx_cpea_calculated_shipping_estimate = estimate.primx_cpea_containers_needed * estimate.primx_cpea_shipping_estimate;
	// 	estimate.primx_cpea_total_cost_estimate = estimate.primx_cpea_calculated_shipping_estimate + estimate.primx_cpea_total_materials_price;
	// 	//#endregion - CPEA calculations above. 
	// } // End calculateFlowAndCpea


	// // ⬇ Add in the last few shared calculated values between both types of units for pricing totals:
	// estimate.design_total_materials_price = estimate.primx_dc_total_materials_price + estimate.primx_flow_total_materials_price +
	// 	estimate.primx_steel_fibers_total_materials_price + estimate.primx_ultracure_blankets_total_materials_price + estimate.primx_cpea_total_materials_price;
	// estimate.design_total_containers = estimate.primx_dc_containers_needed + estimate.primx_steel_fibers_containers_needed +
	// 	estimate.primx_flow_containers_needed + estimate.primx_cpea_containers_needed;
	// estimate.design_total_shipping_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_flow_calculated_shipping_estimate +
	// 	estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_cpea_calculated_shipping_estimate;
	// estimate.design_total_price_estimate = estimate.design_total_shipping_estimate + estimate.design_total_materials_price;


	// // ⬇ Do the Cost Per Square Measurement calculations, Imperial:
	// estimate.primx_dc_cost_per_sq_ft = estimate.primx_dc_total_cost_estimate / estimate.square_feet;
	// estimate.primx_flow_cost_per_sq_ft = estimate.primx_flow_total_cost_estimate / estimate.square_feet
	// estimate.primx_steel_fibers_cost_per_sq_ft = estimate.primx_steel_fibers_total_cost_estimate / estimate.square_feet
	// estimate.primx_ultracure_blankets_cost_per_sq_ft = estimate.primx_ultracure_blankets_total_cost_estimate / estimate.square_feet
	// estimate.primx_cpea_cost_per_sq_ft = estimate.primx_cpea_total_cost_estimate / estimate.square_feet
	// estimate.primx_design_total_cost_per_sq_ft = estimate.design_total_price_estimate / estimate.square_feet
	// // ⬇ Do the Cost Per Square Measurement calculations, Metric:
	// estimate.primx_dc_cost_per_sq_m = estimate.primx_dc_total_cost_estimate / estimate.square_meters;
	// estimate.primx_flow_cost_per_sq_m = estimate.primx_flow_total_cost_estimate / estimate.square_meters;
	// estimate.primx_steel_fibers_cost_per_sq_m = estimate.primx_steel_fibers_total_cost_estimate / estimate.square_meters;
	// estimate.primx_ultracure_blankets_cost_per_sq_m = estimate.primx_ultracure_blankets_total_cost_estimate / estimate.square_meters;
	// estimate.primx_cpea_cost_per_sq_m = estimate.primx_cpea_total_cost_estimate / estimate.square_meters;
	// estimate.primx_design_total_cost_per_sq_m = estimate.design_total_price_estimate / estimate.square_meters;


	// ⬇ The input values can't be displayed as localeStrings, so we need to transform them into numbers first with parseFloat, save them to a unique key (_display), and then they'll be picked up in the value formatter to beautify on the DOM: 
	// estimate.primx_dc_dosage_lbs_display = parseFloat(estimate.primx_dc_dosage_lbs);
	// estimate.primx_dc_dosage_kgs_display = parseFloat(estimate.primx_dc_dosage_kgs);
	// estimate.primx_flow_dosage_liters_display = parseFloat(estimate.primx_flow_dosage_liters);
	// estimate.primx_steel_fibers_dosage_lbs_display = parseFloat(estimate.primx_steel_fibers_dosage_lbs);
	// estimate.primx_steel_fibers_dosage_kgs_display = parseFloat(estimate.primx_steel_fibers_dosage_kgs);
	// estimate.primx_cpea_dosage_liters_display = parseFloat(estimate.primx_cpea_dosage_liters);
	estimate.square_feet_display = parseFloat(estimate.square_feet);
	estimate.square_meters_display = parseFloat(estimate.square_meters);
	estimate.thickness_inches_display = parseFloat(estimate.thickness_inches);
	estimate.thickness_millimeters_display = parseFloat(estimate.thickness_millimeters);
	// estimate.primx_dc_on_hand_lbs_display = parseFloat(estimate.primx_dc_on_hand_lbs);
	// estimate.primx_dc_on_hand_kgs_display = parseFloat(estimate.primx_dc_on_hand_kgs);
	// estimate.primx_flow_on_hand_liters_display = parseFloat(estimate.primx_flow_on_hand_liters);
	// estimate.primx_steel_fibers_on_hand_lbs_display = parseFloat(estimate.primx_steel_fibers_on_hand_lbs);
	// estimate.primx_steel_fibers_on_hand_kgs_display = parseFloat(estimate.primx_steel_fibers_on_hand_kgs);
	// estimate.primx_ultracure_blankets_on_hand_sq_ft_display = parseFloat(estimate.primx_ultracure_blankets_on_hand_sq_ft);
	// estimate.primx_ultracure_blankets_on_hand_sq_m_display = parseFloat(estimate.primx_ultracure_blankets_on_hand_sq_m);
	// estimate.primx_cpea_on_hand_liters_display = parseFloat(estimate.primx_cpea_on_hand_liters);
	estimate.thickened_edge_perimeter_lineal_feet_display = parseFloat(estimate.thickened_edge_perimeter_lineal_feet);
	estimate.thickened_edge_perimeter_lineal_meters_display = parseFloat(estimate.thickened_edge_perimeter_lineal_meters);
	estimate.thickened_edge_construction_joint_lineal_feet_display = parseFloat(estimate.thickened_edge_construction_joint_lineal_feet);
	estimate.thickened_edge_construction_joint_lineal_meters_display = parseFloat(estimate.thickened_edge_construction_joint_lineal_meters);

	// ⬇ If the options object is passed in, run the useCalculateProjectCost function to calculate the project cost:
	options = {
    "products": [
        {
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "product_region_cost_id": 1,
            "region_id": 1,
            "product_self_cost": "0.4",
            "destination_country": "USA"
        },
        {
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "product_region_cost_id": 3,
            "region_id": 1,
            "product_self_cost": "0.88",
            "destination_country": "USA"
        },
        {
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "product_region_cost_id": 5,
            "region_id": 1,
            "product_self_cost": "2",
            "destination_country": "USA"
        },
        {
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "product_region_cost_id": 7,
            "region_id": 1,
            "product_self_cost": "0.89",
            "destination_country": "USA"
        },
        {
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "product_region_cost_id": 9,
            "region_id": 1,
            "product_self_cost": "1.96",
            "destination_country": "USA"
        },
        {
            "product_id": 6,
            "product_label": "PrimX UltraCure Blankets (sqft)",
            "product_region_cost_id": 11,
            "region_id": 1,
            "product_self_cost": "0.08",
            "destination_country": "USA"
        },
        {
            "product_id": 7,
            "product_label": "PrimX UltraCure Blankets (metersq)",
            "product_region_cost_id": 13,
            "region_id": 1,
            "product_self_cost": "0.86",
            "destination_country": "USA"
        },
        {
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "product_region_cost_id": 15,
            "region_id": 1,
            "product_self_cost": "3.55",
            "destination_country": "USA"
        },
        {
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "product_region_cost_id": 179,
            "region_id": 33,
            "product_self_cost": "10",
            "destination_country": "test1"
        },
        {
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "product_region_cost_id": 180,
            "region_id": 33,
            "product_self_cost": "1",
            "destination_country": "test1"
        },
        {
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "product_region_cost_id": 181,
            "region_id": 33,
            "product_self_cost": "1",
            "destination_country": "test1"
        },
        {
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "product_region_cost_id": 182,
            "region_id": 33,
            "product_self_cost": "1",
            "destination_country": "test1"
        },
        {
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "product_region_cost_id": 183,
            "region_id": 33,
            "product_self_cost": "1",
            "destination_country": "test1"
        },
        {
            "product_id": 6,
            "product_label": "PrimX UltraCure Blankets (sqft)",
            "product_region_cost_id": 184,
            "region_id": 33,
            "product_self_cost": "1",
            "destination_country": "test1"
        },
        {
            "product_id": 7,
            "product_label": "PrimX UltraCure Blankets (metersq)",
            "product_region_cost_id": 185,
            "region_id": 33,
            "product_self_cost": "1",
            "destination_country": "test1"
        },
        {
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "product_region_cost_id": 186,
            "region_id": 33,
            "product_self_cost": "1",
            "destination_country": "test1"
        },
        {
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "product_region_cost_id": 173,
            "region_id": 32,
            "product_self_cost": "1",
            "destination_country": "SA"
        },
        {
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "product_region_cost_id": 174,
            "region_id": 32,
            "product_self_cost": "1",
            "destination_country": "SA"
        },
        {
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "product_region_cost_id": 175,
            "region_id": 32,
            "product_self_cost": "1",
            "destination_country": "SA"
        },
        {
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "product_region_cost_id": 176,
            "region_id": 32,
            "product_self_cost": "1",
            "destination_country": "SA"
        },
        {
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "product_region_cost_id": 177,
            "region_id": 32,
            "product_self_cost": "1",
            "destination_country": "SA"
        },
        {
            "product_id": 7,
            "product_label": "PrimX UltraCure Blankets (metersq)",
            "product_region_cost_id": 188,
            "region_id": 32,
            "product_self_cost": "1",
            "destination_country": "SA"
        },
        {
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "product_region_cost_id": 178,
            "region_id": 32,
            "product_self_cost": "1",
            "destination_country": "SA"
        },
        {
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "product_region_cost_id": 167,
            "region_id": 31,
            "product_self_cost": "1",
            "destination_country": "IN"
        },
        {
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "product_region_cost_id": 168,
            "region_id": 31,
            "product_self_cost": "1",
            "destination_country": "IN"
        },
        {
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "product_region_cost_id": 169,
            "region_id": 31,
            "product_self_cost": "1",
            "destination_country": "IN"
        },
        {
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "product_region_cost_id": 170,
            "region_id": 31,
            "product_self_cost": "1",
            "destination_country": "IN"
        },
        {
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "product_region_cost_id": 171,
            "region_id": 31,
            "product_self_cost": "1",
            "destination_country": "IN"
        },
        {
            "product_id": 7,
            "product_label": "PrimX UltraCure Blankets (metersq)",
            "product_region_cost_id": 187,
            "region_id": 31,
            "product_self_cost": "1",
            "destination_country": "IN"
        },
        {
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "product_region_cost_id": 172,
            "region_id": 31,
            "product_self_cost": "1",
            "destination_country": "IN"
        },
        {
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "product_region_cost_id": 2,
            "region_id": 2,
            "product_self_cost": "0.4",
            "destination_country": "CAN"
        },
        {
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "product_region_cost_id": 4,
            "region_id": 2,
            "product_self_cost": "0.88",
            "destination_country": "CAN",
            "custom_duty_percentage": 0.05
        },
        {
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "product_region_cost_id": 6,
            "region_id": 2,
            "product_self_cost": "2",
            "destination_country": "CAN",
            "custom_duty_percentage": 0.05
        },
        {
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "product_region_cost_id": 8,
            "region_id": 2,
            "product_self_cost": "0.89",
            "destination_country": "CAN"
        },
        {
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "product_region_cost_id": 10,
            "region_id": 2,
            "product_self_cost": "1.96",
            "destination_country": "CAN",
            "custom_duty_percentage_75_50": 0.05,
            "custom_duty_percentage_90_60": 0.05
        },
        {
            "product_id": 6,
            "product_label": "PrimX UltraCure Blankets (sqft)",
            "product_region_cost_id": 12,
            "region_id": 2,
            "product_self_cost": "0.08",
            "destination_country": "CAN"
        },
        {
            "product_id": 7,
            "product_label": "PrimX UltraCure Blankets (metersq)",
            "product_region_cost_id": 14,
            "region_id": 2,
            "product_self_cost": "0.86",
            "destination_country": "CAN"
        },
        {
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "product_region_cost_id": 16,
            "region_id": 2,
            "product_self_cost": "3.55",
            "destination_country": "CAN",
            "custom_duty_percentage": 0.05
        }
    ],
    "shippingDestinations": [
        {
            "destination_id": 58,
            "destination_name": "test1",
            "destination_country": "test1",
            "region_id": 33,
            "destination_active": true
        },
        {
            "destination_id": 4,
            "destination_name": "California",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 5,
            "destination_name": "Colorado",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 9,
            "destination_name": "Georgia",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 12,
            "destination_name": "Indiana",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 13,
            "destination_name": "Iowa",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 53,
            "destination_name": "Kentucky",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 19,
            "destination_name": "Michigan",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 20,
            "destination_name": "Minnesota",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 27,
            "destination_name": "New Jersey",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 30,
            "destination_name": "North Carolina",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 32,
            "destination_name": "Ohio",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 35,
            "destination_name": "Pennsylvania",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 37,
            "destination_name": "South Carolina",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 39,
            "destination_name": "Tennessee",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 40,
            "destination_name": "Texas",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 46,
            "destination_name": "Wisconsin",
            "destination_country": "USA",
            "region_id": 1,
            "destination_active": true
        },
        {
            "destination_id": 57,
            "destination_name": "Joh 2",
            "destination_country": "SA",
            "region_id": 32,
            "destination_active": true
        },
        {
            "destination_id": 56,
            "destination_name": "Johannesburg",
            "destination_country": "SA",
            "region_id": 32,
            "destination_active": true
        },
        {
            "destination_id": 48,
            "destination_name": "Alberta",
            "destination_country": "CAN",
            "region_id": 2,
            "destination_active": true
        },
        {
            "destination_id": 49,
            "destination_name": "British Columbia",
            "destination_country": "CAN",
            "region_id": 2,
            "destination_active": true
        },
        {
            "destination_id": 50,
            "destination_name": "Ontario",
            "destination_country": "CAN",
            "region_id": 2,
            "destination_active": true
        }
    ],
    "currentMarkup": [
        {
            "markup_id": 1,
            "margin_applied": 0.09,
            "margin_applied_label": 9,
            "region_id": 1,
            "destination_country": "USA"
        },
        {
            "markup_id": 2,
            "margin_applied": 0.07,
            "margin_applied_label": 7,
            "region_id": 2,
            "destination_country": "CAN"
        },
        {
            "markup_id": 4,
            "margin_applied": 0.04,
            "margin_applied_label": 4,
            "region_id": 32,
            "destination_country": "SA"
        },
        {
            "markup_id": 5,
            "margin_applied": 0.06,
            "margin_applied_label": 6,
            "region_id": 33,
            "destination_country": "test1"
        },
        {
            "markup_id": 3,
            "margin_applied": 0.05,
            "margin_applied_label": 5,
            "region_id": 31,
            "destination_country": "IN"
        }
    ],
    "shippingCosts": [
        {
            "shipping_cost_id": 4,
            "destination_id": 4,
            "dc_20ft": "4050",
            "dc_40ft": "4800",
            "fibers_20ft": "10250",
            "fibers_40ft": "14300",
            "cpea_20ft": "10250",
            "cpea_40ft": "14300",
            "flow_20ft": "10250",
            "flow_40ft": "14300",
            "destination_name": "California",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 5,
            "destination_id": 5,
            "dc_20ft": "6500",
            "dc_40ft": "7800",
            "fibers_20ft": "11750",
            "fibers_40ft": "14350",
            "cpea_20ft": "11750",
            "cpea_40ft": "14350",
            "flow_20ft": "11750",
            "flow_40ft": "14350",
            "destination_name": "Colorado",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 9,
            "destination_id": 9,
            "dc_20ft": "5450",
            "dc_40ft": "6700",
            "fibers_20ft": "7850",
            "fibers_40ft": "9850",
            "cpea_20ft": "7850",
            "cpea_40ft": "9850",
            "flow_20ft": "7850",
            "flow_40ft": "9850",
            "destination_name": "Georgia",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 12,
            "destination_id": 12,
            "dc_20ft": "6600",
            "dc_40ft": "8100",
            "fibers_20ft": "10150",
            "fibers_40ft": "12050",
            "cpea_20ft": "10150",
            "cpea_40ft": "12050",
            "flow_20ft": "10150",
            "flow_40ft": "12050",
            "destination_name": "Indiana",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 13,
            "destination_id": 13,
            "dc_20ft": "6500",
            "dc_40ft": "8100",
            "fibers_20ft": "9550",
            "fibers_40ft": "11350",
            "cpea_20ft": "9550",
            "cpea_40ft": "11350",
            "flow_20ft": "9550",
            "flow_40ft": "11350",
            "destination_name": "Iowa",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 53,
            "destination_id": 53,
            "dc_20ft": "6500",
            "dc_40ft": "7900",
            "fibers_20ft": "9750",
            "fibers_40ft": "11850",
            "cpea_20ft": "9750",
            "cpea_40ft": "11850",
            "flow_20ft": "9750",
            "flow_40ft": "11850",
            "destination_name": "Kentucky",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 19,
            "destination_id": 19,
            "dc_20ft": "6100",
            "dc_40ft": "7500",
            "fibers_20ft": "9450",
            "fibers_40ft": "11150",
            "cpea_20ft": "9450",
            "cpea_40ft": "11150",
            "flow_20ft": "9450",
            "flow_40ft": "11150",
            "destination_name": "Michigan",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 20,
            "destination_id": 20,
            "dc_20ft": "6900",
            "dc_40ft": "8600",
            "fibers_20ft": "9950",
            "fibers_40ft": "11850",
            "cpea_20ft": "9950",
            "cpea_40ft": "11850",
            "flow_20ft": "9950",
            "flow_40ft": "11850",
            "destination_name": "Minnesota",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 27,
            "destination_id": 27,
            "dc_20ft": "5400",
            "dc_40ft": "6700",
            "fibers_20ft": "8000",
            "fibers_40ft": "10100",
            "cpea_20ft": "8000",
            "cpea_40ft": "10100",
            "flow_20ft": "8000",
            "flow_40ft": "10100",
            "destination_name": "New Jersey",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 30,
            "destination_id": 30,
            "dc_20ft": "7300",
            "dc_40ft": "8900",
            "fibers_20ft": "9350",
            "fibers_40ft": "11200",
            "cpea_20ft": "9350",
            "cpea_40ft": "11200",
            "flow_20ft": "9350",
            "flow_40ft": "11200",
            "destination_name": "North Carolina",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 32,
            "destination_id": 32,
            "dc_20ft": "6100",
            "dc_40ft": "7400",
            "fibers_20ft": "9400",
            "fibers_40ft": "11200",
            "cpea_20ft": "9400",
            "cpea_40ft": "11200",
            "flow_20ft": "9400",
            "flow_40ft": "11200",
            "destination_name": "Ohio",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 35,
            "destination_id": 35,
            "dc_20ft": "6500",
            "dc_40ft": "7400",
            "fibers_20ft": "8850",
            "fibers_40ft": "10850",
            "cpea_20ft": "8850",
            "cpea_40ft": "10850",
            "flow_20ft": "8850",
            "flow_40ft": "10850",
            "destination_name": "Pennsylvania",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 37,
            "destination_id": 37,
            "dc_20ft": "5450",
            "dc_40ft": "6750",
            "fibers_20ft": "7850",
            "fibers_40ft": "9850",
            "cpea_20ft": "7850",
            "cpea_40ft": "9850",
            "flow_20ft": "7850",
            "flow_40ft": "9850",
            "destination_name": "South Carolina",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 39,
            "destination_id": 39,
            "dc_20ft": "6500",
            "dc_40ft": "7900",
            "fibers_20ft": "9100",
            "fibers_40ft": "10850",
            "cpea_20ft": "9100",
            "cpea_40ft": "10850",
            "flow_20ft": "9100",
            "flow_40ft": "10850",
            "destination_name": "Tennessee",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 40,
            "destination_id": 40,
            "dc_20ft": "5850",
            "dc_40ft": "7150",
            "fibers_20ft": "8050",
            "fibers_40ft": "10300",
            "cpea_20ft": "8050",
            "cpea_40ft": "10300",
            "flow_20ft": "8050",
            "flow_40ft": "10300",
            "destination_name": "Texas",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 46,
            "destination_id": 46,
            "dc_20ft": "6500",
            "dc_40ft": "7800",
            "fibers_20ft": "8850",
            "fibers_40ft": "10850",
            "cpea_20ft": "8850",
            "cpea_40ft": "10850",
            "flow_20ft": "8850",
            "flow_40ft": "10850",
            "destination_name": "Wisconsin",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 58,
            "destination_id": 58,
            "dc_20ft": "1",
            "dc_40ft": "2",
            "fibers_20ft": "3",
            "fibers_40ft": "4",
            "cpea_20ft": "5",
            "cpea_40ft": "65",
            "flow_20ft": "6",
            "flow_40ft": "7",
            "destination_name": "test1",
            "destination_country": "test1"
        },
        {
            "shipping_cost_id": 57,
            "destination_id": 57,
            "dc_20ft": "1",
            "dc_40ft": "2",
            "fibers_20ft": "3",
            "fibers_40ft": "4",
            "cpea_20ft": "5",
            "cpea_40ft": "65",
            "flow_20ft": "6",
            "flow_40ft": "7",
            "destination_name": "Joh 2",
            "destination_country": "SA"
        },
        {
            "shipping_cost_id": 56,
            "destination_id": 56,
            "dc_20ft": "1",
            "dc_40ft": "2",
            "fibers_20ft": "3",
            "fibers_40ft": "4",
            "cpea_20ft": "5",
            "cpea_40ft": "65",
            "flow_20ft": "6",
            "flow_40ft": "7",
            "destination_name": "Johannesburg",
            "destination_country": "SA"
        },
        {
            "shipping_cost_id": 48,
            "destination_id": 48,
            "dc_20ft": "5000",
            "dc_40ft": "6900",
            "fibers_20ft": "7250",
            "fibers_40ft": "10250",
            "cpea_20ft": "7250",
            "cpea_40ft": "10250",
            "flow_20ft": "7250",
            "flow_40ft": "10250",
            "destination_name": "Alberta",
            "destination_country": "CAN"
        },
        {
            "shipping_cost_id": 49,
            "destination_id": 49,
            "dc_20ft": "2900",
            "dc_40ft": "4800",
            "fibers_20ft": "7250",
            "fibers_40ft": "10250",
            "cpea_20ft": "7250",
            "cpea_40ft": "10250",
            "flow_20ft": "7250",
            "flow_40ft": "10250",
            "destination_name": "British Columbia",
            "destination_country": "CAN"
        },
        {
            "shipping_cost_id": 50,
            "destination_id": 50,
            "dc_20ft": "7000",
            "dc_40ft": "8200",
            "fibers_20ft": "6750",
            "fibers_40ft": "9750",
            "cpea_20ft": "6750",
            "cpea_40ft": "9750",
            "flow_20ft": "6750",
            "flow_40ft": "9750",
            "destination_name": "Ontario",
            "destination_country": "CAN"
        }
    ],
    "productContainers": [
        {
            "product_container_id": 1,
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "container_length_ft": "20",
            "container_destination": "USA",
            "max_pallets_per_container": "13",
            "max_weight_of_container": "38140",
            "gross_weight_of_pallet": "2778",
            "net_weight_of_pallet": "2756"
        },
        {
            "product_container_id": 2,
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "container_length_ft": "40",
            "container_destination": "USA",
            "max_pallets_per_container": "15",
            "max_weight_of_container": "44000",
            "gross_weight_of_pallet": "2778",
            "net_weight_of_pallet": "2756"
        },
        {
            "product_container_id": 3,
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "container_length_ft": "20",
            "container_destination": "CAN",
            "max_pallets_per_container": "17",
            "max_weight_of_container": "21700",
            "gross_weight_of_pallet": "1260",
            "net_weight_of_pallet": "1250"
        },
        {
            "product_container_id": 4,
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "container_length_ft": "40",
            "container_destination": "CAN",
            "max_pallets_per_container": "18",
            "max_weight_of_container": "22680",
            "gross_weight_of_pallet": "1260",
            "net_weight_of_pallet": "1250"
        },
        {
            "product_container_id": 5,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "20",
            "container_destination": "USA",
            "max_pallets_per_container": "15",
            "max_weight_of_container": "38140",
            "gross_weight_of_pallet": "2398",
            "net_weight_of_pallet": "2266"
        },
        {
            "product_container_id": 6,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "40",
            "container_destination": "USA",
            "max_pallets_per_container": "18",
            "max_weight_of_container": "44000",
            "gross_weight_of_pallet": "2398",
            "net_weight_of_pallet": "2266"
        },
        {
            "product_container_id": 7,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "20",
            "container_destination": "CAN",
            "max_pallets_per_container": "19",
            "max_weight_of_container": "21700",
            "gross_weight_of_pallet": "1090",
            "net_weight_of_pallet": "1030"
        },
        {
            "product_container_id": 8,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "40",
            "container_destination": "CAN",
            "max_pallets_per_container": "20",
            "max_weight_of_container": "22680",
            "gross_weight_of_pallet": "1090",
            "net_weight_of_pallet": "1030"
        },
        {
            "product_container_id": 9,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "20",
            "container_destination": "USA",
            "max_pallets_per_container": "17",
            "max_weight_of_container": "38140",
            "gross_weight_of_pallet": "2156",
            "net_weight_of_pallet": "2046"
        },
        {
            "product_container_id": 10,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "40",
            "container_destination": "USA",
            "max_pallets_per_container": "20",
            "max_weight_of_container": "44000",
            "gross_weight_of_pallet": "2156",
            "net_weight_of_pallet": "2046"
        },
        {
            "product_container_id": 11,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "20",
            "container_destination": "CAN",
            "max_pallets_per_container": "22",
            "max_weight_of_container": "21700",
            "gross_weight_of_pallet": "980",
            "net_weight_of_pallet": "930"
        },
        {
            "product_container_id": 12,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "40",
            "container_destination": "CAN",
            "max_pallets_per_container": "23",
            "max_weight_of_container": "22680",
            "gross_weight_of_pallet": "980",
            "net_weight_of_pallet": "930"
        },
        {
            "product_container_id": 13,
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "container_length_ft": "20",
            "container_destination": "USA",
            "max_pallets_per_container": "15",
            "max_weight_of_container": "38140",
            "gross_weight_of_pallet": "2530",
            "net_weight_of_pallet": "2475"
        },
        {
            "product_container_id": 14,
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "container_length_ft": "40",
            "container_destination": "USA",
            "max_pallets_per_container": "17",
            "max_weight_of_container": "44000",
            "gross_weight_of_pallet": "2530",
            "net_weight_of_pallet": "2475"
        },
        {
            "product_container_id": 15,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "container_length_ft": "20",
            "container_destination": "CAN",
            "max_pallets_per_container": "18",
            "max_weight_of_container": "21700",
            "gross_weight_of_pallet": "1150",
            "net_weight_of_pallet": "1125"
        },
        {
            "product_container_id": 16,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "container_length_ft": "40",
            "container_destination": "CAN",
            "max_pallets_per_container": "19",
            "max_weight_of_container": "22680",
            "gross_weight_of_pallet": "1150",
            "net_weight_of_pallet": "1125"
        },
        {
            "product_container_id": 34,
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "container_length_ft": "20",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 35,
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "container_length_ft": "40",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 36,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "20",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 37,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "40",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 38,
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "container_length_ft": "20",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 39,
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "container_length_ft": "40",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 40,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "20",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "11",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 41,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "40",
            "container_destination": "IN",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 42,
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "container_length_ft": "20",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 43,
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "container_length_ft": "40",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 44,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "20",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 45,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "40",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 46,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "container_length_ft": "20",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 47,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "container_length_ft": "40",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 48,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "20",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 49,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "40",
            "container_destination": "SA",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 50,
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "container_length_ft": "20",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 51,
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "container_length_ft": "40",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 52,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "20",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "11",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 53,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "container_length_ft": "40",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 54,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "container_length_ft": "20",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 55,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "container_length_ft": "40",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 56,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "20",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        },
        {
            "product_container_id": 57,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "container_length_ft": "40",
            "container_destination": "test1",
            "max_pallets_per_container": "1",
            "max_weight_of_container": "1",
            "gross_weight_of_pallet": "1",
            "net_weight_of_pallet": "1"
        }
    ],
    "dosageRates": [
        {
            "dosage_rate_id": 1,
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "lbs_y3": "68",
            "kg_m3": null
        },
        {
            "dosage_rate_id": 2,
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "lbs_y3": null,
            "kg_m3": "40",
            "dosage_rate": "40"
        },
        {
            "dosage_rate_id": 3,
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "lbs_y3": "60",
            "kg_m3": null
        },
        {
            "dosage_rate_id": 4,
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "lbs_y3": "68",
            "kg_m3": null
        },
        {
            "dosage_rate_id": 5,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "lbs_y3": null,
            "kg_m3": "35",
            "dosage_rate": "35"
        },
        {
            "dosage_rate_id": 6,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "lbs_y3": null,
            "kg_m3": "40",
            "dosage_rate": "40"
        },
        {
            "dosage_rate_id": 7,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "lbs_y3": "3.2",
            "kg_m3": "4.2",
            "dosage_rate": "4.2"
        },
        {
            "dosage_rate_id": 8,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "lbs_y3": "3.1",
            "kg_m3": "4.1",
            "dosage_rate": "4.1"
        }
    ],
    "customsDuties": [
        {
            "custom_duty_id": 5,
            "duty_label": "Geotextile",
            "region_id": 1,
            "destination_country": "USA",
            "customs_duties_regions_id": 5,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 6,
            "duty_label": "PrimX CPEA",
            "region_id": 1,
            "destination_country": "USA",
            "customs_duties_regions_id": 6,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 1,
            "duty_label": "PrimX DC",
            "region_id": 1,
            "destination_country": "USA",
            "customs_duties_regions_id": 1,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 2,
            "duty_label": "PrimX Flow",
            "region_id": 1,
            "destination_country": "USA",
            "customs_duties_regions_id": 2,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 3,
            "duty_label": "Steel Fibers (75/50)",
            "region_id": 1,
            "destination_country": "USA",
            "customs_duties_regions_id": 3,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 4,
            "duty_label": "Steel Fibers (90/60)",
            "region_id": 1,
            "destination_country": "USA",
            "customs_duties_regions_id": 4,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 5,
            "duty_label": "Geotextile",
            "region_id": 33,
            "destination_country": "test1",
            "customs_duties_regions_id": 179,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 6,
            "duty_label": "PrimX CPEA",
            "region_id": 33,
            "destination_country": "test1",
            "customs_duties_regions_id": 180,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 1,
            "duty_label": "PrimX DC",
            "region_id": 33,
            "destination_country": "test1",
            "customs_duties_regions_id": 175,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 2,
            "duty_label": "PrimX Flow",
            "region_id": 33,
            "destination_country": "test1",
            "customs_duties_regions_id": 176,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 3,
            "duty_label": "Steel Fibers (75/50)",
            "region_id": 33,
            "destination_country": "test1",
            "customs_duties_regions_id": 177,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 4,
            "duty_label": "Steel Fibers (90/60)",
            "region_id": 33,
            "destination_country": "test1",
            "customs_duties_regions_id": 178,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 5,
            "duty_label": "Geotextile",
            "region_id": 32,
            "destination_country": "SA",
            "customs_duties_regions_id": 173,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 6,
            "duty_label": "PrimX CPEA",
            "region_id": 32,
            "destination_country": "SA",
            "customs_duties_regions_id": 174,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 1,
            "duty_label": "PrimX DC",
            "region_id": 32,
            "destination_country": "SA",
            "customs_duties_regions_id": 169,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 2,
            "duty_label": "PrimX Flow",
            "region_id": 32,
            "destination_country": "SA",
            "customs_duties_regions_id": 170,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 3,
            "duty_label": "Steel Fibers (75/50)",
            "region_id": 32,
            "destination_country": "SA",
            "customs_duties_regions_id": 171,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 4,
            "duty_label": "Steel Fibers (90/60)",
            "region_id": 32,
            "destination_country": "SA",
            "customs_duties_regions_id": 172,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 5,
            "duty_label": "Geotextile",
            "region_id": 31,
            "destination_country": "IN",
            "customs_duties_regions_id": 167,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 6,
            "duty_label": "PrimX CPEA",
            "region_id": 31,
            "destination_country": "IN",
            "customs_duties_regions_id": 168,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 1,
            "duty_label": "PrimX DC",
            "region_id": 31,
            "destination_country": "IN",
            "customs_duties_regions_id": 163,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 2,
            "duty_label": "PrimX Flow",
            "region_id": 31,
            "destination_country": "IN",
            "customs_duties_regions_id": 164,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 3,
            "duty_label": "Steel Fibers (75/50)",
            "region_id": 31,
            "destination_country": "IN",
            "customs_duties_regions_id": 165,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 4,
            "duty_label": "Steel Fibers (90/60)",
            "region_id": 31,
            "destination_country": "IN",
            "customs_duties_regions_id": 166,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 5,
            "duty_label": "Geotextile",
            "region_id": 2,
            "destination_country": "CAN",
            "customs_duties_regions_id": 11,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 6,
            "duty_label": "PrimX CPEA",
            "region_id": 2,
            "destination_country": "CAN",
            "customs_duties_regions_id": 12,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 1,
            "duty_label": "PrimX DC",
            "region_id": 2,
            "destination_country": "CAN",
            "customs_duties_regions_id": 7,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 2,
            "duty_label": "PrimX Flow",
            "region_id": 2,
            "destination_country": "CAN",
            "customs_duties_regions_id": 8,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 3,
            "duty_label": "Steel Fibers (75/50)",
            "region_id": 2,
            "destination_country": "CAN",
            "customs_duties_regions_id": 9,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        },
        {
            "custom_duty_id": 4,
            "duty_label": "Steel Fibers (90/60)",
            "region_id": 2,
            "destination_country": "CAN",
            "customs_duties_regions_id": 10,
            "duty_percentage": 0.05,
            "duty_percentage_label": 5
        }
    ]
}
	console.log(`Ryan Here: \n `, {options} );
	if (options) useCalculateProjectCost(estimate, options);
	estimate.price_per_unit_75_50_display = estimate.price_per_unit_75_50;
	estimate.price_per_unit_90_60_display = estimate.price_per_unit_90_60;
	estimate.total_project_cost_75_50_display = estimate.total_project_cost_75_50;
	estimate.total_project_cost_90_60_display = estimate.total_project_cost_90_60;

	// ⬇ Before returning the estimate object, do any necessary rounding on given numbers to match the needs of the various grid displays.  Loop over all key/value pairs in the mutated estimate object, doing rounding based on shared key names:
	for (let property in estimate) {
		// ⬇ Run each value through our formatter hook to return a pretty number: 
		useValueFormatter(property, estimate);
	} // End for loop





	return estimate;
}

