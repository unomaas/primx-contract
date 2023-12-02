const express = require('express');
const {
	rejectUnauthenticated,
	rejectNonAdmin,
	rejectNonSysAdmin,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const format = require('pg-format');
const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
	// Send back user object from the session (previously queried from the database)
	res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', rejectNonSysAdmin, async (req, res, next) => {
	let {
		username,
		password,
		permission_level,
		region_id,
	} = req.body;
	
	if (!region_id) region_id = null;
	
	password = encryptLib.encryptPassword(password);
	
	const connection = await pool.connect();
	try {
		await connection.query('BEGIN');

		const insertUserSql = `
			INSERT INTO users (username, password, permission_level, region_id)
			VALUES (${format(`%L`, username)}, ${format(`%L`, password)}, ${format(`%L`, permission_level)}, ${format(`%L`, region_id)})
			RETURNING user_id;
		`;

		await connection.query(insertUserSql);

		await connection.query('COMMIT');
		res.sendStatus(201);
	} catch (error) {
		await connection.query('ROLLBACK'); // Rollback transaction on error
		console.error('Error in submit licensee POST', error);
		res.sendStatus(500);
	} finally {
		connection.release();
	}
});

router.post('/register_licensee', rejectNonAdmin, (req, res, next) => {
	try {
		const username = req.body.username;
		const password = encryptLib.encryptPassword(req.body.password);
		const licensee_id = req.body.licensee_id;
		const queryText = `
				INSERT INTO "users" 
					(username, password, permission_level, licensee_id)
				VALUES ($1, $2, 4, $3) 
				RETURNING user_id;
			`; // End queryText
		pool
			.query(queryText, [username, password, licensee_id])
			.then(() => res.sendStatus(201))
			.catch((error) => {
				console.error('Licensee registration failed: ', error);
				res.sendStatus(500);
			});

	} catch {
		console.error('Error Registering');
		res.sendStatus(403);
	}
});


// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
	res.sendStatus(200);
});

router.post('/login_licensee', userStrategy.authenticate('local'), (req, res) => {
	res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
	// Use passport's built-in method to log out the user
	req.logout();
	res.sendStatus(200);
});

module.exports = router;
