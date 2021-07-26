const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
  // GET route code here
  const queryText = `SELECT * FROM "placement_types";`;
  pool.query(queryText).then((result) => {
      res.send(result.rows);
  }).catch((error) => {
      console.log('error in placement types GET router', error);
      res.sendStatus(500);
  })
});

//Post Route - adds placement type to DB
router.post('/', rejectUnauthenticated, (req, res) => {
  // endpoint functionality
  query = `INSERT INTO "placement_types" ("placement_type")
            VALUES ($1);`;
    pool.query(queryText, [req.body.placement_type])
    .then(result => {
      res.sendStatus(201)
    })
    .catch(error => {
      console.log('error in placement type post route', error);
      res.sendStatus(500);
    })
});

module.exports = router;
