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


export default function LicenseeTables({ pageData }) {
	// bring in custom calculation hook
	const classes = useStyles();
	const tableData = useSelector(store => store.licenseePortalReducer.tableData);

	let data_to_display = [];
	let grid_source = "";
	// let grid_source = useState('')
	const [data, setData] = useState([]);
	const [gridSource, setGridSource] = useState('open');

	// log

	// TODO: When I come back to this, the flip switch between data works great.  However, because none of the states are being updated (aka we don't load again after doing it), the page does not update.  We can either move the data to a diff array (but then our source of truth doesn't match), or we can run the initial data load every time.  I'm not sure which I wanna take.  But after that, we need to test that all of the buttons "Archived / Delete / Process" are working.  Side note, Licensees should not get a "Process", only an archive and delete.  Lastly, go through and update the rows that we're showing them with conditional rendering.  

	// Depending on the button state, show the associated data: 
	// if (tableData == "Open Orders") {

	// } else 
	if (tableData == "Pending Orders") {
		data_to_display = pageData.pending_orders_array;
		grid_source = "pending";
		// setData(pageData.pending_orders_array);
		// setGridSource("pending");
	} else if (tableData == "Processed Orders") {
		data_to_display = pageData.processed_orders_array;
		grid_source = "processed";

		// setData(pageData.processed_orders_array);
		// setGridSource("processed");
	} else if (tableData == "Archived Orders") {
		data_to_display = pageData.archived_orders_array;
		grid_source = "archived";
		// setData(pageData.archived_orders_array);
		// setGridSource("archived");
	} else if (tableData == "Open Orders") {
		data_to_display = pageData.open_orders_array;
		grid_source = "open";
		// setData(pageData.open_orders_array);
		// setGridSource("open");
	}

	console.log('***', { pageData }, { tableData }, { data_to_display });
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
				estimateData={data_to_display}
				gridSource={grid_source}
			/>


		</Paper>
	)
}
