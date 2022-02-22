import React from 'react';
// import LicenseeLoginForm from '../AdminLoginForm/LicenseeLoginForm';
import LicenseeLoginForm from './LicenseeLoginForm';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

function LicenseeLoginPage() {

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
