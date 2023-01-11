const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const format = require('pg-format');

/**
 * GET route template
 */
 router.get('/', (req, res) => {
    // GET route code here
    const queryText = `SELECT * FROM "products" ORDER BY product_id ASC`;
    pool.query(queryText)
        .then((results) => res.send(results.rows))
        .catch((error) => {
            console.error('Error getting products name and prices', error);
            res.sendStatus(500);
        });
  });
  
  /**
   * EDIT route template
   */
  router.put('/:product_id',rejectUnauthenticated, (req, res) => {
    // EDIT route code here
    const queryText = format(`UPDATE "products" SET %I =$1 WHERE "product_id" = $2;`, req.body.dbColumn);
    pool.query(queryText, [req.body.newValue, req.params.product_id])
      .then(() => { res.sendStatus(200); })
      .catch((error) => {
        console.error('Error completeing UPDATE Product query', error)
      })
  });

  router.post('/', rejectUnauthenticated, (req, res) => {
    const queryText = `INSERT INTO "products" (product_name, product_price, on_hand)
    VALUES ($1, $2, $3)`;
    pool.query(queryText, [req.body.product_name, req.body.product_price, req.body.on_hand])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.error('Product ServerSide Post failed:', error);
      res.sendStatus(500);
    });
  })
   
  module.exports = router;