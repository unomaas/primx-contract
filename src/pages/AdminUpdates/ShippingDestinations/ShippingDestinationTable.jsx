
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material-UI components
import { useStyles } from '../../../../src/components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import HelpIcon from '@material-ui/icons/Help';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function ShippingDestinationTable() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const shippingDestinations = useSelector(store => store.shippingDestinations.shippingAllDestinations);
	const showEditModal = useSelector(store => store.shippingDestinations.showEditModal);

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
			headerClassName: classes.header,
		},
		{
			field: 'destination_active',
			headerName: 'Active',
			align: 'right',
			flex: .5,
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
		dispatch({ type: 'FETCH_SHIPPING_COSTS' });
		// setIsTableLoaded(true)
	}, [])

	// ⬇ Handles the selection and deselection of a row:
	const handleSelectionModelChange = (id_array) => {
		// ⬇ If the selected row is clicked again, deselect it:
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
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows all of the shipping destinations currently saved to the database, and their active status.<br /><br />If a destination is active, it will have a green check mark, and will be shown in other areas of the app (for example, active destinations will appear in the "Current Shipping Costs" table).<br /><br />If a destination is inactive, it will have a red minus box, and will not be shown in other areas of the app.<br /><br />You must first select a row to be able to toggle the active status. All destinations that are being activated need to have prices set and saved.</p>}
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
			if (selectedRow.destination_active === false) {
				dispatch({ type: 'SHIPPING_DESTINATIONS_SHOW_EDIT_MODAL', payload: true })
				return;
			}; // End if

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
		<Paper
			elevation={3}
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

			{showEditModal &&
				<ShippingCostsEditModal selectedRow={selectedRow} handleSelectionModelChange={handleSelectionModelChange} />
			}
		</Paper>
	)
}


//#region - Table Edit Modal: 
const ShippingCostsEditModal = ({ selectedRow, handleSelectionModelChange }) => {
	const editData = {
		// "dc_20ft": 0,
		// "dc_40ft": 0,
		// "fibers_20ft": 0,
		// "fibers_40ft": 0,
		// "cpea_20ft": 0,
		// "cpea_40ft": 0,
		// "flow_20ft": 0,
		// "flow_40ft": 0,
	};
	// const costsByDestinationArray = shippingCosts.filter(cost => cost.destination_name === selectedRow?.destination_name);
	const shippingCosts = useSelector(store => store.shippingCosts.shippingCostsArray);
	const showEditModal = useSelector(store => store.shippingDestinations.showEditModal);
	const dispatch = useDispatch();
	// const selectedShippingCost = shippingCosts.find(cost => cost.destination_id === selectedRow?.destination_id);

	const inputMap = [
		{ label: 'DC 20ft', key: 'dc_20ft', },
		{ label: 'DC 40ft', key: 'dc_40ft', },
		{ label: 'Fibers 20ft', key: 'fibers_20ft', },
		{ label: 'Fibers 40ft', key: 'fibers_40ft', },
		{ label: 'CPEA 20ft', key: 'cpea_20ft', },
		{ label: 'CPEA 40ft', key: 'cpea_40ft', },
		{ label: 'Flow 20ft', key: 'flow_20ft', },
		{ label: 'Flow 40ft', key: 'flow_40ft', },
	]; // End inputMap





	const handleShippingCostChange = (value, key) => {
		// editData[key] = {
		// 	[key]: value.includes('.') ? parseFloat(value).toFixed(2) : parseFloat(value),
		// }; // End editData
		if (value <= 0) {
			value = 0;
		} else if (value >= 0 && value.includes('.')) {
			value = parseFloat(value).toFixed(2);
		} else {
			value = parseFloat(value);
		}
		editData[key] = value
		console.log(`Ryan Here: handleShippingCostChange \n `, { value, key, editData });
	}; // End handleShippingCostChange


	const handleSubmit = () => {
		// ⬇ Loop through the input map and make sure all keys have a value that's not 0:
		// for (let i = 0; i < inputMap.length; i++) {
		for (let i in inputMap) {
			let input = inputMap[i];
			console.log(`Ryan Here: in loop \n `, input);
			if (!editData[input.key] || editData[input.key] == 0) {
				alert(`Please enter a value for ${inputMap[i].label}.`);
				return;
			}; // End if
		}; // End for

		dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
		dispatch({
			type: 'TOGGLE_SHIPPING_DESTINATION_ACTIVE_SET_PRICES', payload: {
				destination_id: selectedRow.destination_id,
				shipping_costs: editData,
			}
		})

		handleSelectionModelChange([selectedRow.destination_id]);
	}; // End handleSubmit


	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			// className={classes.modal}
			open={showEditModal}
			onClose={() => dispatch({ type: 'SHIPPING_DESTINATIONS_SHOW_EDIT_MODAL', payload: false })}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Fade in={showEditModal}>
				<div style={{
					backgroundColor: 'white',
					borderRadius: '1rem',
					boxShadow: "0.5rem 0.5rem 1rem 0.5rem rgba(0, 0, 0, 0.2)",
					padding: '1rem',
					width: "fit-content",
					height: "fit-content",
					marginTop: "-300px",
				}}>
					<div
						style={{
							margin: '0px auto 10px auto',
							fontSize: "1.1rem",
							letterSpacing: "0.5px",
							borderBottom: "1px solid #000",
							fontFamily: "Lexend Tera",
							paddingBottom: '10px',
						}}
					>
						Set {selectedRow?.destination_name}'s Shipping Costs
					</div>


					<div style={{ marginBottom: '10px' }}>
						{inputMap.map((input, index) => {
							return (
								<div
									key={index}
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										alignItems: 'flex-end',
									}}
								>
									<div
										style={{
											padding: "0.6rem",
										}}
									>
										{input.label}:
									</div>
									<div
										style={{
											width: '97px',
										}}
									>
										<TextField
											defaultValue={0}
											type="number"
											onChange={(event) => handleShippingCostChange(event.target.value, input.key)}
										/>
									</div>
								</div>
							)
						})}

					</div>
					<div style={{ borderTop: "1px solid #000" }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '10px',

							}}
						>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => dispatch({ type: 'SHIPPING_DESTINATIONS_SHOW_EDIT_MODAL', payload: false })}
							>
								Cancel
							</Button>
							<Tooltip title={`To activate ${selectedRow?.destination_name}, please set the default pricing and press Submit.`} placement="top" style={{ color: "gray", fontSize: "12px" }} arrow>
								<HelpIcon />
							</Tooltip>
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleSubmit()}
							>
								Submit
							</Button>
						</div>
					</div>
				</div>
			</Fade>
		</Modal>
	); // End return
}; // End ShippingCostsEditModal
	//#endregion - Table Edit Modal.