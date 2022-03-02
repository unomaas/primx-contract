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
		dispatch({ type: 'SET_BUTTON_STATE', payload: 'LicenseePortal' });
		dispatch({ type: 'INITIAL_LOAD_LICENSEE_PORTAL', payload: user.licensees_id });
	}, []);

	const history = useHistory();

	// toggle button states
	// const [buttonState, setButtonState] = useState(`create`);

	const onLogin = (event) => {
		// history.push('/login');
	};
	if (Object.keys(pageData).length != 0) {
		console.log('*** In LicenseePortal', { pageData });
		console.log('*** Test', Object.keys(pageData).length);
	}
	return (
		<div className="EstimateCreate-wrapper">

			<ButtonToggle />

			<br />

			<div>
				{Object.keys(pageData).length != 0 &&
					<LicenseeTables pageData={pageData} />
				}

			</div>

		</div>
	);
}

// export default LicenseePortal;
