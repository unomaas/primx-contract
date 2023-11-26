const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
  rejectNonAdmin
} = require('../modules/authentication-middleware');

const format = require('pg-format');

// *************************** GET ROUTES ***************************

// GET route to GET all data from the licensees table, both active and inactive licensees
router.get('/all', (req, res) => {
  // SQL query to get all licensees for the admin licensees grid, ordered by active licensees first, then alphabetically
  const queryText = `
    SELECT
      l.licensee_id, 
      l.licensee_contractor_name, 
      l.default_measurement,
      l.active,
      array_agg(r.region_id) AS operating_regions
    FROM licensees AS l
    JOIN licensee_regions AS lr ON lr.licensee_id = l.licensee_id
    JOIN regions AS r ON r.region_id = lr.region_id
    GROUP BY l.licensee_id
    ORDER BY l.licensee_contractor_name ASC;
  `;

  pool.query(queryText)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.error('Error getting company names', error);
      res.sendStatus(500);
    });
});

// GET route to GET all active licensees to be displayed in Select menus for the estimate creation view and the estimate lookup view
router.get('/active', (req, res) => {
  // SQL query to get licensees that are currently active sorted alphabetically
  const queryText = `
    SELECT
      l.licensee_id, 
      l.licensee_contractor_name, 
      l.default_measurement,
      l.active,
      array_agg(r.region_id) AS operating_regions
    FROM licensees AS l
    JOIN licensee_regions AS lr ON lr.licensee_id = l.licensee_id
    JOIN regions AS r ON r.region_id = lr.region_id
    WHERE l.active = TRUE
    GROUP BY l.licensee_id
    ORDER BY l.licensee_contractor_name ASC;
  `;

  pool.query(queryText)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.error('Error getting company names', error);
      res.sendStatus(500);
    });
});


// *************************** POST ROUTES ***************************

// POST route to POST a new licensee into the licensees table
// router.post('/', rejectUnauthenticated, (req, res) => {
// 	const { name, measurement } = req.body.value;

//   const queryText = `INSERT INTO "licensees" (licensee_contractor_name, default_measurement)
//       VALUES ($1, $2)`;

//   pool.query(queryText, [name, measurement])
//     .then(() => res.sendStatus(201))
//     .catch((error) => {
//       console.error('Company ServerSide Post failed:', error);
//       res.sendStatus(500);
//     });
// })

router.post('/submit-licensee', rejectNonAdmin, async (req, res) => {
  const connection = await pool.connect();
  try {
    const {
      licensee_contractor_name,
      default_measurement,
      operating_regions,
      active,
      edit,
      licensee_id,
    } = req.body;

    await connection.query('BEGIN'); // Start transaction

    let licenseeId = licensee_id;

    if (edit) {
      const updateLicenseeSql = `
            UPDATE licensees
            SET 
              licensee_contractor_name = ${format(`%L`, licensee_contractor_name)},
               default_measurement = ${format(`%L`, default_measurement)},
               active = ${format(`%L`, active)}
            WHERE licensee_id = ${format(`%L`, licensee_id)};
          `;

      await connection.query(updateLicenseeSql);

      await connection.query(`DELETE FROM licensee_regions WHERE licensee_id = ${format(`%L`, licensee_id)};`);
    } else {
      const insertLicenseeSql = `
            INSERT INTO licensees (
              licensee_contractor_name, 
              default_measurement, 
              active
            ) VALUES (
              ${format(`%L`, licensee_contractor_name)}, 
              ${format(`%L`, default_measurement)}, 
              ${format(`%L`, active)}
            )
            RETURNING licensee_id;
          `;

      const result = await connection.query(insertLicenseeSql);
      licenseeId = result.rows[0].licensee_id;
    }; // End if/else

    // Insert new operating regions
    for (const regionId of operating_regions) {
      const insertRegionSql = `
        INSERT INTO licensee_regions (
          licensee_id, 
          region_id
        ) VALUES (
          ${format(`%L`, licenseeId)}, 
          ${format(`%L`, regionId)}
        )
      `;
      await connection.query(insertRegionSql);
    }

    await connection.query('COMMIT'); // Commit transaction
    res.sendStatus(201);
  } catch (error) {
    await connection.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error in submit licensee POST', error);
    res.sendStatus(500);
  } finally {
    connection.release();
  }
});



// *************************** PUT ROUTES ***************************

// PUT route to toggle the active boolean of the licensees table
router.put('/:id', rejectUnauthenticated, (req, res) => {
  // SQL query to update the active column of the licensees table
  const queryText = `UPDATE "licensees" SET "active"=$1 WHERE "licensee_id"=$2`;
  // req.body.active contains true or false depending on the current status of the licensee clicked, sets it to the opposite value
  pool.query(queryText, [!req.body.active, req.body.licensee_id])
    .then(() => { res.sendStatus(200); })
    .catch((error) => {
      console.error('Error completing UPDATE Companies query', error)
    })
});


module.exports = router;