const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
  //query text to grab all data from the floor types table
  const queryText = `SELECT * FROM "floor_types";`;
  pool.query(queryText).then((result) => {
      res.send(result.rows);
  }).catch((error) => {
      console.log('error in floor types GET router', error);
      res.sendStatus(500);
  })
});

//Post Route - adds floor type to DB
router.post('/', rejectUnauthenticated, (req, res) => {
  // query text to add a new floor type to the floor_types table
  queryText = `INSERT INTO "floor_types" ("floor_type")
            VALUES ($1);`;
    pool.query(queryText, [req.body.floor_type])
    .then(result => {
      res.sendStatus(201)
    })
    .catch(error => {
      console.log('error in floor type POST route', error);
      res.sendStatus(500);
    })
});

module.exports = router;