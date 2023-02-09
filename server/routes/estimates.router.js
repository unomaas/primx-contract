const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
	rejectUnauthenticated,
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
			ft.floor_type_label, 
			l.licensee_contractor_name, 
			pt.placement_type_label, 
			sd.destination_name,
			sd.destination_country
		FROM "estimates" AS e
    JOIN "floor_types" AS ft
			ON e.floor_type_id = ft.floor_type_id
    JOIN "licensees" AS l
			ON e.licensee_id = l.licensee_id
    JOIN "placement_types" AS pt
			ON e.placement_type_id = pt.placement_type_id
    JOIN "shipping_destinations" AS sd
			ON e.destination_id = sd.destination_id
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
router.get('/all', rejectUnauthenticated, (req, res) => {
	// SQL query to GET all estimates along the floor type names, licensee names, placement type names, and shipping state/province names
	const queryText = `
		SELECT "estimates".*, 
			"floor_types".floor_type_label, 
			"licensees".licensee_contractor_name, 
			"placement_types".placement_type_label, 
			"shipping_costs".shipping_cost 
		FROM "estimates"
		JOIN "floor_types" ON "estimates".floor_type_id = "floor_types".floor_type_id
		JOIN "licensees" ON "estimates".licensee_id = "licensees".licensee_id
		JOIN "placement_types" ON "estimates".placement_type_id = "placement_types".placement_type_id
		JOIN "shipping_costs" ON "estimates".destination_id = "shipping_costs".destination_id
		ORDER BY "estimates".estimate_id DESC;`;

	pool.query(queryText)
		.then((result) => res.send(result.rows))
		.catch(error => {
			console.error('Error with /api/estimates/all GET: ', error);
			res.sendStatus(500);
		})

})


// *************************** POST ROUTES ***************************

// // POST Route for Licensee Information -> Includes both Metric and Imperial Inputs
// router.post('/', async (req, res) => {
// 	// set the values sent from licensee by destructuring req.body
// 	let {
// 		// shared values regardless of imperial or metric units
// 		measurement_units,
// 		country,
// 		date_created,
// 		project_name,
// 		licensee_id,
// 		project_general_contractor,
// 		ship_to_address,
// 		ship_to_city,
// 		shipping_costs_id,
// 		zip_postal_code,
// 		anticipated_first_pour_date,
// 		project_manager_name,
// 		project_manager_email,
// 		project_manager_phone,
// 		floor_type_id,
// 		placement_type_id,
// 		primx_flow_dosage_liters,
// 		primx_cpea_dosage_liters,
// 		waste_factor_percentage,

// 		primx_dc_unit_price,
// 		primx_dc_shipping_estimate,
// 		primx_flow_unit_price,
// 		primx_flow_shipping_estimate,
// 		primx_steel_fibers_unit_price,
// 		primx_steel_fibers_shipping_estimate,
// 		primx_ultracure_blankets_unit_price,
// 		primx_cpea_unit_price,
// 		primx_cpea_shipping_estimate,

// 		materials_on_hand,
// 		primx_flow_on_hand_liters,
// 		primx_cpea_on_hand_liters,
// 		// unit specific values
// 		square_feet,
// 		thickness_inches,
// 		thickened_edge_perimeter_lineal_feet,
// 		thickened_edge_construction_joint_lineal_feet,
// 		primx_steel_fibers_dosage_lbs,
// 		primx_dc_dosage_lbs,

// 		primx_dc_on_hand_lbs,
// 		primx_steel_fibers_on_hand_lbs,
// 		primx_ultracure_blankets_on_hand_sq_ft,

// 		square_meters,
// 		thickness_millimeters,
// 		thickened_edge_perimeter_lineal_meters,
// 		thickened_edge_construction_joint_lineal_meters,
// 		primx_steel_fibers_dosage_kgs,
// 		primx_dc_dosage_kgs,

// 		primx_dc_on_hand_kgs,
// 		primx_steel_fibers_on_hand_kgs,
// 		primx_ultracure_blankets_on_hand_sq_m,

// 		estimate_number_combined_1,
// 		estimate_number_combined_2,
// 		estimate_number_combined_3
// 	} = req.body;

