const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { useRadioGroup } = require('@material-ui/core');

//Get Route for Admin Accounts
router.get('/', rejectUnauthenticated, (req, res) => {
  //query to grab all users and their info
  const queryText = `
		SELECT * FROM "user" 
		WHERE permission_level = 2
		ORDER BY username ASC;
	`;
  pool.query(queryText).then((result) => {
    res.send(result.rows);
  }).catch((error) => {
    console.error('Error in GET', error);
    res.sendStatus(500);
  })
});

//Get Route for Admin Accounts

router.get('/licensees', rejectUnauthenticated, (req, res) => {
	//query to grab all users and their info
	const queryText = `
		SELECT 
			u.id, u.username, u.permission_level, u.licensees_id, 
			l.licensee_contractor_name
		FROM "user" AS u
		LEFT JOIN "licensees" AS l ON u.licensees_id = l.id
		WHERE u.permission_level = 3
		ORDER BY u.username ASC;
	`;
	pool.query(queryText).then((result) => {
		res.send(result.rows);
	}).catch((error) => {
		console.error('Error in GET', error);
		res.sendStatus(500);
	})
});

//Delete Route - Delete an admin user
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  if (req.user.permission_level == '1') {
    const queryText = `DELETE FROM "user" WHERE "id" = $1;`;
    pool.query(queryText, [req.params.id])
      .then(result => {
        res.sendStatus(200)
      })
      .catch((error) => {
        console.error('Error in admin DELETE in server', error);
      });
  } else {
    console.error('unable to delete unless you are superuser');
    res.sendStatus(403);
  }
});

//Delete Route - Delete an admin user
router.delete('licensee/:id', rejectUnauthenticated, (req, res) => {
	const queryText = `DELETE FROM "user" WHERE "id" = $1;`;
	pool.query(queryText, [req.params.id])
		.then(result => {
			res.sendStatus(200)
		})
		.catch((error) => {
			console.error('Error in admin DELETE in server', error);
		});
});
// TODO: Build functions for fetching and deleting licensee accounts. 


module.exports = router;