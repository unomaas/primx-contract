const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
 router.get('/', (req, res) => {
    // GET route code here
  });
  

// GET Request to grab all Liscensee/Company Name from DB for View 1.0
router.get('/company', (req, res) => {
  const queryText= 'SELECT * FROM table "licensees";';
   
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


  /**
   * POST route template
   */
  router.post('/', (req, res) => {
    // POST route code here
  });
  
  module.exports = router;