// 	// create a unique UUID estimate number to use for the estimate being sent
// 	let estimate_number = "";

// 	// set the destructured object values as the values to send with the POST request
// 	const values = [
// 		// starting values don't include metric or imperial specific units
// 		measurement_units,
// 		country,
// 		date_created,
// 		project_name,
// 		licensee_id,
// 		project_general_contractor,
// 		ship_to_address,
// 		ship_to_city,
// 		shipping_costs_id,
// 		zip_postal_code,
// 		anticipated_first_pour_date,
// 		project_manager_name,
// 		project_manager_email,
// 		project_manager_phone,
// 		floor_type_id,
// 		placement_type_id,
// 		primx_flow_dosage_liters,
// 		primx_cpea_dosage_liters,
// 		primx_dc_unit_price,
// 		primx_dc_shipping_estimate,
// 		primx_flow_unit_price,
// 		primx_flow_shipping_estimate,
// 		primx_steel_fibers_unit_price,
// 		primx_steel_fibers_shipping_estimate,
// 		primx_ultracure_blankets_unit_price,
// 		primx_cpea_unit_price,
// 		primx_cpea_shipping_estimate,
// 		estimate_number,
// 		estimate_number_combined_1,
// 		estimate_number_combined_2,
// 		estimate_number_combined_3,
// 		waste_factor_percentage,
// 		materials_on_hand,
// 		primx_flow_on_hand_liters,
// 		primx_cpea_on_hand_liters, // 35
// 	]; // End values

// 	// start the query text with shared values
// 	let queryText = `
//     INSERT INTO "estimates" (
// 			"measurement_units",
// 			"country",
// 			"date_created",
// 			"project_name",
// 			"licensee_id",
// 			"project_general_contractor",
// 			"ship_to_address",
// 			"ship_to_city",
// 			"shipping_costs_id",
// 			"zip_postal_code",
// 			"anticipated_first_pour_date",
// 			"project_manager_name",
// 			"project_manager_email",
// 			"project_manager_phone",
// 			"floor_type_id",
// 			"placement_type_id",
// 			"primx_flow_dosage_liters",
// 			"primx_cpea_dosage_liters",
// 			"primx_dc_unit_price",
// 			"primx_dc_shipping_estimate",
// 			"primx_flow_unit_price",
// 			"primx_flow_shipping_estimate",
// 			"primx_steel_fibers_unit_price",
// 			"primx_steel_fibers_shipping_estimate",
// 			"primx_ultracure_blankets_unit_price",
// 			"primx_cpea_unit_price",
// 			"primx_cpea_shipping_estimate",
// 			"estimate_number",
// 			"estimate_number_combined_1",
// 			"estimate_number_combined_2",
// 			"estimate_number_combined_3",
// 			"waste_factor_percentage",
// 			"materials_on_hand",
// 			"primx_flow_on_hand_liters",
// 			"primx_cpea_on_hand_liters",
//   `; // End queryText


// 	// Add in the imperial or metric specific values based on unit choice
// 	if (req.body.measurement_units == 'imperial') {
// 		// add the imperial values to values array
// 		values.push(
// 			square_feet,
// 			thickness_inches,
// 			thickened_edge_perimeter_lineal_feet,
// 			thickened_edge_construction_joint_lineal_feet,
// 			primx_steel_fibers_dosage_lbs,
// 			primx_dc_dosage_lbs,
// 			primx_dc_on_hand_lbs,
// 			primx_steel_fibers_on_hand_lbs,
// 			primx_ultracure_blankets_on_hand_sq_ft, // 44
// 		); // End values.push
// 		// append the imperial specific data to the SQL query
// 		queryText += `
//       "square_feet",
//       "thickness_inches",
//       "thickened_edge_perimeter_lineal_feet",
//       "thickened_edge_construction_joint_lineal_feet",
//       "primx_steel_fibers_dosage_lbs",
// 			"primx_dc_dosage_lbs",
// 			"primx_dc_on_hand_lbs",
// 			"primx_steel_fibers_on_hand_lbs",
// 			"primx_ultracure_blankets_on_hand_sq_ft"
//       )
//     `; // End queryText
// 	} else if (req.body.measurement_units == 'metric') {
// 		// add the metric values to the values array
// 		values.push(
// 			square_meters,
// 			thickness_millimeters,
// 			thickened_edge_perimeter_lineal_meters,
// 			thickened_edge_construction_joint_lineal_meters,
// 			primx_steel_fibers_dosage_kgs,
// 			primx_dc_dosage_kgs,
// 			primx_dc_on_hand_kgs,
// 			primx_steel_fibers_on_hand_kgs,
// 			primx_ultracure_blankets_on_hand_sq_m, // 44
// 		); // End values.push
// 		// append the metric specific data to the SQL query
// 		queryText += `
//       "square_meters",
//       "thickness_millimeters",
//       "thickened_edge_perimeter_lineal_meters",
//       "thickened_edge_construction_joint_lineal_meters",
//       "primx_steel_fibers_dosage_kgs",
// 			"primx_dc_dosage_kgs",
// 			"primx_dc_on_hand_kgs",
// 			"primx_steel_fibers_on_hand_kgs",
// 			"primx_ultracure_blankets_on_hand_sq_m"
//       )
//     `; // End queryText
// 	} // End if/else if

