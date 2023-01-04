
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material-UI components
import { useStyles } from '../MuiStyling/MuiStyling';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridApi, GridExportCsvOptions } from '@material-ui/data-grid';
import { Button, ButtonGroup, ClickAwayListener, Grow, Fade, Popper, MenuItem, MenuList, Paper, Menu, TextField, TablePagination } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function UpdateShippingCostsGrid() {
	// ⬇ State Variables:
	const classes = useStyles();
	const dispatch = useDispatch();
	const shippingCosts = useSelector(store => store.shippingCosts);
	const shippingDestinations = useSelector(store => store.shippingDestinations);
	const [stateFilter, setStateFilter] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [8, 16, 24, 48, 100];
	// const [page, setPage] = useState(0);
	// const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);

	//rows are from the shipping costs reducer
	let rows = [];
	for (let row of shippingCosts) {
		if (stateFilter && stateFilter.destination_name !== row.destination_name) continue;
		rows.push(row);
	}; // End for of loop

	// const rowsToDisplay = rows.slice(page * rowsPerPage, page * rowsPerPage + parseInt(rowsPerPage));



	// columns for Data Grid
	const columns = [
		{
			field: 'product_label',
			headerName: 'Product',
			flex: 1,
			editable: false,
			headerClassName: classes.header
		},
		{
			field: 'container_length_ft',
			headerName: 'Container Length (ft)',
			flex: 1,
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
			flex: 1,
			disableColumnMenu: true,
			editable: false,
			headerClassName: classes.header
		},
		{
			field: 'container_destination',
			headerName: 'Country',
			flex: 0.75,
			disableColumnMenu: true,
			editable: false,
			headerClassName: classes.header
		},
		{
			field: 'shipping_cost',
			type: 'number',
			// align: 'right',
			headerName: 'Cost',
			flex: 1,
			disableColumnMenu: true,
			editable: false,
			headerClassName: classes.header,
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},

	]; // End 






	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'FETCH_SHIPPING_COSTS' }),
			dispatch({ type: 'FETCH_SHIPPING_DESTINATIONS' })
	}, [])

	// submit handler for in-line cell edits on the data grid
	const handleEditSubmit = ({ id, field, value }) => {
		// id argument is the db id of the row being edited, field is the column name, and value is the new value after submitting the edit
		dispatch({
			type: 'UPDATE_SHIPPING_COSTS', payload: {
				id: id,
				dbColumn: field,
				newValue: value
			}
		})
	}



	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {

		const handleStateFilter = (value) => {
			setStateFilter(value);
		}; // End handleStateFilter

		const [anchorEl, setAnchorEl] = useState(null);

		const menuItems = [
			// <CustomGridToolbarExport />,
			<GridToolbarExport />,
			<GridToolbarFilterButton />,
			<GridToolbarColumnsButton />,
			<GridToolbarDensitySelector />,
		]; // End menuItems

		return (
			<GridToolbarContainer >
				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "flex-start",
				}}>
					<Button
						aria-controls="customized-menu"
						aria-haspopup="true"
						color="primary"
						size="small"
						onClick={event => setAnchorEl(event.currentTarget)}
					>
						<ArrowDropDownIcon /> Table Options
					</Button>
					<Menu
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={event => setAnchorEl(null)}
						elevation={0}
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
						{menuItems.map((item, index) => {
							return (
								<MenuItem
									key={index}
									onClick={event => setAnchorEl(null)}
								>
									{item}
								</MenuItem>
							)
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

					<Autocomplete
						options={shippingDestinations.sort((a, b) => -b.destination_name.localeCompare(a.destination_name))}
						getOptionLabel={(option) => option.destination_name}
						getOptionSelected={(option, value) => option.destination_name === value.destination_name}
						style={{ width: 175 }}
						renderInput={(params) => <TextField {...params} label="Destination Filter" InputLabelProps={{ shrink: true }} />}
						onChange={(event, value) => handleStateFilter(value || null)}
						value={stateFilter}
					/>

				</div>
			</GridToolbarContainer>
		); // End return
	}; // End CustomToolbar

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	}; // End handleChangePage

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	}; // End handleChangeRowsPerPage


	// const PaginationComponent = () => (
	// 	<div style={{
	// 		flex: "1",
	// 		display: "flex",
	// 		justifyContent: "flex-end",
	// 	}}>
	// 		<TablePagination
	// 			component="div"
	// 			count={rows.length}
	// 			page={page}
	// 			onPageChange={handleChangePage}
	// 			rowsPerPage={rowsPerPage}
	// 			onRowsPerPageChange={handleChangeRowsPerPage}
	// 			rowsPerPageOptions={rowsPerPageOptions}

	// 		// pageSize={pageSize}
	// 		// onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
	// 		// rowsPerPageOptions={[8, 16, 24, 48, 100]}
	// 		/>
	// 	</div>
	// ); // End PaginationComponent

	// const CustomFooter = () => {


	// 	return (
	// 		<div style={{
	// 			flex: "1",
	// 			display: "flex",
	// 			justifyContent: "flex-start",
	// 		}}>
	// 			<PaginationComponent />
	// 		</div>
	// 	); // End return
	// }; // End CustomFooter



	return (
		<div
			className={classes.shippingGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				rows={rows}
				getRowId={(row) => row.shipping_cost_id}
				autoHeight
				// ⬇ Pagination Setup: 
				pagination
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				rowsPerPageOptions={[8, 16, 24, 48, 100]}
				// ⬇ Selection Setup:
				// onCellEditCommit={handleEditSubmit}
				// hideFooter
				// hideFooterRowCount
				hideFooterSelectedRowCount
				// hideFooterPagination

				// onSelectionModelChange={(id_array) => {
				// 	const shippingCostId = id_array[0];
				// 	const selectedData = rows.filter((row) => row.shipping_cost_id === shippingCostId);
				// 	setSelectedRow(selectedData[0]);
				// }}

				onCellClick={(event) => {
					console.log(`Ryan Here: `, { event });
					// ⬇ If the selected row is clicked again, deselect it:
					// if (event.row.shipping_cost_id === selectedRow?.shipping_cost_id) {
					// 	setSelectedRow(null);
					// 	return;
					// }

					// if (event.row.isSelected) {
					// 	event.component.clearSelection();
					// }

					const selectedData = rows.filter((row) => row.shipping_cost_id === event.row.shipping_cost_id);
					setSelectedRow(selectedData[0]);
				}}



				// checkboxSelection={true}

				components={{
					Toolbar: CustomToolbar,
					// Footer: CustomFooter,
					// Pagination: TablePagination,
				}}

			// componentsProps={{
			// 	toolbar: {
			// 		csvOptions: { getRowsToExport: () => rows }
			// 	}
			// }}
			/>
		</div>
	)
}


