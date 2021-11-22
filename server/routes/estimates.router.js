const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const format = require('pg-format');
const {
  v4: uuidv4
} = require('uuid');
const axios = require('axios');


// *************************** GET ROUTES ***************************

// GET request to grab estimate at ID/Estimate number for Lookup view
router.get('/lookup/:estimate', (req, res) => {
  const estimateNumber = req.query.estimateNumber
  const licenseeId = req.query.licenseeId

  // SQL query to GET a specific estimate along the floor type names, licensee names, placement type names, and shipping state/province names
  const queryText = `
    SELECT "estimates".*, "floor_types".floor_type, "licensees".licensee_contractor_name, "placement_types".placement_type, "shipping_costs".ship_to_state_province FROM "estimates"
    JOIN "floor_types" ON "estimates".floor_types_id = "floor_types".id
    JOIN "licensees" ON "estimates".licensee_id = "licensees".id
    JOIN "placement_types" ON "estimates".placement_types_id = "placement_types".id
    JOIN "shipping_costs" ON "estimates".shipping_costs_id = "shipping_costs".id
    WHERE "estimate_number" = $1 AND "licensee_id" = $2
    ORDER BY "estimates".id DESC;
  `;
  pool.query(queryText, [estimateNumber, licenseeId])
    .then((result) =>
      res.send(result.rows)
    )
    .catch(error => {
      console.error(`Error with /api/estimates/lookup/:estimates GET`, error);
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

  pool.query(queryText)
    .then((result) => res.send(result.rows))
    .catch(error => {
      console.error('Error with /api/estimates/all GET: ', error);
      res.sendStatus(500);
    })

})


// *************************** POST ROUTES ***************************

// POST Route for Licensee Information -> Includes both Metric and Imperial Inputs
router.post('/', async (req, res) => {
  // set the values sent from licensee by destructuring req.body
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
    primx_steel_fibers_dosage_kgs,
    waste_factor_percentage,
    combined_estimate_number_1,
    combined_estimate_number_2,
    combined_estimate_number_3
  } = req.body

  // create a unique UUID estimate number to use for the estimate being sent
  let estimate_number = "";

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
    estimate_number,
    combined_estimate_number_1,
    combined_estimate_number_2,
    combined_estimate_number_3,
    waste_factor_percentage
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
    "combined_estimate_number_1",
    "combined_estimate_number_2",
    "combined_estimate_number_3",
    "waste_factor_percentage",
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

  } else if (req.body.measurement_units == 'metric') {
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
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37
      )
      RETURNING "id";
  `
  try {
    // First DB query: initial POST request with data from the client
    let { rows } = await pool.query(queryText, values);
    const id = rows[0].id   

    // Second DB query: GET the full name of the licensee from the licensee table since licensee name from the client is stored as licensee_id
    const secondQueryText = `SELECT licensee_contractor_name 
                             FROM "licensees"
                             WHERE "id" = $1;
                             `;
    const licenseeNameResponse = await pool.query(secondQueryText, [licensee_id]);

    // create the specified shorter estimate number using the logic below and the returned id number from the original POST
    const letters = licenseeNameResponse.rows[0].licensee_contractor_name.slice(0, 2);
    let newEstimateNumber = letters.toUpperCase() + (123000 + (id * 3));

    // if a combined etsimate, add a letter C to the estimate number    
    if(combined_estimate_number_1 && combined_estimate_number_2) {
      newEstimateNumber += "-C";
    }
    
    // Third DB query: PUT to update the newly created estimate with the shorter estimate number just created
    const thirdQueryText = `UPDATE "estimates" 
                            SET estimate_number = $1 
                            WHERE "id" = $2;
                            `;
    await pool.query(thirdQueryText, [newEstimateNumber, id]);
    res.send({
      estimate_number: newEstimateNumber,
      licensee_id: licensee_id,
      id: id
    })
  } catch (error) {
    console.error('Problem with estimates POST', error);
    res.sendStatus(500);
  }
});


// *************************** PUT ROUTES ***************************

// PUT request to edit a single piece of data on one row of the estimates table
router.put('/edit/:id', rejectUnauthenticated, (req, res) => {
  // SQL query to update a specific piece of data, use pg-format to sanitize it first since DB column to update comes in from client side
  const queryText = format(`UPDATE "estimates" SET %I = $1 WHERE "id" = $2;`, req.body.dbColumn);

  pool.query(queryText, [req.body.newValue, req.params.id])
    .then(result => res.sendStatus(200))
    .catch(error => {
      console.error(`Error with /api/estimates/edit PUT for id ${req.params.id}:`, error)
    })
})

// PUT request to mark an estimate flagged for order by licensee to be marked as ordered by an admin, and to add the name of the admin making the request
router.put('/process/:id', rejectUnauthenticated, (req, res) => {
  // Set an order_number variable to be saved in the database. The order number is an O- followed by the estimate number
  const order_number = `O-${req.body.estimate_number}`
  // SQL query to switch the marked_as_ordered boolean to true and set the processed_by column to the name of the current admin username
  const queryText = `UPDATE "estimates" SET "marked_as_ordered" = TRUE, "processed_by" = $1, "order_number" = $2 WHERE "id" = $3;`;

  pool.query(queryText, [req.user.username, order_number, req.params.id])
    .then(result => res.sendStatus(200))
    .catch(error => {
      console.error(`Error with /api/estimates/process PUT for id ${req.params.id}:`, error)
    })
})

// PUT request to archive an estimate
router.put('/archive/:id', rejectUnauthenticated, (req, res) => {
  // SQL query to switch the marked_as_ordered boolean to true and set the processed_by column to the name of the current admin username
  const queryText = `UPDATE "estimates" SET "archived" = TRUE WHERE "id" = $1;`;

  pool.query(queryText, [req.params.id])
    .then(result => res.sendStatus(200))
    .catch(error => {
      console.error(`Error with /api/estimates/archive PUT for id ${req.params.id}:`, error)
    })
})

// PUT request to mark an estimate as ordered by a licensee and add the P.O. number they've supplied to the estimate
router.put('/order/:id', (req, res) => {
  // SQL query to switch the ordered_by_licensee boolean to true and set the po_number column to the input given by the licensee user
  const queryText = `UPDATE "estimates" SET "ordered_by_licensee" = TRUE, "po_number" = $1 WHERE "id" = $2;`;

  pool.query(queryText, [req.body.po_number, req.params.id])
    .then(result => res.sendStatus(200))
    .catch(error => {
      console.error(`Error with /api/estimates/order/:id PUT for id ${req.params.id}:`, error)
    })
})

// PUT request to take an existing estimate, GET current shipping and materials pricing from the DB, and update the given estimate with the new
// pricing data
router.put('/recalculate/:id', (req, res) => {
  // SQL query to switch the ordered_by_licensee boolean to true and set the po_number column to the input given by the licensee user
  const queryText = `UPDATE "estimates" SET "primx_dc_unit_price" = $1, "primx_dc_shipping_estimate" = $2, "primx_flow_unit_price" = $3, 
                     "primx_flow_shipping_estimate" = $4, "primx_steel_fibers_unit_price" = $5, "primx_steel_fibers_shipping_estimate" = $6,
                     "primx_ultracure_blankets_unit_price" = $7, "primx_cpea_unit_price" = $8, "primx_cpea_shipping_estimate" = $9
                     WHERE "estimates".id = $10;`;

  // destructure data received from saga which contains an object with current updated pricing
  const {
    primx_dc_unit_price,
    primx_dc_shipping_estimate,
    primx_flow_unit_price,
    primx_flow_shipping_estimate,
    primx_steel_fibers_unit_price,
    primx_steel_fibers_shipping_estimate,
    primx_ultracure_blankets_unit_price,
    primx_cpea_unit_price,
    primx_cpea_shipping_estimate,
    id
  } = req.body

  // set the pool query values to equal the destructured values
  const values = [
    primx_dc_unit_price,
    primx_dc_shipping_estimate,
    primx_flow_unit_price,
    primx_flow_shipping_estimate,
    primx_steel_fibers_unit_price,
    primx_steel_fibers_shipping_estimate,
    primx_ultracure_blankets_unit_price,
    primx_cpea_unit_price,
    primx_cpea_shipping_estimate,
    id
  ];

  pool.query(queryText, values)
    .then(result => res.sendStatus(200))
    .catch(error => {
      console.error(`Error with /api/estimates/recalculate/:id PUT for id ${req.params.id}:`, error)
    })
})

// *************************** DELETE ROUTES ***************************

router.delete('/delete/:id', rejectUnauthenticated, (req, res) => {
  pool.query('DELETE FROM "estimates" WHERE id=$1', [req.params.id]).then((result) => {
    res.sendStatus(200);
  }).catch((error) => {
    console.error(`Error with /api/estimates/delete/:id for id ${req.params.id}`, error);
    res.sendStatus(500);
  })
});

// PUT request which allows user to update any form-fillable data from the main estimate creation sheet, follows a very similar workflow to the 
// main POST route above
router.put('/clientupdates/:id', (req, res) => {
  // destructure data received from saga which contains an object with all editable DB columns 
  let {
    // shared values regardless of imperial or metric units
    measurement_units,
    country,
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
    waste_factor_percentage,
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

  // save the values array using the destructured data from client
  const values = [
    // starting values don't include metric or imperial specific units
    measurement_units,
    country,
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
    waste_factor_percentage
  ]

  // start the query text with shared values
  let queryText = `
    UPDATE "estimates" SET
    "measurement_units" = $1,
    "country" = $2,
    "project_name" = $3,
    "licensee_id" = $4,
    "project_general_contractor" = $5,
    "ship_to_address" = $6,
    "ship_to_city" = $7,
    "shipping_costs_id" = $8,
    "zip_postal_code" = $9,
    "anticipated_first_pour_date" = $10,
    "project_manager_name" = $11,
    "project_manager_email" = $12,
    "project_manager_phone" = $13,
    "floor_types_id" = $14,
    "placement_types_id" = $15,
    "primx_flow_dosage_liters" = $16,
    "primx_cpea_dosage_liters" = $17,
    "waste_factor_percentage" = $18,
  `
  // Add in the imperial or metric specific values based on unit choice
  if (req.body.measurement_units == 'imperial') {
    // append the imperial specific data to the SQL query
    queryText += `
      "square_feet"= $19,
      "thickness_inches"= $20,
      "thickened_edge_perimeter_lineal_feet"= $21,
      "thickened_edge_construction_joint_lineal_feet"= $22,
      "primx_steel_fibers_dosage_lbs"= $23
      WHERE "id" = $24;
    `
    // add the imperial values to values array
    values.push(
      square_feet, thickness_inches, thickened_edge_perimeter_lineal_feet, thickened_edge_construction_joint_lineal_feet, primx_steel_fibers_dosage_lbs
    )

  }
  else if (req.body.measurement_units == 'metric') {
    // append the metric specific data to the SQL query
    queryText += `
      "square_meters" = $19,
      "thickness_millimeters" = $20,
      "thickened_edge_perimeter_lineal_meters" = $21,
      "thickened_edge_construction_joint_lineal_meters" = $22,
      "primx_steel_fibers_dosage_kgs" = $23
      WHERE "id" = $24;
    `
    // add the metric values to the values array
    values.push(
      square_meters, thickness_millimeters, thickened_edge_perimeter_lineal_meters, thickened_edge_construction_joint_lineal_meters, primx_steel_fibers_dosage_kgs
    )
  }

  // add id to the values array
  values.push(req.params.id);

  pool.query(queryText, values)
    .then(result => {
      res.sendStatus(200)
    })
    .catch(error => {
      console.error(`Error with /api/estimates/clientupdates/:id PUT for id ${req.params.id}:`, error)
    })
})

// PUT request for when an individual estimate is saved in a combined estimate: 
router.put('/usedincombine/:id', (req, res) => {
  console.log('*** usedincombine', req.body, res);
  
  // const queryText = `UPDATE "estimates" SET "used_in_a_combined_estimate" = TRUE, WHERE "id" = $1;`;

})



module.exports = router;
