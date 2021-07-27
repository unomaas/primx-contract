// custom hook to take in an estimate object and return a mutated object with new keys based on the necessary math needed for all the displays
export default function useEstimateCalculations(estimate) {
    // start by running a loop on the entire object and removing dollar signs and commas from all money quantities from database
    for (let property in estimate) {
        // save the value of property being looped over
        let value = estimate[property]
        // if the value is a string and has a '$' in it, it came from a money column in the DB
        if (typeof(value) == 'string' && value.includes('$')) {
            // Remove all nonessential characters from DB fields with the "Money" data type and convert them into numbers for math later
            // I found this RegEx solution at 'https://jsfiddle.net/jinglesthula/hdzTy/'
            estimate[property] = Number(value.replace(/[^0-9\.-]+/g,""));         
        }
    }

    // begin adding keys to the estimate, first by adding in keys specific to the unit of measurement that's being worked with
    
    // imperial calculalations
    if (estimate.measurement_units == 'imperial') {
        
        // cubic yards base: original formula for cubic yards divided quantity first by 12, then by 27
        estimate.cubic_yards = (estimate.square_feet * estimate.thickness_inches / 324) ; // round up on cubic yardages
        // additional thickness for thickened edges
        if (estimate.thickness_inches >= 6) { // if greater than 6 inches, no need for thickened edges
            estimate.additional_thickness_inches = 0;
        } else { 
            estimate.additional_thickness_inches = ( (6 - estimate.thickness_inches) * .5); // round to 2 decimals for additional thickness
        }
        // calculate perimeter thickening and construction joint thickening based on calculated additional thickness inches, the 5 and 10 values below are provided by PrimX
        estimate.perimeter_thickening_cubic_yards = (estimate.thickened_edge_perimeter_lineal_feet * 5) * (estimate.additional_thickness_inches / 324);
        estimate.construction_joint_thickening_cubic_yards = (estimate.thickened_edge_construction_joint_lineal_feet * 10) * (estimate.additional_thickness_inches / 324);
        // calculate subtotal based on above results, factor in waste factor percentage, and calculate the total design cubic yards
        estimate.cubic_yards_subtotal = estimate.cubic_yards + estimate.perimeter_thickening_cubic_yards + estimate.construction_joint_thickening_cubic_yards;
        estimate.waste_factor_cubic_yards = estimate.cubic_yards_subtotal * .05;
        estimate.design_cubic_yards_total = estimate.cubic_yards_subtotal + estimate.waste_factor_cubic_yards;
        
        // calculate amounts and prices of materials that are measured in pounds and square feet, start with DC
        estimate.primx_dc_total_amount_needed = estimate.design_cubic_yards_total * 67; // 67 is the factor provided by PrimX
        estimate.primx_dc_packages_needed = Math.ceil(estimate.primx_dc_total_amount_needed / 2756); // dc comes in packages of 2756 lbs, need to round up
        estimate.primx_dc_total_order_quantity = estimate.primx_dc_packages_needed * 2756;
        estimate.primx_dc_total_materials_price = estimate.primx_dc_total_order_quantity * estimate.primx_dc_unit_price;
        // Every shipping container can hold 14 packages of DC, need to round up
        estimate.primx_dc_containers_needed = Math.ceil(estimate.primx_dc_packages_needed / 14);
        estimate.primx_dc_calculated_shipping_estimate = estimate.primx_dc_containers_needed * estimate.primx_dc_shipping_estimate;
        estimate.primx_dc_total_cost_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_dc_total_materials_price;
        

        
        // calculate values for PrimX steel fibers
        estimate.primx_steel_fibers_total_amount_needed = estimate.design_cubic_yards_total * estimate.primx_steel_fibers_dosage_lbs;
        // steel fibers comes in packages of 42329 lbs, need to round up
        estimate.primx_steel_fibers_packages_needed = Math.ceil(estimate.primx_steel_fibers_total_amount_needed / 42329);
        estimate.primx_steel_fibers_total_order_quantity = estimate.primx_steel_fibers_packages_needed * 42329;
        estimate.primx_steel_fibers_total_materials_price = estimate.primx_steel_fibers_total_order_quantity * estimate.primx_steel_fibers_unit_price;
        // Every shipping container can only hold 1 package of steel fibers
        estimate.primx_steel_fibers_containers_needed = estimate.primx_steel_fibers_packages_needed;
        estimate.primx_steel_fibers_calculated_shipping_estimate = estimate.primx_steel_fibers_containers_needed * estimate.primx_steel_fibers_shipping_estimate;
        estimate.primx_steel_fibers_total_cost_estimate = estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_steel_fibers_total_materials_price;

    }


    
    
    return estimate;
}

