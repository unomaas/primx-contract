
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../../../../src/components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function ProductContainersTable() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useClasses();
	const dispatch = useDispatch();
	const productContainers = useSelector(store => store.productContainers.productContainersArray);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

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
			field: 'container_destination',
			headerName: 'Destination',
			flex: .75,
			disableColumnMenu: true,
			editable: false,
			headerClassName: classes.header
		},
		{
			field: 'container_length_ft',
			headerName: 'Container Length (ft)',
			flex: 1,
			disableColumnMenu: true,
			type: 'number',
			sortable: false,
			editable: false,
			headerClassName: classes.header,
			valueFormatter: (params) => {
				return `${params.value}'`;
			},
		},
		{
			field: 'max_pallets_per_container',
			headerName: 'Max Pallets',
			type: 'number',
			sortable: false,
			flex: .75,
			disableColumnMenu: true,
			headerClassName: classes.header,
		},
		{
			field: 'max_weight_of_container',
			headerName: 'Container Max Weight',
			type: 'number',
			sortable: false,
			flex: .75,
			disableColumnMenu: true,
			headerClassName: classes.header,
			valueFormatter: (params) => { return parseFloat(params.value).toLocaleString('en-US'); },
		},
		{
			field: 'gross_weight_of_pallet',
			headerName: 'Pallet Gross Weight',
			type: 'number',
			sortable: false,
			flex: .75,
			disableColumnMenu: true,
			headerClassName: classes.header,
			valueFormatter: (params) => { return parseFloat(params.value).toLocaleString('en-US'); },
		},
		{
			field: 'net_weight_of_pallet',
			headerName: 'Pallet Net Weight',
			type: 'number',
			sortable: false,
			flex: .75,
			disableColumnMenu: true,
			headerClassName: classes.header,
			valueFormatter: (params) => { return parseFloat(params.value).toLocaleString('en-US'); },
		},
	]; // End columns
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	let rows = productContainers;
	//rows are from the shipping costs reducer
	// let rows = [];
	// for (let row of shippingCosts) {
	// 	if (stateFilter && stateFilter.destination_name !== row.destination_name) continue;
	// 	rows.push(row);

	// }; // End for of loop

	//#region - Action Handlers Below: 
	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'FETCH_PRODUCT_CONTAINERS' })
	}, [])

	// ⬇ Handles the selection and deselection of a row:
	const handleSelectionModelChange = (id_array) => {
		// ⬇ If the selected row is clicked again, deselect it:a
		if (id_array.length > 0 && id_array[0] === selectedRow?.product_container_id) {
			id_array.length = 0;
			setSelectedRow(null);
		} else { // ⬇ Else set it as normal:
			const rowId = id_array[0];
			const selectedData = rows.filter((row) => row.product_container_id === rowId);
			// ⬇ Set the display name for the edit modal:
			selectedData[0].trimmed_display_name = selectedData[0].product_label.slice(0, selectedData[0].product_label?.indexOf('('))
			// ⬇ Filter the productContainers array for the selected product, matching includes on the selectedData[0].trimmed_display_name:
			const selectedProduct = productContainers.filter((product) => product.product_label.includes(selectedData[0].trimmed_display_name));
			// ⬇ Set the selected product to state:
			setSelectedProduct(selectedProduct);
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
					title={<p>This table shows the currently applied shipping container stats.<br /><br />Click a row to select it.  Click again to deselect.  Exporting with a row selected will only export that single row.  <br /><br />You will be able to edit each Product's four entries at a time (for example, selecting any of the "PrimX DC" rows will allow you to edit PrimX DC).</p>}
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
		// const handleStateFilter = (value) => {
		// 	setStateFilter(value);
		// }; // End handleStateFilter

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
					Current Product Container Stats
				</div>

				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "flex-end",
					fontSize: "11px",
					fontFamily: "Lexend Tera",
				}}>

					{/* <Autocomplete
					options={shippingDestinations.sort((a, b) => -b.destination_name.localeCompare(a.destination_name))}
					getOptionLabel={(option) => option.destination_name}
					getOptionSelected={(option, value) => option.destination_name === value.destination_name}
					style={{ width: 175 }}
					renderInput={(params) => <TextField {...params} label="Destination Filter" InputLabelProps={{ shrink: true }} />}
					onChange={(event, value) => handleStateFilter(value || null)}
					value={stateFilter}
				/> */}

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
				{selectedRow &&
					<>
						<Button
							color="primary"
							size="small"
							onClick={() => setShowEditModal(true)}
						>
							Edit {selectedRow?.trimmed_display_name.trimEnd()}'s Stats
						</Button>
					</>
				}
				<CustomPagination />
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 

	//#region - Table Edit Modal: 
	const TableEditModal = () => {
		const editData = selectedProduct.reduce((acc, curr) => {
			acc[curr.product_container_id] = curr;
			return acc;
		}, {});

		const dataToCompare = selectedProduct.reduce((acc, curr) => {
			acc[curr.product_container_id] = curr;
			return acc;
		}, {});

		const handleEdit = (value, id, label) => {
			editData[id] = {
				...editData[id],
				[label]: parseFloat(value),
			}; // End editData
		}; // End handleShippingCostChange


		const handleSubmit = () => {
			if (
				JSON.stringify(editData) === JSON.stringify(dataToCompare) ||
				Object.keys(editData).length === 0
			) {
				alert('Please make changes to submit first.');
				return;
			}; // End if
			dispatch({ type: 'EDIT_PRODUCT_CONTAINERS', payload: Object.values(editData) });
			setShowEditModal(false);
			// ⬇ We need to refresh the data in selection in case they don't select a new row:
			handleSelectionModelChange([selectedRow.product_container_id])
		}; // End handleSubmit


		return (
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				// className={classes.modal}
				open={showEditModal}
				onClose={() => setShowEditModal(false)}
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
							{selectedRow?.trimmed_display_name}
						</div>
						<div style={{ marginBottom: '10px' }}>
							{/* Create a div of headers that float right and read "USA" and "CAN" */}
							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									alignItems: 'flex-end',
								}}
							>
								<div
									style={{
										fontSize: "16px",
										marginRight: "40px",
									}}
								>
									Max<br />Pallets
								</div>
								<div
									style={{
										fontSize: "16px",
										marginRight: "40px",
									}}
								>
									Container<br />Max
								</div>
								<div
									style={{
										fontSize: "16px",
										marginRight: "56px",
									}}
								>
									Pallet<br />Gross
								</div>
								<div
									style={{
										fontSize: "16px",
										marginRight: "23px",
									}}
								>
									Pallet<br />Net
								</div>
							</div>
							{selectedProduct.map(cost => {
								// ⬇ Create a Number Input for each item in the array, with the value set to the shipping_cost index:
								return (
									<div
										key={cost.product_container_id}
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
											{cost.product_label} for {cost.container_destination} {cost.container_length_ft}' Container:
										</div>
										<div
											style={{
												width: '75px',
												marginRight: "20px",
											}}
										>
											<TextField
												defaultValue={cost.max_pallets_per_container}
												type="number"
												onChange={(event) => handleEdit(event.target.value, cost.product_container_id, 'max_pallets_per_container')}
												size="small"
											/>
										</div>
										<div
											style={{
												width: '75px',
												marginRight: "20px",
											}}
										>
											<TextField
												defaultValue={cost.max_weight_of_container}
												type="number"
												onChange={(event) => handleEdit(event.target.value, cost.product_container_id, 'max_weight_of_container')}
												size="small"
											// InputProps={{
											// 	endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
											// }}
											/>
										</div>
										<div
											style={{
												width: '75px',
												marginRight: "20px",
											}}
										>
											<TextField
												defaultValue={cost.gross_weight_of_pallet}
												type="number"
												onChange={(event) => handleEdit(event.target.value, cost.product_container_id, 'gross_weight_of_pallet')}
												size="small"
											// InputProps={{
											// 	endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
											// }}
											/>
										</div>
										<div
											style={{
												width: '75px',
											}}
										>
											<TextField
												defaultValue={cost.net_weight_of_pallet}
												type="number"
												onChange={(event) => handleEdit(event.target.value, cost.product_container_id, 'net_weight_of_pallet')}
												size="small"
											// InputProps={{
											// 	endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
											// }}
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
									onClick={() => setShowEditModal(false)}
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
	}; // End TableEditModal
	//#endregion - Table Edit Modal.

	// ⬇ Rendering below: 
	return (
		<Paper
			elevation={3}
			className={classes.productContainersGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				rows={rows}
				getRowId={(row) => row.product_container_id}
				autoHeight
				pagination
				onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>

			{selectedRow &&
				<TableEditModal />
			}
		</Paper>
	)
}

