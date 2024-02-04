const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

passport.serializeUser((user, done) => {
	done(null, user.user_id);
});

passport.deserializeUser((id, done) => {

	const sql = `
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
			ARRAY_AGG(r.region_id) FILTER (WHERE r.region_id IS NOT NULL) AS region_ids, 
			ARRAY_AGG(r.region_name) FILTER (WHERE r.region_id IS NOT NULL) AS region_names,
			ARRAY_AGG(r.region_code) FILTER (WHERE r.region_id IS NOT NULL) AS region_codes,
			CASE
				WHEN u.permission_level = 3 THEN true
				ELSE false
			END AS is_region_admin
		FROM users AS u
		LEFT JOIN user_regions AS ur 
			ON u.user_id = ur.user_id
		LEFT JOIN regions AS r 
			ON ur.region_id = r.region_id
		WHERE u.user_id = $1
		GROUP BY u.user_id;
	`;

	pool
		.query(sql, [id])
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
