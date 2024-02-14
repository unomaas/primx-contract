
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper, FormControl, InputLabel, Select, FormControlLabel, Switch, ButtonGroup, Collapse, Grid } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import HelpIcon from '@material-ui/icons/Help';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


export default function RegionsTable() {
	const classes = useClasses();
	const dispatch = useDispatch();


	const [selectedRow, setSelectedRow] = useState(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [tableMounted, setTableMounted] = useState(false);

	const { regionData } = useSelector((store) => store.regions);
	const { allRegions, products, customsDuties } = regionData;


	useEffect(() => {
		dispatch({ type: 'SHOW_TOP_LOADING_DIV' });
		dispatch({ type: 'REGIONS_INITIAL_LOAD' });
	}, []);


	const columns = [
		{
			field: 'region_name',
			headerName: 'Region Name',
			headerClassName: classes.header,
			flex: 1.5,
		},
		{
			field: 'region_code',
			headerName: 'Region Code',
			headerClassName: classes.header,
			flex: 1,
		},
		{
			field: 'is_active',
			headerName: 'Active',
			align: 'right',
			disableColumnMenu: true,
			flex: .5,
			headerAlign: 'right',
			headerClassName: classes.header,
			renderCell: (params) => (
				params.value
					? <CheckCircleIcon style={{ color: 'green' }} />
					: <IndeterminateCheckBoxIcon style={{ color: 'red' }} />
			),
		},
	];

	const handleSelectionModelChange = (id_array) => {
		if (id_array.length > 0 && id_array[0] === selectedRow?.region_id) {
			id_array.length = 0;
			setSelectedRow(null);
		} else {
			const rowId = id_array[0];
			const selectedRegion = allRegions.find((region) => region.region_id === rowId);
			setSelectedRow(selectedRegion);
		}
	};


	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows all Regions saved in the system, and allows PrimX Admin to add a new region, or edit an existing one.<br /><br />Click a row to select it.  Click again to deselect.  Exporting with a row selected will only export that single row.</p>}
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
					All Regions
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
							Edit {selectedRow.region_code}
						</Button>
					</>
					: <>
						<Button
							color="primary"
							size="small"
							onClick={() => setShowEditModal(true)}
							style={{ margin: "4px" }}
						>
							Create New Region
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

		const initialRegionData = {
			region_name: '',
			region_code: '',
			is_active: true,
		};

		const newRegionData = {
			customsDuties: customsDuties.reduce((acc, duty) => {
				acc[duty.custom_duty_id] = {
					value: 0,
					label: duty.duty_label,
				};
				return acc;
			}, {}),
			productCosts: products.reduce((acc, product) => {
				acc[product.product_id] = {
					value: 0,
					label: product.product_label,
				};
				return acc;
			}, {}),
			containerStats: {},
			markupPercentage: 0,
		}

		const [editData, setEditData] = useState({
			...selectedRow || {
				...initialRegionData,
				...newRegionData,
			}
		});


		const [defaultUnit, setDefaultUnit] = useState('metric');

		const [collapsedSections, setCollapsedSections] = useState({
			productCosts: false,
			customsDuties: false,
			containerStats: false,
			markupPercentage: false,
		});

		const toggleSection = (section) => {
			setCollapsedSections({
				...collapsedSections,
				[section]: !collapsedSections[section],
			});
		};

		// Function to get relevant product stats
		const getRelevantProductStats = (unit) => {
			// Logic to filter and return products based on unit
			const relevantProducts = products.filter(p =>
				(unit === 'imperial' ? p.product_label.includes('lbs') : p.product_label.includes('kgs')) ||
				p.product_label.includes('liters')
			);

			return relevantProducts.reduce((acc, product) => {
				acc[product.product_id] = {
					'20': {
						max_pallets_per_container: 0,
						max_weight_of_container: 0,
						gross_weight_of_pallet: 0,
						net_weight_of_pallet: 0,
					},
					'40': {
						max_pallets_per_container: 0,
						max_weight_of_container: 0,
						gross_weight_of_pallet: 0,
						net_weight_of_pallet: 0,
					},
				};
				return acc;
			}, {});
		};

		// Effect to update container stats when default unit changes
		useEffect(() => {
			if (selectedRow) return;
			setEditData({
				...editData,
				containerStats: getRelevantProductStats(defaultUnit),
			});
		}, [defaultUnit]);



		const handleEdit = (value, label) => {
			setEditData({ ...editData, [label]: value });
		};

		const handleProductCostsChange = (key, value, type) => {
			setEditData({
				...editData,
				[type]: {
					...editData[type],
					[key]: {
						...editData[type][key],
						value: parseFloat(value) || 0,
					},
				},
			});
		};

		const handleCustomsDutyChange = (key, value, type) => {
			setEditData({
				...editData,
				[type]: {
					...editData[type],
					[key]: parseFloat(value) || 0,
				},
			});
		};

		const handleContainerStatChange = (productKey, containerSize, key, value) => {
			setEditData({
				...editData,
				containerStats: {
					...editData.containerStats,
					[productKey]: {
						...editData.containerStats[productKey],
						[containerSize]: {
							...editData.containerStats[productKey][containerSize],
							[key]: parseFloat(value) || 0,
						},
					},
				},
			});
		};

		const handleMarkupChange = (value) => {
			setEditData({ ...editData, markupPercentage: parseFloat(value) || 0 });
		};

		const handleSubmit = () => {

			const validationErrors = []; // Initialize an array to store validation errors

			if (selectedRow && JSON.stringify(editData) === JSON.stringify(selectedRow)) {
				validationErrors.push('Please make changes to submit.');
			}

			if (!selectedRow) {
				if (!editData.region_name || !editData.region_code) {
					validationErrors.push('Please enter a region name and code.');
				}

				if (editData.region_code.length > 5) {
					validationErrors.push('Region code must be 5 characters or less.');
				}

				Object.values(editData.productCosts).forEach((element) => {
					if (!element.value) {
						validationErrors.push(`Please enter a value for ${element.label}.`);
					}
				});

				Object.entries(editData.containerStats).forEach(([productKey, containerTypes]) => {
					Object.entries(containerTypes).forEach(([containerSize, stats]) => {
						Object.entries(stats).forEach(([statKey, value]) => {
							if (!value) {
								validationErrors.push(
									`Please enter a value for ${containerSize} ${statKey
										.replace(/_/g, ' ')
										.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))}.`
								);
							}
						});
					});
				});

				Object.entries(editData.customsDuties).forEach(([key, value]) => {
					if (!value) {
						validationErrors.push(`Please enter a value for ${key}.`);
					}
				});
			}

			if (validationErrors.length > 0) {
				alert(`All of these errors must be resolved before submission:\n\n${validationErrors.join('\n')}`);
				return;
			}

			dispatch({ type: 'SHOW_TOP_LOADING_DIV' });

			dispatch({
				type: 'SUBMIT_REGION', payload: {
					...editData,
					defaultMeasurement: defaultUnit,
					edit: selectedRow ? true : false,
				}
			});
			setShowEditModal(false);
			setSelectedRow(editData);
		};


		const renderCollapsibleSectionHeader = (section, label) => (
			<div
				style={{ fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
				onClick={() => toggleSection(section)}
			>
				{label}
				{collapsedSections[section] ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
			</div>
		);

		const newRegionInputs = () => {
			if (selectedRow) return null;

			return (
				<>
					<div style={{ marginBottom: '20px' }}>
						{renderCollapsibleSectionHeader('productCosts', 'Set Product Self-Cost')}
						<Collapse in={!collapsedSections.productCosts}>
							<Grid container spacing={2}>
								{Object.keys(editData?.productCosts).map((productKey, index) => (
									<Grid item xs={6} key={productKey}>
										<TextField
											fullWidth
											label={editData?.productCosts[productKey]?.label}
											value={editData?.productCosts[productKey]?.value}
											onChange={(e) => handleProductCostsChange(productKey, e.target.value, 'productCosts')}
											type="number"
											InputProps={{
												startAdornment: <InputAdornment position="start">$</InputAdornment>,
												endAdornment: <InputAdornment position="end">USD</InputAdornment>,
											}}
										/>
									</Grid>
								))}
							</Grid>
						</Collapse>
					</div>

					<div style={{ marginBottom: '20px' }}>
						{renderCollapsibleSectionHeader('customsDuties', 'Set Customs Duties Percentages')}
						<Collapse in={!collapsedSections.customsDuties}>
							<Grid container spacing={2}>
								{Object.keys(editData?.customsDuties).map((key) => {
									return <Grid item xs={6} key={key}>
										<TextField
											fullWidth
											label={`${editData?.customsDuties[key]?.label} Customs`}
											value={editData?.customsDuties[key]?.value}
											onChange={(e) => handleProductCostsChange(key, e.target.value, 'customsDuties')}
											type="number"
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
										/>
									</Grid>
								})}
							</Grid>
						</Collapse>
					</div>

					<div style={{ marginBottom: '20px' }}>
						{renderCollapsibleSectionHeader('markupPercentage', 'Set Markup Percentage')}
						<Collapse in={!collapsedSections.markupPercentage}>
							<TextField
								fullWidth
								label="Markup Percentage"
								value={editData?.markupPercentage}
								onChange={(e) => handleMarkupChange(e.target.value)}
								type="number"
								InputProps={{
									endAdornment: <InputAdornment position="end">%</InputAdornment>,
								}}
							/>
						</Collapse>
					</div>

					<div>
						{renderCollapsibleSectionHeader('containerStats', 'Set Product Container Stats')}
						<Collapse in={!collapsedSections.containerStats}>

							<FormControl fullWidth style={{ marginBottom: '15px', marginRight: '10px' }}>
								<InputLabel id="default-unit-label">
									Product Units to use for Container Stats
								</InputLabel>
								<Select
									labelId="default-unit-label"
									id="default-unit-select"
									value={defaultUnit}
									onChange={(e) => setDefaultUnit(e.target.value)}
									style={{ textAlign: 'left' }}
								>
									<MenuItem value="imperial">Imperial (lbs)</MenuItem>
									<MenuItem value="metric">Metric (kgs)</MenuItem>
								</Select>
							</FormControl>

							{Object.entries(editData.containerStats).map(([productKey, containerTypes]) => (
								<div key={productKey} style={{ marginBottom: '20px' }}>
									<div style={{ fontWeight: '525', marginBottom: '10px' }}>
										{editData.productCosts[productKey]?.label}
									</div>
									{Object.entries(containerTypes).map(([containerSize, stats]) => (
										<Grid container spacing={2} key={containerSize}>
											{Object.entries(stats).map(([statKey, value]) => (
												<Grid item xs={6} key={statKey}>
													<TextField
														fullWidth
														label={`${containerSize}ft ${statKey.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}`}
														value={value}
														onChange={(e) => handleContainerStatChange(productKey, containerSize, statKey, e.target.value)}
														type="number"
													/>
												</Grid>
											))}
										</Grid>
									))}
								</div>
							))}
						</Collapse>
					</div >
				</>
			)
		}

		return (
			<Modal
				open={showEditModal}
				onClose={() => setShowEditModal(false)}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{ timeout: 500 }}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Fade in={showEditModal}>
					<div
						style={{
							backgroundColor: 'white',
							borderRadius: '1rem',
							boxShadow: '0.5rem 0.5rem 1rem 0.5rem rgba(0, 0, 0, 0.2)',
							padding: '1rem',
							width: 'fit-content',
							maxWidth: '400px',
							maxHeight: '500px',
							overflowY: 'hidden', // Disable Y-axis scrolling for the modal container
							// marginTop: '-300px',
							minWidth: '500px',
							display: 'flex',
							flexDirection: 'column', // Stack children vertically
						}}
					>
						<div
							style={{
								margin: '0px auto 10px auto',
								fontSize: '1.1rem',
								letterSpacing: '0.5px',
								fontFamily: 'Lexend Tera',
								paddingBottom: '10px',
							}}
						>
							{selectedRow?.region_name ? `Edit ${selectedRow.region_name}` : 'Create New Region'}
						</div>
						<div
							style={{
								flex: 1,
								marginBottom: '10px',
								overflowY: 'auto',
								padding: '10px',
							}}
						>
							<TextField
								fullWidth
								label="Region Name"
								value={editData?.region_name}
								onChange={(e) => handleEdit(e.target.value, 'region_name')}
								style={{ marginBottom: '20px' }}
							/>
							<TextField
								fullWidth
								label="Region Code"
								value={editData?.region_code}
								onChange={(e) => handleEdit(e.target.value, 'region_code')}
								style={{ marginBottom: '20px' }}
							/>

							{!selectedRow && newRegionInputs()}

							{selectedRow &&
								<div style={{ marginTop: '20px', width: '100%' }}>
									<ButtonGroup fullWidth>
										<Button
											variant={!editData.is_active ? "contained" : "outlined"}
											color="secondary"
											onClick={(event) => handleEdit(false, 'is_active')}
										>
											Inactive
										</Button>
										<Button
											variant={editData.is_active ? "contained" : "outlined"}
											color="primary"
											onClick={(event) => handleEdit(true, 'is_active')}
										>
											Active
										</Button>
									</ButtonGroup>
								</div>
							}
						</div>
						<div style={{ borderTop: "1px solid #000" }}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									marginTop: '10px',
								}}
							>
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
				rows={allRegions}
				getRowId={(row) => row.region_id}
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

