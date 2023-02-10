
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
import AdminUpdateMarkup from './AdminUpdateMarkup';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function AdminUpdateMaterials() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const productsArray = useSelector(store => store.products.productsArray);
	const productCostHistoryRecent = useSelector(store => store.products.productCostHistoryRecent);
	const [showEditModal, setShowEditModal] = useState(false);

	// ⬇ Logic to handle setting the table rows on first load: 
	const columns = [
		{
			field: 'product_label',
			headerName: 'Product',
			flex: 2,
			headerClassName: classes.header
		},
		{
			field: 'product_self_cost',
			type: 'number',
			headerName: 'Self Cost',
			flex: 1,
			headerClassName: classes.header,
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
	];
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	let rows = productsArray;


	//#region - Action Handlers Below: 
	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'FETCH_PRODUCTS_ARRAY' });
		dispatch({ type: 'FETCH_PRODUCT_COST_HISTORY_RECENT' });
		dispatch({ type: 'FETCH_MARKUP_MARGIN' });
		dispatch({ type: 'FETCH_MARKUP_HISTORY_RECENT' });
	}, [])


	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied product self costs.<br /><br />To edit the product self costs, first you must save the current costs to the Pricing History Log for this month.<br /><br />To do that, click "Actions", then click "Save Costs".  You will be able to save the current costs multiple times, but please be aware this will create more than one entry in the Pricing History Log for this month.</p>}
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
					Current Product Self Costs
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


	const CustomFooter = () => {
		//#region - Info for the Save Costs to History Log button:
		// ⬇ Get today's date in YYYY-MM format;
		const today = new Date().toISOString().slice(0, 7);
		let disabled = true;
		let tooltipText = <p>The current costs have not been saved yet for this month.  Please click the "Save Costs to History Log" button to save the current costs for this month first.</p>;
		if (
			productCostHistoryRecent.length > 0 &&
			productCostHistoryRecent[0].date_saved.slice(0, 7) === today
		) {
			disabled = false;
			tooltipText = "";
		};

		const handleSaveHistoryLogSubmit = () => {
			console.log(`Ryan Here: handleSaveHistoryLogSubmit \n `, { productCostHistoryRecent });
			if (
				productCostHistoryRecent.length > 0 &&
				productCostHistoryRecent[0].date_saved.slice(0, 7) === today
			) {
				if (window.confirm(`Costs have already been saved for this month.  If you continue, two entries will be saved for this month.  Click "OK" to continue.`)) {
					dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
					dispatch({ type: 'PRODUCT_COSTS_SAVE_HISTORY_LOG', payload: productsArray })
				}; // End if
			} else {
				dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
				dispatch({ type: 'PRODUCT_COSTS_SAVE_HISTORY_LOG', payload: productsArray })
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
						onClick={() => setShowEditModal(true)}
						disabled={disabled}
					>
						Edit Product Costs
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
				product_id: id,
				product_self_cost: parseFloat(value),
			}; // End editData
		}; // End handleCostChange

		const handleSubmit = () => {
			if (!editData || Object.keys(editData).length === 0) {
				alert('Please make changes to submit first.');
				return;
			}; // End if
			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
			dispatch({ type: 'UPDATE_PRODUCT_COSTS', payload: Object.values(editData) });
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
							Edit Product Self Cost
						</div>
						<div style={{ marginBottom: '10px' }}>
							{productsArray.map(cost => {
								// ⬇ Create a Number Input for each item in the array, with the value set to the shipping_cost index:
								return (
									<div
										key={cost.product_id}
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
												width: '97px',
											}}
										>
											<TextField
												defaultValue={Number(cost.product_self_cost).toFixed(2)}
												type="number"
												onChange={(event) => handleCostChange(event.target.value, cost.product_id)}
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
					className={classes.productsGrid}
				// style={{ float: "left" }}
				>
					<DataGrid
						className={classes.dataGridTables}
						disableSelectionOnClick
						columns={columns}
						rows={rows}
						getRowId={(row) => row.product_id}
						autoHeight
						pagination
						components={{
							Toolbar: CustomToolbar,
							Footer: CustomFooter,
						}}
					/>

					<CostsEditModal />

				</Paper>

				<AdminUpdateMarkup />

			</div>
		</div>
	)
}

