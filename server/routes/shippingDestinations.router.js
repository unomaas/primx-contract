const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');

// GET route - gets shipping destinations
router.get('/active', async (req, res) => {
	try {
		const sql = `
			SELECT 
				sd.destination_id,
				sd.destination_name,
				r.region_code AS destination_country,
				r.region_id,
				r.default_measurement,
				sd.destination_active
			FROM shipping_destinations as sd
			JOIN regions AS r 
				ON r.region_id = sd.region_id
			WHERE sd.destination_active = TRUE
			ORDER BY 
				r.region_code DESC,
				sd.destination_name ASC;
		`; // End sql
		const result = await pool.query(sql);
		res.send(result.rows);
	} catch (error) {
		console.error('Error in shipping destinations GET router', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End GET route

// GET route - gets shipping destinations
router.get('/all', async (req, res) => {
	try {
		const sql = `
			SELECT 
				sd.destination_id,
				sd.destination_name,
				r.region_code AS destination_country,
				r.region_id,
				sd.destination_active
			FROM shipping_destinations as sd
			JOIN regions AS r 
				ON r.region_id = sd.region_id
			ORDER BY 
				r.region_code DESC,
				sd.destination_name ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in shipping destinations GET router', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End GET route

// //Post Route - adds shipping destination
// router.post('/', rejectUnauthenticated, async (req, res) => {
// 	try {
// 		const { destination_name, destination_country } = req.body;
// 		const params = [
// 			destination_name,
// 			destination_country,
// 		]; // End params
// 		const sql = `
// 			INSERT INTO "shipping_destinations" 
// 				("destination_name", "destination_country", "destination_active")
// 			VALUES ($1, $2, TRUE)
// 			RETURNING destination_id;
// 		`; // End sql
// 		const result = await pool.query(sql, params);
// 		if (result) res.sendStatus(201);
// 	} catch (error) {
// 		console.error('Error in shipping destinations POST route', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// }); // End POST route

//PUT route - updates shipping active status
router.put('/toggle-active/:destinationId', rejectUnauthenticated, async (req, res) => {
	try {
		const { destinationId } = req.params;

		const sql = `
			UPDATE "shipping_destinations" 
			SET "destination_active" = NOT "destination_active"
			WHERE "destination_id" = $1;
		`; // End sql
		pool.query(sql, [destinationId]);
		res.sendStatus(202);
	} catch (error) {
		console.error('Error in shipping destinations PUT route -->', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End PUT route



router.post('/submit-destination', rejectNonAdmin, async (req, res) => {
	const connection = await pool.connect();
	try {
		const {
			destination_name,
			region_id,
			destination_active,
			edit,
			destination_id,
			// Shipping costs
			dc_20ft,
			dc_40ft,
			fibers_20ft,
			fibers_40ft,
			cpea_20ft,
			cpea_40ft,
			flow_20ft,
			flow_40ft,
		} = req.body;

		await connection.query('BEGIN'); // Start transaction

		if (edit) {
			// Update existing destination
			const updateDestinationSql = `
				UPDATE shipping_destinations
				SET 
					destination_name = ${format('%L', destination_name)},
					region_id = ${format('%L', region_id)},
					destination_active = ${format('%L', destination_active)}
				WHERE destination_id = ${format('%L', destination_id)};
			`;
			await connection.query(updateDestinationSql);

		} else {
			// Insert new destination
			const insertDestinationSql = `
							INSERT INTO shipping_destinations (
								destination_name, region_id, destination_active
							) VALUES (
								${format('%L', destination_name)}, ${format('%L', region_id)}, ${format('%L', destination_active)}
							) RETURNING destination_id;
					`;

			const result = await connection.query(insertDestinationSql);
			const newDestinationId = result.rows[0].destination_id;

			// Insert shipping costs
			const insertShippingCostsSql = `
				INSERT INTO shipping_costs (
					destination_id
				) VALUES (	
					${format('%L', newDestinationId)}
				);
			`;

			await connection.query(insertShippingCostsSql);
		}

		await connection.query('COMMIT'); // Commit transaction
		res.sendStatus(201);
	} catch (error) {
		await connection.query('ROLLBACK'); // Rollback transaction on error
		console.error('Error in submit destination POST', error);
		res.sendStatus(500);
	} finally {
		connection.release();
	}
});

// router.post('/toggle-active-set-prices', rejectUnauthenticated, async (req, res) => {
// 	try {
// 		const { destination_id, shipping_costs } = req.body;

// 		let sql = `
// 			BEGIN;
// 		`; // End sql

// 		sql += `
// 			UPDATE "shipping_destinations" 
// 			SET "destination_active" = NOT "destination_active"
// 			WHERE "destination_id" = ${format('%L', destination_id)};
// 		`; // End sql

// 		sql += `
// 			UPDATE "shipping_costs"
// 			SET
// 				"dc_20ft" = v.dc_20ft,
// 				"dc_40ft" = v.dc_40ft,
// 				"fibers_20ft" = v.fibers_20ft,
// 				"fibers_40ft" = v.fibers_40ft,
// 				"cpea_20ft" = v.cpea_20ft,
// 				"cpea_40ft" = v.cpea_40ft,
// 				"flow_20ft" = v.flow_20ft,
// 				"flow_40ft" = v.flow_40ft
// 			FROM (VALUES
// 		`; // End sql
// 		// ⬇ Loop through the req.body array to build the query:
// 		for (let i in shipping_costs) {
// 			const cost = shipping_costs[i];
// 			sql += `(${format('%L::int', destination_id)}, ${format('%L::decimal', cost.dc_20ft)}, ${format('%L::decimal', cost.dc_40ft)}, ${format('%L::decimal', cost.fibers_20ft)}, ${format('%L::decimal', cost.fibers_40ft)}, ${format('%L::decimal', cost.cpea_20ft)}, ${format('%L::decimal', cost.cpea_40ft)}, ${format('%L::decimal', cost.flow_20ft)}, ${format('%L::decimal', cost.flow_40ft)}), `
// 		}; // End for loop
// 		// ⬇ Remove the last comma and space:
// 		sql = sql.slice(0, -2);
// 		// ⬇ Add the WHERE clause:
// 		sql += `
// 			) AS v(destination_id, dc_20ft, dc_40ft, fibers_20ft, fibers_40ft, cpea_20ft, cpea_40ft, flow_20ft, flow_40ft) 
// 			WHERE "shipping_costs"."destination_id" = v.destination_id;
// 		`; // End sql

// 		sql += `
// 			COMMIT;
// 		`; // End sql


// 		pool.query(sql);
// 		res.sendStatus(202);
// 	} catch (error) {
// 		console.error('Error in shipping destinations PUT route -->', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// }); // End PUT route

// router.delete('/delete/:id', rejectUnauthenticated, async (req, res) => {
// 	try {
// 		const sql = `
// 			DELETE FROM "shipping_destinations"
// 			WHERE destination_id = $1
// 			RETURNING TRUE;
// 		`; // End sql
// 		const result = await pool.query(sql, req.body.destination_id);
// 		if (result) res.sendStatus(201);
// 	} catch (error) {
// 		console.error('Error in shipping costs DELETE route -->', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// });

module.exports = router;