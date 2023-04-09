
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

	// TODO: Ryan Here. !!  
	// // Need to update the pricing calculator to use the new shipping costs table.  
	// // Then need to update the POST for the save history log stuff.  
	// // Also need to update the table help descriptions in each new table. 
	// // Also disable all the old update items in the admin portal. 
	// // Also need ot update all the shipping cost routes for the history table. 
	// // Also make it so only one month can be saved at a time for history log. 
	// // TODO: Add a modal to the shipping destinations and make it so they have to enter shipping costs for anything that's activated. 
	// TODO: Check the Pricing Log tables and update it. Specifically the date saved filter seems off. And the shipping cost table needs to be updated. 
	// TODO: Check that estimate pricing and combining still works. 
	// TODO: Look at removing all the null values from the old calculations. (Low Priority)


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
					title={<p>This table shows the currently applied shipping costs to each active destination, for each product, in a 20ft or 40ft trailer.<br /><br />To edit the shipping cost for pricing going forward, double-click on the desired cell.<br /><br />You are able to go forward and backward in the navigation stepper to see the effects of any changes shown in Step 4.</p>}
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
					Shipping Costs
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

