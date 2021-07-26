const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
 router.get('/', (req, res) => {
    // GET route code here
  });
  
  /**
   * EDIT route template
   */
  router.post('/', (req, res) => {
    // EDIT route code here
  });
  
  module.exports = router;