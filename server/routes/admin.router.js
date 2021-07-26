const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
 router.get('/', (req, res) => {
    // GET route code here
  });
  
/***** ⬇⬇ Liscensee Form GET Requests ⬇⬇ *****/

// GET Request to grab all Liscensee/Company Name from DB for View 1.0
router.get('/company', (req, res) => {
  const queryText= `SELECT * FROM "licensees";`;
   
  // DB request
   pool.query(queryText)
   .then(result => {
     res.send(result.rows);
   })
   .catch(error => {
     console.log('Error with /api/admin/company GET: ', error);
     res.sendStatus(500);
   })
});

// GET Request to grab all States/Province from DB for View 1.0
router.get('/state', (req, res) => {
  const queryText= `SELECT 'ship_to_state_province' FROM "shipping_costs";`;
   
  // DB request
   pool.query(queryText)
   .then(result => {
     res.send(result.rows);
   })
   .catch(error => {
     console.log('Error with /api/admin/state GET: ', error);
     res.sendStatus(500);
   })
});

// GET Request to grab all floor types from DB for View 1.0
router.get('/floor', (req, res) => {
  const queryText= `SELECT * FROM "floor_types";`;
   
  // DB request
   pool.query(queryText)
   .then(result => {
     res.send(result.rows);
   })
   .catch(error => {
     console.log('Error with /api/admin/floor GET: ', error);
     res.sendStatus(500);
   })
});

// GET Request to grab all placement types from DB for View 1.0
router.get('/placement', (req, res) => {
  const queryText= `SELECT * FROM "placement_types";`;
   
  // DB request
   pool.query(queryText)
   .then(result => {
     res.send(result.rows);
   })
   .catch(error => {
     console.log('Error with /api/admin/placement GET: ', error);
     res.sendStatus(500);
   })
});

/***** ⬆⬆ Liscensee Form GET Requests ⬆⬆ *****/ 

  /**
   * POST route template
   */
  router.post('/', (req, res) => {
    // POST route code here
  });
  
  module.exports = router;