// 	// add the values clause to the SQL query 
// 	queryText += `
//     VALUES (
//       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39, $40, $41, $42, $43, $44
//       )
//       RETURNING "id";
//   `
// 	try {
// 		// First DB query: initial POST request with data from the client
// 		let { rows } = await pool.query(queryText, values);
// 		const id = rows[0].id

// 		// Second DB query: GET the full name of the licensee from the licensee table since licensee name from the client is stored as licensee_id
// 		const secondQueryText = `SELECT licensee_contractor_name 
//                              FROM "licensees"
//                              WHERE "id" = $1;
//                              `;
// 		const licenseeNameResponse = await pool.query(secondQueryText, [licensee_id]);

// 		// create the specified shorter estimate number using the logic below and the returned id number from the original POST
// 		const letters = licenseeNameResponse.rows[0].licensee_contractor_name.slice(0, 2);
// 		let newEstimateNumber = letters.toUpperCase() + (123000 + (id * 3));

// 		// if it's a combined estimate, add a letter C to the estimate number    
// 		if (estimate_number_combined_1 && estimate_number_combined_2) {
// 			newEstimateNumber += "-C";
// 		}

// 		// Third DB query: PUT to update the newly created estimate with the shorter estimate number just created
// 		const thirdQueryText = `UPDATE "estimates" 
//                             SET estimate_number = $1 
//                             WHERE "id" = $2;
//                             `;
// 		await pool.query(thirdQueryText, [newEstimateNumber, id]);
// 		res.send({
// 			estimate_number: newEstimateNumber,
// 			licensee_id: licensee_id,
// 			id: id
// 		})
// 	} catch (error) {
// 		console.error('Problem with estimates POST', error);
// 		res.sendStatus(500);
// 	}
// });


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
		date_created,
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

		// ⬇ Imperial: 
		square_feet,
		thickness_inches,
		thickened_edge_perimeter_lineal_feet,
		thickened_edge_construction_joint_lineal_feet,
		primx_dc_on_hand_lbs,
		primx_steel_fibers_on_hand_lbs,
		primx_ultracure_blankets_on_hand_sq_ft,

		// ⬇ Metric:
		square_meters,
		thickness_millimeters,
		thickened_edge_perimeter_lineal_meters,
		thickened_edge_construction_joint_lineal_meters,
		primx_dc_on_hand_kgs,
		primx_steel_fibers_on_hand_kgs,
		primx_ultracure_blankets_on_hand_sq_m,
	} = req.body;

	// create a unique UUID estimate number to use for the estimate being sent
	let estimate_number = "";

	// set the destructured object values as the values to send with the POST request
	const values = [
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
		date_created,
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
		total_project_cost_90_60, // 27
	]; // End values

	// start the query text with shared values
	let queryText = `
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
		`; // End queryText


	// Add in the imperial or metric specific values based on unit choice
	if (measurement_units == 'imperial') {
		// add the imperial values to values array
		values.push(
			square_feet,
			thickness_inches,
			thickened_edge_perimeter_lineal_feet,
			thickened_edge_construction_joint_lineal_feet,
			primx_dc_on_hand_lbs,
			primx_steel_fibers_on_hand_lbs,
			primx_ultracure_blankets_on_hand_sq_ft, // 34 
		); // End values.push
		// append the imperial specific data to the SQL query
		queryText += `
			square_feet,
			thickness_inches,
			thickened_edge_perimeter_lineal_feet,
			thickened_edge_construction_joint_lineal_feet,
			primx_dc_on_hand_lbs,
			primx_steel_fibers_on_hand_lbs,
			primx_ultracure_blankets_on_hand_sq_ft
			)
    `; // End queryText
	} else if (req.body.measurement_units == 'metric') {
		// add the metric values to the values array
		values.push(
			square_meters,
			thickness_millimeters,
			thickened_edge_perimeter_lineal_meters,
			thickened_edge_construction_joint_lineal_meters,
			primx_dc_on_hand_kgs,
			primx_steel_fibers_on_hand_kgs,
			primx_ultracure_blankets_on_hand_sq_m, // 34
		); // End values.push
		// append the metric specific data to the SQL query
		queryText += `
			square_meters,
			thickness_millimeters,
			thickened_edge_perimeter_lineal_meters,
			thickened_edge_construction_joint_lineal_meters,
			primx_dc_on_hand_kgs,
			primx_steel_fibers_on_hand_kgs,
			primx_ultracure_blankets_on_hand_sq_m
      )
    `; // End queryText
	} // End if/else if

	// add the values clause to the SQL query 
	queryText += `
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34
      )
      RETURNING "licensee_id", "estimate_id";
  `; // End queryText




	try {
		// First DB query: initial POST request with data from the client
		let { rows } = await pool.query(queryText, values);
		const licensee_id = rows[0].licensee_id;
		const estimate_id = rows[0].estimate_id;

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
		})
	} catch (error) {
		console.error('Problem with estimates POST', error);
		res.sendStatus(500);
	}
});




