const pool = require('../server/modules/pool');

// Run command with DRY_RUN=false to update the database
const DRY_RUN = process.env['DRY_RUN'] !== 'false';

const calculateTotalVolume = (estimate) => {
	let totalVolume = 0;

	if (estimate.measurement_units === 'imperial') {
		// Calculating total volume in cubic yards for imperial units
		totalVolume = (
			(estimate.square_feet * estimate.thickness_inches / 324) +
			((estimate.thickened_edge_perimeter_lineal_feet * 5) * ((6 - estimate.thickness_inches) * 0.5 / 324)) +
			((estimate.thickened_edge_construction_joint_lineal_feet * 10) * ((6 - estimate.thickness_inches) * 0.5 / 324))
		);

	} else if (estimate.measurement_units === 'metric') {
		// Calculating total volume in cubic meters for metric units
		totalVolume = (
			(estimate.square_meters * estimate.thickness_millimeters / 1000) +
			(estimate.thickened_edge_perimeter_lineal_meters * ((152.4 - estimate.thickness_millimeters) * 0.5) * 0.0015) +
			(estimate.thickened_edge_construction_joint_lineal_meters * ((152.4 - estimate.thickness_millimeters) * 0.5) * 0.003)
		);
	};

	// Check if totalVolume is a whole number
	if (totalVolume % 1 !== 0) {
		// Round to two decimal places if it's not a whole number
		totalVolume = Math.round(totalVolume * 100) / 100;
	};

	return totalVolume;
};

const updateEstimates = async () => {
	const connection = await pool.connect();
	try {
		await connection.query('BEGIN');

		const estimatesRes = await connection.query('SELECT * FROM estimates');
		const estimates = estimatesRes.rows;
		console.log(`Total of ${estimates.length} estimates found.`);

		for (const estimate of estimates) {
			const totalVolume = calculateTotalVolume(estimate);

			if (!DRY_RUN) {
				await connection.query('UPDATE estimates SET total_project_volume = $1 WHERE estimate_id = $2', [totalVolume, estimate.estimate_id]);
			} else {
				console.log(`Dry Run: Would have updated estimate with ID ${estimate.estimate_id} to total project volume: ${totalVolume}`);
			}
		}

		if (!DRY_RUN) {
			await connection.query('COMMIT');
			console.log('All estimates updated successfully.');
		} else {
			await connection.query('ROLLBACK');
			console.log('Dry run completed. No changes were made to the database.');
		}

	} catch (error) {
		await connection.query('ROLLBACK');
		console.error('Error updating estimates:', error);
	} finally {
		console.log(`End of calcTotalProjectVolume.js script.`);
		connection.release();
	}
};

updateEstimates();
