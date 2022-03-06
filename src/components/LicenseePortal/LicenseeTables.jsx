import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import useEstimateCalculations from '../../hooks/useEstimateCalculations.js';

// Material-UI components
// import Typography from '@material-ui/core/Typography';
import { Button, MenuItem, TextField, Select, Radio, RadioGroup, FormControl, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Grid, FormHelperText, Typography } from '@material-ui/core';

// components
import AdminEstimatesGrid from '../AdminEstimatesGrid/AdminEstimatesGrid';
import LicenseeEstimatesGrid from './LicenseeEstimatesGrid.jsx';
import { useStyles } from '../MuiStyling/MuiStyling';


export default function LicenseeTables({ pageData }) {
	// bring in custom calculation hook
	const classes = useStyles();


	console.log('***', {pageData});
	return (
		<Paper>
			{/* <br /> */}
			{/* <Typography
				variant="h5"
				component="h2"
				align="center"
				className={classes.OrdersHeaders}
			>
				Open Orders
			</Typography> */}
			<LicenseeEstimatesGrid
				estimateData={pageData.open_orders_array} 
				gridSource={'open'} 
			/>


		</Paper>
	)
}