// *************************** PUT ROUTES ***************************

// PUT request to edit a single piece of data on one row of the estimates table
router.put('/edit/:id', rejectUnauthenticated, (req, res) => {
	// SQL query to update a specific piece of data, use pg-format to sanitize it first since DB column to update comes in from client side
	const queryText = format(`UPDATE "estimates" SET %I = $1 WHERE "id" = $2;`, req.body.dbColumn);

	pool.query(queryText, [req.body.newValue, req.params.id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/edit PUT for id ${req.params.id}:`, error)
		})
})

// PUT request to mark an estimate flagged for order by licensee to be marked as ordered by an admin, and to add the name of the admin making the request
router.put('/process/:id', rejectUnauthenticated, (req, res) => {
	// Set an order_number variable to be saved in the database. The order number is an O- followed by the estimate number
	const order_number = `O-${req.body.estimate_number}`
	// SQL query to switch the marked_as_ordered boolean to true and set the processed_by column to the name of the current admin username
	const queryText = `UPDATE "estimates" SET "marked_as_ordered" = TRUE, "processed_by" = $1, "order_number" = $2 WHERE "id" = $3;`;

	pool.query(queryText, [req.user.username, order_number, req.params.id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/process PUT for id ${req.params.id}:`, error)
		})
})

// PUT request to archive an estimate
router.put('/archive/:id', rejectUnauthenticated, (req, res) => {
	// SQL query to switch the marked_as_ordered boolean to true and set the processed_by column to the name of the current admin username
	const queryText = `
		UPDATE "estimates" 
		SET archived = TRUE 
		WHERE id = $1;
	`;
	pool.query(queryText, [req.params.id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/archive PUT for id ${req.params.id}:`, error)
		})
})

// PUT request to mark an estimate as ordered by a licensee and add the P.O. number they've supplied to the estimate
router.put('/order/:id', (req, res) => {
	// SQL query to switch the ordered_by_licensee boolean to true and set the po_number column to the input given by the licensee user
	const queryText = `
    UPDATE "estimates" 
    SET "ordered_by_licensee" = TRUE, "po_number" = $1 
    WHERE "id" = $2;
  `;

	pool.query(queryText, [req.body.po_number, req.params.id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/order/:id PUT for id ${req.params.id}:`, error)
		})
})


