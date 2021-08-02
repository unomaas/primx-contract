const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');

// GET route - gets shipping costs
router.get('/', (req, res) => {
  //query to grab al info from the shipping_costs table
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
  //query to add a new lane to the shipping costs table
  const queryText = `INSERT INTO "shipping_costs" ("ship_to_state_province", "dc_price", "flow_cpea_price", "fibers_price")
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
router.put('/edit/:id', rejectUnauthenticated, (req, res) => {
    const queryText =  format(`UPDATE "shipping_costs" SET %I = $1 WHERE "id" = $2;`, req.body.dbColumn);
    pool.query(queryText, [req.body.newValue, req.params.id])
    .then(result => {
    res.sendStatus(202);
    }).catch ((error) => {
      console.log('error in shipping costs PUT route -->', error);
      res.sendStatus(500);
    });
  });

module.exports = router;