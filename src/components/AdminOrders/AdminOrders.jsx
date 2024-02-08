import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import useEstimateCalculations from '../../hooks/useEstimateCalculations.js';

// Material-UI components
import Typography from '@material-ui/core/Typography';
// components
import AdminEstimatesGrid from '../AdminEstimatesGrid/AdminEstimatesGrid';
import { useClasses } from '../MuiStyling/MuiStyling';


export default function AdminOrders() {
	// bring in custom calculation hook
	const calculateEstimate = useEstimateCalculations;
	const dispatch = useDispatch();
	const classes = useClasses();

	// useSelector looks at the array of estimate objects from adminEstimates reducer
	const allEstimates = useSelector(store => store.adminEstimates);



	// create holding arrays to be filled with estimate objects, then passed as props to create the needed Data Grids
	const [pendingOrders, processedOrders, openEstimates, archivedEstimates] = [[], [], [], []];

	// break up all estimates into pending orders, processed orders, and open estimates
	allEstimates.forEach(estimate => {

		const updatedEstimate = calculateEstimate(estimate);
		// sort the estimates into their individual array
		// orders are considered processed if they've been marked_as_ordered by an admin and ordered_by_licensee by a licensee
		if (estimate.marked_as_ordered && estimate.ordered_by_licensee) {
			processedOrders.push(estimate);
		} // orders are considered pending if they've been ordered_by_licensee by a licensee but not yet marked_as_ordered by an admin
		else if (estimate.ordered_by_licensee) {
			// If this estimate was used in a combined, hide it from the GUI: 
			if (estimate.archived) {
				return;
			}
			if (estimate.selected_steel_fiber_dosage == '75_50') {
				estimate.final_price_per_unit = estimate.price_per_unit_75_50;
				estimate.final_total_project_cost = estimate.total_project_cost_75_50;
			} else if (estimate.selected_steel_fiber_dosage == '90_60') {
				estimate.final_price_per_unit = estimate.price_per_unit_90_60;
				estimate.final_total_project_cost = estimate.total_project_cost_90_60;
			} else {
				estimate.final_total_project_cost = estimate.total_project_cost_75_50;
				estimate.selected_steel_fiber_dosage = 'Combined';
				if (estimate.measurement_units == 'imperial') {
					estimate.final_price_per_unit = estimate.final_total_project_cost / parseFloat(estimate.total_project_volume.replaceAll(',', ''));
				} else {
					estimate.final_price_per_unit = estimate.final_total_project_cost / parseFloat(estimate.total_project_volume.replaceAll(',', ''));
				}
			}
			pendingOrders.push(estimate);
		} // orders are considered archived if they have estimate.archived marked true my admin via the archive button
		else if (estimate.archived) {
			archivedEstimates.push(estimate);
		} // orders where neither of those are true are considered open
		else {
			openEstimates.push(estimate);
		}
	})
	
	// ! Ryan here, when you come back, you need to update all of tables to remove the unused columns (both in the UI and in the database).  Then we need to come up with a fix to prevent imperial vs metric selection on Prod.  Then we need to merge this branch with the testing/main branch and push this up to the testing website.  Then we need to complete a run through of the testing website and all of the features, and let PrimX know it's done. :)  Eventually, we'll also need to sit down to make the DB migration on Prod and push these changes up to there as well.  THEN we get to re-make the app! 

	useEffect(() => {
		// GET all estimates data on page load
		dispatch({ type: 'FETCH_ALL_ESTIMATES' });
	}, [])


	return (
		<div>
			<br />
			<Typography
				variant="h5"
				component="h2"
				align="center"
				className={classes.OrdersHeaders}
			>
				Pending Orders
			</Typography>
			<AdminEstimatesGrid
				estimatesArray={pendingOrders}
				gridSource={'pending'}
			/>

			<br />
			<Typography
				variant="h5"
				component="h2"
				align="center"
				className={classes.OrdersHeaders}
			>
				Processed Orders
			</Typography>
			<AdminEstimatesGrid
				estimatesArray={processedOrders}
				gridSource={'processed'}
			/>

			<br />
			<Typography
				variant="h5"
				component="h2"
				align="center"
				className={classes.OrdersHeaders}
			>
				Open Estimates
			</Typography>
			<AdminEstimatesGrid
				estimatesArray={openEstimates}
				gridSource={'open'}
			/>

			<br />
			<Typography
				variant="h5"
				component="h2"
				align="center"
				className={classes.OrdersHeaders}
			>
				Archived Estimates
			</Typography>
			<AdminEstimatesGrid
				estimatesArray={archivedEstimates}
				gridSource={'archived'}
			/>
		</div>
	)
}
