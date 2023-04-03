
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import useCalculateProjectCost from '../../../hooks/useCalculateProjectCost';
// import AdminUpdates from './AdminUpdates';


// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function UpdateMarkupMargin() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	// const currentMarkup = useSelector(store => store.products.currentMarkupMargin);
	// const markupHistoryRecent = useSelector(store => store.products.markupHistoryRecent);
	// const markupHistory12Months = useSelector(store => store.products.markupHistory12Months);
	// const markupIsLoading = useSelector(store => store.products.markupIsLoading);
	// const shippingActiveDestinations = useSelector(store => store.shippingDestinations.shippingActiveDestinations);

	const { viewState, dataState } = useSelector(store => store.pricingLog);
	const { newShippingCosts, newProductCosts, newCustomsDuties, newMarkup, monthOptions } = viewState;
	const { currentShippingCosts, currentProductCosts, currentCustomsDuties, currentMarkupMargin, shippingDestinations, pricingData12Months, productContainers, dosageRates } = dataState;
	// const currentMarkup = useSelector(store => store.products.currentMarkupMargin);
	// const currentMarkup = viewState.newMarkup;
	// const shippingActiveDestinations = dataState.activeShippingDestinations;

	const [rightSelectedMonth, setRightSelectedMonth] = useState(pricingData12Months['new']);
	const [leftSelectedMonth, setLeftSelectedMonth] = useState(pricingData12Months['current']);




	// if (rightSelectedMonth === null && leftSelectedMonth === null) {
	// 	console.log(`Ryan Here 1: if check \n `, );

	// 	setLeftSelectedMonth(pricingData12Months['current']);
	// 	setRightSelectedMonth(pricingData12Months['new']);

	// 	// rightSelectedMonth = pricingData12Months['new'];
	// 	// leftSelectedMonth = pricingData12Months['current'];

	// }; // End if

	// ⬇ We need to set the 'new' pricing data and compare it against the 'current' pricing data:


	function calculateNewPricingData() {

		pricingData12Months.new.destinationsCosts = [];

		pricingData12Months.new.pricing = {
			products: JSON.parse(JSON.stringify(newProductCosts)),
			currentMarkup: JSON.parse(JSON.stringify(newMarkup)),
			shippingCosts: JSON.parse(JSON.stringify(newShippingCosts)),
			customsDuties: JSON.parse(JSON.stringify(newCustomsDuties)),
			shippingDestinations: JSON.parse(JSON.stringify(shippingDestinations)),
			productContainers: JSON.parse(JSON.stringify(productContainers)),
			dosageRates: JSON.parse(JSON.stringify(dosageRates)),
		}

		for (const destination of shippingDestinations) {
			const estimate = {};

			if (destination.destination_country == "USA") {
				estimate.measurement_units = "imperial";
				estimate.design_cubic_yards_total = 1000;
				estimate.units_label = "USD/Cubic Yard";
			} else {
				estimate.measurement_units = "metric";
				estimate.design_cubic_meters_total = 1000;
				estimate.units_label = "USD/Cubic Meter";
			}; // End if/else

			estimate.destination_id = destination.destination_id;
			estimate.destination_name = destination.destination_name;

			const calculatedEstimate = useCalculateProjectCost(estimate, pricingData12Months.new.pricing);

			pricingData12Months.new.destinationsCosts.push({
				destination_id: calculatedEstimate.destination_id,
				destination_name: calculatedEstimate.destination_name,
				measurement_units: calculatedEstimate.measurement_units,
				units_label: calculatedEstimate.units_label,
				price_per_unit_75_50: calculatedEstimate.price_per_unit_75_50,
				price_per_unit_90_60: calculatedEstimate.price_per_unit_90_60,
			}); // End month.destinationsCosts.push
		}; // End for loop
	}

	// useEffect(() => {
	calculateNewPricingData();
	// }, []);

	const leftTableData = leftSelectedMonth.destinationsCosts;
	const rightTableData = rightSelectedMonth.destinationsCosts;


	let rows = [];


	// ⬇ Logic to handle setting the table rows on first load:
	if (leftTableData !== undefined && rightTableData !== undefined) {
		// ⬇ Looping through the left table data:
		for (let i = 0; i < shippingDestinations.length; i++) {
			const shippingDestinationItem = shippingDestinations[i];
			const leftTableDataItem = leftTableData[i];
			const rightTableDataItem = rightTableData[i];
			const row = {
				destination_id: shippingDestinationItem.destination_id,
				destination_name: shippingDestinationItem.destination_name,
				left_price_per_unit_75_50: leftTableDataItem.price_per_unit_75_50,
				left_price_per_unit_90_60: leftTableDataItem.price_per_unit_90_60,
				right_price_per_unit_75_50: rightTableDataItem.price_per_unit_75_50,
				right_price_per_unit_90_60: rightTableDataItem.price_per_unit_90_60,
				// ⬇ Calculate the difference between the two as a percentage:
				difference_per_unit_75_50: Math.abs(rightTableDataItem.price_per_unit_75_50 - leftTableDataItem.price_per_unit_75_50) / ((leftTableDataItem.price_per_unit_75_50 + rightTableDataItem.price_per_unit_75_50) / 2),
				difference_per_unit_90_60: Math.abs(rightTableDataItem.price_per_unit_90_60 - leftTableDataItem.price_per_unit_90_60) / ((leftTableDataItem.price_per_unit_90_60 + rightTableDataItem.price_per_unit_90_60) / 2),
				units_label: rightTableDataItem.units_label,
			}; // End row
			rows.push(row);
		}; // End for
	}; // End if




	// ⬇ Logic to handle setting the table rows on first load: 
	const columns = [
		{
			headerName: `Destination`,
			field: 'destination_name',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
		},
		{
			headerName: `60lbs/35kg Price: ${leftSelectedMonth.month_year_label}`,
			field: 'left_price_per_unit_75_50',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
		},
		{
			headerName: `68lbs/40kg Price: ${leftSelectedMonth.month_year_label}`,
			field: 'left_price_per_unit_90_60',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
		},
		{
			headerName: `60lbs/35kg Price: ${rightSelectedMonth.month_year_label}`,
			field: 'right_price_per_unit_75_50',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
		},
		{
			headerName: `68lbs/40kg Price: ${rightSelectedMonth.month_year_label}`,
			field: 'right_price_per_unit_90_60',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
		},
		{
			headerName: `60lbs/35kg Difference`,
			field: 'difference_per_unit_75_50',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => { return `${(params.value * 100).toFixed(2)}%`; },
		},
		{
			headerName: `68lbs/40kg Difference`,
			field: 'difference_per_unit_90_60',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => { return `${(params.value * 100).toFixed(2)}%`; },
		},
		{
			headerName: `Units`,
			field: 'units_label',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
		},
	];
	//#endregion - End State Variables.

	//#region - Table Setup Below:




	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied markup margin percentage.<br /><br />To edit the markup margin, first you must save the current markup to the Pricing History Log for this month.<br /><br />To do that, click "Actions", then click "Save Markup".  You will be able to save the current costs multiple times, but please be aware this will create more than one entry in the Pricing History Log for this month.</p>}
					placement="right-start"
					arrow
				>
					<Button
						color="primary"
						size="small"
					>
						<HelpIcon style={{ markupRight: "8px", markupLeft: "-2px" }} /> Help
					</Button>
				</Tooltip>
			)
		}; // End TableInstructions
		const [anchorEl, setAnchorEl] = useState(null);
		const menuItems = [
			<GridToolbarExport />,
			<Divider />,
			<GridToolbarFilterButton />,
			<Divider />,
			<GridToolbarColumnsButton />,
			<Divider />,
			<GridToolbarDensitySelector />,
			<Divider />,
			<TableInstructions />,
		]; // End menuItems

		const handleLeftViewSelection = (date) => {
			setAnchorEl(null);
			if (leftSelectedMonth.month_year_value == date) return;
			setLeftSelectedMonth(pricingData12Months[date]);
		}; // End handleLogViewSelection

		const handleRightViewSelection = (date) => {
			setAnchorEl(null);
			if (rightSelectedMonth.month_year_value == date) return;
			setRightSelectedMonth(pricingData12Months[date]);
		}; // End handleLogViewSelection

		return (
			<GridToolbarContainer style={{ display: "block", width: "100%" }} >
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						width: "100%",
					}}
				>
					<div
						style={{
							flex: "0.125",
							justifyContent: "center",
							fontSize: "12px",
							fontFamily: "Lexend Tera",
						}}
					>
						<Button
							aria-controls="customized-menu"
							aria-haspopup="true"
							color="primary"
							size="small"
							style={{ marginBottom: "4px", width: "100%" }}
							onClick={event => setAnchorEl(event.currentTarget)}
						>
							<ArrowDropDownIcon /> Options
						</Button>
						<Menu
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={() => setAnchorEl(null)}
							elevation={3}
							getContentAnchorEl={null}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
						>
							{menuItems.map((item, index) => {
								if (item.type === Divider) {
									return <Divider variant="middle" key={index} />
								} else {
									return (
										<MenuItem key={index} disableGutters onClick={() => setAnchorEl(null)}>
											{item}
										</MenuItem>
									)
								}
							})}
						</Menu>
					</div>

					<div
						style={{
							flex: "0.25",
							justifyContent: "center",
							fontSize: "12px",
							fontFamily: "Lexend Tera",
						}}
					>
						<GridToolbarSelectDropdown
							month={leftSelectedMonth}
							otherMonth={rightSelectedMonth}
							handleViewSelection={handleLeftViewSelection}
							viewState={viewState}
						/>

					</div>

					<div
						style={{
							flex: "0.25",
							justifyContent: "center",
							fontSize: "12px",
							fontFamily: "Lexend Tera",
						}}
					>
						<GridToolbarSelectDropdown
							month={rightSelectedMonth}
							otherMonth={leftSelectedMonth}
							handleViewSelection={handleRightViewSelection}
							viewState={viewState}
						/>

					</div>

					{/* <div
						style={{
							flex: "1",
							display: "flex",
							justifyContent: "flex-end",
							fontSize: "11px",
							fontFamily: "Lexend Tera",
						}}
					>
					</div> */}
				</div>

			</GridToolbarContainer >
		); // End return
	}; // End CustomToolbar




	const CustomFooter = () => {
		// //#region - Info for the Save Costs to History Log button:
		// // ⬇ Get today's date in YYYY-MM format;
		// const today = new Date().toISOString().slice(0, 7);
		// let disabled = true;
		// let tooltipText = <p>The current costs have not been saved yet for this month.  Please click the "Save Costs to History Log" button to save the current costs for this month first.</p>;
		// if (
		// 	markupHistoryRecent.length > 1 &&
		// 	markupHistoryRecent[1].date_saved.slice(0, 7) === today
		// ) {
		// 	disabled = false;
		// 	tooltipText = "";
		// };


		// const handleSaveHistoryLogSubmit = () => {
		// 	if (
		// 		markupHistoryRecent.length > 1 &&
		// 		markupHistoryRecent[1].date_saved.slice(0, 7) === today
		// 	) {
		// 		if (!window.confirm(`Markup margins have already been saved for this month.  If you continue, two entries will be saved for this month.  Click "OK" to continue.`)) return;
		// 	}; // End if
		// 	dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
		// 	dispatch({ type: 'MARKUP_SAVE_HISTORY_LOG', payload: currentMarkup })
		// }; // End handleSaveHistoryLogSubmit
		// //#endregion - Info for the Save Costs to History Log button.

		// const [anchorEl, setAnchorEl] = useState(null);
		// const menuItems = [
		// 	<Button
		// 		color="primary"
		// 		size="small"
		// 		onClick={() => handleSaveHistoryLogSubmit()}
		// 	>
		// 		Save Markup to History Log
		// 	</Button>,
		// 	<Divider />,
		// 	<Tooltip title={tooltipText} placement="right-end" arrow>
		// 		<span>
		// 			<Button
		// 				color="primary"
		// 				size="small"
		// 				onClick={() => setShowEditModal(true)}
		// 				disabled={disabled}
		// 			>
		// 				Edit Markup Margin
		// 			</Button>
		// 		</span>
		// 	</Tooltip>,

		// ]; // End menuItems


		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-start",
				height: "52px",
			}}>
				{/* <>
					<Button
						aria-controls="customized-menu"
						aria-haspopup="true"
						color="primary"
						size="small"
						onClick={event => setAnchorEl(event.currentTarget)}
					>
						<ArrowDropUpIcon /> Actions
					</Button>
					<Menu
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={() => setAnchorEl(null)}
						elevation={3}
						getContentAnchorEl={null}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						{menuItems.map((item, index) => {
							if (item.type === Divider) {
								return <Divider variant="middle" key={index} />
							} else {
								return (
									<MenuItem
										key={index}
										disableGutters
										onClick={() => setAnchorEl(null)}
									>
										{item}
									</MenuItem>
								)
							}
						})}
					</Menu>
				</> */}
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 


	// ⬇ Rendering below: 
	return (
		<Paper
			elevation={3}
			style={{
				height: 'fit-content',
				width: "1100px",
				margin: "0 auto",
			}}
		>
			<DataGrid
				className={classes.dataGridTables}
				disableSelectionOnClick
				columns={columns}
				rows={rows}
				getRowId={(row) => row.destination_id}
				autoHeight
				pagination
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>
		</Paper>
	)
}


const GridToolbarSelectDropdown = ({ month, otherMonth, handleViewSelection, viewState }) => {
	const { monthOptions } = viewState;
	const [anchorEl, setAnchorEl] = useState(null);
	return (
		<>
			<Button
				aria-controls="customized-menu"
				aria-haspopup="true"
				color="primary"
				size="small"
				style={{ marginBottom: "4px", width: "100%" }}
				onClick={event => setAnchorEl(event.currentTarget)}
			>
				{month.month_year_label}{month.month_year_label.slice(-3) === "ing" ? "" : " Pricing"} <ArrowDropDownIcon />
			</Button>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				elevation={3}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				{monthOptions.map((item, index) => {
					return (
						<MenuItem
							key={index}
							onClick={() => handleViewSelection(item.value)}
							selected={item.value === month.month_year_value ? true : false}
						>
							View {item.label}
						</MenuItem>
					)
				})}
			</Menu>
		</>
	); // End return
} // End GridToolbarSelectDropdown

