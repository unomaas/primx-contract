
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function UpdateShippingCostsGrid() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const shippingCosts = useSelector(store => store.shippingCosts.shippingCostsArray);
	const shippingCostHistoryRecent = useSelector(store => store.shippingCosts.shippingCostHistoryRecentArray);
	const shippingDestinations = useSelector(store => store.shippingDestinations.shippingActiveDestinations);
	const showEditModal = useSelector(store => store.shippingCosts.showEditModal);

	const [stateFilter, setStateFilter] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [8, 16, 24, 48, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	// ⬇ Logic to handle setting the table rows on first load: 
	const [tableMounted, setTableMounted] = useState(false);
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
			headerClassName: classes.header
		},
		{
			field: 'shipping_cost',
			type: 'number',
			// align: 'right',
			headerName: 'Cost',
			flex: .75,
			disableColumnMenu: true,
			headerClassName: classes.header,
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
	//rows are from the shipping costs reducer
	let rows = [];
	for (let row of shippingCosts) {
		if (stateFilter && stateFilter.destination_name !== row.destination_name) continue;
		rows.push(row);
	}; // End for of loop

	//#region - Action Handlers Below: 
	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'FETCH_SHIPPING_COSTS' }),
			dispatch({ type: 'FETCH_ACTIVE_SHIPPING_DESTINATIONS' }),
			dispatch({ type: 'FETCH_SHIPPING_COST_HISTORY_RECENT' })
		// setIsTableLoaded(true)
	}, [])

	// ⬇ Handles the selection and deselection of a row:
	const handleSelectionModelChange = (id_array) => {
		// ⬇ If the selected row is clicked again, deselect it:a
		if (id_array.length > 0 && id_array[0] === selectedRow?.shipping_cost_id) {
			id_array.length = 0;
			setSelectedRow(null);
		} else { // ⬇ Else set it as normal:
			const shippingCostId = id_array[0];
			const selectedData = rows.filter((row) => row.shipping_cost_id === shippingCostId);
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
					title={<p>This table shows the currently applied shipping costs to only the active destinations.<br /><br />Click a row to select it.  Click again to deselect.  Exporting with a row selected will only export that single row.<br /><br />If you do not see a destination here, it is not active.  Please go to "Shipping Destinations" to manage destination active statuses.<br /><br />To save the current costs to the Pricing History Log for this month, first select a row and then click "Actions", then click "Save Costs".  You will be able to save the current costs multiple times, but the latest save will overwrite all prior saves for this month.<br /><br />To change the costs for any destination, a row must be selected and costs must be saved for this month already. Enter in the new costs and click "Submit".<br /><br />The Destination Filter in the top-right will narrow the results to just the selected destination.</p>}
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


		//#region - Info for the Save Costs to History Log button:
		// ⬇ Get today's date in YYYY-MM format;
		const today = new Date().toISOString().slice(0, 7);
		let disabled = true;
		let tooltipText = <p>The current costs have not been saved yet for this month.  Please click the "Save Costs to History Log" button to save the current costs for this month first.</p>;
		if (
			shippingCostHistoryRecent.length > 0 &&
			shippingCostHistoryRecent[0].date_saved.slice(0, 7) === today
		) {
			disabled = false;
			tooltipText = "";
		};

		const handleSaveHistoryLogSubmit = () => {
			if (
				shippingCostHistoryRecent.length > 0 &&
				shippingCostHistoryRecent[0].date_saved.slice(0, 7) === today
			) {
				if (window.confirm(`Costs have already been saved for this month.  If you continue, the saved costs for this month will be overwritten with the currently shown costs.  Click "OK" to continue.`)) {
					dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
					dispatch({ type: 'SHIPPING_COSTS_SAVE_HISTORY_LOG', payload: shippingCosts })
				}; // End if
			} else {
				dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
				dispatch({ type: 'SHIPPING_COSTS_SAVE_HISTORY_LOG', payload: shippingCosts })
			}; // End if
		}; // End handleSaveHistoryLogSubmit
		//#endregion - Info for the Save Costs to History Log button.

		const [anchorEl, setAnchorEl] = useState(null);
		const menuItems = [
			<Button
				color="primary"
				size="small"
				onClick={() => handleSaveHistoryLogSubmit()}
			>
				Save Costs to History Log
			</Button>,
			<Divider />,
			<Tooltip title={tooltipText} placement="right-end" arrow>
				<span>
					<Button
						color="primary"
						size="small"
						onClick={() => dispatch({ type: 'SHIPPING_COSTS_SHOW_EDIT_MODAL', payload: true })}
						disabled={disabled}
					>
						Edit {selectedRow?.destination_name}'s Costs
					</Button>
				</span>
			</Tooltip>,

		]; // End menuItems


		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-start",
			}}>
				{selectedRow &&
					<>
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
										<MenuItem key={index} disableGutters onClick={() => setAnchorEl(null)}>
											{item}
										</MenuItem>
									)
								}
							})}
						</Menu>
					</>
				}
				<CustomPagination />
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 

	//#region - Table Edit Modal: 
	const ShippingCostsEditModal = () => {
		const editData = {};
		const costsByDestinationArray = shippingCosts.filter(cost => cost.destination_name === selectedRow?.destination_name);


		const handleShippingCostChange = (value, id) => {
			editData[id] = {
				shipping_cost_id: id,
				shipping_cost: parseInt(value),
			}; // End editData
		}; // End handleShippingCostChange


		const handleSubmit = () => {
			if (!editData || Object.keys(editData).length === 0) {
				alert('Please make changes to submit first.');
				return;
			}; // End if
			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
			dispatch({ type: 'UPDATE_SHIPPING_COSTS', payload: Object.values(editData) });
		}; // End handleSubmit


		return (
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				// className={classes.modal}
				open={showEditModal}
				onClose={() => dispatch({ type: 'SHIPPING_COSTS_SHOW_EDIT_MODAL', payload: false })}
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
						width: 'auto',
						height: 'auto',
						maxWidth: '50%',
						maxHeight: '50%',
						minWidth: '415px',
						minHeight: '345px',
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
							{selectedRow?.destination_name} Shipping Costs
						</div>
						<div style={{ marginBottom: '10px' }}>
							{costsByDestinationArray.map(cost => {
								// ⬇ Create a Number Input for each item in the array, with the value set to the shipping_cost index:
								return (
									<div
										key={cost.shipping_cost_id}
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
											{cost.product_label} for {cost.container_length_ft}' Container:
										</div>
										<div
											style={{
												width: '97px',
											}}
										>
											<TextField
												defaultValue={cost.shipping_cost}
												type="number"
												onChange={(event) => handleShippingCostChange(event.target.value, cost.shipping_cost_id, cost.product_label)}
												size="small"
												InputProps={{
													startAdornment: <InputAdornment position="start">$</InputAdornment>,
												}}
											/>
										</div>
									</div>
								);
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
									onClick={() => dispatch({ type: 'SHIPPING_COSTS_SHOW_EDIT_MODAL', payload: false })}
								>
									Cancel
								</Button>
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
				pagination
				onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>

			{selectedRow &&
				<ShippingCostsEditModal />
			}


		</Paper>
	)
}

