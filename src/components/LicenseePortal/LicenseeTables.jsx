import { React, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useEstimateCalculations from '../../hooks/useEstimateCalculations.js';

// Material-UI components
// import Typography from '@material-ui/core/Typography';
import { Button, MenuItem, TextField, Select, Radio, RadioGroup, FormControl, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Grid, FormHelperText, Typography } from '@material-ui/core';

// components
import AdminEstimatesGrid from '../AdminEstimatesGrid/AdminEstimatesGrid';
import LicenseeEstimatesGrid from './LicenseeEstimatesGrid.jsx';
import { useStyles } from '../MuiStyling/MuiStyling';


export default function LicenseeTables() {
	const classes = useStyles();
	const pageData = useSelector(store => store.licenseePortalReducer.pageData);
	const tableData = useSelector(store => store.licenseePortalReducer.tableData);

	// const openOrders = useSelector(store => store.licenseePortalReducer.openOrders);
	// const pendingOrders = useSelector(store => store.licenseePortalReducer.pendingOrders);
	// const processedOrders = useSelector(store => store.licenseePortalReducer.processedOrders);
	// const archivedOrders = useSelector(store => store.licenseePortalReducer.archivedOrders);

	// Depending on the button state, show the associated data: 
	let data_to_display = [];
	let grid_source = "";
	if (tableData == "Pending Orders") {
		data_to_display = pageData.pending_orders_array;
		grid_source = "pending";
	} else if (tableData == "Processed Orders") {
		data_to_display = pageData.processed_orders_array;
		grid_source = "processed";
	} else if (tableData == "Archived Orders") {
		data_to_display = pageData.archived_orders_array;
		grid_source = "archived";
	} else if (tableData == "Open Orders") {
		data_to_display = pageData.open_orders_array;
		grid_source = "open";
	}

	return (
		<Paper>
			<LicenseeEstimatesGrid
				estimateData={data_to_display}
				gridSource={grid_source}
			/>
		</Paper>
	)
}
