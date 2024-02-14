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
				u.licensee_id,
				CASE 
						WHEN u.permission_level = 1 THEN 'System Admin'
						WHEN u.permission_level = 2 THEN 'Admin'
						WHEN u.permission_level = 3 THEN 'Region Admin'
						ELSE 'Licensee User'
				END AS permission_type,
				
				u.permission_level = 3 AS is_region_admin,
				CASE 
						WHEN u.permission_level = 3 
						THEN COALESCE(ur_data.region_ids)
				END AS region_ids, 
				CASE 
						WHEN u.permission_level = 3 
						THEN COALESCE(ur_data.region_names)
				END AS region_names,
				CASE 
						WHEN u.permission_level = 3 
						THEN COALESCE(ur_data.region_codes)
				END AS region_codes,

				u.licensee_id IS NOT NULL AS is_licensee_user,
				CASE 
						WHEN u.licensee_id IS NOT NULL 
						THEN COALESCE(lr_data.operating_region_ids)
				END AS operating_region_ids,
				CASE 
						WHEN u.licensee_id IS NOT NULL 
						THEN COALESCE(lr_data.operating_region_names)
				END AS operating_region_names,
				CASE 
						WHEN u.licensee_id IS NOT NULL 
						THEN COALESCE(lr_data.operating_region_codes)
				END AS operating_region_codes

			FROM users AS u
			LEFT JOIN (
				SELECT 
						ur.user_id,
						ARRAY_AGG(ur_r.region_id) FILTER (WHERE ur_r.region_id IS NOT NULL) AS region_ids,
						ARRAY_AGG(ur_r.region_name) FILTER (WHERE ur_r.region_name IS NOT NULL) AS region_names,
						ARRAY_AGG(ur_r.region_code) FILTER (WHERE ur_r.region_code IS NOT NULL) AS region_codes
				FROM user_regions AS ur
				JOIN regions AS ur_r ON ur.region_id = ur_r.region_id
				GROUP BY ur.user_id
			) AS ur_data ON u.user_id = ur_data.user_id
			LEFT JOIN (
				SELECT 
						lr.licensee_id,
						ARRAY_AGG(lr_r.region_id) FILTER (WHERE lr_r.region_id IS NOT NULL) AS operating_region_ids,
						ARRAY_AGG(lr_r.region_name) FILTER (WHERE lr_r.region_name IS NOT NULL) AS operating_region_names,
						ARRAY_AGG(lr_r.region_code) FILTER (WHERE lr_r.region_code IS NOT NULL) AS operating_region_codes
				FROM licensee_regions AS lr
				JOIN regions AS lr_r ON lr.region_id = lr_r.region_id
				GROUP BY lr.licensee_id
			) AS lr_data ON u.licensee_id = lr_data.licensee_id
			WHERE u.user_id = $1
			GROUP BY u.user_id, ur_data.region_ids, ur_data.region_names, ur_data.region_codes, lr_data.operating_region_ids, lr_data.operating_region_names, lr_data.operating_region_codes;
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
