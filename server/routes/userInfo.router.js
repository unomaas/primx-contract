const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated, rejectNonAdmin, rejectNonSysAdmin } = require('../modules/authentication-middleware');

//Get Route for Admin Accounts
router.get('/', rejectNonAdmin, (req, res) => {
	//query to grab all users and their info
	const queryText = `
		SELECT
			u.user_id, 
			u.username, 
			u.permission_level,
			CASE 
				WHEN u.permission_level = 1 THEN 'System Admin'
				WHEN u.permission_level = 2 THEN 'Admin'
				WHEN u.permission_level = 3 THEN 'Region Admin'
				ELSE 'User'
			END AS permission_type,
			ARRAY_AGG(r.region_id) AS region_ids, 
			ARRAY_AGG(r.region_name) AS region_names,
			ARRAY_AGG(r.region_code) AS region_codes,
			CASE
				WHEN u.permission_level = 3 THEN true
				ELSE false
			END AS is_region_admin
		FROM users AS u
		LEFT JOIN user_regions AS ur
			ON u.user_id = ur.user_id
		LEFT JOIN regions AS r
			ON ur.region_id = r.region_id
		WHERE 
			u.permission_level < 4
		GROUP BY u.user_id
		ORDER BY u.username ASC;
	`;
	pool.query(queryText).then((result) => {
		res.send(result.rows);
	}).catch((error) => {
		console.error('Error in GET', error);
		res.sendStatus(500);
	})
});

//Get Route for Admin Accounts

router.get('/licensees', rejectNonAdmin, (req, res) => {
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
router.delete('/:user_id', rejectNonSysAdmin, async (req, res) => {
	try {
		const queryText = `DELETE FROM "users" WHERE "user_id" = $1;`;
		const result = await pool.query(queryText, [req.params.user_id])
		res.sendStatus(200)
	} catch (error) {
		console.error('unable to delete unless you are superuser');
		res.sendStatus(403);
	}
});

//Delete Route - Delete an licensee user
router.delete('/licensees/:id', rejectNonAdmin, (req, res) => {
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