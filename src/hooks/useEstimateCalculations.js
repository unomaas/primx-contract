// custom hook to take in an estimate object and return a mutated object with new keys based on the necessary math needed for all the displays
export default function useEstimateCalculations(estimate) {
    // start by running a loop on the entire object and removing dollar signs and commas from all money quantities from database
    for (let property in estimate) {
        // save the value of property being looped over
        let value = estimate[property]
        // if the value is a string and has a '$' in it, it came from a money column in the DB
        if (typeof (value) == 'string' && value.includes('$')) {
            // Remove all nonessential characters from DB fields with the "Money" data type and convert them into numbers for math later
            // I found this RegEx solution at 'https://jsfiddle.net/jinglesthula/hdzTy/'
            estimate[property] = Number(value.replace(/[^0-9\.-]+/g, ""));
        }
    }

    // begin adding keys to the estimate, first by adding in keys specific to the unit of measurement that's being worked with

    // imperial calculalations
    if (estimate.measurement_units == 'imperial') {

        // cubic yards base: original formula for cubic yards divided quantity first by 12, then by 27
        estimate.cubic_yards = (estimate.square_feet * estimate.thickness_inches / 324);
        // additional thickness for thickened edges
        if (estimate.thickness_inches >= 6) { // if greater than 6 inches, no need for thickened edges
            estimate.additional_thickness_inches = 0;
        } else {
            estimate.additional_thickness_inches = ((6 - estimate.thickness_inches) * .5);
        }
        // calculate perimeter thickening and construction joint thickening based on calculated additional thickness, the 5 and 10 values below are provided by PrimX
        estimate.perimeter_thickening_cubic_yards = (estimate.thickened_edge_perimeter_lineal_feet * 5) * (estimate.additional_thickness_inches / 324);
        estimate.construction_joint_thickening_cubic_yards = (estimate.thickened_edge_construction_joint_lineal_feet * 10) * (estimate.additional_thickness_inches / 324);
        // calculate subtotal based on above results, factor in waste factor percentage, and calculate the total design cubic yards
        estimate.cubic_yards_subtotal = estimate.cubic_yards + estimate.perimeter_thickening_cubic_yards + estimate.construction_joint_thickening_cubic_yards;
        estimate.waste_factor_cubic_yards = estimate.cubic_yards_subtotal * (estimate.waste_factor_percentage / 100);
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

        // calculate values for PrimX Ultracure Blankets
        estimate.primx_ultracure_blankets_total_amount_needed = estimate.square_feet * 1.2; // 1.2 is the factor provided by PrimX
        // blankets come in rolls of 6458 sq feet, need to round up
        estimate.primx_ultracure_blankets_packages_needed = Math.ceil(estimate.primx_ultracure_blankets_total_amount_needed / 6458);
        estimate.primx_ultracure_blankets_total_order_quantity = estimate.primx_ultracure_blankets_packages_needed * 6458;
        estimate.primx_ultracure_blankets_total_materials_price = estimate.primx_ultracure_blankets_total_order_quantity * estimate.primx_ultracure_blankets_unit_price;
        // Blankets don't get charged shipping and don't have container limitations
        estimate.primx_ultracure_blankets_total_cost_estimate = estimate.primx_ultracure_blankets_total_materials_price;

        // run the shared function to calculate PrimX flow and PrimX CPEA using the calculated design volume 
        calculateFlowAndCpea(estimate.design_cubic_yards_total);
    }

    // metric calculalations
    else if (estimate.measurement_units == 'metric') {

        // cubic meters base
        estimate.cubic_meters = (estimate.square_meters * estimate.thickness_millimeters / 1000);
        // additional thickness for thickened edges
        if (estimate.thickness_millimeters >= 152.4) { // if greater than 152.4 mm, no need for thickened edges
            estimate.additional_thickness_millimeters = 0;
        } else {
            estimate.additional_thickness_millimeters = ((152.4 - estimate.thickness_millimeters) * .5);
        }
        // calculate perimeter thickening and construction joint thickening based on calculated additional thickness, the .0015 and .003 values below are provided by PrimX
        estimate.perimeter_thickening_cubic_meters = estimate.thickened_edge_perimeter_lineal_meters * estimate.additional_thickness_millimeters * .0015;
        estimate.construction_joint_thickening_cubic_meters = estimate.thickened_edge_construction_joint_lineal_meters * estimate.additional_thickness_millimeters * .003;
        // calculate subtotal based on above results, factor in waste factor percentage, and calculate the total design cubic meters
        estimate.cubic_meters_subtotal = estimate.cubic_meters + estimate.perimeter_thickening_cubic_meters + estimate.construction_joint_thickening_cubic_meters;
        estimate.waste_factor_cubic_meters = estimate.cubic_meters_subtotal * (estimate.waste_factor_percentage / 100);
        estimate.design_cubic_meters_total = estimate.cubic_meters_subtotal + estimate.waste_factor_cubic_meters;

        // calculate amounts and prices of materials that are measured in kgs and square meters, start with DC
        estimate.primx_dc_total_amount_needed = estimate.design_cubic_meters_total * 40; // 40 is the factor provided by PrimX
        estimate.primx_dc_packages_needed = Math.ceil(estimate.primx_dc_total_amount_needed / 1250); // dc comes in packages of 1250 kg, need to round up
        estimate.primx_dc_total_order_quantity = estimate.primx_dc_packages_needed * 1250;
        estimate.primx_dc_total_materials_price = estimate.primx_dc_total_order_quantity * estimate.primx_dc_unit_price;
        // Every shipping container can hold 14 packages of DC, need to round up
        estimate.primx_dc_containers_needed = Math.ceil(estimate.primx_dc_packages_needed / 14);
        estimate.primx_dc_calculated_shipping_estimate = estimate.primx_dc_containers_needed * estimate.primx_dc_shipping_estimate;
        estimate.primx_dc_total_cost_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_dc_total_materials_price;

        // calculate values for PrimX steel fibers
        estimate.primx_steel_fibers_total_amount_needed = estimate.design_cubic_meters_total * estimate.primx_steel_fibers_dosage_kgs;
        // steel fibers comes in packages of 19200 kg, need to round up
        estimate.primx_steel_fibers_packages_needed = Math.ceil(estimate.primx_steel_fibers_total_amount_needed / 19200);
        estimate.primx_steel_fibers_total_order_quantity = estimate.primx_steel_fibers_packages_needed * 19200;
        estimate.primx_steel_fibers_total_materials_price = estimate.primx_steel_fibers_total_order_quantity * estimate.primx_steel_fibers_unit_price;
        // Every shipping container can only hold 1 package of steel fibers
        estimate.primx_steel_fibers_containers_needed = estimate.primx_steel_fibers_packages_needed;
        estimate.primx_steel_fibers_calculated_shipping_estimate = estimate.primx_steel_fibers_containers_needed * estimate.primx_steel_fibers_shipping_estimate;
        estimate.primx_steel_fibers_total_cost_estimate = estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_steel_fibers_total_materials_price;

        // calculate values for PrimX Ultracure Blankets
        estimate.primx_ultracure_blankets_total_amount_needed = estimate.square_meters * 1.2; // 1.2 is the factor provided by PrimX
        // blankets come in rolls of 600 square meters, need to round up
        estimate.primx_ultracure_blankets_packages_needed = Math.ceil(estimate.primx_ultracure_blankets_total_amount_needed / 600);
        estimate.primx_ultracure_blankets_total_order_quantity = estimate.primx_ultracure_blankets_packages_needed * 600;
        estimate.primx_ultracure_blankets_total_materials_price = estimate.primx_ultracure_blankets_total_order_quantity * estimate.primx_ultracure_blankets_unit_price;
        // Blankets don't get charged shipping and don't have container limitations
        estimate.primx_ultracure_blankets_total_cost_estimate = estimate.primx_ultracure_blankets_total_materials_price;

        // run the shared function to calculate PrimX flow and PrimX CPEA using the calculated design volume 
        calculateFlowAndCpea(estimate.design_cubic_meters_total);
    }


    // function for mutating the current estimate object to include calculations for PrimX Flow and CPEA, taking in the volume of the design being looked
    // at. Works for both metric and imperial units
    function calculateFlowAndCpea(designVolume) {
        // start by adding calculations data for PrimX Flow
        estimate.primx_flow_total_amount_needed = designVolume * estimate.primx_flow_dosage_liters; // Dosage liters is input by licensee
        // flow comes in packages of 1000 liters, need to round up
        estimate.primx_flow_packages_needed = Math.ceil(estimate.primx_flow_total_amount_needed / 1000);
        estimate.primx_flow_total_order_quantity = estimate.primx_flow_packages_needed * 1000;
        estimate.primx_flow_total_materials_price = estimate.primx_flow_total_order_quantity * estimate.primx_flow_unit_price;
        // Every shipping container can hold 10 packages of flow, need to round up
        estimate.primx_flow_containers_needed = Math.ceil(estimate.primx_flow_packages_needed / 10);
        estimate.primx_flow_calculated_shipping_estimate = estimate.primx_flow_containers_needed * estimate.primx_flow_shipping_estimate;
        estimate.primx_flow_total_cost_estimate = estimate.primx_flow_calculated_shipping_estimate + estimate.primx_flow_total_materials_price;


        // add calculations data for PrimX CPEA
        estimate.primx_cpea_total_amount_needed = designVolume * estimate.primx_cpea_dosage_liters; // Dosage liters is input by licensee
        // cpea comes in packages of 1000 liters, need to round up
        estimate.primx_cpea_packages_needed = Math.ceil(estimate.primx_cpea_total_amount_needed / 1000);
        estimate.primx_cpea_total_order_quantity = estimate.primx_cpea_packages_needed * 1000;
        estimate.primx_cpea_total_materials_price = estimate.primx_cpea_total_order_quantity * estimate.primx_cpea_unit_price;
        // Every shipping container can hold 10 packages of cpea, need to round up
        estimate.primx_cpea_containers_needed = Math.ceil(estimate.primx_cpea_packages_needed / 10);
        estimate.primx_cpea_calculated_shipping_estimate = estimate.primx_cpea_containers_needed * estimate.primx_cpea_shipping_estimate;
        estimate.primx_cpea_total_cost_estimate = estimate.primx_cpea_calculated_shipping_estimate + estimate.primx_cpea_total_materials_price;
    }

    // add in the last few shared calculated values between both types of units
    // total price and 
    estimate.design_total_materials_price = estimate.primx_dc_total_materials_price + estimate.primx_flow_total_materials_price +
        estimate.primx_steel_fibers_total_materials_price + estimate.primx_ultracure_blankets_total_materials_price + estimate.primx_cpea_total_materials_price;

    estimate.design_total_shipping_estimate = estimate.primx_dc_calculated_shipping_estimate + estimate.primx_flow_calculated_shipping_estimate +
        estimate.primx_steel_fibers_calculated_shipping_estimate + estimate.primx_cpea_calculated_shipping_estimate;

    estimate.design_total_price_estimate = estimate.design_total_shipping_estimate + estimate.design_total_materials_price;

    return estimate;
}

