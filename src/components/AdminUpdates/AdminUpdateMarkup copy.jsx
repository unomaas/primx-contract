
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import AdminUpdates from './AdminUpdates';


// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function AdminUpdateMarkup() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const currentMarkup = useSelector(store => store.products.currentMarkupMargin);
	const markupHistoryRecent = useSelector(store => store.products.markupHistoryRecent);
	const markupHistory12Months = useSelector(store => store.products.markupHistory12Months);

	// console.log(`Ryan Here \n markupHistory12Months:`, { markupHistory12Months });

	const generateTableData = (data) => {
		// // ⬇ Variables:
		// let tableData = [];
		// // ⬇ Loop through the data:
		// for (let i = 0; i < data.length; i++) {
		// 	// ⬇ Create a new object for each row:
		// 	let row = {
		// 		id: i,
		// 		margin_applied: data[i].margin_applied,
		// 		created_at: data[i].created_at,
		// 	}; // End row
		// 	// ⬇ Push the row to the tableData array:
		// 	tableData.push(row);
		// } // End for
		// // ⬇ Return the tableData:
		// return tableData;
	}; // End generateTableData

	const [showEditModal, setShowEditModal] = useState(false);

	// ⬇ Logic to handle setting the table rows on first load: 
	const columns = [
		{
			field: 'margin_applied',
			headerName: `Margin <br> Percentage`,
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			sortable: false,
			valueFormatter: (params) => {
				return `${(params.value * 100)}%`;
			},
			type: 'number',
		},

	];
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	let rows = currentMarkup;


	//#region - Action Handlers Below: 
	useEffect(() => {
		// GET shipping cost data on page load
		// dispatch({ type: 'FETCH_MARKUP_MARGIN' });
		// dispatch({ type: 'FETCH_MARKUP_HISTORY_RECENT' });
		// dispatch({ type: 'FETCH_ALL_FOR_CALCULATE' });
		dispatch({ type: 'CALCULATE_MONTHLY_MARKUP' });
	}, [])



	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied markup margin percentage.<br /><br />To edit the markup margin, first you must save the current markup to the Pricing History Log for this month.<br /><br />To do that, click "Actions", then click "Save Markup".  You will be able to save the current costs multiple times, but please be aware this will create more than one entry in the Pricing History Log for this month.</p>}
					placement="right-start"
					arrow
				>
					<Button
						color="primary"
						size="small"
					>
						<HelpIcon style={{ markupRight: "8px", markupLeft: "-2px" }} /> Help
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
			<GridToolbarContainer style={{ display: "block" }} >
				<div
					// className="table-flex-row"
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						width: "100%",
					}}
				>
					<div
						// className="table-flex-column"

						style={{
							flex: "1",
							display: "flex",
							justifyContent: "flex-start",
							height: "45px"

						}}
					>
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

					<div
						// className="table-flex-column"
						style={{
							flex: "1",
							display: "flex",
							justifyContent: "center",
							fontSize: "12px",
							fontFamily: "Lexend Tera",
						}}
					>
						<GridToolbarSelectDropdown />

					</div>

					<div
						// className="table-flex-column"
						style={{
							flex: "1",
							display: "flex",
							justifyContent: "flex-end",
							fontSize: "11px",
							fontFamily: "Lexend Tera",
						}}
					>
					</div>
				</div>


				{/* <div
					className="table-flex-row"
				>
					teSt
				</div> */}

			</GridToolbarContainer >
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
					Viewing Test <ArrowDropDownIcon />
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
					{/* {Object.values(pricingLogTableOptions).map((item, index) => {
						return (
							<MenuItem
								key={index}
								onClick={() => handleLogViewSelection(item.key)}
								selected={item.key == selectedLog.key ? true : false}

							>
								View {item.label}
							</MenuItem>
						)
					})} */}
				</Menu>
			</>
		); // End return
	} // End GridToolbarSelectDropdown


	const CustomFooter = () => {
		//#region - Info for the Save Costs to History Log button:
		// ⬇ Get today's date in YYYY-MM format;
		const today = new Date().toISOString().slice(0, 7);
		let disabled = true;
		let tooltipText = <p>The current costs have not been saved yet for this month.  Please click the "Save Costs to History Log" button to save the current costs for this month first.</p>;
		if (
			markupHistoryRecent.length > 0 &&
			markupHistoryRecent[0].date_saved.slice(0, 7) === today
		) {
			disabled = false;
			tooltipText = "";
		};

		const handleSaveHistoryLogSubmit = () => {
			if (
				markupHistoryRecent.length > 0 &&
				markupHistoryRecent[0].date_saved.slice(0, 7) === today
			) {
				if (!window.confirm(`Markup margins have already been saved for this month.  If you continue, two entries will be saved for this month.  Click "OK" to continue.`)) return;
			}; // End if
			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
			dispatch({ type: 'MARKUP_SAVE_HISTORY_LOG', payload: currentMarkup })
		}; // End handleSaveHistoryLogSubmit
		//#endregion - Info for the Save Costs to History Log button.

		const [anchorEl, setAnchorEl] = useState(null);
		const menuItems = [
			<Button
				color="primary"
				size="small"
				onClick={() => handleSaveHistoryLogSubmit()}
			>
				Save Markup to History Log
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
						Edit Markup Margin
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
				</>
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 

	//#region - Table Edit Modal: 
	const CostsEditModal = () => {

		const editData = {};
		const handleCostChange = (value, id) => {
			editData[id] = {
				markup_id: id,
				margin_applied: parseFloat(value / 100),
			}; // End editData
		}; // End handleCostChange

		const handleSubmit = () => {
			if (!editData || Object.keys(editData).length === 0) {
				alert('Please make changes to submit first.');
				return;
			}; // End if
			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
			dispatch({ type: 'EDIT_MARKUP_MARGIN', payload: Object.values(editData) });
			setShowEditModal(false);
		}; // End handleSubmit


		return (
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				// className={classes.modal}
				open={showEditModal}
				// onClose={() => dispatch({ type: 'SHIPPING_COSTS_SHOW_EDIT_MODAL', payload: false })}
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
						minHeight: '145px',
					}}>
						<div
							style={{
								markup: '0px auto 10px auto',
								fontSize: "1.1rem",
								letterSpacing: "0.5px",
								borderBottom: "1px solid #000",
								fontFamily: "Lexend Tera",
								paddingBottom: '10px',
							}}
						>
							Edit Markup Margin
						</div>
						<div style={{ marginBottom: '10px', height: '59px' }}>
							<div
								key={currentMarkup[0]?.markup_id}
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									alignItems: 'flex-end',
									paddingTop: '10px',
								}}
							>
								<div
									style={{
										padding: "0.6rem",
									}}
								>
									Margin to Apply:
								</div>
								<div
									style={{
										width: '75px',
									}}
								>
									<TextField
										defaultValue={Number(currentMarkup[0]?.margin_applied * 100)}
										type="number"
										onChange={(event) => handleCostChange(event.target.value, currentMarkup[0]?.markup_id)}
										size="small"
										InputProps={{
											endAdornment: <InputAdornment position="end">%</InputAdornment>,
										}}
									/>
								</div>
							</div>
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
									// onClick={() => dispatch({ type: 'SHIPPING_COSTS_SHOW_EDIT_MODAL', payload: false })}
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
	}; // End CostsEditModal
	//#endregion - Table Edit Modal.

	// ⬇ Rendering below: 
	return (
		<div>
			<AdminUpdates />
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Paper
					elevation={3}
					className={classes.markupGrid}
				>
					<DataGrid
						className={classes.dataGridTables}
						disableSelectionOnClick
						columns={columns}
						rows={rows}
						getRowId={(row) => row.markup_id}
						autoHeight
						pagination
						components={{
							Toolbar: CustomToolbar,
							Footer: CustomFooter,
						}}
					// height='500px'
					/>

					<CostsEditModal />

				</Paper>

			</div>
		</div>
	)
}

