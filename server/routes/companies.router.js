const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');


// *************************** GET ROUTES ***************************

// GET route to GET all data from the licensees table, both active and inactive licensees
router.get('/all', (req, res) => {
  // SQL query to get all licensees for the admin licensees grid, ordered by active licensees first, then alphabetically
  const queryText = `SELECT * FROM "licensees" ORDER BY "active" DESC, "licensee_contractor_name" ASC;`;

  pool.query(queryText)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log('Error getting company names', error);
      res.sendStatus(500);
    });
});

// GET route to GET all active licensees to be displayed in Select menus for the estimate creation view and the estimate lookup view
router.get('/active', (req, res) => {
  // SQL query to get licensees that are currently active sorted alphabetically
  const queryText = `SELECT * FROM "licensees" WHERE "active" = TRUE ORDER BY "licensee_contractor_name" ASC;`;

  pool.query(queryText)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log('Error getting company names', error);
      res.sendStatus(500);
    });
});


// *************************** POST ROUTES ***************************

// POST route to POST a new licensee into the licensees table
router.post('/', rejectUnauthenticated, (req, res) => {
  const queryText = `INSERT INTO "licensees" (licensee_contractor_name)
      VALUES ($1)`;
   
  pool.query(queryText, [req.body.value])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log('Company ServerSide Post failed:', error);
      res.sendStatus(500);
    });
})


// *************************** PUT ROUTES ***************************

// PUT route to toggle the active boolean of the licensees table
router.put('/:id', rejectUnauthenticated, (req, res) => {
  // SQL query to update the active column of the licensees table
  const queryText = `UPDATE "licensees" SET "active"=$1 WHERE "id"=$2`;
  // req.body.active contains true or false depending on the current status of the licensee clicked, sets it to the opposite value
  pool.query(queryText, [!req.body.active, req.params.id])
    .then(() => { res.sendStatus(200); })
    .catch((error) => {
      console.log('Error completeing UPDATE Companies query', error)
    })
});


module.exports = router;