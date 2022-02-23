const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// * GET Routes Below: 
// ⬇ GET :id pulls all of the estimates from the associated Licensee ID passed in.  This is part of the Licensee Portal initial data load.  
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

		const arrayToObjectConverter = (arr, key) => Object.assign({}, ...arr.map(item => ({[item[key]]: item})));

		// const arrayToObjectConverter = (arr, key) => {
		// 	return arr.reduce((obj, item) => {
		// 		obj[item[key]] = item
		// 		return obj
		// 	}, {})
		// }

		console.log('*** TEST 1', result.rows);
		

		console.log('*** TEST 2', arrayToObjectConverter(result.rows, 'id'));

		const sorted_result = arrayToObjectConverter(result.rows, 'id');


		// ⬇ Sending data back: 
		// res.send(result.rows);
		res.send(sorted_result);

	} catch (error) {
		console.error('Error in /licenseePortal GET', error)
		res.sendStatus(500);
	} // End try/catch
}); // End GET :id

module.exports = router;
