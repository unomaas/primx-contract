import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import LicenseeLoginForm from '../AdminLoginForm/LicenseeLoginForm';
import LicenseeLoginForm from './LicenseeLoginForm';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

function LicenseeLoginPage() {
	const dispatch = useDispatch();

	// ⬇ Run on page load:
	useEffect(() => {
		// ⬇ Set the page button state: 
		dispatch({ type: 'SET_BUTTON_STATE', payload: 'SavedEstimates' });
	}, []);

	return (
		<div>
			<ButtonToggle />

			<br />
			<center>
				<LicenseeLoginForm />
			</center>
		</div>
	);
}

export default LicenseeLoginPage;
