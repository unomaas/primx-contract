
import { React, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, MenuItem, Menu, TablePagination, Divider, Tooltip, Paper, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';

export default function UpdatePricingSteps() {
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
			rows: dataState.customsDutiesHistoryAll,
			row_id: "custom_duty_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved',
					flex: 1,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					},
				},
				{
					headerName: 'Custom Duty',
					field: 'duty_label',
					flex: 1,
					headerClassName: classes.header
				},
				{
					headerName: 'USA Duty (%)',
					field: 'USA_percent',
					flex: 1,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						// ⬇ Return value as a percentage:
						return `${(params.value * 100)}%`;
					},
				},
				{
					headerName: 'CAN Duty (%)',
					field: 'CAN_percent',
					flex: 1,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						// ⬇ Return value as a percentage:
						return `${(params.value * 100)}%`;
					},
				},
			]
		},
		markup_margin: {
			label: "Markup Margin",
			key: "markup_margin",
			className: classes.customsDutiesHistoryGrid,
			rows: dataState.markupHistoryAll,
			row_id: "markup_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved',
					flex: 1,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					},
				},
				{
					headerName: 'Margin Applied (%)',
					field: 'margin_applied',
					flex: 1,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						return `${(params.value * 100)}%`;
					},
					type: 'number',
				},
			]
		},
		product_cost: {
			label: "Material Cost",
			key: "product_cost",
			className: classes.customsDutiesHistoryGrid,
			rows: dataState.productCostHistoryAll,
			row_id: "product_cost_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved',
					flex: 1,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					},
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
			]
		},
		shipping_cost: {
			label: "Shipping Cost",
			key: "shipping_cost",
			className: classes.customsDutiesHistoryGrid,
			rows: dataState.shippingCostHistoryAll,
			row_id: "shipping_cost_history_id",
			columns: [
				{
					headerName: 'Date Saved',
					field: 'date_saved',
					flex: 1,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						return `${new Date(params.value).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`;
					},
					
				},
				{
					headerName: 'Product',
					field: 'product_label',
					flex: 1,
					headerClassName: classes.header,
				},
				{
					field: 'container_length_ft',
					headerName: 'Container Length (ft)',
					flex: .5,
					disableColumnMenu: true,
					editable: false,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						return `${params.value}"`;
					},
				},
				{
					field: 'destination_name',
					headerName: 'Destination',
					flex: .75,
					disableColumnMenu: true,
					editable: false,
					headerClassName: classes.header
				},
				{
					field: 'container_destination',
					headerName: 'Country',
					flex: 0.75,
					disableColumnMenu: true,
					headerClassName: classes.header
				},
				{
					field: 'shipping_cost',
					type: 'number',
					headerName: 'Cost',
					flex: .5,
					disableColumnMenu: true,
					headerClassName: classes.header,
					valueFormatter: (params) => {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(params.value);
					},
				},
			]
		},
	}

	const [selectedLog, setSelectedLog] = useState(pricingLogTableOptions.product_cost);



	// const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	// ⬇ Logic to handle setting the table rows on first load: 
	const [tableMounted, setTableMounted] = useState(false);
	// columns for Data Grid
	const columns = selectedLog.columns;


	// let rows = selectedLog.rows;
	let rows = [];
	for (let row of selectedLog.rows) {
		if (Object.values(filter).length > 0 && filter.value !== row.date_saved) continue;
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
			<Divider />,
			<GridToolbarColumnsButton />,
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
			autocompleteOptions[row.date_saved] = {
				value: row.date_saved,
				label: `${new Date(row.date_saved).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })}`,
			}
		});

		return (
			<GridToolbarContainer >
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
				}}>
					<GridToolbarSelectDropdown />

				</div>

				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "flex-end",
					fontSize: "11px",
					fontFamily: "Lexend Tera",
				}}>

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

				</div>
			</GridToolbarContainer>
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
			<div style={{
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
			className={selectedLog.className}
		>
			<DataGrid
				className={selectedLog.className}
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

