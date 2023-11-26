const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');

//#region - Shipping Costs routes below: 
// GET route - gets shipping costs
router.get('/get-current-shipping-costs', async (req, res) => {
	try {
		const sql = `
			SELECT 
				sc.shipping_cost_id,
				sc.destination_id,
				sc.dc_20ft,
				sc.dc_40ft,
				sc.fibers_20ft,
				sc.fibers_40ft,
				sc.cpea_20ft,
				sc.cpea_40ft,
				sc.flow_20ft,
				sc.flow_40ft,
				sd.destination_name,
				r.region_code AS destination_country
			FROM shipping_costs AS sc
			JOIN shipping_destinations AS sd USING(destination_id)
			JOIN regions as r ON r.region_id = sd.region_id
			WHERE sd.destination_active = TRUE
			ORDER BY
				r.region_code DESC, 
				sd.destination_name ASC;
		`; // End sql
		const result = await pool.query(sql);
		res.send(result.rows);
	} catch (error) {
		console.error('Error in shipping costs GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

// //Post Route - adds shipping cost
// router.post('/', rejectUnauthenticated, (req, res) => {
// 	//query to add a new lane to the shipping costs table
// 	const queryText = `INSERT INTO "shipping_costs" ("destination_name", "dc_price", "flow_cpea_price", "fibers_price")
//             VALUES ($1, $2, $3, $4);`;
// 	pool.query(queryText, [req.body.destination_name, req.body.dc_price, req.body.flow_cpea_price, req.body.fibers_price])
// 		.then(result => {
// 			res.sendStatus(201)
// 		}).catch((error) => {
// 			console.error('Error in shipping costs POST route', error);
// 			res.sendStatus(500);
// 		})
// });

//PUT route - updates shipping costs
router.put('/edit-shipping-costs', rejectUnauthenticated, async (req, res) => {
	try {
		let sql = `
			UPDATE "shipping_costs" AS sc 
			SET "shipping_cost" = v.shipping_cost
			FROM (VALUES 
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(`(%L::int, %L::decimal), `, cost.shipping_cost_id, cost.shipping_cost);
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		sql += `
			) AS v(shipping_cost_id, shipping_cost)
			WHERE v.shipping_cost_id = sc.shipping_cost_id;
		`; // End sql
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(202);
	} catch (error) {
		console.error('Error with shipping costs edit: ', error);
		res.sendStatus(500);
	}; // End try/catch
});
//#endregion - Shipping Cost routes baove. 

//#region - Shipping Cost History routes below:
// GET route - gets shipping cost history
router.get('/get-all-shipping-cost-history', async (req, res) => {
	try {
		const sql = `
			SELECT 
				sch.shipping_cost_history_id,
				sch.shipping_cost_id,
				sch.dc_20ft,
				sch.dc_40ft,
				sch.fibers_20ft,
				sch.fibers_40ft,
				sch.cpea_20ft,
				sch.cpea_40ft,
				sch.flow_20ft,
				sch.flow_40ft,
				TO_CHAR(sch.date_saved, 'YYYY-MM') AS date_saved,
				TO_CHAR(sch.date_saved, 'YYYY-MM-DD') AS date_saved_full,
				sc.destination_id,
				sd.destination_name,
				r.region_code AS destination_country
			FROM shipping_cost_history AS sch
			JOIN shipping_costs AS sc USING(shipping_cost_id)
			JOIN shipping_destinations AS sd USING(destination_id)
			JOIN regions as r ON r.region_id = sd.region_id
			WHERE sd.destination_active = TRUE
			ORDER BY
				sch.date_saved DESC,
				r.region_code DESC, 
				sd.destination_name ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in shipping costs GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

router.get('/get-one-year-of-shipping-cost-history', async (req, res) => {
	try {
		const sql = `
			SELECT 
				sch.shipping_cost_history_id,
				sch.shipping_cost_id,
				sch.dc_20ft,
				sch.dc_40ft,
				sch.fibers_20ft,
				sch.fibers_40ft,
				sch.cpea_20ft,
				sch.cpea_40ft,
				sch.flow_20ft,
				sch.flow_40ft,
				TO_CHAR("sch".date_saved, 'YYYY-MM') AS "date_saved",
				TO_CHAR(sch.date_saved, 'YYYY-MM-DD') AS date_saved_full,
				sc.destination_id,
				sd.destination_name,
				r.region_code AS destination_country
			FROM shipping_cost_history AS sch
			JOIN shipping_costs AS sc USING(shipping_cost_id)
			JOIN shipping_destinations AS sd USING(destination_id)
			JOIN regions as r ON r.region_id = sd.region_id
			WHERE sd.destination_active = TRUE
				AND "sch".date_saved > NOW() - INTERVAL '1 year'
			ORDER BY
				"sch".date_saved DESC,
				"r".region_code DESC, 
				"sd".destination_name ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		// ⬇ Make an object of results indexed by date_saved:
		const results = {};
		for (let row of rows) {
			if (!results[row.date_saved]) {
				results[row.date_saved] = [];
			}; // End if
			results[row.date_saved].push(row);
		}; // End for loop
		res.send(results);
	} catch (error) {
		console.error('Error in shipping costs GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

// ! Deprecated. 
// router.get('/get-recent-shipping-cost-history', async (req, res) => {
// 	try {
// 		const sql = `
// 			SELECT 
// 				"sch".shipping_cost_history_id,
// 				"sch".shipping_cost_id,
// 				"sch".shipping_cost,
// 				"sch".date_saved,
// 				"p".product_label,
// 				"c".container_length_ft, 
// 				"sd".destination_name,
// 				"c".container_destination
// 			FROM "shipping_cost_history" AS "sch"
// 			JOIN "shipping_costs" AS "sc"
// 				ON "sc".shipping_cost_id = "sch".shipping_cost_id
// 			JOIN "shipping_destinations" AS "sd"
// 				ON "sd".destination_id = "sc".destination_id
// 			JOIN "product_containers" AS "pc"
// 				ON "pc".product_container_id = "sc".product_container_id
// 			JOIN "products" AS "p"
// 				ON "p".product_id = "pc".product_id
// 			JOIN "containers" AS "c"
// 					ON "pc".container_id = "c".container_id
// 			WHERE "sd".destination_active = TRUE
// 			ORDER BY "sch".shipping_cost_history_id DESC
// 			LIMIT 8;
// 		`; // End sql
// 		const { rows } = await pool.query(sql);
// 		res.send(rows);
// 	} catch (error) {
// 		console.error('Error in shipping costs GET router', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// });

// router.get('/get-specific-shipping-cost-history', async (req, res) => {
// 	const { date_saved, destination_id } = req.query;
// 	try {
// 		const sql = `
// 			SELECT
// 				"sch".shipping_cost_history_id,
// 				"sch".shipping_cost_id,
// 				"sch".shipping_cost,
// 				"sch".date_saved,
// 				"p".product_label,
// 				"c".container_length_ft, 
// 				"sd".destination_name,
// 				r.region_code AS container_destination
// 			FROM "shipping_cost_history" AS "sch"
// 			JOIN "shipping_costs" AS "sc"
// 				ON "sc".shipping_cost_id = "sch".shipping_cost_id
// 			JOIN "shipping_destinations" AS "sd"
// 				ON "sd".destination_id = "sc".destination_id
// 			JOIN "product_containers" AS "pc"
// 				ON "pc".product_container_id = "sc".product_container_id
// 			JOIN "products" AS "p"
// 				ON "p".product_id = "pc".product_id
// 			JOIN "containers" AS "c"
// 				ON "pc".container_id = "c".container_id
// 			JOIN regions AS r 
// 				ON r.region_id = c.region_id
// 			WHERE 
// 				"date_saved" <= ${format('%L', date_saved)} AND 
// 				"sd".destination_id = ${format('%L', destination_id)}
// 			ORDER BY "date_saved" DESC
// 			LIMIT 8;
// 		`; // End sql
// 		const { rows } = await pool.query(sql);
// 		res.send(rows);
// 	} catch (error) {
// 		console.error('Error in shipping costs GET router', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// });

// // ⬇ POST route - adds shipping cost history
// router.post('/submit-shipping-cost-history', rejectUnauthenticated, async (req, res) => {
// 	try {
// 		// ⬇ Date in YYYY-MM-DD format: 
// 		const date = req.body.date ? req.body.date : new Date().toISOString().slice(0, 10);
// 		let sql = `
// 			INSERT INTO "shipping_cost_history" (
// 				"shipping_cost_id", 
// 				"dc_20ft", 
// 				"dc_40ft",
// 				"fibers_20ft",
// 				"fibers_40ft",
// 				"cpea_20ft",
// 				"cpea_40ft",
// 				"flow_20ft",
// 				"flow_40ft",
// 				"date_saved"
// 			)
// 			VALUES
// 		`; // End sql
// 		// ⬇ Loop through the req.body array to build the query:
// 		for (let cost of req.body.data) {
// 			sql += format(
// 				`(%L::int, %L::decimal, %L::decimal, %L::decimal, %L::decimal, %L::decimal, %L::decimal, %L::decimal, %L::decimal, %L), `,
// 				cost.shipping_cost_id, cost.dc_20ft, cost.dc_40ft, cost.fibers_20ft, cost.fibers_40ft, cost.cpea_20ft, cost.cpea_40ft, cost.flow_20ft, cost.flow_40ft, date
// 			);
// 		}; // End for loop
// 		// ⬇ Remove the last comma and space:
// 		sql = sql.slice(0, -2);
// 		sql += `;`;
// 		// ⬇ Send the query to the database:
// 		const result = await pool.query(sql);
// 		// ⬇ Send the response:
// 		res.sendStatus(201);
// 	} catch (error) {
// 		console.error('Error in shipping costs history POST route', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// }); // End POST route
//#endregion - Shipping Cost History routes above. 

module.exports = router;