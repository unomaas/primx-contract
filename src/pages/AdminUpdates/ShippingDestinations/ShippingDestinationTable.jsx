
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material-UI components
import { useStyles } from '../../../../src/components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, MenuItem, Menu, TablePagination } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function ShippingDestinationTable() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const shippingDestinations = useSelector(store => store.shippingDestinations.shippingAllDestinations);

	const [selectedRow, setSelectedRow] = useState(null);

	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	// ⬇ Logic to handle setting the table rows on first load: 
	const [tableMounted, setTableMounted] = useState(false);
	// columns for Data Grid
	const columns = [
		{
			field: 'destination_name',
			headerName: 'Destination',
			flex: 1,
			headerClassName: classes.header
		},
		{
			field: 'destination_country',
			headerName: 'Country',
			flex: 1,
			disableColumnMenu: true,
			editable: false,
			headerClassName: classes.header,
		},
		{
			field: 'destination_active',
			headerName: 'Active',
			align: 'right',
			flex: 1,
			disableColumnMenu: true,
			editable: false,
			headerAlign: 'right',
			headerClassName: classes.header,
			renderCell: (params) => {
				if (params.value == true) {
					return <CheckCircleIcon style={{ color: 'green' }} /> 
				} else {
					return <IndeterminateCheckBoxIcon style={{ color: 'red' }} />
				}
			},
		},
	]; // End columns
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	//rows are from the shipping costs reducer
	let rows = [];
	for (let row of shippingDestinations) {

		rows.push(row);
	}; // End for of loop

	//#region - Action Handlers Below: 
	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'FETCH_ALL_SHIPPING_DESTINATIONS' });
		// setIsTableLoaded(true)
	}, [])

	// ⬇ Handles the selection and deselection of a row:
	const handleSelectionModelChange = (id_array) => {
		// ⬇ If the selected row is clicked again, deselect it:a
		if (id_array.length > 0 && id_array[0] === selectedRow?.destination_id) {
			id_array.length = 0;
			setSelectedRow(null);
		} else { // ⬇ Else set it as normal:
			const selectedId = id_array[0];
			const selectedData = rows.filter((row) => row.destination_id === selectedId);
			setSelectedRow(selectedData[0]);
		}; // End if	
	}; // End handleSelectionModelChange
	//#endregion - End Action Handlers.


	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
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
						onClose={() => setAnchorEl(null)}
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
									onClick={() => setAnchorEl(null)}
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
					All Destinations
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

		const toggleActiveSubmit = () => {
			console.log('⬇ selectedRow:', selectedRow);
			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
			dispatch({ type: 'TOGGLE_SHIPPING_DESTINATION_ACTIVE', payload: selectedRow.destination_id })
			setSelectedRow({
				...selectedRow,
				destination_active: !selectedRow.destination_active
			})
		}; // End handleActiveSubmit

		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-start",
			}}>
				{selectedRow &&
					// ⬇ Only show this button if a row is selected:
					<Button
						color={selectedRow.destination_active === true ? "secondary" : "primary"}
						size="small"
						onClick={() => toggleActiveSubmit()}
					>
						{selectedRow.destination_active === true
							? `Set ${selectedRow.destination_name} Inactive`
							: `Set ${selectedRow.destination_name} Active`
						}
					</Button>
				}
				<CustomPagination />
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 



	// ⬇ Rendering below: 
	return (
		<div
			className={classes.destinationGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				rows={rows}
				getRowId={(row) => row.destination_id}
				autoHeight
				pagination
				onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>
		</div>
	)
}

