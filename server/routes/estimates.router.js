const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
	rejectUnauthenticated,
	rejectNonAdmin,
} = require('../modules/authentication-middleware');
const format = require('pg-format');
const {
	v4: uuidv4
} = require('uuid');
const axios = require('axios');


// *************************** GET ROUTES ***************************

// GET request to grab estimate at ID/Estimate number for Lookup view
router.get('/lookup/:estimate', (req, res) => {
	const { estimateNumber, licenseeId } = req.query;

	// SQL query to GET a specific estimate along the floor type names, licensee names, placement type names, and shipping state/province names
	const queryText = `
    SELECT 
			e.*, 
			e.total_number_of_20ft_containers::int,
			e.total_number_of_40ft_containers::int,
			e.total_number_of_pallets::int,
			CASE
				WHEN e.measurement_units = 'imperial' THEN 'cubic yards'
				WHEN e.measurement_units = 'metric' THEN 'cubic meters'
			END AS measurement_units_label,
			ft.floor_type_label, 
			l.licensee_contractor_name, 
			pt.placement_type_label, 
			sd.destination_name,
			r.region_code AS destination_country
		FROM "estimates" AS e
    JOIN "floor_types" AS ft
			ON e.floor_type_id = ft.floor_type_id
    JOIN "licensees" AS l
			ON e.licensee_id = l.licensee_id
    JOIN "placement_types" AS pt
			ON e.placement_type_id = pt.placement_type_id
    JOIN "shipping_destinations" AS sd
			ON e.destination_id = sd.destination_id
		JOIN regions as r 
			ON r.region_id = sd.region_id
    WHERE e.estimate_number = $1 AND l.licensee_id = $2;
	`;
	// ORDER BY e.estimate_id DESC;
	pool.query(queryText, [estimateNumber, licenseeId])
		.then(result => {
			res.send(result.rows);
		})
		.catch(error => {
			console.error(`Error with /api/estimates/lookup/:estimates GET`, error)
			res.sendStatus(500)
		})
})

// GET request to get all estimates data from the database
router.get('/all', rejectNonAdmin, (req, res) => {

	let whereClause = '';

	if (req.user.is_region_admin) {
		const regionIds = req.user.region_ids.map(id => format('%L', id)).join(', ');
		whereClause = `WHERE r.region_id IN (${regionIds})`;
	}

	// SQL query to GET all estimates along the floor type names, licensee names, placement type names, and shipping state/province names
	const queryText = `
		SELECT
			e.*,
			e.total_number_of_20ft_containers::int,
			e.total_number_of_40ft_containers::int,
			e.total_number_of_pallets::int,
			CASE
				WHEN e.measurement_units = 'imperial' THEN 'cubic yards'
				WHEN e.measurement_units = 'metric' THEN 'cubic meters'
			END AS measurement_units_label,
			ft.floor_type_label,
			l.licensee_contractor_name,
			pt.placement_type_label,
			sd.destination_name,
			r.region_id,
			r.region_code AS destination_country
		FROM estimates AS e
		JOIN floor_types AS ft
			ON e.floor_type_id = ft.floor_type_id
		JOIN licensees AS l
			ON e.licensee_id = l.licensee_id
		JOIN placement_types AS pt
			ON e.placement_type_id = pt.placement_type_id
		JOIN shipping_destinations AS sd
			ON e.destination_id = sd.destination_id
		LEFT JOIN users AS u
			ON e.processed_by = u.user_id
		JOIN regions as r	
			ON r.region_id = sd.region_id	
		${whereClause}
		ORDER BY e.estimate_id DESC;
	`;

	pool.query(queryText)
		.then((result) => res.send(result.rows))
		.catch(error => {
			console.error('Error with /api/estimates/all GET: ', error);
			res.sendStatus(500);
		})

})


// *************************** POST ROUTES ***************************



