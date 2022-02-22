import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

//imports for MUI
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';


// CUSTOM COMPONENTS
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';

const handleButtonState = (event, selection) => {
	// setButtonState(selection);
	// history.push(`/${selection}`);
}

export default function LicenseePortal() {

	const history = useHistory();

	// toggle button states
	// const [buttonState, setButtonState] = useState(`create`);

	const onLogin = (event) => {
		// history.push('/login');
	};


	return (
		<div className="container">

			Test

		</div>
	);
}

// export default LicenseePortal;
