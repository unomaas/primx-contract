
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, MenuItem, Menu, TablePagination, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';

export default function UpdateShippingCosts() {
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const { viewState, dataState } = useSelector(store => store.pricingLog);
	const shippingCosts = viewState.newShippingCosts;

	// TODO: Ryan Here.  Need to update the pricing calculator to use the new shipping costs table.  Then need to update the POST for the save history log stuff.  Also need to update the table help descriptions in each new table. Also disable all the old update items in the admin portal. 


	const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [tableMounted, setTableMounted] = useState(false);
	// columns for Data Grid
	const columns = [

		{
			headerName: 'Destination',
			field: 'destination_name',
			flex: 1.5,
			disableColumnMenu: true,
			headerClassName: classes.header,
		},
		{
			headerName: 'DC 20ft',
			field: 'dc_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'DC 40ft',
			field: 'dc_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Fibers 20ft',
			field: 'fibers_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Fibers 40ft',
			field: 'fibers_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'CPEA 20ft',
			field: 'cpea_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'CPEA 40ft',
			field: 'cpea_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Flow 20ft',
			field: 'flow_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Flow 40ft',
			field: 'flow_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
	]; // End columns
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	let rows = shippingCosts;



	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied shipping costs to only the active destinations.<br /><br />Click a row to select it.  Click again to deselect.  Exporting with a row selected will only export that single row.<br /><br />If you do not see a destination here, it is not active.  Please go to "Shipping Destinations" to manage destination active statuses.<br /><br />To save the current costs to the Pricing History Log for this month, first select a row and then click "Actions", then click "Save Costs".  You will be able to save the current costs multiple times, but please be aware this will create more than one entry in the Pricing History Log for this month.<br /><br />To change the costs for any destination, a row must be selected and costs must be saved for this month already. Enter in the new costs and click "Submit".<br /><br />The Destination Filter in the top-right will narrow the results to just the selected destination.</p>}
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

		// ⬇ Action Handlers: 
		const handleStateFilter = (value) => {
			setStateFilter(value);
		}; // End handleStateFilter

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
									<MenuItem key={index} disableGutters onClick={() => setAnchorEl(null)}>
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
					Current Shipping Costs
				</div>

				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "flex-end",
					fontSize: "11px",
					fontFamily: "Lexend Tera",
				}}>

				</div>
			</GridToolbarContainer>
		); // End return
	}; // End CustomToolbar

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
			setSelectedRow(null);
		}; // End handleOnPageChange


		const handleOnRowsPerPageChange = (size) => {
			apiRef.current.setPageSize(size.props.value);
			setRowsPerPage(size.props.value);
			handleOnPageChange(0);
			setSelectedRow(null);
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


	// ⬇ Submit handler for in-line cell edits on the data grid:
	const handleInCellEditSubmit = ({ id, field, value }) => {
		const destination = shippingCosts.find(destination => destination.destination_id === id);
		// ⬇ If the value is the same as the original, don't submit the edit:
		if (destination[field] === value) return;
		// ⬇ If the value is different, modify the product object:
		destination[field] = value;
	}; // End handleInCellEditSubmit

	// ⬇ Rendering below: 
	return (
		<Paper
			elevation={3}
			className={classes.shippingGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				rows={rows}
				getRowId={(row) => row.shipping_cost_id}
				autoHeight
				onCellEditCommit={handleInCellEditSubmit}
				pagination
				// onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				disableSelectionOnClick
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			// density={"compact"}
			/>

			{/* {selectedRow &&
				<ShippingCostsEditModal />
			} */}


		</Paper>
	)
}

