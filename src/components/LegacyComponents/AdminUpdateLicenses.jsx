import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import AdminUpdates from '../AdminUpdates/AdminUpdates';

//material ui imports
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useClasses } from '../MuiStyling/MuiStyling';


import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';




export default function AdminUpdateLicenses() {

	const dispatch = useDispatch();
	const companies = useSelector(store => store.companies);
	const activeRegions = useSelector(store => store.regions.activeRegions);
	const [pageSize, setPageSize] = useState(10);
	const classes = useClasses();

	const [selectedCompany, setSelectedCompany] = useState('');
	const [selectedRegions, setSelectedRegions] = useState([]);

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

	const [company, setCompany] = useState({
		name: '',
		measurement: '',
		operating_regions: [],
	});
	// const [availableRegions, setAvailableRegions] = useState(regions || []);

	console.log(`Ryan Here: \n `, {
		companies,
		selectedCompany,
		selectedRegions,
		activeRegions,
	});


	// GET all licensee company data on component load
	useEffect(() => {
		dispatch({ type: 'FETCH_ALL_COMPANIES' });
		dispatch({ type: 'FETCH_ACTIVE_REGIONS' });

	}, [])


	// renders a button to mark a licensee as active or inactive
	const renderActivateButton = (params) => {
		return (
			// Render a red Deactivate button if the licensee is active, or a blue Reactivate button if the licensee is inactive
			<>
				{params.row.active ?
					<Button
						variant="contained"
						color="secondary"
						onClick={() => handleActivateDeactivateClick(params)}
						className={classes.LexendTeraFont11}
					>
						Deactivate
					</Button> :
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleActivateDeactivateClick(params)}
						className={classes.LexendTeraFont11}
					>
						Reactivate
					</Button>
				}
			</>
		)
	}

	// Click handler for the rendered Deactivate/Reactivate buttons in the data grid, toggles active status of licensee
	const handleActivateDeactivateClick = (params) => {
		// On click, sends a dispatch to the companies saga to toggle active or inactive licensee status
		dispatch({ type: 'TOGGLE_ACTIVE_INACTIVE_LICENSEE', payload: params.row });
	}

	//establish rows with campanies array for datagrid
	let rows = companies;

	// ! Ryan here, when you come back, we need to implement a way to update which regions a licensee can operate in. Then, we  need to add a view to create/manage regions.  Then we need to update the shipping destinations view to be able to create new destinations that link to a region. Then we need to work out the new historical pricing stuff with regions (likely one table per region). Then do the same thing for pricing updates in the set new pricing procedure.  Then create a view to create/manage region admin, then implement the logic associated with that. I think that might be everything. 
	// // ! 1.) Implement a wa to update which regions a licensee can operate in. 
	// ! 2.) Add a view to create/manage regions.  Need to add a way that when a user creates a new region, they automatically set prices and shit for it.
	// ! 3.) Update the shipping destinations view to be able to create new destinations that link to a region. 
	// ! 4.) Create a view to create/manage region admin, then implement the logic associated with that. 
	// ! 5.) I think that might be everything.

	//estabish columns for datagrid
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
			// renderCell: (params) => (
			// 	<span>
			// 		{params?.row?.operating_regions?.join(', ')}
			// 	</span>
			// )
			valueFormatter: (params) => {
				return params?.row?.operating_regions?.join(', ');
			}
		},
		{
			field: 'default_measurement',
			headerName: 'Default Measurement',
			headerClassName: classes.header,
			flex: 1,
			valueFormatter: params => {
				return params.value.charAt(0).toUpperCase() + params.value.slice(1);
			}
		},
		{
			field: 'activate_button',
			headerName: 'Activate/Deactivate',
			disableClickEventBubbling: true,
			flex: 1,
			renderCell: renderActivateButton, // function declared above
			align: 'center',
			headerClassName: classes.header
		},

	];

	// Handler for adding a new licensee
	const handleAddCompany = (event) => {
		event.preventDefault();
		// if (!companyNameInput || selectedRegions.length === 0) {
		// 	alert('Please fill out all fields.');
		// 	return;
		// }
		// dispatch({
		// 	type: 'ADD_COMPANY',
		// 	payload: {
		// 		name: companyNameInput,
		// 		measurement: defaultMeasurements,
		// 		operating_regions: selectedRegions
		// 	}
		// });
		// setCompanyNameInput('');
		// setSelectedRegions([]);
	};

	// Handler for editing operating regions
	const handleEditRegions = (event) => {
		event.preventDefault();
		if (!selectedCompany || selectedRegions.length === 0) {
			alert('Please select a licensee and at least one region.');
			return;
		}
		dispatch({
			type: 'EDIT_LICENSEE_REGIONS',
			payload: {
				licenseeId: selectedCompany,
				operatingRegions: selectedRegions
			}
		});
		setSelectedCompany('');
		setSelectedRegions([]);
	};


	const AddNewLicenseeForm = () => {
		return (
			<div style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>

				<form onSubmit={handleAddCompany} style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr 1fr 1fr',
					gap: '1rem',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: '20px',
					maxWidth: '800px',
				}}>
					<TextField
						label="Licensee Name"
						value={company.name}
						onChange={(event) => setCompany({ ...company, name: event.target.value })}
					/>
					<FormControl>
						<InputLabel>Operating Regions</InputLabel>
						<Select
							multiple
							value={company.operating_regions}
							onChange={(event) => setCompany({ ...company, operating_regions: event.target.value })}
						// renderValue={(selected) => (
						// 	<div>
						// 		{selected.map((value) => (
						// 			<Chip key={value} label={value} className={classes.chip} />
						// 		))}
						// 	</div>
						// )}
						>
							{activeRegions?.map((region) => (
								<MenuItem key={region.region_id} value={region.region_code}>
									{region.region_code}
								</MenuItem>
							))}
						</Select>

					</FormControl>
					<FormControl>
						<InputLabel>Default Measurement</InputLabel>
						<Select
							onChange={(event) => setDefaultMeasurements(event.target.value)}
							label="Default Measurements"
							value={company.measurement}
						>
							{measurementOptions.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}

						</Select>
					</FormControl>
					<Button type="submit" variant="contained" color="primary" className={classes.submitButton}>
						Add Licensee
					</Button>
				</form>
			</div>
		)
	};

	return (
		<div >
			<AdminUpdates />

			<h2>Update Licensee</h2>

			<AddNewLicenseeForm />

			<div className={classes.licenseeGrid}>
				<DataGrid
					className={classes.dataGridTables}
					autoHeight
					rows={rows}
					columns={columns}
					getRowId={(row) => row.licensee_id}
					// pageSize={10}
					rowsPerPageOptions={[10, 25, 50, 100]}
					pageSize={pageSize}
					onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
					pagination
				/>

			</div>
		</div>
	)
}
