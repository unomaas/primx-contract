const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const format = require('pg-format');
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

// router.get('/get-regions', rejectUnauthenticated, async (req, res) => {
router.get('/get-regions', rejectNonAdmin, async (req, res) => {

	let activeClause = '';
	if (req.query.active === 'true') activeClause = 'WHERE is_active = true';
	const queryText = `
		SELECT * 
		FROM regions AS r
		${activeClause}
		ORDER BY region_id;
	`;
	try {
		const results = await pool.query(queryText);
		res.send(results.rows);
	} catch (error) {
		console.error('Error getting regions', error);
		res.sendStatus(500);
	}
});



/**
* POST route template for regions
*/
router.post('/create-new-region', rejectNonAdmin, async (req, res) => {
	const connection = await pool.connect();

	try {
		const {
			region_name,
			region_code,
			is_active,
			customsDuties,
			productCosts,
			containerStats,
		} = req.body;

		await connection.query('BEGIN');

		// Insert into regions table
		const insertRegionSql = `
      INSERT INTO regions (region_name, region_code, is_active)
      VALUES (${format('%L', region_name)}, ${format('%L', region_code)}, ${format('%L', is_active)})
      RETURNING region_id;
    `;
		const regionResult = await connection.query(insertRegionSql);
		const regionId = regionResult.rows[0].region_id;

		// Insert into customs_duties_regions table
		for (const [customDutyId, { value }] of Object.entries(customsDuties)) {
			const insertCustomDutySql = `
        INSERT INTO customs_duties_regions (custom_duty_id, region_id, duty_percentage)
        VALUES (${customDutyId}, ${regionId}, ${value / 100});
      `;
			await connection.query(insertCustomDutySql);
		}

		// Insert into product_region_cost table
		for (const [productId, { value }] of Object.entries(productCosts)) {
			const insertProductCostSql = `
        INSERT INTO product_region_cost (product_id, region_id, product_self_cost)
        VALUES (${productId}, ${regionId}, ${value});
      `;
			await connection.query(insertProductCostSql);
		}


		const containerSizes = ['20', '40'];
		let insertContainerSql = `
			INSERT INTO containers (container_length_ft, region_id)
			VALUES
		`;

		containerSizes.forEach((size, index) => {
			insertContainerSql += `(${format('%L', size)}, ${format('%L', regionId)})`;
			if (index < containerSizes.length - 1) {
				insertContainerSql += ', ';
			}
		});

		insertContainerSql += ' RETURNING container_id, container_length_ft;';

		const containerResult = await connection.query(insertContainerSql);

		const containerIdsBySize = containerResult.rows.reduce((acc, row) => {
			acc[row.container_length_ft] = row.container_id;
			return acc;
		}, {});

		let insertProductContainerSql = `
		INSERT INTO product_containers (product_id, container_id, max_pallets_per_container, max_weight_of_container, gross_weight_of_pallet, net_weight_of_pallet)
		VALUES
	`;

		const productContainerValues = [];

		Object.entries(containerStats).forEach(([productId, containerData]) => {
			Object.entries(containerData).forEach(([containerSize, stats]) => {
				if (containerIdsBySize[containerSize]) {
					const containerId = containerIdsBySize[containerSize];
					productContainerValues.push(`(${format('%L', productId)}, ${format('%L', containerId)}, ${format('%L', stats.max_pallets_per_container)}, ${format('%L', stats.max_weight_of_container)}, ${format('%L', stats.gross_weight_of_pallet)}, ${format('%L', stats.net_weight_of_pallet)})`);
				}
			});
		});

		insertProductContainerSql += productContainerValues.join(', ') + ';';

		await connection.query(insertProductContainerSql);

		await connection.query('COMMIT');
		res.sendStatus(201);
	} catch (error) {
		await connection.query('ROLLBACK');
		console.error('Error in submit new region POST', error);
		res.sendStatus(500);
	} finally {
		connection.release();
	}
});


router.post('/edit-existing-region', rejectNonAdmin, async (req, res) => {
	const connection = await pool.connect();
	try {
		const {
			region_id,
			region_code,
			is_active,
			region_name,
			customsDuties,
			productCosts,
			containerStats,
		} = req.body;

		await connection.query('BEGIN');

		const updateRegionSql = `
      UPDATE regions
      SET 
				region_name = ${format(`%L`, region_name)},
				region_code = ${format(`%L`, region_code)}, 
				is_active = ${format(`%L`, is_active)}
      WHERE region_id = ${format(`%L`, region_id)};
    `;
		await connection.query(updateRegionSql);

		await connection.query('COMMIT');
		res.sendStatus(200);
	} catch (error) {
		await connection.query('ROLLBACK');
		console.error('Error in edit existing region POST', error);
		res.sendStatus(500);
	} finally {
		connection.release();
	};
});

/**
* DELETE route template for regions
*/
router.delete('/:region_id', rejectNonAdmin, async (req, res) => {
	const queryText = 'DELETE FROM regions WHERE region_id = $1;';
	try {
		await pool.query(queryText, [req.params.region_id]);
		res.sendStatus(204);
	} catch (error) {
		console.error('Error deleting region', error);
		res.sendStatus(500);
	}
});

module.exports = router;
