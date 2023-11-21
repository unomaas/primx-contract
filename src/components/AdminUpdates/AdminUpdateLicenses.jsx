import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import AdminUpdates from './AdminUpdates';

//material ui imports
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useClasses } from '../MuiStyling/MuiStyling';



export default function AdminUpdateLicenses() {

	// establish usedispatch as dispatch
	const dispatch = useDispatch();
	// establish companies with a use selector from the companies reducer
	const companies = useSelector(store => store.companies);
	// establish add company input state with use state
	let [companyNameInput, setCompanyNameInput] = useState('');
	let [defaultMeasurements, setDefaultMeasurements] = useState('imperial');
	const [pageSize, setPageSize] = useState(10);
	//defining classes for MUI
	const classes = useClasses();

	// GET all licensee company data on component load
	useEffect(() => {
		dispatch({ type: 'FETCH_ALL_COMPANIES' });
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
		dispatch({ type: 'SET_SUCCESS_ACTIVE' });
	}

	//establish rows with campanies array for datagrid
	let rows = companies;

	// ! Ryan here, when you come back, we need to implement a way to update which regions a licensee can operate in. Then, we  need to add a view to create/manage regions.  Then we need to update the shipping destinations view to be able to create new destinations that link to a region. Then we need to work out the new historical pricing stuff with regions (likely one table per region). Then do the same thing for pricing updates in the set new pricing procedure.  Then create a view to create/manage region admin, then implement the logic associated with that. I think that might be everything. 

	//estabish columns for datagrid
	const columns = [
		{
			field: 'licensee_contractor_name',
			headerName: 'Licensee/Contractor',
			width: 300,
			headerClassName: classes.header
		},
		{
			field: 'operating_regions',
			headerName: 'Operating Regions',
			width: 300,
			headerClassName: classes.header,
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
			field: 'activate_button',
			headerName: 'Activate/Deactivate',
			width: 225,
			disableClickEventBubbling: true,
			renderCell: renderActivateButton, // function declared above
			align: 'center',
			headerClassName: classes.header
		},

	];

	// tracks the state of the company name input in companynameinput variable
	const handleCompanyInputChange = (event) => {
		setCompanyNameInput(event.target.value);
	}

	//handles add company button click that sends payload of company name input to saga for posting to database
	const handleAddCompany = (event) => {
		if (companyNameInput == '') {
			// dispatch({ type: 'SET_EMPTY_ERROR' })
			alert('Please enter a name for the new licensee first.');
			return;
		}
		dispatch({ type: 'ADD_COMPANY', payload: { name: companyNameInput, measurement: defaultMeasurements } });
		setCompanyNameInput('');
	}



	return (
		<div >
			<AdminUpdates />

			<h2>Update Licensee</h2>

			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginBottom: '20px'
			}}>
				<form onSubmit={handleAddCompany}>
					<TextField
						id="outlined-basic"
						className={classes.AddLicenseeInput}
						label="Add New Licensee"
						variant="outlined"
						value={companyNameInput}
						onChange={handleCompanyInputChange}
						style={{ marginRight: "10px" }}
					/>

					<Select
						onChange={(event) => setDefaultMeasurements(event.target.value)}
						variant="outlined"
						label="Default Measurement Units"
						value={defaultMeasurements}
					>
						<MenuItem value="imperial">Imperial</MenuItem>
						<MenuItem value="metric">Metric</MenuItem>
					</Select>

					<Fab
						type="submit"
						color="primary"
						style={{ marginLeft: '20px', fontSize: '10px' }}
						aria-label="add"
					>
						<AddIcon />
					</Fab>
				</form>

			</div>

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
