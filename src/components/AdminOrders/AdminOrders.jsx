import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import useEstimateCalculations from '../../hooks/useEstimateCalculations.js';

// Material-UI components
import Typography from '@material-ui/core/Typography';
// components
import AdminEstimatesGrid from '../AdminEstimatesGrid/AdminEstimatesGrid';
import { useStyles } from '../MuiStyling/MuiStyling';


export default function AdminOrders() {
	// bring in custom calculation hook
	const calculateEstimate = useEstimateCalculations;
	const dispatch = useDispatch();
	const classes = useStyles();

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
			pendingOrders.push(estimate);
		} // orders are considered archived if they have estimate.archived marked true my admin via the archive button
		else if (estimate.archived) {
			archivedEstimates.push(estimate);
		} // orders where neither of those are true are considered open
		else {
			openEstimates.push(estimate);
		}
	})


	useEffect(() => {
		// GET all estimates data on page load
		dispatch({ type: 'FETCH_ALL_ESTIMATES' });
	}, [])

	console.log(`Ryan Here \n`, {allEstimates, pendingOrders, processedOrders, openEstimates, archivedEstimates});

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
