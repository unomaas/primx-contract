import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


//imports for MUI
// import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import ButtonToggle from '../ButtonToggle/ButtonToggle';
import { Button, MenuItem, TextField, Select, Radio, RadioGroup, FormControl, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Grid, FormHelperText } from '@material-ui/core';




// CUSTOM COMPONENTS
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';
import LicenseeTables from './LicenseeTables';

const handleButtonState = (event, selection) => {
	// setButtonState(selection);
	// history.push(`/${selection}`);
}



export default function LicenseePortal() {

	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const pageData = useSelector(store => store.licenseePortalReducer.pageData);



	// ⬇ Run on page load:
	useEffect(() => {
		// ⬇ Fetch the current companies for drop-down menu options:
		dispatch({ type: 'INITIAL_LOAD_LICENSEE_PORTAL', payload: user.licensee_id });
		// ⬇ Set the page button state: 
		dispatch({ type: 'SET_BUTTON_STATE', payload: 'SavedEstimates' });

	}, []);

	const history = useHistory();

	// toggle button states
	// const [buttonState, setButtonState] = useState(`create`);

	const onLogin = (event) => {
		// history.push('/login');
	};

	return (
		<div className="EstimateCreate-wrapper">

			<ButtonToggle />

			<br />

			<div>
				{/* Conditional rendering to only show the table once the data is loaded: */}
				{Object.keys(pageData).length != 0 &&
					<LicenseeTables pageData={pageData} />
				}

			</div>

		</div>
	);
}

// export default LicenseePortal;
