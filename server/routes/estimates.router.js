const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const format = require('pg-format');
const { v4: uuidv4 } = require('uuid');


// GET request to grab estimate at ID/Estimate number for Lookup view
router.get('/lookup/:estimate', (req, res) => {
  const estimateNumber = req.query.estimateNumber
  const licenseeId = req.query.licenseeId

  const queryText =
                  `SELECT * FROM estimates 
                   WHERE "estimate_number" = '$1'
                   AND "licensee_id" = '$2';`
  
  pool.query(queryText, [estimateNumber, licenseeId])
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log(`Error with /api/estimates/lookup POST:`, error);
      res.sendStatus(500)
    })
})


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


// POST Route for Licensee Information -> Includes both Metric and Imperial Inputs
router.post('/', (req, res) => {
  // console.log('In /api/estimates/ POST route with incoming data:', req.body);
  
  // set the values sent from licensee
  // destructure the req.body values shared between metric and imperial units
  let {
    // shared values regardless of imperial or metric units
    measurement_units,
    country,
    date_created,
    project_name,
    licensee_id,
    project_general_contractor,
    ship_to_address,
    ship_to_city,
    shipping_costs_id,
    zip_postal_code,
    anticipated_first_pour_date,
    project_manager_name,
    project_manager_email,
    project_manager_phone,
    floor_types_id,
    placement_types_id,
    primx_flow_dosage_liters,
    primx_cpea_dosage_liters,
    primx_dc_unit_price,
    primx_dc_shipping_estimate,
    primx_flow_unit_price,
    primx_flow_shipping_estimate,
    primx_steel_fibers_unit_price,
    primx_steel_fibers_shipping_estimate,
    primx_ultracure_blankets_unit_price,
    primx_cpea_unit_price,
    primx_cpea_shipping_estimate,
    // unit specific values
    square_feet,
    thickness_inches,
    thickened_edge_perimeter_lineal_feet,
    thickened_edge_construction_joint_lineal_feet,
    primx_steel_fibers_dosage_lbs,
    square_meters,
    thickness_millimeters,
    thickened_edge_perimeter_lineal_meters,
    thickened_edge_construction_joint_lineal_meters,
    primx_steel_fibers_dosage_kgs
  } = req.body

  // create a unique UUID estimate number to use for the estimate being sent
  estimate_number = uuidv4();
  
  // set the destructured object values as the values to send with the POST request
  const values = [
    // starting values don't include metric or imperial specific units
    measurement_units,
    country,
    date_created,
    project_name,
    licensee_id,
    project_general_contractor,
    ship_to_address,
    ship_to_city,
    shipping_costs_id,
    zip_postal_code,
    anticipated_first_pour_date,
    project_manager_name,
    project_manager_email,
    project_manager_phone,
    floor_types_id,
    placement_types_id,
    primx_flow_dosage_liters,
    primx_cpea_dosage_liters,
    primx_dc_unit_price,
    primx_dc_shipping_estimate,
    primx_flow_unit_price,
    primx_flow_shipping_estimate,
    primx_steel_fibers_unit_price,
    primx_steel_fibers_shipping_estimate,
    primx_ultracure_blankets_unit_price,
    primx_cpea_unit_price,
    primx_cpea_shipping_estimate,
    estimate_number
  ]

  // start the query text with shared values
  let queryText = `
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
    "project_manager_phone",
    "floor_types_id",
    "placement_types_id",
    "primx_flow_dosage_liters",
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
    "estimate_number",
  `
  // Add in the imperial or metric specific values based on unit choice
  if (req.body.measurement_units == 'imperial') {
    // append the imperial specific data to the SQL query
    queryText += `
      "square_feet",
      "thickness_inches",
      "thickened_edge_perimeter_lineal_feet",
      "thickened_edge_construction_joint_lineal_feet",
      "primx_steel_fibers_dosage_lbs"
      )
    `
    // add the imperial values to values array
    values.push(
      square_feet, thickness_inches, thickened_edge_perimeter_lineal_feet, thickened_edge_construction_joint_lineal_feet, primx_steel_fibers_dosage_lbs
    )
  
  }
  else if (req.body.measurement_units == 'metric') {
    // append the metric specific data to the SQL query
    queryText += `
      "square_meters",
      "thickness_millimeters",
      "thickened_edge_perimeter_lineal_meters",
      "thickened_edge_construction_joint_lineal_meters",
      "primx_steel_fibers_dosage_kgs"
      )
    `
    // add the metric values to the values array
    values.push(
      square_meters, thickness_millimeters, thickened_edge_perimeter_lineal_meters, thickened_edge_construction_joint_lineal_meters, primx_steel_fibers_dosage_kgs
    )
  }

  // add the values clause to the SQL query 
  queryText += `
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33
      );
  `
  
  pool.query(queryText, values)
    .then(result => {
      // send back the object created to allow navagiation from the saga to the view of the new estimate
      res.send({
        estimate_number: estimate_number,
        licensee_id: licensee_id
      });
    })
    .catch(error => {
      console.log(`Error with /api/estimates/ POST:`, error)
      res.sendStatus(500);
    })

});




// PUT request to edit a single piece of data on one row of the estimates table
router.put('/edit/:id', rejectUnauthenticated, (req, res) => {
  // SQL query to update a specific piece of data
  const queryText = format(`UPDATE "estimates" SET %I = $1 WHERE "id" = $2;`, req.body.dbColumn);
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