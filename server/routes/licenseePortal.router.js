const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const calculateEstimate = require('../modules/useEstimateCalculations-module');

// * GET Routes Below: 
// ⬇ GET :id pulls all of the estimates from the associated Licensee ID passed in.  This is part of the Licensee Portal initial data load.  It will return an indexed data object. 
router.get('/:id', rejectUnauthenticated, async (req, res) => {
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
		// ⬇ Empty array containers to push to: 
		let processed_orders = [];
		let pending_orders = [];
		let archived_orders = [];
		let open_orders = [];
		// ⬇ Sorting the estimates pulled for the licensee: 
		for (const estimate of result.rows) {
			const calculated_estimate = calculateEstimate(estimate);
			// ⬇ If the estimate is marked as ordered by both sides, it's Processed:
			if (calculated_estimate.marked_as_ordered && calculated_estimate.ordered_by_licensee) {
				processed_orders.push(calculated_estimate);
			} else if (calculated_estimate.ordered_by_licensee) {
				// ⬇ If this calculated_estimate was used in a combined, hide it from the GUI: 
				if (calculated_estimate.archived) {
					continue;
				} // End if 
				// ⬇ Else if it's ready to order by licensee, it's Pending:
				pending_orders.push(calculated_estimate);
			} else if (calculated_estimate.archived) {
				// ⬇ If it's been marked as Archived by the user, sort here: 
				archived_orders.push(calculated_estimate);
			} else {
				// ⬇ Else it's an Open order: 
				open_orders.push(calculated_estimate);
			} // End if/else
		} // End for of loop
		// ⬇ Will convert an array of objects into an object indexed by a key: 
		const arrayToObjectConverter = (array, key) => Object.assign({}, ...array.map(property => ({ [property[key]]: property })));
		// ⬇ Organizing the data into an indexed object: 
		const data = {
			// ! Kind of a bummer that the MUI Data Grid needs arrays, not objects. :( 
			// [`processed_orders`]: arrayToObjectConverter(processed_orders, 'estimate_number'),
			// [`pending_orders`]: arrayToObjectConverter(pending_orders, 'estimate_number'),
			// [`archived_orders`]: arrayToObjectConverter(archived_orders, 'estimate_number'),
			// [`open_orders`]: arrayToObjectConverter(open_orders, 'estimate_number'),
			[`open_orders_array`]: open_orders,
			[`pending_orders_array`]: pending_orders,
			[`archived_orders_array`]: archived_orders,
			[`processed_orders_array`]: processed_orders,
		} // End data
		// ⬇ Sending sorted data back: 
		res.send(data);
	} catch (error) {
		console.error('Error in /licenseePortal GET', error)
		res.sendStatus(500);
	} // End try/catch
}); // End GET :id

module.exports = router;
