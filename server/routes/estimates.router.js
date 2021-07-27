const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

/**
 * GET route template
 */
router.get('/', (req, res) => {
  // GET route code here
});

// GET request to get all estimates data from the database
router.get('/all', rejectUnauthenticated, (req, res) => {
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


// POST Route for Liscensee Information -> Includes both Metric and Imperial Inputs
router.post('/', (req, res) => {
  console.log('In /api/estimates/ POST route with incoming data:', req.body);

  const queryText = `
                    INSERT INTO "estimates" (

                    "measurement_units",
                    "country",
                    "date_created",
                    "project_name",
                    "licensee_id",
                    "project_general_contractor",
                    "ship_to_address",
                    "ship_to_city",
                    "shipping_costs_id",
                    "zip_postal_code",
                    "anticipated_first_pour_date",
                    "project_manager_name",
                    "project_manager_email",
                    "project_manager_phone","floor_types_id",
                    "placement_types_id",
                    "square_meters",
                    "thickness_millimeters",
                    "thickened_edge_perimeter_lineal_meters",
                    "thickened_edge_construction_joint_lineal_meters",
                    "primx_flow_dosage_liters",
                    "primx_steel_fibers_dosage_kgs",
                    "primx_cpea_dosage_liters",
                    "primx_dc_unit_price",
                    "primx_dc_shipping_estimate",
                    "primx_flow_unit_price",
                    "primx_flow_shipping_estimate",
                    "primx_steel_fibers_unit_price",
                    "primx_steel_fibers_shipping_estimate",
                    "primx_ultracure_blankets_unit_price",
                    "primx_cpea_unit_price",
                    "primx_cpea_shipping_estimate",
                    "estimate_number"
                    )

                    VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                    $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                    $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32
                    );
                    
                    `
  
  // ROUTE IS INCOMPLETE
  // req.body NEEDS to be updated for all 32 values
  pool.query(queryText, [req.body])
    .then(result => {
      res.sendStatus(200);
      })
      .catch(error => {
      console.log(`Error with /api/estimates/ POST for id ${req.params.id}:`, error)
      res.sendStatus(500);
      })
});


// PUT request to edit a single piece of data on one row of the estimates table
router.put('/edit/:id', rejectUnauthenticated, (req, res) => {
  console.log('got to PUT route! params id, req.body', req.params.id, req.body);

  // SQL query to update a specific piece of data
  // THIS ISN"T WORKING RIGHT NOW: need to figure out how to sanitize the req.body.dbColumn that's being sent, can't be used with $ to be a value
  // const queryText = `UPDATE "estimates" SET "$1" = $2 WHERE "id" = $3`
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
router.put('/process/:id', rejectUnauthenticated, (req, res) => {

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