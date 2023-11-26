
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper, FormControl, InputLabel, Select, FormControlLabel, Switch, ButtonGroup } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function LicenseesTable() {
	// ⬇ State Variables:
	//#region - State Variables Below: 
	const classes = useClasses();
	const dispatch = useDispatch();
	const productContainers = useSelector(store => store.productContainers.productContainersArray);
	const [showEditModal, setShowEditModal] = useState(false);

	const companies = useSelector(store => store.companies);
	const activeRegions = useSelector(store => store.regions.activeRegions);

	const [selectedRegions, setSelectedRegions] = useState([]);

	const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [tableMounted, setTableMounted] = useState(false);

	const measurementOptions = [
		{
			value: 'imperial',
			label: 'Imperial',
		},
		{
			value: 'metric',
			label: 'Metric',
		},
	];



	const columns = [
		{
			field: 'licensee_contractor_name',
			headerName: 'Licensee/Contractor',
			headerClassName: classes.header,
			flex: 1.5,
		},
		{
			field: 'operating_regions',
			headerName: 'Operating Regions',
			headerClassName: classes.header,
			flex: 1.5,
			valueFormatter: (params) => {
				// Mapping each region_id to its corresponding region_code
				const regionCodes = params.value.map(regionId =>
					activeRegions.find(region => region.region_id === regionId)?.region_code || regionId
				);
				return regionCodes.join(', ');
			}
		},
		{
			field: 'default_measurement',
			headerName: 'Default Measurement',
			headerClassName: classes.header,
			disableColumnMenu: true,
			flex: 1,
			valueFormatter: params => {
				return params.value.charAt(0).toUpperCase() + params.value.slice(1);
			}
		},
		{
			field: 'active',
			headerName: 'Active',
			align: 'right',
			disableColumnMenu: true,
			flex: .75,
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
	];
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	let rows = companies;

	//#region - Action Handlers Below: 
	useEffect(() => {
		dispatch({ type: 'FETCH_ALL_COMPANIES' });
		dispatch({ type: 'FETCH_ACTIVE_REGIONS' });
	}, [])

	// ⬇ Handles the selection and deselection of a row:
	const handleSelectionModelChange = (id_array) => {
		// ⬇ If the selected row is clicked again, deselect it:a
		if (id_array.length > 0 && id_array[0] === selectedRow?.licensee_id) {
			id_array.length = 0;
			setSelectedRow(null);
		} else { // ⬇ Else set it as normal:
			const rowId = id_array[0];
			const selectedData = rows.find((row) => row.licensee_id === rowId);

			if (selectedData.licensee_contractor_name.includes(' ')) {
				selectedData.trimmed_display_name = selectedData.licensee_contractor_name.slice(0, selectedData.licensee_contractor_name?.indexOf(' '));
			} else {
				selectedData.trimmed_display_name = selectedData.licensee_contractor_name;
			}

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
					title={<p>This table shows all Licensee companies saved in the system, and allows PrimX Admin to add a new company, or edit an existing one.<br /><br />Click a row to select it.  Click again to deselect.  Exporting with a row selected will only export that single row.</p>}
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
					All Licensees by Company
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
							onClick={() => setShowEditModal(true)}
							style={{ margin: "4px" }}
						>
							Edit {selectedRow?.trimmed_display_name}
						</Button>
					</>
					: <>
						<Button
							color="primary"
							size="small"
							onClick={() => setShowEditModal(true)}
							style={{ margin: "4px" }}
						>
							Create New Licensee
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

		const company = {
			licensee_contractor_name: '',
			default_measurement: '',
			operating_regions: [],
			active: true,
		};

		// Assume editData is already correctly initialized based on the selected row
		const [editData, setEditData] = useState({ ...selectedRow || company });

		const handleEdit = (value, label) => {
			setEditData({
				...editData,
				[label]: value
			});
		};

		const handleSubmit = () => {
			console.log(`Ryan Here: handleSubmit \n `, { editData });
			if (selectedRow && JSON.stringify(editData) === JSON.stringify(selectedRow)) {
				alert('Please make changes to submit.');
				return;
			}

			if (!editData.licensee_contractor_name || !editData.default_measurement || editData.operating_regions.length == 0) {
				alert('Please fill out all fields to submit.');
				return;
			}
			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });

			dispatch({
				type: 'SUBMIT_LICENSEE', payload: {
					...editData,
					edit: selectedRow ? true : false,
				}
			});
			setShowEditModal(false);
			setSelectedRow(editData);

		};


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
						<div style={{ margin: '0px auto 10px auto', fontSize: "1.1rem", letterSpacing: "0.5px", borderBottom: "1px solid #000", fontFamily: "Lexend Tera", paddingBottom: '10px' }}>
							{selectedRow?.licensee_contractor_name ? `Edit ${selectedRow.licensee_contractor_name}` : 'Create New Licensee'}
						</div>
						<div style={{ marginBottom: '10px' }}>
							<TextField
								fullWidth
								label="Licensee Name"
								value={editData.licensee_contractor_name}
								onChange={(event) => handleEdit(event.target.value, 'licensee_contractor_name')}
								style={{ marginBottom: '20px' }}
							/>
							<FormControl fullWidth style={{ marginBottom: '20px' }}>
								<InputLabel>Default Measurement</InputLabel>
								<Select
									value={editData.default_measurement}
									style={{ textAlign: 'left' }}
									onChange={(event) => handleEdit(event.target.value, 'default_measurement')}
								>
									{measurementOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl fullWidth>
								<InputLabel>Operating Regions</InputLabel>
								<Select
									multiple
									value={editData.operating_regions}
									onChange={(event) => handleEdit(event.target.value, 'operating_regions')}
									renderValue={(selected) => selected.map(id => activeRegions.find(region => region.region_id === id)?.region_code).join(', ')}
									style={{ textAlign: 'left' }}
								>
									{activeRegions?.map((region) => (
										<MenuItem key={region.region_id} value={region.region_id}>
											{region.region_code}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							{selectedRow &&
								<div style={{ marginTop: '20px', width: '100%' }}>
									<ButtonGroup fullWidth>
										<Button
											variant={!editData.active ? "contained" : "outlined"}
											color="secondary"
											onClick={(event) => handleEdit(false, 'active')}
										>
											Inactive
										</Button>
										<Button
											variant={editData.active ? "contained" : "outlined"}
											color="primary"
											onClick={(event) => handleEdit(true, 'active')}
										>
											Active
										</Button>
									</ButtonGroup>
								</div>
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

	// ⬇ Rendering below: 
	return (
		<Paper
			elevation={3}
			className={classes.licenseeGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				rows={rows}
				getRowId={(row) => row.licensee_id}
				autoHeight
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
		</Paper>
	)
}