// PUT request to mark a combined estimate as ordered by a licensee and add the P.O. number they've supplied to the estimate
router.put('/combine-order/:id', async (req, res) => {
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
router.put('/recalculate/:id', (req, res) => {
	// SQL query to switch the ordered_by_licensee boolean to true and set the po_number column to the input given by the licensee user
	const queryText = `
    UPDATE "estimates" 
    SET 
      "primx_dc_unit_price" = $1, 
      "primx_dc_shipping_estimate" = $2, 
      "primx_flow_unit_price" = $3, 
      "primx_flow_shipping_estimate" = $4, 
      "primx_steel_fibers_unit_price" = $5, 
      "primx_steel_fibers_shipping_estimate" = $6,
      "primx_ultracure_blankets_unit_price" = $7, 
      "primx_cpea_unit_price" = $8, 
      "primx_cpea_shipping_estimate" = $9
    WHERE "estimates".estimate_id = $10;
  `;

	// destructure data received from saga which contains an object with current updated pricing
	const {
		primx_dc_unit_price,
		primx_dc_shipping_estimate,
		primx_flow_unit_price,
		primx_flow_shipping_estimate,
		primx_steel_fibers_unit_price,
		primx_steel_fibers_shipping_estimate,
		primx_ultracure_blankets_unit_price,
		primx_cpea_unit_price,
		primx_cpea_shipping_estimate,
		id
	} = req.body

	// set the pool query values to equal the destructured values
	const values = [
		primx_dc_unit_price,
		primx_dc_shipping_estimate,
		primx_flow_unit_price,
		primx_flow_shipping_estimate,
		primx_steel_fibers_unit_price,
		primx_steel_fibers_shipping_estimate,
		primx_ultracure_blankets_unit_price,
		primx_cpea_unit_price,
		primx_cpea_shipping_estimate,
		id
	];

	pool.query(queryText, values)
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/recalculate/:id PUT for id ${req.params.id}:`, error)
		})
})

// *************************** DELETE ROUTES ***************************

router.delete('/delete/:id', rejectUnauthenticated, (req, res) => {

	const queryText = `
		DELETE FROM "estimates" 
		WHERE id = $1
	`; // End queryText

	pool.query(queryText, [req.params.id])
		.then(result => res.sendStatus(200))
		.catch(error => {
			console.error(`Error with /api/estimates/delete/:id for id ${req.params.id}`, error);
			res.sendStatus(500);
		})
});

// PUT request which allows user to update any form-fillable data from the main estimate creation sheet, follows a very similar workflow to the 
// main POST route above
router.put('/clientupdates/:id', (req, res) => {
	// destructure data received from saga which contains an object with all editable DB columns 
	let {
		// shared values regardless of imperial or metric units
		measurement_units,
		country,
		project_name,
		licensee_id,
		project_general_contractor,
		ship_to_address,
		ship_to_city,
		shipping_costs_id,
		zip_postal_code,
		anticipated_first_pour_date,
		project_manager_name,
		project_manager_email,
		project_manager_phone,
		floor_type_id,
		placement_type_id,
		primx_flow_dosage_liters,
		primx_cpea_dosage_liters,
		waste_factor_percentage,
		materials_on_hand,
		primx_flow_on_hand_liters,
		primx_cpea_on_hand_liters,
		// unit specific values
		square_feet,
		thickness_inches,
		thickened_edge_perimeter_lineal_feet,
		thickened_edge_construction_joint_lineal_feet,
		primx_steel_fibers_dosage_lbs,
		primx_dc_dosage_lbs,
		primx_dc_on_hand_lbs,
		primx_steel_fibers_on_hand_lbs,
		primx_ultracure_blankets_on_hand_sq_ft,
		square_meters,
		thickness_millimeters,
		thickened_edge_perimeter_lineal_meters,
		thickened_edge_construction_joint_lineal_meters,
		primx_steel_fibers_dosage_kgs,
		primx_dc_dosage_kgs,
		primx_dc_on_hand_kgs,
		primx_steel_fibers_on_hand_kgs,
		primx_ultracure_blankets_on_hand_sq_m,
	} = req.body

	// save the values array using the destructured data from client
	const values = [
		// starting values don't include metric or imperial specific units
		measurement_units,
		country,
		project_name,
		licensee_id,
		project_general_contractor,
		ship_to_address,
		ship_to_city,
		shipping_costs_id,
		zip_postal_code,
		anticipated_first_pour_date,
		project_manager_name,
		project_manager_email,
		project_manager_phone,
		floor_type_id,
		placement_type_id,
		primx_flow_dosage_liters,
		primx_cpea_dosage_liters,
		waste_factor_percentage,
		materials_on_hand,
		primx_flow_on_hand_liters,
		primx_cpea_on_hand_liters,
	]

	// start the query text with shared values
	let queryText = `
    UPDATE "estimates" 
		SET
			"measurement_units" = $1,
			"country" = $2,
			"project_name" = $3,
			"licensee_id" = $4,
			"project_general_contractor" = $5,
			"ship_to_address" = $6,
			"ship_to_city" = $7,
			"shipping_costs_id" = $8,
			"zip_postal_code" = $9,
			"anticipated_first_pour_date" = $10,
			"project_manager_name" = $11,
			"project_manager_email" = $12,
			"project_manager_phone" = $13,
			"floor_type_id" = $14,
			"placement_type_id" = $15,
			"primx_flow_dosage_liters" = $16,
			"primx_cpea_dosage_liters" = $17,
			"waste_factor_percentage" = $18,
			"materials_on_hand" = $19, 
			"primx_flow_on_hand_liters" = $20,
			"primx_cpea_on_hand_liters" = $21,
  `; // End queryText

	// Add in the imperial or metric specific values based on unit choice
	if (req.body.measurement_units == 'imperial') {
		// add the imperial values to values array
		values.push(
			square_feet,
			thickness_inches,
			thickened_edge_perimeter_lineal_feet,
			thickened_edge_construction_joint_lineal_feet,
			primx_steel_fibers_dosage_lbs,
			primx_dc_dosage_lbs,
			primx_dc_on_hand_lbs,
			primx_steel_fibers_on_hand_lbs,
			primx_ultracure_blankets_on_hand_sq_ft,
		); // End push
		// append the imperial specific data to the SQL query
		queryText += `
			"square_feet"= $22,
			"thickness_inches"= $23,
			"thickened_edge_perimeter_lineal_feet"= $24,
			"thickened_edge_construction_joint_lineal_feet"= $25,
			"primx_steel_fibers_dosage_lbs"= $26,
			"primx_dc_dosage_lbs" = $27,
			"primx_dc_on_hand_lbs" = $28,
			"primx_steel_fibers_on_hand_lbs" = $29,
			"primx_ultracure_blankets_on_hand_sq_ft" = $30
			WHERE "id" = $31;
		`; // End queryText
	} else if (req.body.measurement_units == 'metric') {
		// add the metric values to the values array
		values.push(
			square_meters,
			thickness_millimeters,
			thickened_edge_perimeter_lineal_meters,
			thickened_edge_construction_joint_lineal_meters,
			primx_steel_fibers_dosage_kgs,
			primx_dc_dosage_kgs,
			primx_dc_on_hand_kgs,
			primx_steel_fibers_on_hand_kgs,
			primx_ultracure_blankets_on_hand_sq_m,
		); // End push
		// append the metric specific data to the SQL query
		queryText += `
      "square_meters" = $22,
      "thickness_millimeters" = $23,
      "thickened_edge_perimeter_lineal_meters" = $24,
      "thickened_edge_construction_joint_lineal_meters" = $25,
      "primx_steel_fibers_dosage_kgs" = $26,
			"primx_dc_dosage_kgs" = $27,
			"primx_dc_on_hand_kgs" = $28,
			"primx_steel_fibers_on_hand_kgs" = $29,
			"primx_ultracure_blankets_on_hand_sq_m" = $30
      WHERE "id" = $31;
    `; // End 
	} // End if/else if

	// add id to the values array
	values.push(req.params.id);

	pool.query(queryText, values)
		.then(result => {
			res.sendStatus(200)
		})
		.catch(error => {
			console.error(`Error with /api/estimates/clientupdates/:id PUT for id ${req.params.id}:`, error)
		})
})

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
