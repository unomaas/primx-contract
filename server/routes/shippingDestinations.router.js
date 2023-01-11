const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');

// GET route - gets shipping destinations
router.get('/active', async (req, res) => {
	try {
		const sql = `
			SELECT * 
			FROM "shipping_destinations"
			WHERE destination_active = TRUE
			ORDER BY destination_id ASC;
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
			SELECT * 
			FROM "shipping_destinations"
			ORDER BY destination_id ASC;
		`; // End sql
		const {rows} = await pool.query(sql);
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