router.post('/add-new-estimate', async (req, res) => {
	// set the values sent from licensee by destructuring req.body
	const {
		// ⬇ General Info: 
		project_name,
		licensee_id,
		project_general_contractor,
		project_manager_name,
		project_manager_email,
		project_manager_phone,
		floor_type_id,
		placement_type_id,
		measurement_units,
		// date_created,
		anticipated_first_pour_date,
		ship_to_address,
		ship_to_city,
		destination_id,
		zip_postal_code,
		waste_factor_percentage,
		materials_excluded,

		// ⬇ Materials On Hand Shared:
		materials_on_hand,
		primx_flow_on_hand_liters,
		primx_cpea_on_hand_liters,

		// ⬇ Combined Estimate Numbers:
		estimate_number_combined_1,
		estimate_number_combined_2,
		estimate_number_combined_3,
		estimate_number_combined_1_sf_dosage,
		estimate_number_combined_2_sf_dosage,
		estimate_number_combined_3_sf_dosage,

		// ⬇ Final Cost Numbers:
		price_per_unit_75_50,
		price_per_unit_90_60,
		total_project_cost_75_50,
		total_project_cost_90_60,

		// ⬇ Container/Pallet Info:
		total_number_of_pallets,
		total_number_of_20ft_containers,
		total_number_of_40ft_containers,

		total_project_volume,
		// ⬇ Imperial: 
		// square_feet,
		// thickness_inches,
		// thickened_edge_perimeter_lineal_feet,
		// thickened_edge_construction_joint_lineal_feet,
		// primx_dc_on_hand_lbs,
		// primx_steel_fibers_on_hand_lbs,
		// primx_ultracure_blankets_on_hand_sq_ft,

		// ⬇ Metric:
		// square_meters,
		// thickness_millimeters,
		// thickened_edge_perimeter_lineal_meters,
		// thickened_edge_construction_joint_lineal_meters,
		// primx_dc_on_hand_kgs,
		// primx_steel_fibers_on_hand_kgs,
		// primx_ultracure_blankets_on_hand_sq_m,
	} = req.body;

	// start the query text with shared values
	let sql = `
    INSERT INTO "estimates" (
			project_name,
			licensee_id,
			project_general_contractor,
			project_manager_name,
			project_manager_email,
			project_manager_phone,
			floor_type_id,
			placement_type_id,
			measurement_units,
			date_created, 
			anticipated_first_pour_date,
			ship_to_address,
			ship_to_city,
			destination_id,
			zip_postal_code,
			waste_factor_percentage,
			materials_excluded,
			
			materials_on_hand,
			primx_flow_on_hand_liters,
			primx_cpea_on_hand_liters,
	
			estimate_number_combined_1,
			estimate_number_combined_2,
			estimate_number_combined_3,
	
			price_per_unit_75_50,
			price_per_unit_90_60,
			total_project_cost_75_50,
			total_project_cost_90_60,

			total_number_of_pallets,
			total_number_of_20ft_containers,
			total_number_of_40ft_containers,
	`; // End sql

	if (estimate_number_combined_1 && estimate_number_combined_2) {
		sql += `
			estimate_number_combined_1_sf_dosage,
			estimate_number_combined_2_sf_dosage,
			estimate_number_combined_3_sf_dosage,
		`; // End sql
	}; // End if

	sql += `
			total_project_volume
		)
	`;

	// // Add in the imperial or metric specific values based on unit choice
	// if (measurement_units == 'imperial') {
	// 	// append the imperial specific data to the SQL query
	// 	sql += `
	// 			square_feet,
	// 			thickness_inches,
	// 			thickened_edge_perimeter_lineal_feet,
	// 			thickened_edge_construction_joint_lineal_feet,
	// 			primx_dc_on_hand_lbs,
	// 			primx_steel_fibers_on_hand_lbs,
	// 			primx_ultracure_blankets_on_hand_sq_ft
	// 		)
	//   `; // End sql
	// } else if (req.body.measurement_units == 'metric') {
	// 	// append the metric specific data to the SQL query
	// 	sql += `
	// 			square_meters,
	// 			thickness_millimeters,
	// 			thickened_edge_perimeter_lineal_meters,
	// 			thickened_edge_construction_joint_lineal_meters,
	// 			primx_dc_on_hand_kgs,
	// 			primx_steel_fibers_on_hand_kgs,
	// 			primx_ultracure_blankets_on_hand_sq_m
	//     )
	//   `; // End sql
	// } // End if/else if

	// add the values clause to the SQL query 
	sql += `
    VALUES (
			${format('%L', project_name)},
			${format('%L', licensee_id)},
			${format('%L', project_general_contractor)},
			${format('%L', project_manager_name)},
			${format('%L', project_manager_email)},
			${format('%L', project_manager_phone)},
			${format('%L', floor_type_id)},
			${format('%L', placement_type_id)},
			${format('%L', measurement_units)},
			NOW(),
			${format('%L', anticipated_first_pour_date)},
			${format('%L', ship_to_address)},
			${format('%L', ship_to_city)},
			${format('%L', destination_id)},
			${format('%L', zip_postal_code)},
			${format('%L', waste_factor_percentage)},
			${format('%L', materials_excluded)},
			${format('%L', materials_on_hand)},
			${format('%L', primx_flow_on_hand_liters)},
			${format('%L', primx_cpea_on_hand_liters)},
			${format('%L', estimate_number_combined_1)},
			${format('%L', estimate_number_combined_2)},
			${format('%L', estimate_number_combined_3)},
			${format('%L', price_per_unit_75_50)},
			${format('%L', price_per_unit_90_60)},
			${format('%L', total_project_cost_75_50)},
			${format('%L', total_project_cost_90_60)},
			${format('%L', total_number_of_pallets)},
			${format('%L', total_number_of_20ft_containers)},
			${format('%L', total_number_of_40ft_containers)},
	`;

	if (estimate_number_combined_1 && estimate_number_combined_2) {
		// append the imperial specific data to the SQL query
		sql += `
			${format('%L', estimate_number_combined_1_sf_dosage)},
			${format('%L', estimate_number_combined_2_sf_dosage)},
			${format('%L', estimate_number_combined_3_sf_dosage)},
		`; // End sql
	}

	sql += `
		${format('%L', total_project_volume)}
	`;

	// // Add in the imperial or metric specific values based on unit choice
	// if (measurement_units == 'imperial') {
	// 	// append the imperial specific data to the SQL query
	// 	sql += `
	// 		${format('%L', square_feet)},
	// 		${format('%L', thickness_inches)},
	// 		${format('%L', thickened_edge_perimeter_lineal_feet)},
	// 		${format('%L', thickened_edge_construction_joint_lineal_feet)},
	// 		${format('%L', primx_dc_on_hand_lbs)},
	// 		${format('%L', primx_steel_fibers_on_hand_lbs)},
	// 		${format('%L', primx_ultracure_blankets_on_hand_sq_ft)}
	// 	`;
	// } else if (req.body.measurement_units == 'metric') {
	// 	// append the metric specific data to the SQL query
	// 	sql += `
	// 		${format('%L', square_meters)},
	// 		${format('%L', thickness_millimeters)},
	// 		${format('%L', thickened_edge_perimeter_lineal_meters)},
	// 		${format('%L', thickened_edge_construction_joint_lineal_meters)},
	// 		${format('%L', primx_dc_on_hand_kgs)},
	// 		${format('%L', primx_steel_fibers_on_hand_kgs)},
	// 		${format('%L', primx_ultracure_blankets_on_hand_sq_m)}
	// 	`;
	// } // End if/else if

	// add the closing parenthesis to the SQL query
	sql += `
      )
		RETURNING "licensee_id", "estimate_id";
  `; // End sql

	try {
		// First DB query: initial POST request with data from the client
		let { rows } = await pool.query(sql);
		const { licensee_id, estimate_id } = rows[0];
		// const estimate_id = rows[0].estimate_id;

		// Second DB query: GET the full name of the licensee from the licensee table since licensee name from the client is stored as licensee_id
		const secondQueryText = `SELECT licensee_contractor_name 
                             FROM "licensees"
                             WHERE "licensee_id" = $1;
                             `;
		const licenseeNameResponse = await pool.query(secondQueryText, [licensee_id]);

		// create the specified shorter estimate number using the logic below and the returned id number from the original POST
		const letters = licenseeNameResponse.rows[0].licensee_contractor_name.slice(0, 2);

		let newEstimateNumber = letters.toUpperCase() + (123000 + (estimate_id * 3));

		// if it's a combined estimate, add a letter C to the estimate number    
		if (estimate_number_combined_1 && estimate_number_combined_2) {
			newEstimateNumber += "-C";
		}

		// Third DB query: PUT to update the newly created estimate with the shorter estimate number just created
		const thirdQueryText = `UPDATE "estimates" 
                            SET estimate_number = $1 
                            WHERE "estimate_id" = $2;
                            `;
		await pool.query(thirdQueryText, [newEstimateNumber, estimate_id]);
		res.send({
			estimate_number: newEstimateNumber,
			licensee_id: licensee_id,
			estimate_id: estimate_id
		});
	} catch (error) {
		console.error('Problem with estimates POST', error);
		res.sendStatus(500);
	}
});




