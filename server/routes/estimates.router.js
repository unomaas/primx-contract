const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
 router.get('/', (req, res) => {
    // GET route code here
  });
  
// GET request to get all estimates data from the database
router.get('/all', (req, res) => {
  // SQL query to GET all estimates along the floor type names, licensee names, placement type names, and shipping state/province names
  const queryText = `SELECT "estimates".*, "floor_types".floor_type, "licensees".licensee_contractor_name, "placement_types".placement_type, "shipping_costs".ship_to_state_province FROM "estimates"
                     JOIN "floor_types" ON "estimates".floor_types_id = "floor_types".id
                     JOIN "licensees" ON "estimates".licensee_id = "licensees".id
                     JOIN "placement_types" ON "estimates".placement_types_id = "placement_types".id
                     JOIN "shipping_costs" ON "estimates".shipping_costs_id = "shipping_costs".id;`;
  // DB request
  pool.query(queryText)
    .then(result => {
      res.send(result.rows);
    })
    .catch(error => {
      console.log('Error with /api/estimates/all GET: ', error);
      res.sendStatus(500);
    })
                  
})

  /**
   * POST route template
   */
  router.post('/', (req, res) => {
    // POST route code here
  });
  
  module.exports = router;