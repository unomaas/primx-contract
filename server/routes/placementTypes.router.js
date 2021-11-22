const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
  // query text to grab all info from placement types table
  const queryText = `SELECT * FROM "placement_types";`;
  pool.query(queryText).then((result) => {
      res.send(result.rows);
  }).catch((error) => {
      console.error('Error in placement types GET router', error);
      res.sendStatus(500);
  })
});

//Post Route - adds placement type to DB
router.post('/', rejectUnauthenticated, (req, res) => {
  // query text to add a new placement type to the table
  queryText = `INSERT INTO "placement_types" ("placement_type")
            VALUES ($1);`;
    pool.query(queryText, [req.body.placement_type])
    .then(result => {
      res.sendStatus(201)
    })
    .catch(error => {
      console.error('Error in placement type post route', error);
      res.sendStatus(500);
    })
});

module.exports = router;
