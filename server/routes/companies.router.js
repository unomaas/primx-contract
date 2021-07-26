const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
 router.get('/', (req, res) => {
    // GET route code here
    const queryText = `SELECT * FROM "licensees" ORDER BY id ASC`;

    pool.query(queryText)
        .then((results) => res.send(results.rows))
        .catch((error) => {
            console.log('Error getting company names', error);
            res.sendStatus(500);
        });
  });
  
  /**
   * EDIT route template
   */
  router.post('/', (req, res) => {
    // EDIT route code here
  });
  
  module.exports = router;