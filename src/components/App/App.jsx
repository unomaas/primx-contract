//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './App.css';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import AdminLandingPage from '../AdminLandingPage/AdminLandingPage';
import AdminLoginPage from '../AdminLoginPage/AdminLoginPage';
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';
import EstimateCombine from '../EstimateCombine/EstimateCombine';
import AdminOrders from '../AdminOrders/AdminOrders';
import AdminUpdates from '../AdminUpdates/AdminUpdates';
import AdminUpdatesIndex from '../../pages/AdminUpdates/index.jsx';
import AdminUpdateTypes from '../AdminUpdates/AdminUpdateTypes';
import AdminUpdateLicenses from '../LegacyComponents/AdminUpdateLicenses.jsx';
// import AdminUpdateMaterials from '../AdminUpdates/AdminUpdateMaterials';
import AdminUpdateMarkup from '../LegacyComponents/AdminUpdateMarkup';
import AdminUpdateShipping from '../LegacyComponents/AdminUpdateShipping';
import SystemAdmin from '../AdminUpdates/SystemAdmin';
import MuiSnackbarManager from '../MuiSnackbarManager/MuiSnackbarManager';
import MuiBackdropManager from '../MuiBackdropManager/MuiBackdropManager';
import Error404Page from '../../routes/Error404Page';
// import ProtectedRoute from '../../routes/ProtectedRoute';
import SysAdminRoute from '../../routes/SysAdminRoute';
import LicenseeRoute from '../../routes/LicenseeRoute';
import LicenseeAccounts from '../AdminLicenseeAccounts/LicenseeAccounts';
import LicenseePortal from '../LicenseePortal/LicenseePortal';
import LicenseeLoginPage from '../LicenseePortal/LicenseeLoginPage';
import TopLoadingDiv from '../MuiBackdropManager/TopLoadingDiv';
// import AdminUpdateDestinations from '../../pages/AdminUpdates/ShippingDestinations/index.jsx'
// import AdminUpdateCustoms from '../../pages/AdminUpdates/CustomsDuties/index.jsx'
// import ProductContainers from '../../pages/AdminUpdates/ProductContainers/index.jsx';
// import DosageRates from '../../pages/AdminUpdates/DosageRates/index.jsx';
// import Regions from '../../pages/AdminUpdates/Regions/index.jsx';
// import PricingLog from '../../pages/PricingLog/index.jsx';
// import UpdatePricing from '../../pages/UpdatePricing/index.jsx';
// ⬇ Dependent Functionality:
import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../MuiStyling/MuiStyling';
import { Buffer } from "buffer";

import AdminRoute, { adminRoutes } from '../../routes/AdminRoute';
import RegionalAdminRoute, { regionalAdminRoutes } from '../../routes/RegionalAdminRoute.jsx';
import ProtectedRoute, { protectedRoutes } from '../../routes/ProtectedRoute';
import LoginForm from '../LoginForm/LoginForm';

Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;
//#endregion ⬆⬆ All document setup above.



function App() {
	//#region ⬇⬇ All state variables below:
	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const backdropState = useSelector(store => store.backdropReducer.backdropReducer);
	const isLoading = useSelector(store => store.backdropReducer.isLoading)
	// ⬇ Runs on page load:
	useEffect(() => {
		dispatch({ type: 'FETCH_USER' })
	}, [dispatch]);
	//#endregion ⬆⬆ All state variables above. 



	// ⬇ Rendering:
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<MuiBackdropManager />
				<TopLoadingDiv />

				<div className="App">

					{/* This manages the Snackbar alerts throughout the app: */}
					<MuiSnackbarManager />

					<Nav />

					<div className="ContentWrapper" style={{ display: `${isLoading}` }}>
						<Switch>
							{/* Visiting localhost:3000 will redirect to localhost:3000/home */}
							<Redirect exact from="/" to="/create" />
							<Redirect exact from="/home" to="/create" />


							<LoginForm exact path="/Login" />

							{/* // ⬇ Any logged in user will be able to view these, whether licensee, region, admin, or super user: */}
							{protectedRoutes.map((route) => (
								<ProtectedRoute
									key={route.path}
									exact
									path={route.path}
									component={route.component}
								/>
							))}

							{/* <LicenseeRoute exact path="/SavedEstimates" >
								<LicenseePortal />
							</LicenseeRoute> */}

							{regionalAdminRoutes.map((route) => (
								<RegionalAdminRoute
									key={route.path}
									exact
									path={route.path}
									component={route.component}
								/>
							))}

							{/* // ⬇ Only Admin users (NOT regional) will  be able to view these: */}
							{adminRoutes.map((route) => (
								<AdminRoute
									key={route.path}
									exact
									path={route.path}
									component={route.component}
								/>
							))}

							<SysAdminRoute exact path="/SystemAdmin" >
								<SystemAdmin />
							</SysAdminRoute>


							{/* If none of the other routes matched, we will show a 404. */}
							<Route render={() => <Error404Page />} />

						</Switch>

						<Footer />
					</div>

				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
