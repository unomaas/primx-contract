// custom hook to take in an estimate object and return a mutated object with new keys based on the necessary math needed for all the displays
export default function useEstimateCalculations(estimate) {
    // begin adding keys to the estimate, first by adding in keys specific to the unit of measurement that's being worked with
    
    // imperial calculalations
    if (estimate.measurement_units == 'imperial') {
        

        // cubic yards base
        estimate.cubic_yards = Math.ceil( (estimate.square_feet * estimate.thickness_inches / 324) ); // round up on cubic yardages
        // additional thickness for thickened edges
        if (estimate.thickness_inches >= 6) { // if greater than 6 inches, no need for thickened edges
            estimate.additional_thickness_inches = 0;
        } else { 
            estimate.additional_thickness_inches = ((6 - estimate.thickness_inches) * .5).toFixed(2); // round to 2 decimals for additional thickness
        }
        // calculate perimeter thickening and construction joint thickening based on calculated additional thickness inches
        estimate.perimeter_thickening_cubic_yards = Math.ceil((estimate.thickened_edge_perimeter_lineal_feet * 5) * (estimate.additional_thickness_inches / 324) );
        estimate.construction_joint_thickening_cubic_yards = Math.ceil((estimate.thickened_edge_construction_joint_lineal_feet * 5) * (estimate.additional_thickness_inches / 324) );
        estimate.cubic_yards_subtotal = estimate.cubic_yards + estimate.perimeter_thickening_cubic_yards + estimate.construction_joint_thickening_cubic_yards;
        estimate.waste_factor_cubic_yards = Math.ceil( estimate.cubic_yards_subtotal * .05 );


    }


    
    
    return estimate;
}

