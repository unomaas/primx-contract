import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Error404Page from './Error404Page.jsx';
import AdminLoginPage from '../components/AdminLoginPage/AdminLoginPage.jsx';
import LoginForm from '../components/LoginForm/LoginForm.jsx';
import { useSelector } from 'react-redux';
import AdminLandingPage from '../components/AdminLandingPage/AdminLandingPage.jsx';
import AdminUpdates from '../components/AdminUpdates/AdminUpdates.jsx';
import AdminOrders from '../components/AdminOrders/AdminOrders.jsx';
import AdminUpdateTypes from '../components/AdminUpdates/AdminUpdateTypes.jsx';
// import AdminUpdateLicenses from '../components/AdminUpdates/AdminUpdateLicenses';
import AdminUpdateDestinations from '../pages/AdminUpdates/ShippingDestinations/index.jsx'
import LicenseeAccounts from '../components/AdminLicenseeAccounts/LicenseeAccounts.jsx';
import ProductContainers from '../pages/AdminUpdates/ProductContainers/index.jsx';
import Regions from '../pages/AdminUpdates/Regions/index.jsx';
import DosageRates from '../pages/AdminUpdates/DosageRates/index.jsx';
import PricingLog from '../pages/PricingLog/index.jsx';
import UpdatePricing from '../pages/UpdatePricing/index.jsx';
import AdminUpdateLicenses from '../pages/AdminUpdates/Licensees/index.jsx';


// A Custom Wrapper Component -- This will keep our code DRY.
// Responsible for watching redux state, and returning an appropriate component
// API for this component is the same as a regular route

// THIS IS NOT SECURITY! That must be done on the server
// A malicious user could change the code and see any view
// so your server-side route must implement real security
// by checking req.isAuthenticated for authentication
// and by checking req.user for authorization

export const regionalAdminRoutes = [
	{
		path: '/User',
		component: AdminLandingPage
	},
	{
		path: '/AdminOrders',
		component: AdminOrders
	},

];

export default function RegionalAdminRoute(props) {
	const user = useSelector((store) => store.user);

	// Using destructuring, this takes ComponentToProtect from component
	// prop and grabs all other props to pass them along to Route
	const {
		// redirect path to be used if the user is authorized
		authRedirect,
		...otherProps
	} = props;

	// Component may be passed in as as prop, or as a child
	const ComponentToProtect = props.component || (() => props.children);

	let ComponentToShow;

	if (user.user_id && user.permission_level <= 3) {
		// if the user is logged in (only logged in users have ids)
		// show the component that is protected
		ComponentToShow = ComponentToProtect;
	} else {
		// if they are not logged in, check the loginMode on Redux State
		// if the mode is 'login', show the LoginPage
		ComponentToShow = LoginForm;
		// ComponentToShow = Error404Page;
	}


	// redirect a logged in user if an authRedirect prop has been provided
	if (user.user_id && authRedirect != null) {
		return <Redirect exact from={otherProps.path} to={authRedirect} />;
	} else if (!user.user_id && authRedirect != null) {
		ComponentToShow = ComponentToProtect;
	}

	// We return a Route component that gets added to our list of routes
	return (
		<Route
			// all props like 'exact' and 'path' that were passed in
			// are now passed along to the 'Route' Component
			{...otherProps}
		>
			<ComponentToShow />
		</Route>

	);
}

