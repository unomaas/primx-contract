
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material-UI components
import { useStyles } from '../../../../src/components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function CustomsDutiesTable() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const customsDuties = useSelector(store => store.customsDuties.customsDutiesArray);
	const customsDutiesHistoryRecent = useSelector(store => store.customsDuties.customsDutiesHistoryRecentArray);

	const [showEditModal, setShowEditModal] = useState(false);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	// ⬇ Logic to handle setting the table rows on first load: 
	// const [tableMounted, setTableMounted] = useState(false);
	// columns for Data Grid
	const columns = [
		{
			field: 'duty_label',
			headerName: 'Duty Label',
			flex: 2.5,
			headerClassName: classes.header
		},
		{
			field: 'usa_percent',
			headerName: 'USA',
			flex: 1,
			headerClassName: classes.header,
			valueFormatter: (params) => {
				// ⬇ Return value as a percentage:
				return `${(params.value * 100)}%`;
			},
			disableColumnMenu: true,
			type: 'number',
			// editable: true,
		},
		{
			field: 'can_percent',
			headerName: 'Canada',
			flex: 1,
			headerClassName: classes.header,
			valueFormatter: (params) => {
				// ⬇ Return value as a percentage:
				return `${(params.value * 100)}%`;
			},
			disableColumnMenu: true,
			type: 'number',
			// editable: true,
		},
	]; // End columns
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	//rows are from the shipping costs reducer
	let rows = customsDuties;
	// for (let row of customsDuties) {
	// 	if (stateFilter && stateFilter.destination_name !== row.destination_name) continue;
	// 	rows.push(row);
	// }; // End for of loop

	//#region - Action Handlers Below: 
	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'FETCH_CUSTOMS_DUTIES' }),
			dispatch({ type: 'FETCH_CUSTOMS_DUTIES_HISTORY_RECENT' })
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
					title={<p>This table shows the currently applied custom duties percentages.<br /><br />To save the current customs duties to the Pricing History Log for this month, click "Actions", then click "Save Customs To History Log".  You will be able to save the current customs multiple times, but please be aware this will create more than one entry in the Pricing History Log for this month.</p>}
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
					Current Customs Duties
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


		//#region - Info for the Save Costs to History Log button:
		// ⬇ Get today's date in YYYY-MM format;
		const today = new Date().toISOString().slice(0, 7);
		let disabled = true;
		let tooltipText = <p>The current customs duties have not been saved yet for this month.  Please click the "Save Customs to History Log" button to save the current costs for this month first.</p>;
		if (
			customsDutiesHistoryRecent.length > 0 &&
			customsDutiesHistoryRecent[0].date_saved.slice(0, 7) === today
		) {
			disabled = false;
			tooltipText = "";
		};

		const handleSaveHistoryLogSubmit = () => {
			if (
				customsDutiesHistoryRecent.length > 0 &&
				customsDutiesHistoryRecent[0].date_saved.slice(0, 7) === today
			) {
				if (window.confirm(`Customs have already been saved for this month.  If you continue, two entries will be saved for this month.  Click "OK" to continue.`)) {
					dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
					dispatch({ type: 'CUSTOMS_DUTIES_SAVE_HISTORY_LOG', payload: customsDuties })
				}; // End if
			} else {
				dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
				dispatch({ type: 'CUSTOMS_DUTIES_SAVE_HISTORY_LOG', payload: customsDuties })
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
				Save Customs to History Log
			</Button>,
			<Divider />,
			<Tooltip title={tooltipText} placement="right-end" arrow>
				<span>
					<Button
						color="primary"
						size="small"
						onClick={() => setShowEditModal(true)}
						disabled={disabled}
					>
						Edit Customs Duties
					</Button>
				</span>
			</Tooltip>,

		]; // End menuItems


		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-start",
				height: "52px",
			}}>
				<>
					{/* <Button
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
					</Menu> */}
					<Button
						color="primary"
						size="small"
						onClick={() => setShowEditModal(true)}
						disabled={disabled}
					>
						Edit Customs Duties
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
		// ⬇ Convert the customsDuties array to an object indexed by the custom_duty_id:
		const editData = customsDuties.reduce((acc, curr) => {
			acc[curr.custom_duty_id] = curr;
			return acc;
		}, {});

		const dataToCompare = customsDuties.reduce((acc, curr) => {
			acc[curr.custom_duty_id] = curr;
			return acc;
		}, {});

		const handleRowChange = (value, id, label) => {
			editData[id] = {
				...editData[id],
				[label]: parseFloat(value / 100).toFixed(4),
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
			dispatch({ type: 'EDIT_CUSTOMS_DUTIES', payload: Object.values(editData) });
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
							Customs Duties Percentages
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
										marginRight: "66px",
									}}
								>
									USA
								</div>
								<div
									style={{
										fontSize: "16px",
										marginRight: "23px",
									}}
								>
									Canada
								</div>
							</div>
							{/* ⬇ Map through the customsDuties array and create a div for each item in the array: */}
							{customsDuties.map(cost => {
								// ⬇ Create a Number Input for each item in the array, with the value set to the shipping_cost index:
								return (
									<div
										key={cost.custom_duty_id}
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
											{cost.duty_label}:
										</div>
										<div
											style={{
												width: '75px',
												marginRight: "20px",
											}}
										>
											<TextField
												defaultValue={(cost.usa_percent) * 100}
												type="number"
												onChange={(event) => handleRowChange(event.target.value, cost.custom_duty_id, 'usa_percent')}
												size="small"
												InputProps={{
													endAdornment: <InputAdornment position="end">%</InputAdornment>,
												}}
											/>
										</div>
										<div
											style={{
												width: '75px',
											}}
										>
											<TextField
												defaultValue={(cost.can_percent) * 100}
												type="number"
												onChange={(event) => handleRowChange(event.target.value, cost.custom_duty_id, 'can_percent')}
												size="small"
												InputProps={{
													endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
									onClick={() => setShowEditModal(false)}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={() => handleSubmit()}
								>
									Save Changes
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
				getRowId={(row) => row.custom_duty_id}
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

