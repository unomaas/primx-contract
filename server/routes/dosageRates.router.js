const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');


router.get('/fetch-dosage-rates', async (req, res) => {
	try {
		const sql = `
			SELECT
				"dr".dosage_rate_id,
				"p".product_id,
				"p".product_label,
				"dr".lbs_y3,
				"dr".kg_m3
			FROM "dosage_rates" AS "dr"
			JOIN "products" AS "p" 
				ON "p".product_id = "dr".product_id
			ORDER BY "dr".dosage_rate_id ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in dosage rates GET', error);
		res.sendStatus(500);
	}; // End try/catch
});


router.put('/edit-dosage-rates', rejectUnauthenticated, async (req, res) => {
	try {
		let sql = `
			UPDATE "dosage_rates" AS "dr" 
			SET 
				"lbs_y3" = v.lbs_y3,
				"kg_m3" = v.kg_m3
			FROM (VALUES 
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(
				`(%L::int, %L::decimal, %L::decimal), `,
				cost.dosage_rate_id, cost.lbs_y3, cost.kg_m3
			); // End format
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		sql += `
			) AS v(dosage_rate_id, lbs_y3, kg_m3)
			WHERE v.dosage_rate_id = dr.dosage_rate_id;
		`; // End sql
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(202);
	} catch (error) {
		console.error('Error with dosage rates edit: ', error);
		res.sendStatus(500);
	}; // End try/catch
});
//#endregion - Shipping Cost routes baove. 



module.exports = router;