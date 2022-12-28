const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

passport.serializeUser((user, done) => {
	done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
	pool
		.query('SELECT * FROM "users" WHERE user_id = $1', [id])
		.then((result) => {
			// Handle Errors
			const user = result && result.rows && result.rows[0];

			if (user) {
				// user found
				delete user.password; // remove password so it doesn't get sent
				// done takes an error (null in this case) and a user
				done(null, user);
			} else {
				// user not found
				// done takes an error (null in this case) and a user (also null in this case)
				// this will result in the server returning a 401 status code
				done(null, null);
			}
		})
		.catch((error) => {
			console.error('Error with query during deserializing user ', error);
			// done takes an error (we have one) and a user (null in this case)
			// this will result in the server returning a 500 status code
			done(error, null);
		});
});

// Does actual work of logging in
passport.use(
	'local',
	new LocalStrategy((username, password, done) => {
		pool
			.query('SELECT * FROM "users" WHERE username = $1', [username])
			.then((result) => {
				const user = result && result.rows && result.rows[0];
				if (user && encryptLib.comparePassword(password, user.password)) {
					// All good! Passwords match!
					// done takes an error (null in this case) and a user
					done(null, user);
				} else {
					// Not good! Username and password do not match.
					// done takes an error (null in this case) and a user (also null in this case)
					// this will result in the server returning a 401 status code
					done(null, null);
				}
			})
			.catch((error) => {
				console.error('Error with query for user ', error);
				// done takes an error (we have one) and a user (null in this case)
				// this will result in the server returning a 500 status code
				done(error, null);
			});
	})
);

// Does actual work of logging in
passport.use(
	'licensee',
	new LocalStrategy((licensee_id, password, done) => {
		pool
			.query('SELECT * FROM "users" WHERE licensee_id = $1', [licensee_id])
			.then((result) => {
				const user = result && result.rows && result.rows[0];
				if (user && encryptLib.comparePassword(password, user.password)) {
					// All good! Passwords match!
					// done takes an error (null in this case) and a user
					done(null, user);
				} else {
					// Not good! Username and password do not match.
					// done takes an error (null in this case) and a user (also null in this case)
					// this will result in the server returning a 401 status code
					done(null, null);
				}
			})
			.catch((error) => {
				console.error('Error with query for user ', error);
				// done takes an error (we have one) and a user (null in this case)
				// this will result in the server returning a 500 status code
				done(error, null);
			});
	})
);

module.exports = passport;
