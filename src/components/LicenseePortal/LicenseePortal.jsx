import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';


//imports for MUI
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import ButtonToggle from '../ButtonToggle/ButtonToggle';



// CUSTOM COMPONENTS
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';

const handleButtonState = (event, selection) => {
	// setButtonState(selection);
	// history.push(`/${selection}`);
}



export default function LicenseePortal() {
	const dispatch = useDispatch();


		// ⬇ Run on page load:
		useEffect(() => {
			// ⬇ Fetch the current companies for drop-down menu options:
			dispatch({ type: 'SET_BUTTON_STATE', payload: 'LicenseePortal' });
		}, []);

	const history = useHistory();

	// toggle button states
	// const [buttonState, setButtonState] = useState(`create`);

	const onLogin = (event) => {
		// history.push('/login');
	};


	return (
		<div className="container">

			<ButtonToggle />

			<br/>

			Test

		</div>
	);
}

// export default LicenseePortal;
