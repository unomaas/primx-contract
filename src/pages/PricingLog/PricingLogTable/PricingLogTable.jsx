
import { React, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../../../../src/components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, MenuItem, Menu, TablePagination, Divider, Tooltip, Paper, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default function PricingLogTable() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();

	const pricingLog = useSelector(store => store.pricingLog);
	const { viewState, dataState } = pricingLog;
	const [filter, setFilter] = useState({});


	const pricingLogTableOptions = {
		customs_duties: {
			label: "Customs Duties",
			key: "customs_duties",
			className: classes.customsDutiesHistoryGrid,
			paperClassName: classes.customsDutiesHistoryGrid,
			rows: dataState.customsDutiesHistoryAll,
			row_id: "custom_duty_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved_full',
					flex: 1,
					headerClassName: classes.header,
					// valueFormatter: (params) => {
					// 	return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					// },
				},
				{
					headerName: 'Custom Duty',
					field: 'duty_label',
					flex: 1,
					headerClassName: classes.header
				},
				{
					headerName: 'USA Duty (%)',
					field: 'usa_percent',
					flex: 1,
					type: 'number',
					headerClassName: classes.header,
					valueFormatter: (params) => {
						// ⬇ Return value as a percentage:
						return `${(params.value * 100)}%`;
					},
				},
				{
					headerName: 'CAN Duty (%)',
					field: 'can_percent',
					flex: 1,
					type: 'number',
					headerClassName: classes.header,
					valueFormatter: (params) => {
						// ⬇ Return value as a percentage:
						return `${(params.value * 100)}%`;
					},
				},
			] // End columns
		}, // End customs_duties
		markup_margin: {
			label: "Markup Margin",
			key: "markup_margin",
			className: classes.customsDutiesHistoryGrid,
			paperClassName: classes.customsDutiesHistoryGrid,
			rows: dataState.markupHistoryAll,
			row_id: "markup_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved_full',
					flex: 1,
					headerClassName: classes.header,
					// valueFormatter: (params) => {
					// 	return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					// },
				},
				{
					headerName: 'Margin Applied (%)',
					field: 'margin_applied',
					flex: 1,
					type: 'number',
					headerClassName: classes.header,
					valueFormatter: (params) => { return `${(params.value * 100)}%` },
					type: 'number',
				},
			] // End columns
		}, // End markup_margin
		product_cost: {
			label: "Product Cost",
			key: "product_cost",
			className: classes.customsDutiesHistoryGrid,
			paperClassName: classes.customsDutiesHistoryGrid,
			rows: dataState.productCostHistoryAll,
			row_id: "product_cost_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved_full',
					flex: 1,
					headerClassName: classes.header,
					// valueFormatter: (params) => {
					// return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					// },
				},
				{
					headerName: 'Product',
					field: 'product_label',
					flex: 1,
					headerClassName: classes.header,
				},
				{
					headerName: 'Cost',
					field: 'product_self_cost',
					flex: 1,
					headerClassName: classes.header,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					},
				},
			] // End columns
		}, // End product_cost
		shipping_cost: {
			label: "Shipping Cost",
			key: "shipping_cost",
			className: classes.shippingCostHistoryGrid,
			paperClassName: classes.shippingCostHistoryGrid,
			rows: dataState.shippingCostHistoryAll,
			row_id: "shipping_cost_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved_full',
					flex: 1.25,
					headerClassName: classes.header,
					// valueFormatter: (params) => {
					// return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					// },
				},
				{
					headerName: 'Destination',
					field: 'destination_name',
					flex: 1.25,
					headerClassName: classes.header,

				},
				{
					headerName: 'DC 20ft',
					field: 'dc_20ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
				{
					headerName: 'DC 40ft',
					field: 'dc_40ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
				{
					headerName: 'Fibers 20ft',
					field: 'fibers_20ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
				{
					headerName: 'Fibers 40ft',
					field: 'fibers_40ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
				{
					headerName: 'CPEA 20ft',
					field: 'cpea_20ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
				{
					headerName: 'CPEA 40ft',
					field: 'cpea_40ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
				{
					headerName: 'Flow 20ft',
					field: 'flow_20ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
				{
					headerName: 'Flow 40ft',
					field: 'flow_40ft',
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					}
				},
			] // End columns
		}, // End shipping_cost
		// TODO: Implement this. 
		price_per_unit: {
			label: "Price Per Unit",
			key: "price_per_unit",
			className: classes.pricePerUnitHistoryGrid,
			paperClassName: classes.pricePerUnitHistoryPaper,
			row_id: "destination_id",
			rows: dataState?.pricePerUnitHistory12Months?.pricingLogPerUnitRows,
			double_columns: dataState?.pricePerUnitHistory12Months?.pricingLogPerUnitTopHeader,
			columns: dataState?.pricePerUnitHistory12Months?.pricingLogPerUnitBottomHeader,
		}, // End product_cost
	}

	const [selectedLog, setSelectedLog] = useState(pricingLogTableOptions.product_cost);



	// const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	// ⬇ Logic to handle setting the table rows on first load: 
	const [tableMounted, setTableMounted] = useState(false);
	// columns for Data Grid
	let columns = [];
	let doubleColumns = [];

	if (selectedLog.key != "price_per_unit") {
		columns = selectedLog.columns;
	} else {
		selectedLog.columns.forEach((column) => {
			if (column.headerName.includes("Price")) {
				columns.push({
					headerName: column.headerName,
					field: column.field,
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
				}); // End push
			} else if (column.headerName.includes("Change")) {
				columns.push({
					headerName: column.headerName,
					field: column.field,
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
					type: 'number',
					renderCell: (params) => {
						if (params.value == undefined) return "N/A";
						if (params.value > 0) return <div style={{ display: "flex", alignItems: "center" }}><ArrowUpwardIcon style={{ color: "green" }} />&nbsp;&nbsp;{`${(params.value * 100).toFixed(2)}%`}</div>;
						if (params.value < 0) return <div style={{ display: "flex", alignItems: "center" }}><ArrowDownwardIcon style={{ color: "red" }} />&nbsp;&nbsp;{`${(params.value * 100).toFixed(2)}%`}</div>;
						if (params.value == 0) return <div>0.00%</div>;
					},
				}); // End push
			} else if (column.headerName.includes("Measurement")) {
				columns.push({
					headerName: column.headerName,
					field: column.field,
					flex: 1,
					headerClassName: classes.header,
					disableColumnMenu: true,
					sortable: false,
				}); // End push
			} else {
				columns.push({
					headerName: column.headerName,
					field: column.field,
					flex: 1,
					headerClassName: classes.header,
				}); // End push
			}; // End if/else
		}); // End for each

		selectedLog.double_columns.forEach((column) => {
			if (column.month_year_label) {
				doubleColumns.push({
					headerName: column.headerName,
					field: column.field,
					flex: 4,
					headerClassName: classes.header,
				}); // End push
			} else {
				doubleColumns.push({
					// headerName: column.headerName,
					// field: column.field,
					flex: 1,
					headerClassName: classes.header,
				}); // End push
			}; // End if/else
		}); // End for each
	}; // End if/else


	// let rows = selectedLog.rows;
	let rows = [];
	for (let row of selectedLog.rows) {
		if (Object.values(filter).length > 0 && filter.value !== row.date_saved_full) continue;
		rows.push(row);
	}; // End for of loop


	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the historical pricing log for various items.<br /><br />Row selection is disabled.  Click in the center of the table to select a new pricing history view.  Use the top-right Date Saved filter to narrow down results to a specific date.</p>}
					placement="right-start"
					arrow
				>
					<Button
						color="primary"
						size="small"
					>
						<HelpIcon style={{ marginRight: "8px", marginLeft: "-2px" }} /> Help
					</Button>
				</Tooltip>
			)
		}; // End TableInstructions
		const [anchorEl, setAnchorEl] = useState(null);
		const menuItems = [
			<GridToolbarExport />,
			<Divider />,
			<GridToolbarFilterButton />,
			// <Divider />,
			// <GridToolbarColumnsButton />,
			<Divider />,
			<GridToolbarDensitySelector />,
			<Divider />,
			<TableInstructions />,
		]; // End menuItems

		const handleFilter = (value) => {
			setFilter(value)
		}; // End handleFilter

		let autocompleteOptions = {};
		selectedLog.rows.forEach((row) => {
			autocompleteOptions[row.date_saved_full] = {
				value: row.date_saved_full,
				// label: `${new Date(row.date_saved_full).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`,
				label: row.date_saved_full,
			}
		});

		return (
			<GridToolbarContainer className={`toolbar-container`} style={{ display: "block" }}>

				<div className={`toolbar-row ${selectedLog.key == "price_per_unit" ? classes.pricePerUnitToolbar : ""}`} style={{
					display: "flex",
					// padding: "4px 4px 0",
					alignItems: "center",
				}}>

					<div style={{
						flex: "1",
						display: "flex",
						justifyContent: "flex-start",
						height: "45px"
					}}>
						<Button
							aria-controls="customized-menu"
							aria-haspopup="true"
							color="primary"
							size="small"
							style={{ marginBottom: "4px" }}
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
					</div>

					<div style={{
						flex: "1",
						display: "flex",
						justifyContent: "center",
						fontSize: "12px",
						fontFamily: "Lexend Tera",
						height: "45px"

					}}>
						<GridToolbarSelectDropdown />

					</div>

					<div style={{
						flex: "1",
						display: "flex",
						justifyContent: "flex-end",
						fontSize: "11px",
						fontFamily: "Lexend Tera",
						// height: "45px"

					}}>

						{selectedLog.key != "price_per_unit" &&
							<Autocomplete
								options={Object.values(autocompleteOptions)}
								getOptionLabel={(option) => option.label || ""}
								getOptionSelected={(option, value) => option.label == value.label}
								style={{ width: 190 }}
								renderInput={(params) =>
									<TextField
										{...params}
										label="Date Saved Filter"
										InputLabelProps={{ shrink: true }}
									/>
								}
								onChange={(event, value) => handleFilter(value || {})}
								value={Object.keys(filter).length > 0 ? filter : null}
							/>
						}

					</div>
				</div>

				{selectedLog.key === "price_per_unit" &&
					<div style={{
						display: "flex",
						// padding: "4px 4px 0",
						alignItems: "center",
						height: "45px",
						// width: "100%",
						marginLeft: "-4px",
						marginRight: "-4px",
						backgroundColor: "#686868",
						color: "white",
					}}>

						{selectedLog.double_columns.map((column, index) => {
							if (column.month_year_label) {
								return (
									<div style={{
										flex: "4",
										display: "flex",
										// textAlign: "center",
										justifyContent: "center",
										borderLeft: "1px solid #e0e0e0",
										borderRight: "1px solid #e0e0e0",
										fontWeight: "500",
										// className: classes.header,
										// justifyContent: "center",
										// fontSize: "11px",
										// fontFamily: "Lexend Tera",
										// height: "45px"
									}} key={index} >
										{column.month_year_label} at {(column.margin_applied * 100)}% Markup
									</div>
								)
							} else {
								return (
									<div style={{
										flex: "1",
										display: "flex",
										justifyContent: "center",
										// borderLeft: "1px solid #e0e0e0",
										borderRight: "1px solid #e0e0e0",
										fontWeight: "bold",
										// justifyContent: "center",
										// fontSize: "11px",
										// fontFamily: "Lexend Tera",
										// height: "45px"
									}} key={index}>{column.month_year_value}</div>
								)
							}
						})}
					</div>
				}


			</GridToolbarContainer >
		); // End return
	}; // End CustomToolbar


	const GridToolbarSelectDropdown = () => {

		const [anchorEl, setAnchorEl] = useState(null);

		const handleLogViewSelection = (key) => {
			setAnchorEl(null);
			setSelectedLog(pricingLogTableOptions[key]);
			setFilter({});
		}; // End handleLogViewSelection

		// ⬇ Rendering below:
		return (
			<>
				<Button
					aria-controls="customized-menu"
					aria-haspopup="true"
					color="primary"
					size="small"
					style={{ marginBottom: "4px" }}
					onClick={event => setAnchorEl(event.currentTarget)}
				>
					Viewing {selectedLog.label} <ArrowDropDownIcon />
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
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
				>
					{Object.values(pricingLogTableOptions).map((item, index) => {
						return (
							<MenuItem
								key={index}
								onClick={() => handleLogViewSelection(item.key)}
								selected={item.key == selectedLog.key ? true : false}

							>
								View {item.label}
							</MenuItem>
						)
					})}
				</Menu>
			</>
		); // End return
	} // End GridToolbarSelectDropdown


	const CustomPagination = () => {
		// ⬇ State Variables: 
		const { state, apiRef } = useGridSlotComponentProps();

		//#region - Pagination Action Handlers:
		// ⬇ We only want the page size to be set once, on initial render (otherwise it defaults to 100):
		useEffect(() => {
			if (tableMounted === false) {
				apiRef.current.setPageSize(rowsPerPageOptions[0]);
				setTableMounted(true);
			}; // End if
		}, []); // End useEffect

		const handleOnPageChange = (value) => {
			apiRef.current.setPage(value);
		}; // End handleOnPageChange


		const handleOnRowsPerPageChange = (size) => {
			apiRef.current.setPageSize(size.props.value);
			setRowsPerPage(size.props.value);
			handleOnPageChange(0);
		}; // End handleOnRowsPerPageChange
		//#endregion - Pagination Action Handlers.

		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-end",
			}}>
				<TablePagination
					component='div'
					count={state.rows.totalRowCount}
					page={state.pagination.page}
					onPageChange={(event, value) => handleOnPageChange(value)}
					rowsPerPageOptions={rowsPerPageOptions}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={(event, size) => handleOnRowsPerPageChange(size)}
				/>
			</div>
		); // End return
	}; // End PaginationComponent

	const CustomFooter = () => {
		const [anchorEl, setAnchorEl] = useState(null);

		return (
			<div className={`toolbar-container ${selectedLog.key == "price_per_unit" ? classes.pricePerUnitToolbar : ""}`} style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-start",
			}}>
				<CustomPagination />
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 

	// ⬇ Rendering below: 
	return (
		<Paper
			elevation={3}
			className={selectedLog.paperClassName}
		// style={{ width: "700px", margin: "0 auto", overflowX: "scroll" }}
		>

			{/* <TableHeader selectedLog={selectedLog} /> */}

			{/* <CustomToolbar /> */}
			<DataGrid
				id="pricingLogTable"
				className={selectedLog.className}
				// ⬇ Set a style to, if the selectedLog.key == "price_per_unit", I want the width to be rows.length * 100 px:
				style={selectedLog.key === "price_per_unit" ? { width: `${rows.length * 100}px` } : {}}

				columns={columns}
				rows={rows}
				getRowId={(row) => row[`${selectedLog.row_id}`]}
				autoHeight
				disableSelectionOnClick
				pagination
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>

		</Paper>
	)
}

