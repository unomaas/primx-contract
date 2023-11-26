const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

router.get('/get-active-regions', rejectUnauthenticated, async (req, res) => {
	const queryText = `
		SELECT * 
		FROM regions AS r
		WHERE r.is_active = true
		ORDER BY region_id;
	`;
	try {
		const results = await pool.query(queryText);
		res.send(results.rows);
	} catch (error) {
		console.error('Error getting regions', error);
		res.sendStatus(500);
	}
});

router.get('/get-all-regions', rejectNonAdmin, async (req, res) => {
	const queryText = 'SELECT * FROM regions ORDER BY region_id;';
	try {
		const results = await pool.query(queryText);
		res.send(results.rows);
	} catch (error) {
		console.error('Error getting regions', error);
		res.sendStatus(500);
	}
});

/**
* POST route template for regions
*/
router.post('/create-new-region', rejectNonAdmin, async (req, res) => {
	const queryText = 'INSERT INTO regions (region_code, is_active) VALUES ($1, true);';
	try {
		await pool.query(queryText, [req.body.region_code, req.body.is_active]);
		res.sendStatus(201);
	} catch (error) {
		console.error('Error adding new region', error);
		res.sendStatus(500);
	}
});

/**
* PUT route template for regions
*/
router.put('/:region_id', rejectNonAdmin, async (req, res) => {
	const queryText = 'UPDATE regions SET region_code = $1, is_active = $2 WHERE region_id = $3;';
	try {
		await pool.query(queryText, [req.body.region_code, req.body.is_active, req.params.region_id]);
		res.sendStatus(200);
	} catch (error) {
		console.error('Error updating region', error);
		res.sendStatus(500);
	}
});

/**
* DELETE route template for regions
*/
router.delete('/:region_id', rejectNonAdmin, async (req, res) => {
	const queryText = 'DELETE FROM regions WHERE region_id = $1;';
	try {
		await pool.query(queryText, [req.params.region_id]);
		res.sendStatus(204);
	} catch (error) {
		console.error('Error deleting region', error);
		res.sendStatus(500);
	}
});

module.exports = router;
