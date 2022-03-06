import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import useEstimateCalculations from '../../hooks/useEstimateCalculations.js';

// Material-UI components
import Typography from '@material-ui/core/Typography';
// components
import AdminEstimatesGrid from '../AdminEstimatesGrid/AdminEstimatesGrid';
import LicenseeEstimatesGrid from './LicenseeEstimatesGrid.jsx';
import { useStyles } from '../MuiStyling/MuiStyling';


export default function LicenseeTables({ pageData }) {
	// bring in custom calculation hook
	const calculateEstimate = useEstimateCalculations;
	const dispatch = useDispatch();
	const classes = useStyles();

	// useSelector looks at the array of estimate objects from adminEstimates reducer
	const allEstimates = useSelector(store => store.adminEstimates);

	console.log('***', {pageData});
	return (
		<div>
			<br />
			<Typography
				variant="h5"
				component="h2"
				align="center"
				className={classes.OrdersHeaders}
			>
				Open Orders
			</Typography>
			<LicenseeEstimatesGrid
				estimateData={pageData.open_orders_array} 
				gridSource={'open'} 
			/>


		</div>
	)
}
