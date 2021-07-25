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
// **************** NEED TO REJECT UNAUTHENTICATED ********************
router.get('/all', (req, res) => {
  // SQL query to GET all estimates along the floor type names, licensee names, placement type names, and shipping state/province names
  const queryText = `SELECT "estimates".*, "floor_types".floor_type, "licensees".licensee_contractor_name, "placement_types".placement_type, "shipping_costs".ship_to_state_province FROM "estimates"
                     JOIN "floor_types" ON "estimates".floor_types_id = "floor_types".id
                     JOIN "licensees" ON "estimates".licensee_id = "licensees".id
                     JOIN "placement_types" ON "estimates".placement_types_id = "placement_types".id
                     JOIN "shipping_costs" ON "estimates".shipping_costs_id = "shipping_costs".id
                     ORDER BY "estimates".id DESC;`;
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


  // PUT request to edit a single piece of data on one row of the estimates table
  // **************** NEED TO REJECT UNAUTHENTICATED ********************
  router.put('/edit/:id', (req, res) => {
    console.log('got to PUT route! params id, req.body', req.params.id, req.body);
    
    // SQL query to update a specific piece of data
    // THIS ISN"T WORKING RIGHT NOW: need to figure out how to sanitize the req.body.dbColumn that's being sent, can't be used with $ to be a value
    // const queryText = `UPDATE "estimates" SET $1 = $2 WHERE "id" = $3`
    // // DB request
    // pool.query(queryText, [req.body.dbColumn, req.body.newValue, req.params.id])
    //   .then(result => {
    //     res.sendStatus(200);
    //   })
    //   .catch(error => {
    //     console.log(`Error with /api/estimates GET for id ${req.params.id}:`, error)
    //   })

      // ***************** THIS MAY NOT BE SECURE ***********************

      // SQL query to update a specific piece of data
      const queryText = `UPDATE "estimates" SET ${req.body.dbColumn} = $1 WHERE "id" = $2`
      // DB request
      pool.query(queryText, [req.body.newValue, req.params.id])
        .then(result => {
          res.sendStatus(200);
        })
        .catch(error => {
          console.log(`Error with /api/estimates/edit PUT for id ${req.params.id}:`, error)
        })
    
  })
  
  // PUT request to mark an estimate flagged for order by licensee to be marked as ordered by an admin, and to add the name of the admin making the request
  // **************** NEED TO REJECT UNAUTHENTICATED ********************
  router.put('/process/:id', (req, res) => {

    // SQL query to switch the marked_as_ordered boolean to true and set the processed_by column to the name of the current admin username
    const queryText = `UPDATE "estimates" SET "marked_as_ordered" = TRUE, "processed_by" = $1 WHERE "id" = $2;`;
    // DB request
    pool.query(queryText, [req.user.username, req.params.id])
      .then(result => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.log(`Error with /api/estimates/process PUT for id ${req.params.id}:`, error)
      })
  })




  module.exports = router;