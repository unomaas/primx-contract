const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
	rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const format = require('pg-format');

/**
 * GET route template
 */
router.get('/', (req, res) => {
	// GET route code here
	const queryText = `SELECT * FROM "products" ORDER BY product_id ASC`;
	pool.query(queryText)
		.then((results) => res.send(results.rows))
		.catch((error) => {
			console.error('Error getting products name and prices', error);
			res.sendStatus(500);
		});
});

/**
 * EDIT route template
 */
router.put('/:product_id', rejectUnauthenticated, (req, res) => {
	// EDIT route code here
	const queryText = format(`UPDATE "products" SET %I =$1 WHERE "product_id" = $2;`, req.body.dbColumn);
	pool.query(queryText, [req.body.newValue, req.params.product_id])
		.then(() => { res.sendStatus(200); })
		.catch((error) => {
			console.error('Error completeing UPDATE Product query', error)
		})
});

router.post('/', rejectUnauthenticated, (req, res) => {
	const queryText = `INSERT INTO "products" (product_name, product_price, on_hand)
    VALUES ($1, $2, $3)`;
	pool.query(queryText, [req.body.product_name, req.body.product_price, req.body.on_hand])
		.then(() => res.sendStatus(201))
		.catch((error) => {
			console.error('Product ServerSide Post failed:', error);
			res.sendStatus(500);
		});
})

router.get('/get-all-product-cost-history', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM "product_cost_history" AS "pch"
			ORDER BY "pch".product_cost_history_id ASC
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in shipping costs GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});


router.get('/get-recent-product-cost-history', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM "product_cost_history" AS "pch"
			ORDER BY "pch".product_cost_history_id DESC
			LIMIT 8;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in shipping costs GET router', error);
		res.sendStatus(500);
	}; // End try/catch
});

router.post('/submit-product-cost-history', rejectUnauthenticated, async (req, res) => {
	try {
		// ⬇ Today's date in YYYY-MM-DD format: 
		const today = new Date().toISOString().slice(0, 10);
		let sql = `
			INSERT INTO "product_cost_history" (
				"product_id", "product_self_cost", "date_saved"
			)
			VALUES
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(`(%L::int, %L::decimal, %L::date), `, cost.product_id, cost.product_self_cost, today);
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		sql += `;`;
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(201);
	} catch (error) {
		console.error('Error in shipping costs history POST route', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End POST route


router.post('/edit-products-costs', rejectUnauthenticated, async (req, res) => {
	try {
		let sql = `
			UPDATE "products" AS p 
			SET "product_self_cost" = v.product_self_cost
			FROM (VALUES 
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of req.body) {
			sql += format(`(%L::int, %L::decimal), `, cost.product_id, cost.product_self_cost);
		}; // End for loop
		// ⬇ Remove the last comma and space:
		sql = sql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		sql += `
			) AS v(product_id, product_self_cost)
			WHERE v.product_id = p.product_id;
		`; // End sql
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(202);
	} catch (error) {
		console.error('Error with product costs edit: ', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End POST route


//#region - Markup routes below: 
router.get('/get-markup-margin', async (req, res) => {
	try {
		const sql = `SELECT * FROM "markup"`;
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error getting markup margin', error);
		res.sendStatus(500);
	} // End try/catch
}); // End GET route

router.get('/get-recent-markup-history', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM "markup_history" AS "mh"
			ORDER BY "mh".markup_history_id DESC
			LIMIT 3;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in recent markup history GET', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End GET route

router.get('/get-all-markup-history', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM "markup_history" AS "mh"
			ORDER BY "mh".markup_history_id ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in all markup history GET', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End GET route

router.post('/edit-markup-margin', rejectUnauthenticated, async (req, res) => {
	// ! Ryan Here, something's wrong with this route.  Keeps throwing a SQL error. 

	try {
		console.log(`**** Ryan Here: \n\n `, {reqBody: req.body, reqParams: req.params});
		const sql = `
			UPDATE "markup" AS m
			SET "margin_applied" = ${format('%L::decimal', req.body.margin_applied)}
			WHERE m.markup_id = 1;
		`; // End sql
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(202);
	} catch (error) {
		console.error('Error with markup edit: ', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End POST route

router.post('/submit-markup-history', rejectUnauthenticated, async (req, res) => {
	try {
		// ⬇ Today's date in YYYY-MM-DD format: 
		const today = new Date().toISOString().slice(0, 10);
		let sql = `
			INSERT INTO "markup_history" (
				"margin_applied", "date_saved"
			) VALUES (
				${format('%L::decimal', req.body.margin_applied)}, ${format('%L::date', today)}
			);
		`; // End sql
		// ⬇ Send the query to the database:
		await pool.query(sql);
		// ⬇ Send the response:
		res.sendStatus(201);
	} catch (error) {
		console.error('Error in submit markup history POST', error);
		res.sendStatus(500);
	}; // End try/catch
}); // End POST route
//#endregion - Markup routes above.

module.exports = router;