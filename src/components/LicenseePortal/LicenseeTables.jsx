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

	// TODO: When I come back to this, the flip switch between data works great.  However, because none of the states are being updated (aka we don't load again after doing it), the page does not update.  We can either move the data to a diff array (but then our source of truth doesn't match), or we can run the initial data load every time.  I'm not sure which I wanna take.  But after that, we need to test that all of the buttons "Archived / Delete / Process" are working.  Side note, Licensees should not get a "Process", only an archive and delete.  Lastly, go through and update the rows that we're showing them with conditional rendering.  

	// TODO: Another idea is instead of bringing the "pageData" in bundled as one item, we could break it up in the reducer into Open/Pending/etc.  Then when something is changed, we filter/shift it in the reducers, and that would update the state.  

	// TODO: Another idea is to have the DELETE/PUT queries return fresh data, which would accomplish the above while keeping hte source of truth the same.  I think the best route might be combining this with the above.  

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