// *************************** PUT ROUTES ***************************

// PUT request to edit a single piece of data on one row of the estimates table
router.put('/edit/:estimate_id', rejectUnauthenticated, (req, res) => {
	// SQL query to update a specific piece of data, use pg-format to sanitize it first since DB column to update comes in from client side
	const queryText = format(`UPDATE "estimates" SET %I = $1 WHERE "estimate_id" = $2;`, req.body.dbColumn);

	pool.query(queryText, [req.body.newValue, req.params.estimate_id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/edit PUT:`, error)
		})
})

// PUT request to edit a single piece of data on one row of the estimates table
router.put('/edit-combined-estimate/:estimate_id', async (req, res) => {
	const {
		estimate_id,
		estimate_number_combined_1_sf_dosage,
		estimate_number_combined_2_sf_dosage,
		estimate_number_combined_3_sf_dosage,
		price_per_unit_75_50,
		price_per_unit_90_60,
		total_project_cost_75_50,
		total_project_cost_90_60,
	} = req.body;
	try {
		let sql = `
			UPDATE "estimates"
			SET
				"estimate_number_combined_1_sf_dosage" = ${format('%L', estimate_number_combined_1_sf_dosage)},
				"estimate_number_combined_2_sf_dosage" = ${format('%L', estimate_number_combined_2_sf_dosage)},
				"estimate_number_combined_3_sf_dosage" = ${format('%L', estimate_number_combined_3_sf_dosage)},
				"price_per_unit_75_50" = ${format('%L', price_per_unit_75_50)},
				"price_per_unit_90_60" = ${format('%L', price_per_unit_90_60)},
				"total_project_cost_75_50" = ${format('%L', total_project_cost_75_50)},
				"total_project_cost_90_60" = ${format('%L', total_project_cost_90_60)}
			WHERE "estimate_id" = ${format('%L', estimate_id)};
		`; // End sql
		await pool.query(sql);
		res.sendStatus(200);
	} catch (error) {
		console.error('Problem with estimates PUT', error);
		res.sendStatus(500);
	}
})


// PUT request to mark an estimate flagged for order by licensee to be marked as ordered by an admin, and to add the name of the admin making the request
router.put('/process/:estimate_id', rejectUnauthenticated, (req, res) => {
	const {
		estimate_id,
		estimate_number,
		processed_by,
	} = req.body;
	// Set an order_number variable to be saved in the database. The order number is an O- followed by the estimate number
	const order_number = `O-${estimate_number}`
	// SQL query to switch the marked_as_ordered boolean to true and set the processed_by column to the name of the current admin username
	const queryText = `
		UPDATE "estimates" 
		SET 
			"marked_as_ordered" = TRUE, 
			"processed_by" = ${format('%L', processed_by)}, 
			"order_number" = ${format('%L', order_number)} 
		WHERE "estimate_id" = ${format('%L', estimate_id)} ;
	`;
	pool.query(queryText)
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/process PUT :`, error)
		})
})

