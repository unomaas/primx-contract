const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');

// GET route - gets shipping costs
router.get('/', async (req, res) => {

	try {
		const sql = `
			SELECT 
				"sc".shipping_cost_id,
				"p".product_label,
				"c".container_length_ft, 
				"sd".destination_name,
				"c".container_destination,
				"sc".shipping_cost
			FROM "shipping_costs" AS "sc"
			JOIN "shipping_destinations" AS "sd"
				ON "sd".destination_id = "sc".destination_id
			JOIN "product_containers" AS "pc"
				ON "pc".product_container_id = "sc".product_container_id
			JOIN "products" AS "p"
				ON "p".product_id = "pc".product_id
			JOIN "containers" AS "c"
					ON "pc".container_id = "c".container_id
			WHERE "sd".destination_active = TRUE
			ORDER BY "sc".shipping_cost_id ASC;
		`; // End sql
		const result = await pool.query(sql);
		res.send(result.rows);
	} catch (error) {
		console.error('Error in shipping costs GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

//Post Route - adds shipping cost
router.post('/', rejectUnauthenticated, (req, res) => {
	//query to add a new lane to the shipping costs table
	const queryText = `INSERT INTO "shipping_costs" ("ship_to_state_province", "dc_price", "flow_cpea_price", "fibers_price")
            VALUES ($1, $2, $3, $4);`;
	pool.query(queryText, [req.body.ship_to_state_province, req.body.dc_price, req.body.flow_cpea_price, req.body.fibers_price])
		.then(result => {
			res.sendStatus(201)
		}).catch((error) => {
			console.error('Error in shipping costs POST route', error);
			res.sendStatus(500);
		})
});

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
			sql += format(`(%L::int, %L::int), `, cost.shipping_cost_id, cost.shipping_cost);
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		sql += `
			) AS v(shipping_cost_id, shipping_cost)
			WHERE v.shipping_cost_id = sc.shipping_cost_id
			RETURNING true;
		`; // End sql
		// ⬇ Send the query to the database:
		const result = await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(202);
	} catch (error) {
		console.error('Error with shipping costs edit: ', error);
		res.sendStatus(500);
	}; // End try/catch


	// const queryText =  format(`UPDATE "shipping_costs" SET %I = $1 WHERE "id" = $2;`, req.body.dbColumn);
	// pool.query(queryText, [req.body.newValue, req.params.id])
	// .then(result => {
	// res.sendStatus(202);
	// }).catch ((error) => {
	//   console.error('Error in shipping costs PUT route -->', error);
	//   res.sendStatus(500);
	// });
});

module.exports = router;