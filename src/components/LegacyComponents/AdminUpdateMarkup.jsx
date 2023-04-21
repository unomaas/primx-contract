
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import AdminUpdates from '../AdminUpdates/AdminUpdates';


// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function AdminUpdateMarkup() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const currentMarkup = useSelector(store => store.products.currentMarkupMargin);
	const markupHistoryRecent = useSelector(store => store.products.markupHistoryRecent);
	const markupHistory12Months = useSelector(store => store.products.markupHistory12Months);
	const markupIsLoading = useSelector(store => store.products.markupIsLoading);
	const shippingActiveDestinations = useSelector(store => store.shippingDestinations.shippingActiveDestinations);

	const [rightSelectedMonth, setRightSelectedMonth] = useState(null);
	const [leftSelectedMonth, setLeftSelectedMonth] = useState(null);

	//#region - Action Handlers Below: 
	useEffect(() => {
		dispatch({ type: 'SET_MARKUP_IS_LOADING', payload: true });
		dispatch({ type: 'CALCULATE_MONTHLY_MARKUP' });
	}, []);

	if (markupIsLoading) return (null);

	if (rightSelectedMonth === null && leftSelectedMonth === null) {
		// ⬇ Basic for loop to set the two most recent dates as default:
		for (let i = 0; i < 2; i++) {
			let date_saved = markupHistoryRecent[i].date_saved;
			if (i === 0) {
				setRightSelectedMonth(date_saved);
			} else if (i === 1) {
				// ⬇ SElect the last item in the markupHistoryRecent array:
				// setLeftSelectedMonth(markupHistoryRecent[markupHistoryRecent.length - 1].date_saved);

				setLeftSelectedMonth(date_saved);
			}; // End if
		}; // End for
	}; // End if

	const leftTableData = markupHistory12Months[leftSelectedMonth];
	const rightTableData = markupHistory12Months[rightSelectedMonth];


	let rows = [];

	// ⬇ Logic to handle setting the table rows on first load:
	if (leftTableData !== undefined && rightTableData !== undefined) {
		// ⬇ Looping through the left table data:
		for (let i = 0; i < shippingActiveDestinations.length; i++) {
			const shippingDestinationItem = shippingActiveDestinations[i];
			const leftTableDataItem = leftTableData.rows[i];
			const rightTableDataItem = rightTableData.rows[i];
			const row = {
				destination_id: shippingDestinationItem.destination_id,
				destination_name: shippingDestinationItem.destination_name,
				left_price_per_unit_75_50: leftTableDataItem.price_per_unit_75_50,
				left_price_per_unit_90_605: leftTableDataItem.price_per_unit_90_60,
				right_price_per_unit_75_50: rightTableDataItem.price_per_unit_75_50,
				right_price_per_unit_90_60: rightTableDataItem.price_per_unit_90_60,
				// ⬇ Calculate the difference between the two as a percentage:
				difference_per_unit_75_50: Math.abs(rightTableDataItem.price_per_unit_75_50 - leftTableDataItem.price_per_unit_75_50) / ((leftTableDataItem.price_per_unit_75_50 + rightTableDataItem.price_per_unit_75_50) / 2),
				difference_per_unit_90_60: Math.abs(rightTableDataItem.price_per_unit_90_60 - leftTableDataItem.price_per_unit_90_60) / ((leftTableDataItem.price_per_unit_90_60 + rightTableDataItem.price_per_unit_90_60) / 2),
				units_label: rightTableDataItem.units_label,
			}; // End row
			rows.push(row);
		}; // End for
	}; // End if



	const AdminUpdateMarkupTable = (props) => {
		const [showEditModal, setShowEditModal] = useState(false);

		// ⬇ Logic to handle setting the table rows on first load: 
		const columns = [
			{
				headerName: `Destination`,
				field: 'destination_name',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
			},
			{
				headerName: `60lbs/35kg ${leftTableData.month_year_label}`,
				field: 'left_price_per_unit_75_50',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
				type: 'number',
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
			},
			{
				headerName: `68lbs/40kg Price: ${leftTableData.month_year_label}`,
				field: 'left_price_per_unit_90_60',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
				type: 'number',
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
			},
			{
				headerName: `60lbs/35kg Price: ${rightTableData.month_year_label}`,
				field: 'right_price_per_unit_75_50',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
				type: 'number',
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
			},
			{
				headerName: `68lbs/40kg Price: ${rightTableData.month_year_label}`,
				field: 'right_price_per_unit_90_60',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
				type: 'number',
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) },
			},
			{
				headerName: `60lbs/35kg Difference`,
				field: 'difference_per_unit_75_50',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
				type: 'number',
				valueFormatter: (params) => { return `${(params.value * 100).toFixed(2)}%`; },
			},
			{
				headerName: `68lbs/40kg Difference`,
				field: 'difference_per_unit_90_60',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
				type: 'number',
				valueFormatter: (params) => { return `${(params.value * 100).toFixed(2)}%`; },
			},
			{
				headerName: `Units`,
				field: 'units_label',
				flex: 1,
				headerClassName: classes.header,
				disableColumnMenu: true,
				sortable: false,
			},
		];
		//#endregion - End State Variables.

		//#region - Table Setup Below:




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

			const handleLeftViewSelection = (date_saved) => {
				setAnchorEl(null);
				if (leftSelectedMonth == date_saved) return;
				setLeftSelectedMonth(date_saved);
			}; // End handleLogViewSelection

			const handleRightViewSelection = (date_saved) => {
				setAnchorEl(null);
				if (rightSelectedMonth == date_saved) return;
				setRightSelectedMonth(date_saved);
			}; // End handleLogViewSelection

			return (
				<GridToolbarContainer style={{ display: "block", width: "100%" }} >
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							width: "100%",
						}}
					>
						<div
							style={{
								flex: "0.125",
								justifyContent: "center",
								fontSize: "12px",
								fontFamily: "Lexend Tera",
							}}
						>
							<Button
								aria-controls="customized-menu"
								aria-haspopup="true"
								color="primary"
								size="small"
								style={{ marginBottom: "4px", width: "100%" }}
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
							style={{
								flex: "0.25",
								justifyContent: "center",
								fontSize: "12px",
								fontFamily: "Lexend Tera",
							}}
						>
							<GridToolbarSelectDropdown data={leftTableData} handleViewSelection={handleLeftViewSelection} />

						</div>

						<div
							style={{
								flex: "0.25",
								justifyContent: "center",
								fontSize: "12px",
								fontFamily: "Lexend Tera",
							}}
						>
							<GridToolbarSelectDropdown data={rightTableData} handleViewSelection={handleRightViewSelection} />

						</div>

						{/* <div
						style={{
							flex: "1",
							display: "flex",
							justifyContent: "flex-end",
							fontSize: "11px",
							fontFamily: "Lexend Tera",
						}}
					>
					</div> */}
					</div>

				</GridToolbarContainer >
			); // End return
		}; // End CustomToolbar

		const GridToolbarSelectDropdown = ({ data, handleViewSelection }) => {
			const markupHistory12MonthsArray = [];
			Object.values(markupHistory12Months).sort((a, b) => {
				return new Date(b.date_saved) - new Date(a.date_saved);
			}).forEach((item, index) => {
				markupHistory12MonthsArray.push(item);
			});

			const [anchorEl, setAnchorEl] = useState(null);
			return (
				<>
					<Button
						aria-controls="customized-menu"
						aria-haspopup="true"
						color="primary"
						size="small"
						style={{ marginBottom: "4px", width: "100%" }}
						onClick={event => setAnchorEl(event.currentTarget)}
					>
						{data.month_year_label} Markup: {data.margin_applied * 100}% <ArrowDropDownIcon />
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
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
					>
						{markupHistory12MonthsArray.map((item, index) => {
							return (
								<MenuItem
									key={index}
									onClick={() => handleViewSelection(item.date_saved)}
									selected={item.date_saved === data.date_saved ? true : false}
								>
									View {item.month_year_label} Markup: {item.margin_applied * 100}%
								</MenuItem>
							)
						})}
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
				markupHistoryRecent.length > 1 &&
				markupHistoryRecent[1].date_saved.slice(0, 7) === today
			) {
				disabled = false;
				tooltipText = "";
			};


			const handleSaveHistoryLogSubmit = () => {
				if (
					markupHistoryRecent.length > 1 &&
					markupHistoryRecent[1].date_saved.slice(0, 7) === today
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
							width: "fit-content",
							height: "fit-content",
							marginTop: "-300px",	
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
										Save Changes
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

			<Paper
				elevation={3}
				style={{
					height: 'fit-content',
					width: "1100px",
				}}
			>
				<DataGrid
					className={classes.dataGridTables}
					disableSelectionOnClick
					columns={columns}
					rows={rows}
					getRowId={(row) => row.destination_id}
					autoHeight
					pagination
					components={{
						Toolbar: CustomToolbar,
						Footer: CustomFooter,
					}}

				/>

				<CostsEditModal />
			</Paper>

		)
	}; // End AdminUpdateMarkupTable


	// ⬇ Rendering below: 
	return (
		<div>
			<AdminUpdates />
			<div
				// elevation={3}
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<AdminUpdateMarkupTable leftTableData={leftTableData} />
			</div>
		</div>
	)
}

