//#region ⬇⬇ All document setup, below:
import React from 'react';
import './Footer.css';

import { useLocation } from 'react-router-dom';
//#endregion ⬆⬆ All document setup above.


// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
	const location = useLocation();

	if (
		location.pathname === '/PricingLog'
	) return null;

	return (
		<footer className="lexendFont footerPrint">
			<img src="./images/PrimXLogo-Spaced-01.svg" height="55"></img>
			<br />
			&copy; 2023 PrīmX NA. All rights reserved.
		</footer>
	)
}

export default Footer;
