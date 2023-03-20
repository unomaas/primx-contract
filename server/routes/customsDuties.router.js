const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');


router.get('/fetch-customs-duties', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM "customs_duties" AS "cd"
			ORDER BY "cd".custom_duty_id ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET', error);
		res.sendStatus(500);
	}; // End try/catch
});


router.put('/edit-customs-duties', rejectUnauthenticated, async (req, res) => {
	try {
		let sql = `
			UPDATE "customs_duties" AS cd 
			SET 
				"USA_percent" = v.USA_percent,
				"CAN_percent" = v.CAN_percent
			FROM (VALUES 
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(
				`(%L::int, %L::decimal, %L::decimal), `,
				cost.custom_duty_id, cost.USA_percent, cost.CAN_percent
			); // End format
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		sql += `
			) AS v(custom_duty_id, USA_percent, CAN_percent)
			WHERE v.custom_duty_id = cd.custom_duty_id;
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
//#endregion - Shipping Cost routes baove. 

//#region - Shipping Cost History routes below:
// GET route - gets shipping cost history
router.get('/get-all-customs-duties-history', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM "customs_duties_history" AS "cdh"
			JOIN "customs_duties" AS "cd" using ("custom_duty_id") 
			ORDER BY "cdh".custom_duty_id ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs dutie GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

router.get('/get-one-year-of-customs-duties-history', async (req, res) => {
	try {
		const sql = `
			SELECT 
				*,
				TO_CHAR("cdh".date_saved, 'YYYY-MM-DD') AS "date_saved"
			FROM "customs_duties_history" AS "cdh"
			JOIN "customs_duties" AS "cd" using ("custom_duty_id") 
			WHERE "cdh".date_saved >= NOW() - INTERVAL '1 year'
			ORDER BY "cdh".custom_duty_id ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

router.get('/get-recent-customs-duties-history', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM "customs_duties_history" AS "cdh"
			ORDER BY "cdh".custom_duty_history_id DESC
			LIMIT 6;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

router.get('/get-specific-customs-duties-history', async (req, res) => {
	const { date_saved } = req.query;
	try {
		const sql = `
			SELECT * 
			FROM "customs_duties_history"
			WHERE "date_saved" <= ${format('%L', date_saved)}
			ORDER BY "date_saved" DESC
			LIMIT 6;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

// ⬇ POST route - adds shipping cost history
router.post('/submit-customs-duties-history', rejectUnauthenticated, async (req, res) => {
	try {
		// ⬇ Today's date in YYYY-MM-DD format: 
		const today = new Date().toISOString().slice(0, 10);
		let sql = `
			INSERT INTO "customs_duties_history" (
				"custom_duty_id", "USA_percent", "CAN_percent", "date_saved"
			)
			VALUES
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(
				`(%L::int, %L::decimal, %L::decimal, NOW()), `,
				cost.custom_duty_id, cost.USA_percent, cost.CAN_percent
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