// PUT request to archive an estimate
router.put('/archive/:estimate_id', rejectUnauthenticated, (req, res) => {
	// SQL query to switch the marked_as_ordered boolean to true and set the processed_by column to the name of the current admin username
	const queryText = `
		UPDATE "estimates" 
		SET archived = TRUE 
		WHERE estimate_id = $1;
	`;
	pool.query(queryText, [req.body.estimate_id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/archive:`, error)
		})
})

// PUT request to mark an estimate as ordered by a licensee and add the P.O. number they've supplied to the estimate
router.put('/order/:estimate_id', async (req, res) => {
	try {
		const {
			estimate_id,
			po_number,
			selected_steel_fiber_dosage,
		} = req.body;
		// SQL query to switch the ordered_by_licensee boolean to true and set the po_number column to the input given by the licensee user
		const queryText = `
			UPDATE "estimates" 
			SET 
				"ordered_by_licensee" = TRUE, 
				"po_number" = ${format('%L', po_number)},
				"selected_steel_fiber_dosage" = ${format('%L', selected_steel_fiber_dosage)}
			WHERE "estimate_id" = ${format('%L', estimate_id)};
		`;
		await pool.query(queryText);
		res.sendStatus(200);
	} catch (error) {
		console.error(`Error with /api/estimates/order`, error);
		res.sendStatus(500);
	}; // end of try/catch
});


// PUT request to mark a combined estimate as ordered by a licensee and add the P.O. number they've supplied to the estimate
router.put('/combine-order/:estimate_id', async (req, res) => {
	// ⬇ Declaring all the variables to hold the data for easier ref: 
	const po_number = req.body.poNumber;
	const combinedEstimateNumber = req.body.calcCombinedEstimate.estimate_number;
	const firstEstimateNumber = req.body.calcCombinedEstimate.estimate_number_combined_1;
	const secondEstimateNumber = req.body.calcCombinedEstimate.estimate_number_combined_2;
	const thirdEstimateNumber = req.body.calcCombinedEstimate.estimate_number_combined_3;
	// ⬇ queryText to update later: 
	let queryText1 = ``;
	let queryText2 = `
    UPDATE "estimates" 
    SET 
      "ordered_by_licensee" = TRUE, 
      "po_number" = $1 
    WHERE "estimate_number" = $2;
  `;
	// ⬇ The values to send to the DB: 
	let values1 = [
		po_number, // $1
		firstEstimateNumber, // $2
		secondEstimateNumber // $3
	]; // End values
	let values2 = [
		po_number, // $1
		combinedEstimateNumber, // $2
	]
	// ⬇ SQL query to switch the ordered_by_licensee boolean to true and set the po_number column to the input given by the licensee user
	if (thirdEstimateNumber) {
		// ⬇ If the third estimate number exists, add it to the values and set the SQL text to accommodate: 
		values1.push(thirdEstimateNumber); // $4
		queryText1 = `
      UPDATE "estimates" 
      SET 
        "ordered_by_licensee" = TRUE, 
        "archived" = TRUE,
        "po_number" = $1 
      WHERE "estimate_number" in ($2, $3, $4);
    `; // End queryText
	} else { // ⬇ If it's only two estimates, SQL to match: 
		queryText1 = `
      UPDATE "estimates" 
      SET 
        "ordered_by_licensee" = TRUE, 
        "archived" = TRUE,
        "po_number" = $1 
      WHERE "estimate_number" in ($2, $3);
    `; // End queryText
	} // End if/else
	try {
		await pool.query(queryText1, values1);
		await pool.query(queryText2, values2);
		res.sendStatus(200); // OK
	} catch (error) {
		console.error(`Error with /api/estimates/combined-order/:id PUT:`, error);
	} // End try/catch
}) // End router.put('/combine-order/:id'

// PUT request to take an existing estimate, GET current shipping and materials pricing from the DB, and update the given estimate with the new
// pricing data
router.put('/recalculate/:estimate_id', async (req, res) => {
	try {
		const {
			estimate_id,
			price_per_unit_75_50,
			price_per_unit_90_60,
			total_project_cost_75_50,
			total_project_cost_90_60,
		} = req.body;
		// SQL query to switch the ordered_by_licensee boolean to true and set the po_number column to the input given by the licensee user
		const sql = `
			UPDATE "estimates" 
			SET 
				"price_per_unit_75_50" = ${format('%L', price_per_unit_75_50)},
				"price_per_unit_90_60" = ${format('%L', price_per_unit_90_60)},
				"total_project_cost_75_50" = ${format('%L', total_project_cost_75_50)},
				"total_project_cost_90_60" = ${format('%L', total_project_cost_90_60)},
				"date_created" = NOW()
			WHERE "estimate_id" = ${format('%L', estimate_id)}
			RETURNING "date_created";
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows[0].date_created);
	} catch (error) {
		console.error(`Error with /api/estimates/recalculate:`, error)
		res.sendStatus(500);
	}; // End try/catch
}); // End PUT route

