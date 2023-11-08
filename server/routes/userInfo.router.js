const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { useRadioGroup } = require('@material-ui/core');

//Get Route for Admin Accounts
router.get('/', rejectUnauthenticated, (req, res) => {
  //query to grab all users and their info
  const queryText = `
		SELECT
			user_id, username, permission_level
		FROM "users" 
		WHERE 
			permission_level = 1 OR
			permission_level = 2
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
			u.user_id, u.username, u.permission_level, u.licensee_id, 
			l.licensee_contractor_name
		FROM "users" AS u
		LEFT JOIN "licensees" AS l ON u.licensee_id = l.licensee_id
		WHERE u.permission_level = 4
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
    const queryText = `DELETE FROM "users" WHERE "user_id" = $1;`;
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

//Delete Route - Delete an licensee user
router.delete('/licensees/:id', rejectUnauthenticated, (req, res) => {
	const queryText = `DELETE FROM "users" WHERE "user_id" = $1;`;
	pool.query(queryText, [req.params.id])
		.then(result => {
			res.sendStatus(200)
		})
		.catch((error) => {
			console.error('Error in licensee DELETE in server', error);
		});
});


module.exports = router;