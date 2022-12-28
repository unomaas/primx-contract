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
import { useStyles } from '../MuiStyling/MuiStyling';



export default function AdminUpdateLicenses() {

	// establish usedispatch as dispatch
	const dispatch = useDispatch();
	// establish companies with a use selector from the companies reducer
	const companies = useSelector(store => store.companies);
	// establish add company input state with use state
	let [companyNameInput, setCompanyNameInput] = useState('');
  const [pageSize, setPageSize] = useState(10);
	//defining classes for MUI
	const classes = useStyles();

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

	//estabish columns for datagrid
	const columns = [
		{
			field: 'licensee_contractor_name',
			headerName: 'Licensee/Contractor',
			width: 300,
			headerClassName: classes.header
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
			dispatch({ type: 'SET_EMPTY_ERROR' })
		} else {
			dispatch({ type: 'ADD_COMPANY', payload: companyNameInput });
			setCompanyNameInput('');
		}
	}



	return (
		<div >
			<AdminUpdates />

			<h2>Update Licensee</h2>

			<form onSubmit={handleAddCompany}>
				<TextField
					id="outlined-basic"
					className={classes.AddLicenseeInput}
					label="Add New Licensee"
					variant="outlined"
					value={companyNameInput}
					onChange={handleCompanyInputChange} />
				<Fab
					className={classes.AddLicenseeInput}
					type="submit"
					color="primary"
					aria-label="add">
					<AddIcon />
				</Fab>
			</form>

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