// *************************** DELETE ROUTES ***************************

router.delete('/delete/:estimate_id', rejectUnauthenticated, (req, res) => {

	const queryText = `
		DELETE FROM "estimates" 
		WHERE estimate_id = $1
	`; // End queryText

	pool.query(queryText, [req.params.estimate_id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/delete/`, error);
			res.sendStatus(500);
		})
});

// PUT request which allows user to update any form-fillable data from the main estimate creation sheet, follows a very similar workflow to the 
// main POST route above


router.put('/edit-estimate/:estimate_id', async (req, res) => {
	try {

		const {
			// ⬇ General Info: 
			estimate_id,
			project_name,
			licensee_id,
			project_general_contractor,
			project_manager_name,
			project_manager_email,
			project_manager_phone,
			floor_type_id,
			placement_type_id,
			measurement_units,
			// date_created,
			anticipated_first_pour_date,
			ship_to_address,
			ship_to_city,
			destination_id,
			zip_postal_code,
			waste_factor_percentage,
			materials_excluded,

			// ⬇ Materials On Hand Shared:
			materials_on_hand,
			primx_flow_on_hand_liters,
			primx_cpea_on_hand_liters,

			// ⬇ Combined Estimate Numbers:
			estimate_number_combined_1,
			estimate_number_combined_2,
			estimate_number_combined_3,

			// ⬇ Final Cost Numbers:
			price_per_unit_75_50,
			price_per_unit_90_60,
			total_project_cost_75_50,
			total_project_cost_90_60,

			// ⬇ Container/Pallet Info:
			total_number_of_pallets,
			total_number_of_20ft_containers,
			total_number_of_40ft_containers,

			total_project_volume,
			// // ⬇ Imperial: 
			// square_feet,
			// thickness_inches,
			// thickened_edge_perimeter_lineal_feet,
			// thickened_edge_construction_joint_lineal_feet,
			// primx_dc_on_hand_lbs,
			// primx_steel_fibers_on_hand_lbs,
			// primx_ultracure_blankets_on_hand_sq_ft,

			// // ⬇ Metric:
			// square_meters,
			// thickness_millimeters,
			// thickened_edge_perimeter_lineal_meters,
			// thickened_edge_construction_joint_lineal_meters,
			// primx_dc_on_hand_kgs,
			// primx_steel_fibers_on_hand_kgs,
			// primx_ultracure_blankets_on_hand_sq_m,
		} = req.body;
		let sql = `
			UPDATE "estimates"
			SET
				"project_name" = ${format('%L', project_name)},
				"licensee_id" = ${format('%L', licensee_id)},
				"project_general_contractor" = ${format('%L', project_general_contractor)},
				"project_manager_name" = ${format('%L', project_manager_name)},
				"project_manager_email" = ${format('%L', project_manager_email)},
				"project_manager_phone" = ${format('%L', project_manager_phone)},
				"floor_type_id" = ${format('%L', floor_type_id)},
				"placement_type_id" = ${format('%L', placement_type_id)},
				"measurement_units" = ${format('%L', measurement_units)},
				"anticipated_first_pour_date" = ${format('%L', anticipated_first_pour_date)},
				"ship_to_address" = ${format('%L', ship_to_address)},
				"ship_to_city" = ${format('%L', ship_to_city)},
				"destination_id" = ${format('%L', destination_id)},
				"zip_postal_code" = ${format('%L', zip_postal_code)},
				"waste_factor_percentage" = ${format('%L', waste_factor_percentage)},
				"materials_excluded" = ${format('%L', materials_excluded)},
				"materials_on_hand" = ${format('%L', materials_on_hand)},
				"primx_flow_on_hand_liters" = ${format('%L', primx_flow_on_hand_liters)},
				"primx_cpea_on_hand_liters" = ${format('%L', primx_cpea_on_hand_liters)},
				"estimate_number_combined_1" = ${format('%L', estimate_number_combined_1)},
				"estimate_number_combined_2" = ${format('%L', estimate_number_combined_2)},
				"estimate_number_combined_3" = ${format('%L', estimate_number_combined_3)},
				"price_per_unit_75_50" = ${format('%L', price_per_unit_75_50)},
				"price_per_unit_90_60" = ${format('%L', price_per_unit_90_60)},
				"total_project_cost_75_50" = ${format('%L', total_project_cost_75_50)},
				"total_project_cost_90_60" = ${format('%L', total_project_cost_90_60)},
				"total_number_of_pallets" = ${format('%L', parseInt(total_number_of_pallets))},
				"total_number_of_20ft_containers" = ${format('%L', parseInt(total_number_of_20ft_containers))},
				"total_number_of_40ft_containers" = ${format('%L', parseInt(total_number_of_40ft_containers))},
				"total_project_volume" = ${format('%L', total_project_volume)}
			WHERE "estimate_id" = ${format('%L', estimate_id)};
		`; // End sql
		// // Add in the imperial or metric specific values based on unit choice
		// if (req.body.measurement_units == 'imperial') {
		// 	sql += `
		// 			"square_feet" = ${format('%L', square_feet)},
		// 			"thickness_inches" = ${format('%L', thickness_inches)},
		// 			"thickened_edge_perimeter_lineal_feet" = ${format('%L', thickened_edge_perimeter_lineal_feet)},
		// 			"thickened_edge_construction_joint_lineal_feet" = ${format('%L', thickened_edge_construction_joint_lineal_feet)},
		// 			"primx_dc_on_hand_lbs" = ${format('%L', primx_dc_on_hand_lbs)},
		// 			"primx_steel_fibers_on_hand_lbs" = ${format('%L', primx_steel_fibers_on_hand_lbs)},
		// 			"primx_ultracure_blankets_on_hand_sq_ft" = ${format('%L', primx_ultracure_blankets_on_hand_sq_ft)}
		// 		WHERE "estimate_id" = ${format('%L', estimate_id)};
		// 	`; // End sql
		// } else if (req.body.measurement_units == 'metric') {
		// 	sql += `
		// 			"square_meters" = ${format('%L', square_meters)},
		// 			"thickness_millimeters" = ${format('%L', thickness_millimeters)},
		// 			"thickened_edge_perimeter_lineal_meters" = ${format('%L', thickened_edge_perimeter_lineal_meters)},
		// 			"thickened_edge_construction_joint_lineal_meters" = ${format('%L', thickened_edge_construction_joint_lineal_meters)},
		// 			"primx_dc_on_hand_kgs" = ${format('%L', primx_dc_on_hand_kgs)},
		// 			"primx_steel_fibers_on_hand_kgs" = ${format('%L', primx_steel_fibers_on_hand_kgs)},
		// 			"primx_ultracure_blankets_on_hand_sq_m" = ${format('%L', primx_ultracure_blankets_on_hand_sq_m)}
		// 		WHERE "estimate_id" = ${format('%L', estimate_id)};
		// 	`; // End sql
		// }; // End if/else if
		await pool.query(sql);
		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
		console.error('Error in estimate.router PUT', error);
	}; // End try/catch
}); // End router.put




// PUT request for when an individual estimate is saved in a combined estimate, flip it's 'used_in_a_combined_order' key to TRUE: 
router.put('/usedincombine', async (req, res) => {
	const combinedEstimateNumber = req.body.estimate_number;
	const firstCombinedEstimateNumber = req.body.estimate_number_combined_1;
	const secondCombinedEstimateNumber = req.body.estimate_number_combined_2;
	const thirdCombinedEstimateNumber = req.body.estimate_number_combined_3;
	let queryText1 = "";
	let queryText2 = "";
	let values1 = [
		firstCombinedEstimateNumber, // $1
		secondCombinedEstimateNumber // $2
	]; // End values
	let values2 = [
		firstCombinedEstimateNumber, // $1
		secondCombinedEstimateNumber // $2
	]; // End values
	if (thirdCombinedEstimateNumber) {
		// If there's a third estimate, add it to values:
		values1.push(thirdCombinedEstimateNumber); // $3
		values2.push(thirdCombinedEstimateNumber, combinedEstimateNumber); // $3 $4
		// Query will mark all estimates as true, and update with each others numbers:
		queryText1 = `
      UPDATE "estimates"  
      SET "used_in_a_combined_order" = 'TRUE' 
      WHERE "estimate_number" in ($1, $2, $3);
    `; // End queryText1
		queryText2 = `
      UPDATE "estimates"  
      SET "estimate_number_combined_1" = $4
      WHERE "estimate_number" in ($1, $2, $3);
    `; // End queryText2
	} else {
		values2.push(combinedEstimateNumber); // $3
		queryText1 = `
      UPDATE "estimates"  
      SET "used_in_a_combined_order" = 'TRUE' 
      WHERE "estimate_number" in ($1, $2);
    `; // End queryText1
		queryText2 = `
      UPDATE "estimates"  
      SET "estimate_number_combined_1" = $3
      WHERE "estimate_number" in ($1, $2);
    `; // End queryText2
	} // End if/else query text. 
	try {
		await pool.query(queryText1, values1);
		await pool.query(queryText2, values2);
		res.sendStatus(200); // OK
	} catch (error) {
		console.error(`Error with /api/estimates/usedincombine PUT`, error)
	} // End try/catch
}) // End PUT /usedincombine


module.exports = router;
