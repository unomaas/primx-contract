import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../MuiStyling/MuiStyling.jsx';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper, FormControl, InputLabel, Select, FormControlLabel, Switch, ButtonGroup } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';



export default function SystemAdminUpdateUsersGrid() {

	const dispatch = useDispatch();
	const classes = useClasses();
	const userInfo = useSelector(store => store.userInfoReducer.userInfo);

	const [showEditModal, setShowEditModal] = useState(false);

	const { activeRegions } = useSelector(store => store.regions.regionData);

	const [selectedRegions, setSelectedRegions] = useState([]);

	const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [tableMounted, setTableMounted] = useState(false);


	// columns for Data Grid
	const columns = [
		{
			field: 'username',
			headerName: 'Username',
			headerClassName: classes.header,
			flex: 1,
		}, {
			field: 'permission_type',
			headerName: 'Account Type',
			headerClassName: classes.header,
			flex: 1,
		},
		// {
		// 	field: '',
		// 	headerName: 'Delete',
		// 	width: 132,
		// 	disableClickEventBubbling: true,
		// 	// renderCell: renderDeleteButton, // function declared above, creates a button in each row of the pending column
		// 	renderCell: (params) => {
		// 		return (
		// 			<Button
		// 				variant="contained"
		// 				color="secondary"
		// 				onClick={() => handleDeleteAdmin(params)}
		// 				className={classes.LexendTeraFont11}
		// 			>
		// 				Delete
		// 			</Button>
		// 		)
		// 	},
		// 	headerClassName: classes.header
		// }
	]

	//function to render the delete button in the datagrid
	const renderDeleteButton = (params) => {

		// ⬇ Pull in the user's permission level from the store, and hide a delete button if system admin:
		if (params.row.permission_level === 1) return null;

		return (
			<Button
				variant="contained"
				color="secondary"
				onClick={() => handleDeleteAdmin(params)}
				className={classes.LexendTeraFont11}
			>
				Delete
			</Button>
		)
	}



	//datagrid rows are the information from userInfo reducer
	let rows = userInfo;


	// click listener for the process order buttons inside the pending order table
	const handleDeleteAdmin = (row) => {
		if (!window.confirm('Are you sure you want to delete this user?')) return;
		dispatch({ type: 'DELETE_ADMIN', payload: row });
	}

	// ⬇ Handles the selection and deselection of a row:
	const handleSelectionModelChange = (id_array) => {
		// ⬇ If the selected row is clicked again, deselect it:
		if (id_array.length > 0 && id_array[0] === selectedRow?.user_id) {
			id_array.length = 0;
			setSelectedRow(null);
		} else { // ⬇ Else set it as normal:
			const rowId = id_array[0];
			const selectedData = rows.find((row) => row.user_id === rowId);

			// ⬇ Set the selected product to state:
			setSelectedRow(selectedData);
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
					title={<p>This table shows all admin users accounts in the system.<br /><br />Click a row to select it.  Click again to deselect.  Exporting with a row selected will only export that single row.</p>}
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
					All Admin User Accounts
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
			handleSelectionModelChange([selectedRow?.user_id]);
			// setSelectedRow(null);
		}; // End handleOnPageChange

		const handleOnRowsPerPageChange = (size) => {
			apiRef.current.setPageSize(size.props.value);
			setRowsPerPage(size.props.value);
			handleOnPageChange(0);
			// setSelectedRow(null);
			handleSelectionModelChange([selectedRow?.user_id]);
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
				{selectedRow
					? <>
						<Button
							color="primary"
							size="small"
							onClick={() => handleDeleteAdmin(selectedRow)}
							style={{ margin: "4px" }}
						>
							Delete {selectedRow?.username}
						</Button>
					</>
					: <>
						<Button
							color="primary"
							size="small"
							onClick={() => setShowEditModal(true)}
							style={{ margin: "4px" }}
						>
							Create New Admin Account
						</Button>
					</>
				}
				<CustomPagination />
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 

	const TableEditModal = () => {

		const admin = {
			username: '',
			password: '',
			permission_level: 0,
			region_id: 0,
		};

		const [editData, setEditData] = useState({ ...admin });

		const handleEdit = (value, label) => {
			setEditData({
				...editData,
				[label]: value
			});
		};

		const handleSubmit = () => {
			if (!editData.username || !editData.password || !editData.permission_level || (editData.permission_level === 3 && !editData.region_id)) {
				alert('Please fill out all fields to submit.');
				return;
			}

			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });

			dispatch({ type: 'SUBMIT_ADMIN', payload: editData });
			setShowEditModal(false);
			setSelectedRow(editData);
		};

		const accountTypeOptions = [
			{ value: 1, label: 'System Admin' },
			{ value: 2, label: 'Admin' },
			{ value: 3, label: 'Regional Admin' },
		];

		return (
			<Modal
				open={showEditModal}
				onClose={() => setShowEditModal(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{ timeout: 500 }}
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			>
				<Fade in={showEditModal}>
					<div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: "0.5rem 0.5rem 1rem 0.5rem rgba(0, 0, 0, 0.2)", padding: '1rem', width: "fit-content", height: "fit-content", marginTop: "-300px", minWidth: '460px' }}>
						<div
							style={{ margin: '0px auto 10px auto', fontSize: "1.1rem", letterSpacing: "0.5px", borderBottom: "1px solid #000", fontFamily: "Lexend Tera", paddingBottom: '10px' }}
						>
							Create New Admin Account
						</div>
						<div style={{ marginBottom: '10px' }}>
							<TextField
								fullWidth
								label="Username"
								value={editData.username}
								onChange={(event) => handleEdit(event.target.value, 'username')}
								style={{ marginBottom: '20px' }}
							/>
														<TextField
								fullWidth
								label="Password"
								value={editData.password}
								onChange={(event) => handleEdit(event.target.value, 'password')}
								style={{ marginBottom: '20px' }}
							/>
							<FormControl fullWidth style={{ marginBottom: '20px' }}>
								<InputLabel>Account Type</InputLabel>
								<Select
									value={editData.permission_level}
									style={{ textAlign: 'left' }}
									onChange={(event) => handleEdit(event.target.value, 'permission_level')}
								>
									{accountTypeOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							{editData.permission_level === 3 &&
								<FormControl fullWidth>
									<InputLabel>Operating Region</InputLabel>
									<Select
										value={editData.region_id}
										onChange={(event) => handleEdit(event.target.value, 'region_id')}
										style={{ textAlign: 'left' }}
									>
										{activeRegions?.map((region) => (
											<MenuItem key={region.region_id} value={region.region_id}>
												{region.region_name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							}

						</div>
						<div style={{ borderTop: "1px solid #000" }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
								<Button variant="contained" color="secondary" onClick={() => setShowEditModal(false)}>
									Cancel
								</Button>
								<Button variant="contained" color="primary" onClick={handleSubmit}>
									Submit
								</Button>
							</div>
						</div>
					</div>
				</Fade>
			</Modal>
		);
	};

	return (
		<div
			className={classes.licenseeGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				autoHeight
				rows={rows}
				getRowId={(row) => row.user_id}
				columns={columns}
				pagination
				onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>

			{showEditModal &&
				<TableEditModal />
			}

		</div>
	)
}