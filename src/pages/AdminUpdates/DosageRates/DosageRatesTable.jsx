
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material-UI components
import { useStyles } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function DosageRatesTable() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const dosageRates = useSelector(store => store.dosageRates.dosageRatesArray);

	const [showEditModal, setShowEditModal] = useState(false);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	// ⬇ Logic to handle setting the table rows on first load: 
	// const [tableMounted, setTableMounted] = useState(false);
	// columns for Data Grid
	const columns = [
		{
			field: 'product_label',
			headerName: 'Product',
			flex: 2.5,
			editable: false,
			headerClassName: classes.header
		},
		{
			field: 'lbs_y3',
			headerName: 'Lbs y³',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			type: 'number',
		},
		{
			field: 'kg_m3',
			headerName: 'Kg m³',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			type: 'number',
		},
	]; // End columns
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	//rows are from the shipping costs reducer
	let rows = dosageRates;
	// for (let row of dosageRates) {
	// 	if (stateFilter && stateFilter.destination_name !== row.destination_name) continue;
	// 	rows.push(row);
	// }; // End for of loop

	//#region - Action Handlers Below: 
	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'FETCH_DOSAGE_RATES' })
	}, [])

	// ⬇ Handles the selection and deselection of a row:
	// const handleSelectionModelChange = (id_array) => {
	// 	// ⬇ If the selected row is clicked again, deselect it:a
	// 	if (id_array.length > 0 && id_array[0] === selectedRow?.shipping_cost_id) {
	// 		id_array.length = 0;
	// 		setSelectedRow(null);
	// 	} else { // ⬇ Else set it as normal:
	// 		const shippingCostId = id_array[0];
	// 		const selectedData = rows.filter((row) => row.shipping_cost_id === shippingCostId);
	// 		setSelectedRow(selectedData[0]);
	// 	}; // End if	
	// }; // End handleSelectionModelChange
	//#endregion - End Action Handlers.


	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied dosage rates for each product.<br /><br />These dosage rates are used to calculate price per material needed for one yard or meter cubed of concrete.<br /><br />Please keep the unused fields blank or at 0 (for example, PrimX DC (lbs) should not have an entry for Kg m³).</p>}
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
					Current Dosage Rates
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


		// //#region - Info for the Save Costs to History Log button:
		// // ⬇ Get today's date in YYYY-MM format;
		// const today = new Date().toISOString().slice(0, 7);
		// let disabled = true;
		// let tooltipText = <p>The current customs duties have not been saved yet for this month.  Please click the "Save Customs to History Log" button to save the current costs for this month first.</p>;
		// if (
		// 	customsDutiesHistoryRecent.length > 0 &&
		// 	customsDutiesHistoryRecent[0].date_saved.slice(0, 7) === today
		// ) {
		// 	disabled = false;
		// 	tooltipText = "";
		// };

		// const handleSaveHistoryLogSubmit = () => {
		// 	if (
		// 		customsDutiesHistoryRecent.length > 0 &&
		// 		customsDutiesHistoryRecent[0].date_saved.slice(0, 7) === today
		// 	) {
		// 		if (window.confirm(`Customs have already been saved for this month.  If you continue, two entries will be saved for this month.  Click "OK" to continue.`)) {
		// 			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
		// 		}; // End if
		// 	} else {
		// 		dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
		// 	}; // End if
		// }; // End handleSaveHistoryLogSubmit
		// //#endregion - Info for the Save Costs to History Log button.

		const [anchorEl, setAnchorEl] = useState(null);
		const menuItems = [
			// <Button
			// 	color="primary"
			// 	size="small"
			// 	onClick={() => handleSaveHistoryLogSubmit()}
			// >
			// 	Save Customs to History Log
			// </Button>,
			// <Divider />,
			// <Tooltip title={tooltipText} placement="right-end" arrow>
			<span>
				<Button
					color="primary"
					size="small"
					onClick={() => setShowEditModal(true)}
				// disabled={disabled}
				>
					Edit Customs Duties
				</Button>
			</span>
			// </Tooltip>,

		]; // End menuItems


		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-start",
				height: "52px",
			}}>
				<>
					<Button
						color="primary"
						size="small"
						onClick={() => setShowEditModal(true)}
					// disabled={disabled}
					>
						Edit Dosage Rates
					</Button>
				</>
				{/* <CustomPagination /> */}
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 

	//#region - Table Edit Modal: 
	const TableEditModal = () => {
		// ⬇ Convert the dosageRates array to an object indexed by the dosage_rate_id:
		const editData = dosageRates.reduce((acc, curr) => {
			acc[curr.dosage_rate_id] = curr;
			return acc;
		}, {});

		const dataToCompare = dosageRates.reduce((acc, curr) => {
			acc[curr.dosage_rate_id] = curr;
			return acc;
		}, {});

		const handleRowChange = (value, id, label) => {
			editData[id] = {
				...editData[id],
				[label]: value,
			}; // End editData
		} // End handleRowChange

		const handleSubmit = () => {
			if (
				JSON.stringify(editData) === JSON.stringify(dataToCompare) ||
				Object.keys(editData).length === 0
			) {
				alert('Please make changes to submit first.');
				return;
			}; // End if
			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
			dispatch({ type: 'EDIT_DOSAGE_RATES', payload: Object.values(editData) });
			setShowEditModal(false);
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
							Dosage Rates
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
										marginRight: "52px",
									}}
								>
									Lbs y³
								</div>
								<div
									style={{
										fontSize: "16px",
										marginRight: "29px",
									}}
								>
									Kg m³
								</div>
							</div>
							{/* ⬇ Map through the dosageRates array and create a div for each item in the array: */}
							{dosageRates.map(cost => {
								// ⬇ Create a Number Input for each item in the array, with the value set to the shipping_cost index:
								return (
									<div
										key={cost.dosage_rate_id}
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
											{cost.product_label}:
										</div>
										<div
											style={{
												width: '75px',
												marginRight: "20px",
											}}
										>
											<TextField
												defaultValue={cost.lbs_y3}
												type="number"
												onChange={(event) => handleRowChange(event.target.value, cost.dosage_rate_id, 'lbs_y3')}
												size="small"
											/>
										</div>
										<div
											style={{
												width: '75px',
											}}
										>
											<TextField
												defaultValue={cost.kg_m3}
												type="number"
												onChange={(event) => handleRowChange(event.target.value, cost.dosage_rate_id, 'kg_m3')}
												size="small"
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
			className={classes.customsGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				rows={rows}
				disableSelectionOnClick
				getRowId={(row) => row.dosage_rate_id}
				autoHeight
				pagination
				// onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>

			<TableEditModal />

		</Paper>
	)
}

