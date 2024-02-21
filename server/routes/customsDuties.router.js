const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');


router.get('/fetch-customs-duties', rejectUnauthenticated, async (req, res) => {
	let activeClause = '';
	if (req.query.active === 'true') activeClause = 'WHERE r.is_active = true';
	const sql = `
		SELECT
			cd.custom_duty_id, cd.duty_label,
			r.region_id, r.region_code AS destination_country,
			cdr.customs_duties_regions_id, cdr.duty_percentage::REAL, (cdr.duty_percentage * 100)::REAL AS duty_percentage_label
		FROM customs_duties_regions AS cdr
		JOIN regions AS r
			ON cdr.region_id = r.region_id
		JOIN customs_duties AS cd
			ON cdr.custom_duty_id = cd.custom_duty_id
		${activeClause}
		ORDER BY 
			r.region_code DESC, 
			cd.duty_label;
	`; // End sql
	try {
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET', error);
		res.sendStatus(500);
	}; // End try/catch
});

router.get('/get-duties-for-regions', rejectNonAdmin, async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM customs_duties AS cd
			ORDER BY 
				cd.duty_label;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET', error);
		res.sendStatus(500);
	}; // End try/catch
});


router.put('/edit-customs-duties', rejectNonAdmin, async (req, res) => {
	try {
		let sql = `
			UPDATE "customs_duties_regions" AS cdr
			SET "duty_percentage" = v.duty_percentage
			FROM (VALUES 
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(
				`(%L::int, %L::int, %L::decimal), `,
				cost.custom_duty_id, cost.region_id, cost.duty_percentage
			); // End format
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		sql += `
			) AS v(custom_duty_id, region_id, duty_percentage)
			WHERE 
				v.custom_duty_id = cdr.custom_duty_id AND
				v.region_id = cdr.region_id;
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
//#endregion - Shipping Cost routes above. 

//#region - Shipping Cost History routes below:
// GET route - gets shipping cost history
router.get('/get-all-customs-duties-history', rejectNonAdmin, async (req, res) => {
	try {
		const sql = `
			SELECT 
				cdh.custom_duty_history_id,
				cdh.custom_duty_id,
				r.region_id,
				r.region_code AS destination_country,
				cdh.duty_percentage::REAL,
				(cdh.duty_percentage * 100)::REAL AS duty_percentage_label,
				TO_CHAR(cdh.date_saved, 'YYYY-MM') AS "date_saved",
				TO_CHAR(cdh.date_saved, 'YYYY-MM-DD') AS date_saved_full
			FROM customs_duties_history AS cdh
			JOIN regions AS r 
				ON cdh.region_id = r.region_id
			ORDER BY 
				cdh.date_saved DESC, 
				r.region_code DESC,
				cdh.custom_duty_id DESC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

router.get('/get-one-year-of-customs-duties-history', rejectNonAdmin, async (req, res) => {
	try {
		const sql = `
		SELECT 
			cdh.custom_duty_history_id,
			cdh.custom_duty_id,
			r.region_id,
			r.region_code AS destination_country,
			cdh.duty_percentage::REAL,
			(cdh.duty_percentage * 100)::REAL AS duty_percentage_label,
			TO_CHAR(cdh.date_saved, 'YYYY-MM') AS "date_saved",
			TO_CHAR(cdh.date_saved, 'YYYY-MM-DD') AS date_saved_full
		FROM customs_duties_history AS cdh
		JOIN regions AS r 
			ON cdh.region_id = r.region_id
		WHERE cdh.date_saved >= NOW() - INTERVAL '1 year'
		ORDER BY 
			cdh.date_saved DESC, 
			r.region_code DESC,
			cdh.custom_duty_id DESC;
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
		console.error('Error in customs duties GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

// router.get('/get-recent-customs-duties-history', rejectNonAdmin, async (req, res) => {
// 	try {
// 		const sql = `
// 			SELECT 
// 				cdh.*, 
// 				r.region_code AS destination_country,
// 				cdr.duty_percentage
// 			FROM customs_duties_history AS cdh
// 			JOIN customs_duties_regions AS cdr 
// 				ON cdh.custom_duty_id = cdr.custom_duty_id 
// 				AND cdh.region_id = cdr.region_id
// 			JOIN regions AS r 
// 				ON cdr.region_id = r.region_id
// 			ORDER BY cdh.custom_duty_history_id DESC
// 			LIMIT 6;
// 		`; // End sql
// 		const { rows } = await pool.query(sql);
// 		res.send(rows);
// 	} catch (error) {
// 		console.error('Error in customs duties GET router', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// });

// router.get('/get-specific-customs-duties-history', rejectNonAdmin, async (req, res) => {
// 	const { date_saved } = req.query;
// 	try {
// 		const sql = `
// 			SELECT * 
// 			FROM "customs_duties_history"
// 			WHERE "date_saved" <= ${format('%L', date_saved)}
// 			ORDER BY "date_saved" DESC
// 			LIMIT 6;
// 		`; // End sql
// 		const { rows } = await pool.query(sql);
// 		res.send(rows);
// 	} catch (error) {
// 		console.error('Error in customs duties GET router', error);
// 		res.sendStatus(500);
// 	}; // End try/catch
// });

// ⬇ POST route - adds shipping cost history
router.post('/submit-customs-duties-history', rejectNonAdmin, async (req, res) => {
	try {
		// ⬇ Today's date in YYYY-MM-DD format: 
		const today = new Date().toISOString().slice(0, 10);
		let sql = `
			INSERT INTO "customs_duties_history" (
				"custom_duty_id", "duty_percentage", "region_id", "date_saved"
			)
			VALUES
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(
				`(%L::int, %L::decimal, %L::int, NOW()), `,
				cost.custom_duty_id, cost.duty_percentage, cost.region_id
			); // End format
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		sql += `;`;
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(201);
	} catch (error) {
		console.error('Error in customs duties history POST route', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End POST route

module.exports = router;