import useValueFormatter from "./useValueFormatter";
import useCalculateProjectCost from "./useCalculateProjectCost";
import { estimateDummyOptions } from '../utils/dummyData';

// ⬇ Custom hook to take in an estimate object and return a mutated object with new keys based on the necessary math needed for all the displays:
export default function useEstimateCalculations(estimate, options = null) {

	// ⬇ Remove the Time Stamps first: 
	estimate.date_created = estimate.date_created.split('T')[0];
	estimate.anticipated_first_pour_date = estimate.anticipated_first_pour_date.split('T')[0];

	if (!estimate.total_project_volume) {
		// ⬇ Set a default value for waste factor percentage if one wasn't entered:
		if (!estimate.waste_factor_percentage) {
			estimate.waste_factor_percentage = 3;
		}; // End if 

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
		} // End Imperial/Metric if/else

		estimate.square_feet_display = parseFloat(estimate.square_feet);
		estimate.square_meters_display = parseFloat(estimate.square_meters);
		estimate.thickness_inches_display = parseFloat(estimate.thickness_inches);
		estimate.thickness_millimeters_display = parseFloat(estimate.thickness_millimeters);

		estimate.thickened_edge_perimeter_lineal_feet_display = parseFloat(estimate.thickened_edge_perimeter_lineal_feet);
		estimate.thickened_edge_perimeter_lineal_meters_display = parseFloat(estimate.thickened_edge_perimeter_lineal_meters);
		estimate.thickened_edge_construction_joint_lineal_feet_display = parseFloat(estimate.thickened_edge_construction_joint_lineal_feet);
		estimate.thickened_edge_construction_joint_lineal_meters_display = parseFloat(estimate.thickened_edge_construction_joint_lineal_meters);
	}

	// ⬇ If the options object is passed in, run the useCalculateProjectCost function to calculate the project cost:
	// if (estimateDummyOptions) useCalculateProjectCost(estimate, estimateDummyOptions);
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

