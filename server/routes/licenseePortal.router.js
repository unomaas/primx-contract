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
		// ⬇ Will convert an array of objects into an object indexed by id's: 
		// const arrayToObjectConverter = (arr, key) => Object.assign({}, ...arr.map(item => ({[item[key]]: item})));
		// Sorting the result: 
		// const sorted_result = arrayToObjectConverter(result.rows, 'id');

		// TODO: It's probably better just to do a for of loop, and then do the object loop when absolutely necessary.  

		let processed_orders = [];
		let pending_orders = [];
		let archived_orders = [];
		let open_orders = [];


		// for (let i in sorted_result) {
		for (let estimate of result.rows) {
			console.log('estimate is', estimate);

			if (estimate.marked_as_ordered && estimate.ordered_by_licensee) {
				processed_orders.push(estimate);
			} // orders are considered pending if they've been ordered_by_licensee by a licensee but not yet marked_as_ordered by an admin
			else if (estimate.ordered_by_licensee) {
				// If this estimate was used in a combined, hide it from the GUI: 
				if (estimate.archived) {
					continue;
				}
				pending_orders.push(estimate); 
			} // orders are considered archived if they have estimate.archived marked true my admin via the archive button
			else if (estimate.archived){
				archived_orders.push(estimate);
			} // orders where neither of those are true are considered open
			else {
				open_orders.push(estimate);
			}
			
			// const estimate = sorted_result[i];
			// if (estimate.marked_as_ordered && estimate.ordered_by_licensee)
		}

		console.log('***', processed_orders, pending_orders, archived_orders, open_orders	);
		

		const data = {
			[processed_orders]: processed_orders,
			[pending_orders]: pending_orders,
			[archived_orders]: archived_orders,
			[open_orders]: open_orders,
		}
		console.log('*** data is', data);
		
		// ⬇ Sending sorted data back: 
		// res.send(result.rows);
		// res.send(sorted_result);
		res.send(data);

	} catch (error) {
		console.error('Error in /licenseePortal GET', error)
		res.sendStatus(500);
	} // End try/catch
}); // End GET :id

module.exports = router;
