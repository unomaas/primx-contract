import useValueFormatter from "./useValueFormatter";
import useCalculateProjectCost from "./useCalculateProjectCost";

// ⬇ Custom hook to take in an estimate object and return a mutated object with new keys based on the necessary math needed for all the displays:
export default function useEstimateCalculations(estimate, options = null) {

	console.log(`Ryan Here : useEstimateCalculations\n`, { estimate, options});

	// ⬇ Remove the Time Stamps first: 
	estimate.date_created = estimate.date_created.split('T')[0];
	estimate.anticipated_first_pour_date = estimate.anticipated_first_pour_date.split('T')[0];

	// ⬇ Setup for Materials On Hand. If false, make sure the values are zero:
	if (!estimate.materials_on_hand) {
		estimate.primx_dc_on_hand_lbs = 0;
		estimate.primx_dc_on_hand_kgs = 0;
		estimate.primx_flow_on_hand_liters = 0;
		estimate.primx_steel_fibers_on_hand_lbs = 0;
		estimate.primx_steel_fibers_on_hand_kgs = 0;
		estimate.primx_ultracure_blankets_on_hand_sq_ft = 0;
		estimate.primx_ultracure_blankets_on_hand_sq_m = 0;
		estimate.primx_cpea_on_hand_liters = 0;
	}; // End if


	// ⬇ Set a default value for waste factor percentage if one wasn't entered:
	if (!estimate.waste_factor_percentage) {
		estimate.waste_factor_percentage = 5;
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
	// ⬇ Start by running a loop on the entire object and removing dollar signs and commas from all money quantities from database:p
	for (let property in estimate) {
		// ⬇ Save the value of property being looped over:
		let value = estimate[property]
		// ⬇ If the value is a string and has a '$' in it, it came from a money column in the DB:
		if (typeof (value) == 'string' && value.includes('$')) {
			// ⬇ Remove all nonessential characters from DB fields with the "Money" data type and convert them into numbers for math later.  I found this RegEx solution at 'https://jsfiddle.net/jinglesthula/hdzTy/'
			estimate[property] = Number(value.replace(/[^0-9\.-]+/g, ""));
		}; // End if 
	}; // End if 


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
		estimate.primx_dc_total_project_amount = estimate.design_cubic_yards_total * estimate.primx_dc_dosage_lbs; // 67 is the factor provided by PrimX
		// ⬇ Dc comes in packages of 2756 lbs, need to round up:
		estimate.primx_dc_packages_needed = Math.ceil(estimate.primx_dc_total_project_amount / 2756);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_dc_total_order_amount = estimate.primx_dc_total_project_amount - estimate.primx_dc_on_hand_lbs;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_dc_total_order_amount < 0) {
				estimate.primx_dc_total_order_amount = 0;
			} // End if 
			// ⬇ Dc comes in packages of 2756 lbs, need to round up:
			estimate.primx_dc_packages_needed = Math.ceil(estimate.primx_dc_total_order_amount / 2756);
		} // End if
		estimate.primx_dc_final_order_amount = estimate.primx_dc_packages_needed * 2756;
		estimate.primx_dc_total_materials_price = estimate.primx_dc_final_order_amount * estimate.primx_dc_unit_price;
		// ⬇ Every shipping container can hold 14 packages of DC, need to round up:
		estimate.primx_dc_containers_needed = Math.ceil(estimate.primx_dc_packages_needed / 14);
		estimate.primx_dc_calculated_shipping_estimate = estimate.primx_dc_containers_needed * estimate.primx_dc_shipping_estimate;
		estimate.primx_dc_total_cost_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_dc_total_materials_price;
		//#endregion - Imperial DC calculations above. 

		//#region - ⬇⬇ Imperial Steel Fiber calculations below:
		// ⬇ Calculate amounts and prices of materials that are measured in pounds and square feet:
		estimate.primx_steel_fibers_total_project_amount = estimate.design_cubic_yards_total * estimate.primx_steel_fibers_dosage_lbs;
		// ⬇ Steel fibers comes in packages of 42329 lbs, need to round up:
		estimate.primx_steel_fibers_packages_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 42329);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_steel_fibers_total_order_amount = estimate.primx_steel_fibers_total_project_amount - estimate.primx_steel_fibers_on_hand_lbs;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_steel_fibers_total_order_amount < 0) {
				estimate.primx_steel_fibers_total_order_amount = 0;
			} // End if 
			// ⬇ Steel fibers comes in packages of 42329 lbs, need to round up:
			estimate.primx_steel_fibers_packages_needed = Math.ceil(estimate.primx_steel_fibers_total_order_amount / 42329);
		} // End if
		estimate.primx_steel_fibers_final_order_amount = estimate.primx_steel_fibers_packages_needed * 42329;
		estimate.primx_steel_fibers_total_materials_price = estimate.primx_steel_fibers_final_order_amount * estimate.primx_steel_fibers_unit_price;
		// ⬇ Every shipping container can only hold 1 package of steel fibers:
		estimate.primx_steel_fibers_containers_needed = estimate.primx_steel_fibers_packages_needed;
		estimate.primx_steel_fibers_calculated_shipping_estimate = estimate.primx_steel_fibers_containers_needed * estimate.primx_steel_fibers_shipping_estimate;
		estimate.primx_steel_fibers_total_cost_estimate = estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_steel_fibers_total_materials_price;
		//#endregion - Imperial Steel Fibers calculations above. 

		//#region - ⬇⬇ Imperial Ultracure Blankets calculations below:
		// ⬇ Calculate values for PrimX Ultracure Blankets:
		estimate.primx_ultracure_blankets_total_project_amount = estimate.square_feet * 1.2; // 1.2 is the factor provided by PrimX
		// ⬇ Blankets come in rolls of 6458 sq feet, need to round up:
		estimate.primx_ultracure_blankets_packages_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 6458);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_ultracure_blankets_total_order_amount = estimate.primx_ultracure_blankets_total_project_amount - estimate.primx_ultracure_blankets_on_hand_sq_ft;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_ultracure_blankets_total_order_amount < 0) {
				estimate.primx_ultracure_blankets_total_order_amount = 0;
			} // End if 
			// ⬇ Blankets come in rolls of 6458 sq feet, need to round up:
			estimate.primx_ultracure_blankets_packages_needed = Math.ceil(estimate.primx_ultracure_blankets_total_order_amount / 6458);
		} // End if
		estimate.primx_ultracure_blankets_final_order_amount = estimate.primx_ultracure_blankets_packages_needed * 6458;
		estimate.primx_ultracure_blankets_total_materials_price = estimate.primx_ultracure_blankets_final_order_amount * estimate.primx_ultracure_blankets_unit_price;
		// ⬇ Blankets don't get charged shipping and don't have container limitations:
		estimate.primx_ultracure_blankets_total_cost_estimate = estimate.primx_ultracure_blankets_total_materials_price;
		//#endregion - Imperial Ultracure Blankets calculations above. 

		// ⬇ Run the shared function to calculate PrimX flow and PrimX CPEA using the calculated design volume:
		calculateFlowAndCpea(estimate.design_cubic_yards_total);

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
		// ⬇ Calculate amounts and prices of materials that are measured in kgs and square meters:
		estimate.primx_dc_total_project_amount = estimate.design_cubic_meters_total * estimate.primx_dc_dosage_kgs; // 40 is the factor provided by PrimX
		// ⬇ DC comes in packages of 1250 kg, need to round up
		estimate.primx_dc_packages_needed = Math.ceil(estimate.primx_dc_total_project_amount / 1250);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_dc_total_order_amount = estimate.primx_dc_total_project_amount - estimate.primx_dc_on_hand_kgs;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_dc_total_order_amount < 0) {
				estimate.primx_dc_total_order_amount = 0;
			} // End if 
			// ⬇ DC comes in packages of 1250 kg, need to round up
			estimate.primx_dc_packages_needed = Math.ceil(estimate.primx_dc_total_order_amount / 1250);
		} // End if 
		estimate.primx_dc_final_order_amount = estimate.primx_dc_packages_needed * 1250;
		estimate.primx_dc_total_materials_price = estimate.primx_dc_final_order_amount * estimate.primx_dc_unit_price;
		// ⬇ Every shipping container can hold 14 packages of DC, need to round up:
		estimate.primx_dc_containers_needed = Math.ceil(estimate.primx_dc_packages_needed / 14);
		estimate.primx_dc_calculated_shipping_estimate = estimate.primx_dc_containers_needed * estimate.primx_dc_shipping_estimate;
		estimate.primx_dc_total_cost_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_dc_total_materials_price;
		//#endregion - Metric DC calculations above. 

		//#region - ⬇⬇ Metric Steel Fiber calculations below:
		// ⬇ Calculate values for PrimX steel fibers:
		estimate.primx_steel_fibers_total_project_amount = estimate.design_cubic_meters_total * estimate.primx_steel_fibers_dosage_kgs;
		// ⬇ Steel fibers comes in packages of 19200 kg, need to round up:
		estimate.primx_steel_fibers_packages_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 19200);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_steel_fibers_total_order_amount = estimate.primx_steel_fibers_total_project_amount - estimate.primx_steel_fibers_on_hand_kgs;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_steel_fibers_total_order_amount < 0) {
				estimate.primx_steel_fibers_total_order_amount = 0;
			} // End if 
			// ⬇ Steel fibers comes in packages of 19200 kg, need to round up:
			estimate.primx_steel_fibers_packages_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount / 19200);
		} // End if 
		estimate.primx_steel_fibers_final_order_amount = estimate.primx_steel_fibers_packages_needed * 19200;
		estimate.primx_steel_fibers_total_materials_price = estimate.primx_steel_fibers_final_order_amount * estimate.primx_steel_fibers_unit_price;
		// ⬇ Every shipping container can only hold 1 package of steel fibers:
		estimate.primx_steel_fibers_containers_needed = estimate.primx_steel_fibers_packages_needed;
		estimate.primx_steel_fibers_calculated_shipping_estimate = estimate.primx_steel_fibers_containers_needed * estimate.primx_steel_fibers_shipping_estimate;
		estimate.primx_steel_fibers_total_cost_estimate = estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_steel_fibers_total_materials_price;
		//#endregion - Metric Steel Fibers calculations above. 

		//#region - ⬇⬇ Metric Ultracure Blankets calculations below:
		// ⬇ Calculate values for PrimX Ultracure Blankets:
		estimate.primx_ultracure_blankets_total_project_amount = estimate.square_meters * 1.2; // 1.2 is the factor provided by PrimX
		// ⬇ Blankets come in rolls of 600 square meters, need to round up:
		estimate.primx_ultracure_blankets_packages_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 600);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_ultracure_blankets_total_order_amount = estimate.primx_ultracure_blankets_total_project_amount - estimate.primx_ultracure_blankets_on_hand_sq_m;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_ultracure_blankets_total_order_amount < 0) {
				estimate.primx_ultracure_blankets_total_order_amount = 0;
			} // End if 
			// ⬇ Blankets come in rolls of 600 square meters, need to round up:
			estimate.primx_ultracure_blankets_packages_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 600);
		} // End if 
		estimate.primx_ultracure_blankets_final_order_amount = estimate.primx_ultracure_blankets_packages_needed * 600;
		estimate.primx_ultracure_blankets_total_materials_price = estimate.primx_ultracure_blankets_final_order_amount * estimate.primx_ultracure_blankets_unit_price;
		// Blankets don't get charged shipping and don't have container limitations
		estimate.primx_ultracure_blankets_total_cost_estimate = estimate.primx_ultracure_blankets_total_materials_price;
		//#endregion - Imperial Ultracure Blankets calculations above. 

		// ⬇ Run the shared function to calculate PrimX flow and PrimX CPEA using the calculated design volume:
		calculateFlowAndCpea(estimate.design_cubic_meters_total);
	} // End Imperial/Metric if/else


	// ⬇ Function for mutating the current estimate object to include calculations for PrimX Flow and CPEA, taking in the volume of the design being looked at. Works for both metric and imperial units since PrimX Flow and CPEA are measured in liters no matter what.
	function calculateFlowAndCpea(designVolume) {
		//#region - ⬇⬇ Flow calculations below:
		// ⬇ Start by adding calculations data for PrimX Flow:
		estimate.primx_flow_total_project_amount = designVolume * estimate.primx_flow_dosage_liters;
		// ⬇ Flow comes in packages of 1000 liters, need to round up:
		estimate.primx_flow_packages_needed = Math.ceil(estimate.primx_flow_total_project_amount / 1000);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_flow_total_order_amount = estimate.primx_flow_total_project_amount - estimate.primx_flow_on_hand_liters;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_flow_total_order_amount < 0) {
				estimate.primx_flow_total_order_amount = 0;
			} // End if 
			// ⬇ Flow comes in packages of 1000 liters, need to round up:
			estimate.primx_flow_packages_needed = Math.ceil(estimate.primx_flow_total_project_amount / 1000);
		} // End if 
		estimate.primx_flow_final_order_amount = estimate.primx_flow_packages_needed * 1000;
		estimate.primx_flow_total_materials_price = estimate.primx_flow_final_order_amount * estimate.primx_flow_unit_price;
		// ⬇ Every shipping container can hold 10 packages of flow, need to round up:
		estimate.primx_flow_containers_needed = Math.ceil(estimate.primx_flow_packages_needed / 10);
		estimate.primx_flow_calculated_shipping_estimate = estimate.primx_flow_containers_needed * estimate.primx_flow_shipping_estimate;
		estimate.primx_flow_total_cost_estimate = estimate.primx_flow_calculated_shipping_estimate + estimate.primx_flow_total_materials_price;
		//#endregion - Flow calculations above. 

		//#region - ⬇⬇ CPEA calculations below:
		// ⬇ Add calculations data for PrimX CPEA:
		estimate.primx_cpea_total_project_amount = designVolume * estimate.primx_cpea_dosage_liters;
		// ⬇ Cpea comes in packages of 1000 liters, need to round up:
		estimate.primx_cpea_packages_needed = Math.ceil(estimate.primx_cpea_total_project_amount / 1000);
		// ⬇ If they have materials on hand, calculate the new values: 
		if (estimate.materials_on_hand) {
			// ⬇ Total order amount is a new amount to display: 
			estimate.primx_cpea_total_order_amount = estimate.primx_cpea_total_project_amount - estimate.primx_cpea_on_hand_liters;
			// ⬇ Validation to disallow negative numbers: 
			if (estimate.primx_cpea_total_order_amount < 0) {
				estimate.primx_cpea_total_order_amount = 0;
			} // End if 
			// ⬇ Cpea comes in packages of 1000 liters, need to round up:
			estimate.primx_cpea_packages_needed = Math.ceil(estimate.primx_cpea_total_project_amount / 1000);
		} // End if
		estimate.primx_cpea_final_order_amount = estimate.primx_cpea_packages_needed * 1000;
		estimate.primx_cpea_total_materials_price = estimate.primx_cpea_final_order_amount * estimate.primx_cpea_unit_price;
		// ⬇ Every shipping container can hold 10 packages of cpea, need to round up:
		estimate.primx_cpea_containers_needed = Math.ceil(estimate.primx_cpea_packages_needed / 10);
		estimate.primx_cpea_calculated_shipping_estimate = estimate.primx_cpea_containers_needed * estimate.primx_cpea_shipping_estimate;
		estimate.primx_cpea_total_cost_estimate = estimate.primx_cpea_calculated_shipping_estimate + estimate.primx_cpea_total_materials_price;
		//#endregion - CPEA calculations above. 
	} // End calculateFlowAndCpea


	// ⬇ Add in the last few shared calculated values between both types of units for pricing totals:
	estimate.design_total_materials_price = estimate.primx_dc_total_materials_price + estimate.primx_flow_total_materials_price +
		estimate.primx_steel_fibers_total_materials_price + estimate.primx_ultracure_blankets_total_materials_price + estimate.primx_cpea_total_materials_price;
	estimate.design_total_containers = estimate.primx_dc_containers_needed + estimate.primx_steel_fibers_containers_needed +
		estimate.primx_flow_containers_needed + estimate.primx_cpea_containers_needed;
	estimate.design_total_shipping_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_flow_calculated_shipping_estimate +
		estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_cpea_calculated_shipping_estimate;
	estimate.design_total_price_estimate = estimate.design_total_shipping_estimate + estimate.design_total_materials_price;


	// ⬇ Do the Cost Per Square Measurement calculations, Imperial:
	estimate.primx_dc_cost_per_sq_ft = estimate.primx_dc_total_cost_estimate / estimate.square_feet;
	estimate.primx_flow_cost_per_sq_ft = estimate.primx_flow_total_cost_estimate / estimate.square_feet
	estimate.primx_steel_fibers_cost_per_sq_ft = estimate.primx_steel_fibers_total_cost_estimate / estimate.square_feet
	estimate.primx_ultracure_blankets_cost_per_sq_ft = estimate.primx_ultracure_blankets_total_cost_estimate / estimate.square_feet
	estimate.primx_cpea_cost_per_sq_ft = estimate.primx_cpea_total_cost_estimate / estimate.square_feet
	estimate.primx_design_total_cost_per_sq_ft = estimate.design_total_price_estimate / estimate.square_feet
	// ⬇ Do the Cost Per Square Measurement calculations, Metric:
	estimate.primx_dc_cost_per_sq_m = estimate.primx_dc_total_cost_estimate / estimate.square_meters;
	estimate.primx_flow_cost_per_sq_m = estimate.primx_flow_total_cost_estimate / estimate.square_meters;
	estimate.primx_steel_fibers_cost_per_sq_m = estimate.primx_steel_fibers_total_cost_estimate / estimate.square_meters;
	estimate.primx_ultracure_blankets_cost_per_sq_m = estimate.primx_ultracure_blankets_total_cost_estimate / estimate.square_meters;
	estimate.primx_cpea_cost_per_sq_m = estimate.primx_cpea_total_cost_estimate / estimate.square_meters;
	estimate.primx_design_total_cost_per_sq_m = estimate.design_total_price_estimate / estimate.square_meters;


	// ⬇ The input values can't be displayed as localeStrings, so we need to transform them into numbers first with parseFloat, save them to a unique key (_display), and then they'll be picked up in the value formatter to beautify on the DOM: 
	estimate.primx_dc_dosage_lbs_display = parseFloat(estimate.primx_dc_dosage_lbs);
	estimate.primx_dc_dosage_kgs_display = parseFloat(estimate.primx_dc_dosage_kgs);
	estimate.primx_flow_dosage_liters_display = parseFloat(estimate.primx_flow_dosage_liters);
	estimate.primx_steel_fibers_dosage_lbs_display = parseFloat(estimate.primx_steel_fibers_dosage_lbs);
	estimate.primx_steel_fibers_dosage_kgs_display = parseFloat(estimate.primx_steel_fibers_dosage_kgs);
	estimate.primx_cpea_dosage_liters_display = parseFloat(estimate.primx_cpea_dosage_liters);
	estimate.square_feet_display = parseFloat(estimate.square_feet);
	estimate.square_meters_display = parseFloat(estimate.square_meters);
	estimate.thickness_inches_display = parseFloat(estimate.thickness_inches);
	estimate.thickness_millimeters_display = parseFloat(estimate.thickness_millimeters);
	estimate.primx_dc_on_hand_lbs_display = parseFloat(estimate.primx_dc_on_hand_lbs);
	estimate.primx_dc_on_hand_kgs_display = parseFloat(estimate.primx_dc_on_hand_kgs);
	estimate.primx_flow_on_hand_liters_display = parseFloat(estimate.primx_flow_on_hand_liters);
	estimate.primx_steel_fibers_on_hand_lbs_display = parseFloat(estimate.primx_steel_fibers_on_hand_lbs);
	estimate.primx_steel_fibers_on_hand_kgs_display = parseFloat(estimate.primx_steel_fibers_on_hand_kgs);
	estimate.primx_ultracure_blankets_on_hand_sq_ft_display = parseFloat(estimate.primx_ultracure_blankets_on_hand_sq_ft);
	estimate.primx_ultracure_blankets_on_hand_sq_m_display = parseFloat(estimate.primx_ultracure_blankets_on_hand_sq_m);
	estimate.primx_cpea_on_hand_liters_display = parseFloat(estimate.primx_cpea_on_hand_liters);
	estimate.thickened_edge_perimeter_lineal_feet_display = parseFloat(estimate.thickened_edge_perimeter_lineal_feet);
	estimate.thickened_edge_perimeter_lineal_meters_display = parseFloat(estimate.thickened_edge_perimeter_lineal_meters);
	estimate.thickened_edge_construction_joint_lineal_feet_display = parseFloat(estimate.thickened_edge_construction_joint_lineal_feet);
	estimate.thickened_edge_construction_joint_lineal_meters_display = parseFloat(estimate.thickened_edge_construction_joint_lineal_meters);

	// ⬇ If the options object is passed in, run the useCalculateProjectCost function to calculate the project cost:
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

