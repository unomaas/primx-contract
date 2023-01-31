
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../../../src/components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import PricingLogTable from './PricingLogTable/PricingLogTable'


import TopLoadingDiv from '../components/TopLoadingDiv';

export default function index() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const productContainers = useSelector(store => store.productContainers.productContainersArray);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [8, 16, 24, 48, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	// ⬇ Logic to handle setting the table rows on first load: 
	const [tableMounted, setTableMounted] = useState(false);


	const pricingLogData = useSelector(store => store.pricingLog);
	const { viewState, dataState } = pricingLogData;

	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'PRICING_LOG_INITIAL_LOAD' })
	}, [])

	if (viewState.isLoading) return <TopLoadingDiv />;


	return (
		<div className="EstimateCreate-wrapper">

			<PricingLogTable />
		</div>


	)
}
