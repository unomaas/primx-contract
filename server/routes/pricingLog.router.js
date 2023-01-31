const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');

router.get('/fetch-initial-load', rejectUnauthenticated, async (req, res) => {
	try {
		const sql = `
			SELECT 
				"pc".product_container_id,
				"p".product_label,
				"c".container_length_ft,
				"c".container_destination,
				"pc".max_pallets_per_container,
				"pc".max_weight_of_container,
				"pc".gross_weight_of_pallet,
				"pc".net_weight_of_pallet
			FROM "product_containers" AS "pc"
			JOIN "products" AS "p" 
				ON "p".product_id = "pc".product_id
			JOIN "containers" AS "c"
				ON "c".container_id = "pc".container_id
			ORDER BY "pc".product_container_id ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET', error);
		res.sendStatus(500);
	}; // End try/catch
});


router.put('/edit-product-container', rejectUnauthenticated, async (req, res) => {
	try {
		let sql = `
			UPDATE "product_containers" AS pc 
			SET 
				"max_pallets_per_container" = v.max_pallets_per_container,
				"max_weight_of_container" = v.max_weight_of_container,
				"gross_weight_of_pallet" = v.gross_weight_of_pallet,
				"net_weight_of_pallet" = v.net_weight_of_pallet
			FROM (VALUES 
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(
				`(%L::int, %L::decimal, %L::decimal, %L::decimal, %L::decimal), `,
				cost.product_container_id, cost.max_pallets_per_container, cost.max_weight_of_container, cost.gross_weight_of_pallet, cost.net_weight_of_pallet
			); // End format
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		sql += `
			) AS v(
				product_container_id, 
				max_pallets_per_container, 
				max_weight_of_container, 
				gross_weight_of_pallet, 
				net_weight_of_pallet
			)
			WHERE v.product_container_id = pc.product_container_id;
		`; // End sql
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(202);
	} catch (error) {
		console.error('Error with customs duties edit: ', error);
		res.sendStatus(500);
	}; // End try/catch
});



module.exports = router;