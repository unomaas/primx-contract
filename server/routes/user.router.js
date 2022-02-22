const express = require('express');
const {
	rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
	// Send back user object from the session (previously queried from the database)
	res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', rejectUnauthenticated, (req, res, next) => {
	try {
		if (req.user.permission_level == '1') {
			const username = req.body.username;
			const password = encryptLib.encryptPassword(req.body.password);

			const queryText = `INSERT INTO "user" (username, password, permission_level)
			VALUES ($1, $2, $3) RETURNING id`;
			pool
				.query(queryText, [username, password])
				.then(() => res.sendStatus(201))
				.catch((error) => {
					console.error('User registration failed: ', error);
					res.sendStatus(500);
				});
		} else {
			console.error('unable to register unless you are superuser');
			res.sendStatus(403);
		}
	} catch {
		console.error('Error Registering');
		res.sendStatus(403);
	}
});

router.post('/register_licensee', rejectUnauthenticated, (req, res, next) => {
	try {
		if (req.user.permission_level == '1' || req.user.permission_level == '2') {
			const username = req.body.username;
			const password = encryptLib.encryptPassword(req.body.password);
			const licensees_id = req.body.licensees_id;

			const queryText = `INSERT INTO "user" (username, password, permission_level, licensees_id)
			VALUES ($1, $2, 3, $3) RETURNING id`;
			pool
				.query(queryText, [username, password, licensees_id])
				.then(() => res.sendStatus(201))
				.catch((error) => {
					console.error('User registration failed: ', error);
					res.sendStatus(500);
				});
		} else {
			console.error('unable to register unless you are an admin');
			res.sendStatus(403);
		}
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
	// console.log('*** Test');

	console.log('*** Test login',req.body);


	res.sendStatus(200);
});

router.post('/login_licensee', userStrategy.authenticate('local'), (req, res) => {
	
	console.log('*** Test login_licensee', req.body);
	
	res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
	// Use passport's built-in method to log out the user
	req.logout();
	res.sendStatus(200);
});

module.exports = router;
