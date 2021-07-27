const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// GET route - gets shipping costs
router.get('/', rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM "shipping_costs" ORDER BY ship_to_state_province ASC;`;
  pool.query(queryText).then((result) => {
      res.send(result.rows);
  }).catch((error) => {
      console.log('error in shipping costs GET router', error);
      res.sendStatus(500);
  })
});

//Post Route - adds shipping cost
router.post('/', rejectUnauthenticated, (req, res) => {
  queryText = `INSERT INTO "shipping_costs" ("ship_to_state_province", "dc_price", "flow_cpea_price", "fibers_price")
            VALUES ($1, $2, $3, $4);`;
    pool.query(queryText, [req.body.ship_to_state_province, req.body.dc_price, req.body.flow_cpea_price, req.body.fibers_price])
    .then(result => {
      res.sendStatus(201)
    }).catch((error) => {
      console.log('error in shipping costs POST route', error);
      res.sendStatus(500);
    })
});

//PUT route - updates shipping costs
router.put('/', rejectUnauthenticated, (req, res) => {
    queryText = `UPDATE "shipping_costs" SET "ship_to_state_province"=$1, "dc_price"=$2, "flow_cpea_price"=$3, "fibers_price"=$4, WHERE .id=$5;`;
    pool.query(queryText, [req.body.ship_to_state_province, req.body.dc_price, req.body.flow_cpea_price, req.body.fibers_price, req.body.id])
    .then(result => {
    res.sendStatus(202);
    }).catch ((error) => {
      console.log('error in shipping costs PUT route -->', error);
      res.sendStatus(500);
    });
  });

module.exports = router;