import useValueFormatter from "./useValueFormatter";
import useCalculateProjectCost from "./useCalculateProjectCost";

// ⬇ Custom hook to take in an estimate object and return a mutated object with new keys based on the necessary math needed for all the displays:
export default function useEstimateCalculations(estimate, options = null) {

	// ⬇ Remove the Time Stamps first: 
	estimate.date_created = estimate.date_created.split('T')[0];
	estimate.anticipated_first_pour_date = estimate.anticipated_first_pour_date.split('T')[0];

	// ⬇ Set a default value for waste factor percentage if one wasn't entered:
	if (!estimate.waste_factor_percentage) {
		estimate.waste_factor_percentage = 5;
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

	// ⬇ If the options object is passed in, run the useCalculateProjectCost function to calculate the project cost:
	options = {
    "products": [
        {
            "product_id": 1,
            "product_label": "PrimX DC (lbs)",
            "product_key": "dc_lbs",
            "product_self_cost": "0.1434"
        },
        {
            "product_id": 2,
            "product_label": "PrimX DC (kgs)",
            "product_key": "dc_kgs",
            "product_self_cost": "0.3162"
        },
        {
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "product_key": "flow_liters",
            "product_self_cost": "1.2378"
        },
        {
            "product_id": 4,
            "product_label": "PrimX Steel Fibers (lbs)",
            "product_key": "steel_fibers_lbs",
            "product_self_cost": "0.5231"
        },
        {
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "product_key": "steel_fibers_kgs",
            "product_self_cost": "1.1531"
        },
        {
            "product_id": 6,
            "product_label": "PrimX UltraCure Blankets (sqft)",
            "product_key": "blankets_sqft",
            "product_self_cost": "0.0345"
        },
        {
            "product_id": 7,
            "product_label": "PrimX UltraCure Blankets (metersq)",
            "product_key": "blankets_sqmeters",
            "product_self_cost": "0.3716"
        },
        {
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "product_key": "cpea_liters",
            "product_self_cost": "5.1256"
        }
    ],
    "shippingDestinations": [
        {
            "destination_id": 2,
            "destination_name": "Arizona",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 4,
            "destination_name": "California",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 5,
            "destination_name": "Colorado",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 8,
            "destination_name": "Florida",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 9,
            "destination_name": "Georgia",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 11,
            "destination_name": "Illinois",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 12,
            "destination_name": "Indiana",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 13,
            "destination_name": "Iowa",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 14,
            "destination_name": "Kansas",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 53,
            "destination_name": "Kentucky",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 19,
            "destination_name": "Michigan",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 20,
            "destination_name": "Minnesota",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 22,
            "destination_name": "Missouri",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 24,
            "destination_name": "Nebraska",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 27,
            "destination_name": "New Jersey",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 30,
            "destination_name": "North Carolina",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 32,
            "destination_name": "Ohio",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 33,
            "destination_name": "Oklahoma",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 35,
            "destination_name": "Pennsylvania",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 37,
            "destination_name": "South Carolina",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 39,
            "destination_name": "Tennessee",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 40,
            "destination_name": "Texas",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 41,
            "destination_name": "Utah",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 45,
            "destination_name": "West Virginia",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 46,
            "destination_name": "Wisconsin",
            "destination_country": "USA",
            "destination_active": true
        },
        {
            "destination_id": 48,
            "destination_name": "Alberta",
            "destination_country": "CAN",
            "destination_active": true
        },
        {
            "destination_id": 49,
            "destination_name": "British Columbia",
            "destination_country": "CAN",
            "destination_active": true
        },
        {
            "destination_id": 50,
            "destination_name": "Ontario",
            "destination_country": "CAN",
            "destination_active": true
        }
    ],
    "currentMarkup": [
        {
            "markup_id": 1,
            "margin_applied": 0.455,
            "margin_applied_label": 45.5
        }
    ],
    "shippingCosts": [
        {
            "shipping_cost_id": 2,
            "destination_id": 2,
            "dc_20ft": "5725",
            "dc_40ft": "6725",
            "fibers_20ft": "8567",
            "fibers_40ft": "8625",
            "cpea_20ft": "8567",
            "cpea_40ft": "8625",
            "flow_20ft": "8567",
            "flow_40ft": "8625",
            "destination_name": "Arizona",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 4,
            "destination_id": 4,
            "dc_20ft": "3800",
            "dc_40ft": "4200",
            "fibers_20ft": "4750",
            "fibers_40ft": "5250",
            "cpea_20ft": "4750",
            "cpea_40ft": "5250",
            "flow_20ft": "4750",
            "flow_40ft": "5250",
            "destination_name": "California",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 5,
            "destination_id": 5,
            "dc_20ft": "6100",
            "dc_40ft": "7100",
            "fibers_20ft": "5750",
            "fibers_40ft": "6750",
            "cpea_20ft": "5750",
            "cpea_40ft": "6750",
            "flow_20ft": "5750",
            "flow_40ft": "6750",
            "destination_name": "Colorado",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 8,
            "destination_id": 8,
            "dc_20ft": "4400",
            "dc_40ft": "5100",
            "fibers_20ft": "4450",
            "fibers_40ft": "4750",
            "cpea_20ft": "4450",
            "cpea_40ft": "4750",
            "flow_20ft": "4450",
            "flow_40ft": "4750",
            "destination_name": "Florida",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 9,
            "destination_id": 9,
            "dc_20ft": "4600",
            "dc_40ft": "5400",
            "fibers_20ft": "4250",
            "fibers_40ft": "4850",
            "cpea_20ft": "4250",
            "cpea_40ft": "4850",
            "flow_20ft": "4250",
            "flow_40ft": "4850",
            "destination_name": "Georgia",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 11,
            "destination_id": 11,
            "dc_20ft": "5200",
            "dc_40ft": "6000",
            "fibers_20ft": "4750",
            "fibers_40ft": "5750",
            "cpea_20ft": "4750",
            "cpea_40ft": "5750",
            "flow_20ft": "4750",
            "flow_40ft": "5750",
            "destination_name": "Illinois",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 12,
            "destination_id": 12,
            "dc_20ft": "5900",
            "dc_40ft": "7000",
            "fibers_20ft": "4750",
            "fibers_40ft": "5750",
            "cpea_20ft": "4750",
            "cpea_40ft": "5750",
            "flow_20ft": "4750",
            "flow_40ft": "5750",
            "destination_name": "Indiana",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 13,
            "destination_id": 13,
            "dc_20ft": "6000",
            "dc_40ft": "7000",
            "fibers_20ft": "4750",
            "fibers_40ft": "5750",
            "cpea_20ft": "4750",
            "cpea_40ft": "5750",
            "flow_20ft": "4750",
            "flow_40ft": "5750",
            "destination_name": "Iowa",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 14,
            "destination_id": 14,
            "dc_20ft": "5500",
            "dc_40ft": "6500",
            "fibers_20ft": "5250",
            "fibers_40ft": "6250",
            "cpea_20ft": "5250",
            "cpea_40ft": "6250",
            "flow_20ft": "5250",
            "flow_40ft": "6250",
            "destination_name": "Kansas",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 53,
            "destination_id": 53,
            "dc_20ft": "5800",
            "dc_40ft": "7000",
            "fibers_20ft": "4750",
            "fibers_40ft": "5750",
            "cpea_20ft": "4750",
            "cpea_40ft": "5750",
            "flow_20ft": "4750",
            "flow_40ft": "5750",
            "destination_name": "Kentucky",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 19,
            "destination_id": 19,
            "dc_20ft": "5700",
            "dc_40ft": "6600",
            "fibers_20ft": "5250",
            "fibers_40ft": "5550",
            "cpea_20ft": "5250",
            "cpea_40ft": "5550",
            "flow_20ft": "5250",
            "flow_40ft": "5550",
            "destination_name": "Michigan",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 20,
            "destination_id": 20,
            "dc_20ft": "6200",
            "dc_40ft": "7100",
            "fibers_20ft": "5250",
            "fibers_40ft": "5550",
            "cpea_20ft": "5250",
            "cpea_40ft": "5550",
            "flow_20ft": "5250",
            "flow_40ft": "5550",
            "destination_name": "Minnesota",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 22,
            "destination_id": 22,
            "dc_20ft": "5450",
            "dc_40ft": "6450",
            "fibers_20ft": "5420",
            "fibers_40ft": "5468",
            "cpea_20ft": "5420",
            "cpea_40ft": "5468",
            "flow_20ft": "5420",
            "flow_40ft": "5468",
            "destination_name": "Missouri",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 24,
            "destination_id": 24,
            "dc_20ft": "5500",
            "dc_40ft": "6500",
            "fibers_20ft": "7250",
            "fibers_40ft": "8250",
            "cpea_20ft": "7250",
            "cpea_40ft": "8250",
            "flow_20ft": "7250",
            "flow_40ft": "8250",
            "destination_name": "Nebraska",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 27,
            "destination_id": 27,
            "dc_20ft": "4500",
            "dc_40ft": "5300",
            "fibers_20ft": "4450",
            "fibers_40ft": "4750",
            "cpea_20ft": "4450",
            "cpea_40ft": "4750",
            "flow_20ft": "4450",
            "flow_40ft": "4750",
            "destination_name": "New Jersey",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 30,
            "destination_id": 30,
            "dc_20ft": "5000",
            "dc_40ft": "5400",
            "fibers_20ft": "4750",
            "fibers_40ft": "5750",
            "cpea_20ft": "4750",
            "cpea_40ft": "5750",
            "flow_20ft": "4750",
            "flow_40ft": "5750",
            "destination_name": "North Carolina",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 32,
            "destination_id": 32,
            "dc_20ft": "5500",
            "dc_40ft": "6400",
            "fibers_20ft": "4750",
            "fibers_40ft": "5750",
            "cpea_20ft": "4750",
            "cpea_40ft": "5750",
            "flow_20ft": "4750",
            "flow_40ft": "5750",
            "destination_name": "Ohio",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 33,
            "destination_id": 33,
            "dc_20ft": "5355",
            "dc_40ft": "6355",
            "fibers_20ft": "6505",
            "fibers_40ft": "6525",
            "cpea_20ft": "6505",
            "cpea_40ft": "6525",
            "flow_20ft": "6505",
            "flow_40ft": "6525",
            "destination_name": "Oklahoma",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 35,
            "destination_id": 35,
            "dc_20ft": "5000",
            "dc_40ft": "6000",
            "fibers_20ft": "4250",
            "fibers_40ft": "5250",
            "cpea_20ft": "4250",
            "cpea_40ft": "5250",
            "flow_20ft": "4250",
            "flow_40ft": "5250",
            "destination_name": "Pennsylvania",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 37,
            "destination_id": 37,
            "dc_20ft": "4600",
            "dc_40ft": "5400",
            "fibers_20ft": "4450",
            "fibers_40ft": "4850",
            "cpea_20ft": "4450",
            "cpea_40ft": "4850",
            "flow_20ft": "4450",
            "flow_40ft": "4850",
            "destination_name": "South Carolina",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 39,
            "destination_id": 39,
            "dc_20ft": "5000",
            "dc_40ft": "6000",
            "fibers_20ft": "5750",
            "fibers_40ft": "6750",
            "cpea_20ft": "5750",
            "cpea_40ft": "6750",
            "flow_20ft": "5750",
            "flow_40ft": "6750",
            "destination_name": "Tennessee",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 40,
            "destination_id": 40,
            "dc_20ft": "4600",
            "dc_40ft": "5500",
            "fibers_20ft": "4750",
            "fibers_40ft": "5650",
            "cpea_20ft": "4750",
            "cpea_40ft": "5650",
            "flow_20ft": "4750",
            "flow_40ft": "5650",
            "destination_name": "Texas",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 41,
            "destination_id": 41,
            "dc_20ft": "4965",
            "dc_40ft": "5965",
            "fibers_20ft": "6765",
            "fibers_40ft": "7535",
            "cpea_20ft": "6765",
            "cpea_40ft": "7535",
            "flow_20ft": "6765",
            "flow_40ft": "7535",
            "destination_name": "Utah",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 45,
            "destination_id": 45,
            "dc_20ft": "5500",
            "dc_40ft": "6500",
            "fibers_20ft": "5250",
            "fibers_40ft": "6250",
            "cpea_20ft": "5250",
            "cpea_40ft": "6250",
            "flow_20ft": "5250",
            "flow_40ft": "6250",
            "destination_name": "West Virginia",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 46,
            "destination_id": 46,
            "dc_20ft": "5500",
            "dc_40ft": "6500",
            "fibers_20ft": "5750",
            "fibers_40ft": "6250",
            "cpea_20ft": "5750",
            "cpea_40ft": "6250",
            "flow_20ft": "5750",
            "flow_40ft": "6250",
            "destination_name": "Wisconsin",
            "destination_country": "USA"
        },
        {
            "shipping_cost_id": 48,
            "destination_id": 48,
            "dc_20ft": "3500",
            "dc_40ft": "4200",
            "fibers_20ft": "5250",
            "fibers_40ft": "6250",
            "cpea_20ft": "5250",
            "cpea_40ft": "6250",
            "flow_20ft": "5250",
            "flow_40ft": "6250",
            "destination_name": "Alberta",
            "destination_country": "CAN"
        },
        {
            "shipping_cost_id": 49,
            "destination_id": 49,
            "dc_20ft": "3000",
            "dc_40ft": "3700",
            "fibers_20ft": "5250",
            "fibers_40ft": "6250",
            "cpea_20ft": "5250",
            "cpea_40ft": "6250",
            "flow_20ft": "5250",
            "flow_40ft": "6250",
            "destination_name": "British Columbia",
            "destination_country": "CAN"
        },
        {
            "shipping_cost_id": 50,
            "destination_id": 50,
            "dc_20ft": "5000",
            "dc_40ft": "6000",
            "fibers_20ft": "4250",
            "fibers_40ft": "5250",
            "cpea_20ft": "4250",
            "cpea_40ft": "5250",
            "flow_20ft": "4250",
            "flow_40ft": "5250",
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
            "net_weight_of_pallet": "2271"
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
            "net_weight_of_pallet": "2271"
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
            "kg_m3": "40"
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
            "kg_m3": "35"
        },
        {
            "dosage_rate_id": 6,
            "product_id": 5,
            "product_label": "PrimX Steel Fibers (kgs)",
            "lbs_y3": null,
            "kg_m3": "40"
        },
        {
            "dosage_rate_id": 7,
            "product_id": 3,
            "product_label": "PrimX Flow (liters)",
            "lbs_y3": "3.2",
            "kg_m3": "4.2"
        },
        {
            "dosage_rate_id": 8,
            "product_id": 8,
            "product_label": "PrimX CPEA (liters)",
            "lbs_y3": "3.1",
            "kg_m3": "4.04"
        }
    ],
    "customsDuties": [
        {
            "custom_duty_id": 1,
            "duty_label": "PrimX DC",
            "duty_key": "primx_dc",
            "usa_percent": 0.3,
            "can_percent": 0.05,
            "usa_percent_label": 30,
            "can_percent_label": 5
        },
        {
            "custom_duty_id": 2,
            "duty_label": "PrimX Flow",
            "duty_key": "primx_flow",
            "usa_percent": 0.05,
            "can_percent": 0.05,
            "usa_percent_label": 5,
            "can_percent_label": 5
        },
        {
            "custom_duty_id": 3,
            "duty_label": "Steel Fibers (75/50)",
            "duty_key": "steel_fibers_75_50",
            "usa_percent": 0.039,
            "can_percent": 0.05,
            "usa_percent_label": 3.9,
            "can_percent_label": 5
        },
        {
            "custom_duty_id": 4,
            "duty_label": "Steel Fibers (90/60)",
            "duty_key": "steel_fibers_90_60",
            "usa_percent": 0.039,
            "can_percent": 0.05,
            "usa_percent_label": 3.9,
            "can_percent_label": 5
        },
        {
            "custom_duty_id": 5,
            "duty_label": "Geotextile",
            "duty_key": "geotextile",
            "usa_percent": 0,
            "can_percent": 0.05,
            "usa_percent_label": 0,
            "can_percent_label": 5
        },
        {
            "custom_duty_id": 6,
            "duty_label": "PrimX CPEA",
            "duty_key": "primx_cpea",
            "usa_percent": 0.05,
            "can_percent": 0.05,
            "usa_percent_label": 5,
            "can_percent_label": 5
        }
    ]
}
	console.log(`Ryan Here: useEstimateCalculations \n `, {options} );
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

