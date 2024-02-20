const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

// ! This is not used currently. 
router.get('/update-pricing-initial-load', rejectNonAdmin, async (req, res) => {
	try {
		const sql = `
			SELECT 
				"pc".product_container_id,
				"p".product_label,
				"c".container_length_ft,
				r.region_code AS container_destination,
				"pc".max_pallets_per_container,
				"pc".max_weight_of_container,
				"pc".gross_weight_of_pallet,
				"pc".net_weight_of_pallet
			FROM "product_containers" AS "pc"
			JOIN "products" AS "p" 
				ON "p".product_id = "pc".product_id
			JOIN "containers" AS "c"
				ON "c".container_id = "pc".container_id
			JOIN regions AS r 
				ON r.region_id = c.region_id
			ORDER BY "pc".product_container_id ASC;
		`; // End sql
		const { rows } = await pool.query(sql);
		res.send(rows);
	} catch (error) {
		console.error('Error in customs duties GET', error);
		res.sendStatus(500);
	}; // End try/catch
});


router.post('/submit-new-pricing-changes', rejectNonAdmin, async (req, res) => {

	const {
		monthToSaveTo,
		newCustomsDuties,
		newShippingCosts,
		newProductCosts,
		newMarkup,
		currentCustomsDuties,
		currentShippingCosts,
		currentProductCosts,
		currentMarkup,
	} = req.body;

	// ⬇ Generate today in YYYY-MM-DD format with time zone:
	const today = dayjs().format('-DD');
	let dateToSaveTo = `${monthToSaveTo}${today}`;

	// ⬇ If dateToSaveTo is not a valid date (e.g., 2021-02-31), then we need to set it to the last day of that month:
	if (!dayjs(dateToSaveTo, 'YYYY-MM-DD', true).isValid()) {
		dateToSaveTo = dayjs(monthToSaveTo).endOf('month').format('YYYY-MM-DD');
	}; // End if

	// ⬇ If dateToSaveTo is past the current month (e.g., 2023-07-05 is past 2023-06-15), set the dateToSaveTo to the first day of the next month:
	if (dayjs(dateToSaveTo).isAfter(dayjs().format('YYYY-MM-DD'))) {
		dateToSaveTo = dayjs(dateToSaveTo).startOf('month').format('YYYY-MM-DD');
	}; // End if

	try {
		// ⬇ Default logic assumptions: 
		let savingPricesToHistoryLog = true;
		let overwritingAnExistingMonth = false;

		if (monthToSaveTo == -1) {
			savingPricesToHistoryLog = false;
			dateToSaveTo = null;
		}; // End if


		//#region - Overwriting data check below:
		if (savingPricesToHistoryLog) {
			const overwriteSql = `
				SELECT date_saved
				FROM "markup_history"
				WHERE TO_CHAR(date_saved, 'YYYY-MM') = ${format('%L', monthToSaveTo)}
				ORDER BY date_saved DESC;
			`; // End overwriteSql	
			const { rows } = await pool.query(overwriteSql);
			if (rows.length > 0) {
				overwritingAnExistingMonth = true;
				dateToSaveTo = rows[0].date_saved.toISOString().slice(0, 10);
			}; // End if
		}; // End if
		//#endregion - Overwriting data check above.

		let currentCustomsDutiesSql, currentShippingCostsSql, currentProductCostsSql, currentMarkupSql = '';
		let overwriteCustomsDutiesSql, overwriteShippingCostsSql, overwriteProductCostsSql, overwriteMarkupSql = '';


		//#region - Current costs to an empty month query building below: 
		if (savingPricesToHistoryLog && !overwritingAnExistingMonth) {
			currentCustomsDutiesSql = `
				INSERT INTO "customs_duties_history" (
					"custom_duty_id", "duty_percentage", "region_id", "date_saved"
				)
				VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:
			for (let cost of currentCustomsDuties) {
				currentCustomsDutiesSql += `(${format('%L::int', cost.custom_duty_id)}, ${format('%L::decimal', cost.duty_percentage)}, ${format('%L::int', cost.region_id)}, ${format('%L', dateToSaveTo)}), `
			}; // End for loop
			// ⬇ Remove the last comma and space, and add the ending semicolon:
			currentCustomsDutiesSql = currentCustomsDutiesSql.slice(0, -2) + `;`;


			currentShippingCostsSql = `
				INSERT INTO "shipping_cost_history" (
					"shipping_cost_id",	"dc_20ft",	"dc_40ft",	"fibers_20ft",	"fibers_40ft",	"cpea_20ft",	"cpea_40ft",	"flow_20ft",	"flow_40ft",	"date_saved"
				)
				VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:
			for (let cost of currentShippingCosts) {
				currentShippingCostsSql += `(${format('%L::int', cost.shipping_cost_id)}, ${format('%L::decimal', cost.dc_20ft)}, ${format('%L::decimal', cost.dc_40ft)}, ${format('%L::decimal', cost.fibers_20ft)}, ${format('%L::decimal', cost.fibers_40ft)}, ${format('%L::decimal', cost.cpea_20ft)}, ${format('%L::decimal', cost.cpea_40ft)}, ${format('%L::decimal', cost.flow_20ft)}, ${format('%L::decimal', cost.flow_40ft)}, ${format('%L', dateToSaveTo)}
			), `
			}; // End for loop
			// ⬇ Remove the last comma and space, and add the ending semicolon:
			currentShippingCostsSql = currentShippingCostsSql.slice(0, -2) + `;`;


			currentProductCostsSql = `
				INSERT INTO "product_cost_history" (
						"product_id", "product_self_cost", "region_id", "date_saved"
				)
				VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:
			for (let cost of currentProductCosts) {
				currentProductCostsSql += `(${format('%L::int', cost.product_id)}, ${format('%L::decimal', cost.product_self_cost)}, ${format('%L::int', cost.region_id)}, ${format('%L', dateToSaveTo)}), `
			}; // End for loop
			// ⬇ Remove the last comma and space, and add the ending semicolon:
			currentProductCostsSql = currentProductCostsSql.slice(0, -2) + `;`;


			currentMarkupSql = `
				INSERT INTO "markup_history" (
						"margin_applied", "region_id", "date_saved"
				)
				VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:
			for (let markup of currentMarkup) {
				currentMarkupSql += `(${format('%L::decimal', markup.margin_applied)}, ${format('%L::int', markup.region_id)}, ${format('%L', dateToSaveTo)}), `
			};
			currentMarkupSql = currentMarkupSql.slice(0, -2) + `;`;
		}; // End if
		//#endregion - Current costs sql query building above.


		//#region - Overwriting data query building below:
		if (savingPricesToHistoryLog && overwritingAnExistingMonth) {
			overwriteCustomsDutiesSql = `
				UPDATE "customs_duties_history"
				SET "duty_percentage" = v.duty_percentage
				FROM (VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:
			for (let cost of newCustomsDuties) {
				overwriteCustomsDutiesSql += `(${format('%L::int', cost.custom_duty_id)}, ${format('%L::decimal', cost.duty_percentage)}, ${format('%L::int', cost.region_id)}), `
			}; // End for loop
			// ⬇ Remove the last comma and space:
			overwriteCustomsDutiesSql = overwriteCustomsDutiesSql.slice(0, -2);
			// ⬇ Add the WHERE clause:
			overwriteCustomsDutiesSql += `
				) AS v(custom_duty_id, duty_percentage, region_id)
				WHERE 
					"customs_duties_history"."custom_duty_id" = v.custom_duty_id AND 
					"customs_duties_history"."region_id" = v.region_id AND 
					"customs_duties_history"."date_saved" = ${format('%L', dateToSaveTo)};
			`; // End sql


			overwriteShippingCostsSql = `
				UPDATE "shipping_cost_history"
				SET
					"dc_20ft" = v.dc_20ft,
					"dc_40ft" = v.dc_40ft,
					"fibers_20ft" = v.fibers_20ft,
					"fibers_40ft" = v.fibers_40ft,
					"cpea_20ft" = v.cpea_20ft,
					"cpea_40ft" = v.cpea_40ft,
					"flow_20ft" = v.flow_20ft,
					"flow_40ft" = v.flow_40ft
				FROM (VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:
			for (let cost of newShippingCosts) {
				overwriteShippingCostsSql += `(${format('%L::int', cost.shipping_cost_id)}, ${format('%L::decimal', cost.dc_20ft)}, ${format('%L::decimal', cost.dc_40ft)}, ${format('%L::decimal', cost.fibers_20ft)}, ${format('%L::decimal', cost.fibers_40ft)}, ${format('%L::decimal', cost.cpea_20ft)}, ${format('%L::decimal', cost.cpea_40ft)}, ${format('%L::decimal', cost.flow_20ft)}, ${format('%L::decimal', cost.flow_40ft)}), `
			}; // End for loop
			// ⬇ Remove the last comma and space:
			overwriteShippingCostsSql = overwriteShippingCostsSql.slice(0, -2);
			// ⬇ Add the WHERE clause:
			overwriteShippingCostsSql += `
				) AS v(shipping_cost_id, dc_20ft, dc_40ft, fibers_20ft, fibers_40ft, cpea_20ft, cpea_40ft, flow_20ft, flow_40ft) 
				WHERE
					"shipping_cost_history"."shipping_cost_id" = v.shipping_cost_id AND 
					"shipping_cost_history"."date_saved" = ${format('%L', dateToSaveTo)};
			`; // End sql


			overwriteProductCostsSql = `
				UPDATE "product_cost_history"
				SET "product_self_cost" = v.product_self_cost
				FROM (VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:	
			for (let cost of newProductCosts) {
				overwriteProductCostsSql += `(${format('%L::int', cost.product_id)}, ${format('%L::decimal', cost.product_self_cost)}, ${format('%L::int', cost.region_id)}), `
			}; // End for loop
			// ⬇ Remove the last comma and space:
			overwriteProductCostsSql = overwriteProductCostsSql.slice(0, -2);
			// ⬇ Add the WHERE clause:
			overwriteProductCostsSql += `
				) AS v(product_id, product_self_cost, region_id)
				WHERE 
					"product_cost_history"."product_id" = v.product_id AND 
					"product_cost_history"."region_id" = v.region_id AND 
					"product_cost_history"."date_saved" = ${format('%L', dateToSaveTo)};
			`; // End sql


			overwriteMarkupSql = `
				UPDATE "markup_history"
				SET "margin_applied" = v.margin_applied
				FROM (VALUES
			`; // End sql
			// ⬇ Loop through the req.body array to build the query:
			for (let cost of newMarkup) {
				overwriteMarkupSql += `(${format('%L::decimal', cost.margin_applied)}, ${format('%L::int', cost.region_id)}), `
			}; // End for loop
			// ⬇ Remove the last comma and space:
			overwriteMarkupSql = overwriteMarkupSql.slice(0, -2);
			// ⬇ Add the WHERE clause:
			overwriteMarkupSql += `
				) AS v(margin_applied, region_id)
				WHERE 
					"markup_history"."region_id" = v.region_id AND 
					"markup_history"."date_saved" = ${format('%L', dateToSaveTo)};
			`; // End sql
		}; // End if
		//#endregion - Overwriting data query building above.


		//#region - New costs sql query building below:
		let newCustomsDutiesSql = `
			UPDATE "customs_duties_regions" AS cdr
			SET "duty_percentage" = v.duty_percentage
			FROM (VALUES
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of newCustomsDuties) {
			newCustomsDutiesSql += `(${format('%L::int', cost.custom_duty_id)}, ${format('%L::decimal', cost.duty_percentage)}, ${format('%L::int', cost.region_id)}), `
		}; // End for loop
		// ⬇ Remove the last comma and space:
		newCustomsDutiesSql = newCustomsDutiesSql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		newCustomsDutiesSql += `
			) AS v(custom_duty_id, duty_percentage, region_id)
			WHERE 
				cdr.custom_duty_id = v.custom_duty_id AND 
				cdr.region_id = v.region_id;
		`; // End sql



		let newShippingCostsSql = `
			UPDATE "shipping_costs" AS sc
			SET 
				"dc_20ft" = v.dc_20ft,
				"dc_40ft" = v.dc_40ft,
				"fibers_20ft" = v.fibers_20ft,
				"fibers_40ft" = v.fibers_40ft,
				"cpea_20ft" = v.cpea_20ft,
				"cpea_40ft" = v.cpea_40ft,
				"flow_20ft" = v.flow_20ft,
				"flow_40ft" = v.flow_40ft
			FROM (VALUES 
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of newShippingCosts) {
			newShippingCostsSql += `(${format('%L::int', cost.shipping_cost_id)}, ${format('%L::decimal', cost.dc_20ft)}, ${format('%L::decimal', cost.dc_40ft)}, ${format('%L::decimal', cost.fibers_20ft)}, ${format('%L::decimal', cost.fibers_40ft)}, ${format('%L::decimal', cost.cpea_20ft)}, ${format('%L::decimal', cost.cpea_40ft)}, ${format('%L::decimal', cost.flow_20ft)}, ${format('%L::decimal', cost.flow_40ft)}), `
		}; // End for loop
		// ⬇ Remove the last comma and space:
		newShippingCostsSql = newShippingCostsSql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		newShippingCostsSql += `
			) AS v(shipping_cost_id, dc_20ft, dc_40ft, fibers_20ft, fibers_40ft, cpea_20ft, cpea_40ft, flow_20ft, flow_40ft)
			WHERE v.shipping_cost_id = sc.shipping_cost_id;
		`; // End sql


		let newProductCostsSql = `
			UPDATE "product_region_cost" AS prc
			SET "product_self_cost" = v.product_self_cost
			FROM (VALUES
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of newProductCosts) {
			newProductCostsSql += `(${format('%L::int', cost.product_id)}, ${format('%L::decimal', cost.product_self_cost)}, ${format('%L::int', cost.region_id)}), `
		}; // End for loop
		// ⬇ Remove the last comma and space:
		newProductCostsSql = newProductCostsSql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		newProductCostsSql += `
			) AS v(product_id, product_self_cost, region_id)
			WHERE 
				prc.product_id = v.product_id AND 
				prc.region_id = v.region_id;
		`; // End sql


		let newMarkupSql = `
			UPDATE "markup" AS m
			SET "margin_applied" = v.margin_applied
			FROM (VALUES
		`; // End sql
		// ⬇ Loop through the req.body array to build the query:
		for (let cost of newMarkup) {
			newMarkupSql += `(${format('%L::decimal', cost.margin_applied)}, ${format('%L::int', cost.region_id)}), `
		}; // End for loop
		// ⬇ Remove the last comma and space:
		newMarkupSql = newMarkupSql.slice(0, -2);
		// ⬇ Add the closing parentheses:
		newMarkupSql += `
			) AS v(margin_applied, region_id)
			WHERE m.region_id = v.region_id;
		`; // End sql
		//#endregion - New costs sql query building above:


		//#region - Full query building below:
		// ⬇ Now we build the full query with transaction begin and commit: 
		let fullQuery = `
			BEGIN;
		`;

		if (savingPricesToHistoryLog && !overwritingAnExistingMonth) {
			fullQuery += currentCustomsDutiesSql + currentShippingCostsSql + currentProductCostsSql + currentMarkupSql;
		}; // End if

		if (savingPricesToHistoryLog && overwritingAnExistingMonth) {
			fullQuery += overwriteCustomsDutiesSql + overwriteShippingCostsSql + overwriteProductCostsSql + overwriteMarkupSql;
		}; // End if

		// ⬇ We're always going to be saving the new prices to be current:
		fullQuery += newCustomsDutiesSql + newShippingCostsSql + newProductCostsSql + newMarkupSql;

		fullQuery += `
			COMMIT;
		`; // End fullQuery
		//#endregion - Full query building above.

		// ⬇ Now we run the full query:
		await pool.query(fullQuery);

		// ⬇ If we made it this far, send a success:
		res.sendStatus(200);

	} catch (error) {
		console.error('Error with pricing log set new pricing query: \n \n ', error);
		res.sendStatus(500);
	}; // End try/catch
});



module.exports = router;