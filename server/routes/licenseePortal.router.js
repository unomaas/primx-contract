const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/:id', async (req, res) => {
	try {
		// ⬇ Destructuring the req.params data: 
		const { id } = req.params;
		// ⬇ Building the params array: 
		const params = [id];
		// ⬇ Pg Query to get all data: 
		const query = `
			SELECT * 
			FROM "estimates"
			WHERE licensee_id = $1;
		`; // End query
		// ⬇ Pulling the data from DB: 
		const result = await pool.query(query, params);
		// ⬇ Sending data back: 
		res.send(result.rows);
	} catch (error) {
		console.error('Error in /licenseePortal GET', error)
		res.sendStatus(500);
	} // End try/catch
}); // End GET :id

module.exports = router;
