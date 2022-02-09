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
import AdminUpdateTypes from '../AdminUpdates/AdminUpdateTypes';
import AdminUpdateLicenses from '../AdminUpdates/AdminUpdateLicenses';
import AdminUpdateMaterials from '../AdminUpdates/AdminUpdateMaterials';
import AdminUpdateShipping from '../AdminUpdates/AdminUpdateShipping';
import SystemAdmin from '../AdminUpdates/SystemAdmin';
import MuiSnackbarManager from '../MuiSnackbarManager/MuiSnackbarManager';
import MuiBackdropManager from '../MuiBackdropManager/MuiBackdropManager';
import Error404Page from '../ProtectedRoute/Error404Page';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import SysAdminRoute from '../ProtectedRoute/SysAdminRoute';
import AdminRoute from '../ProtectedRoute/AdminRoute';
import LicenseeRoute from '../ProtectedRoute/LicenseeRoute';
import LicenseeAccounts from '../AdminUpdates/LicenseeAccounts';
// ⬇ Dependent Functionality:
import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Redirect, Switch, } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../MuiStyling/MuiStyling';
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

				<div className="App">


					{/* This manages the Snackbar alerts throughout the app: */}
					<MuiSnackbarManager />


					<Nav />

					<div className="ContentWrapper" style={{ display: `${isLoading}` }}>
						<Switch>
							{/* Visiting localhost:3000 will redirect to localhost:3000/home */}
							<Redirect exact from="/" to="/create" />
							<Redirect exact from="/home" to="/create" />

							{/* Home/Landing Page with Create New or Lookup Estimate: */}
							<Route exact path="/create">
								<EstimateCreate />
							</Route>

							{/* /lookup leads to the search estimate view for finding individual estimates */}
							<Route exact path="/lookup">
								<EstimateLookup />
							</Route>

							{/* This route bring user to specific estimate in /lookup */}
							<Route
								exact path="/lookup/:licensee_id_searched/:estimate_number_searched"
								children={<EstimateLookup />}
							>
							</Route>

							{/* /combine leads to the combine estimate view for combining individual estimates */}
							<Route exact path="/combine">
								<EstimateCombine />
							</Route>

							{/* (For Combinations of 2) This route bring user to specific estimate combinations in /combine */}
							<Route
								exact path="/combine/:licensee_id_searched/:first_estimate_number_combined/:second_estimate_number_combined"
								children={<EstimateCombine />}
							>
							</Route>

							{/* (For Combinations of 3) This route bring user to specific estimate combinations in /combine */}
							<Route
								exact path="/combine/:licensee_id_searched/:first_estimate_number_combined/:second_estimate_number_combined/:third_estimate_number_combined"
								children={<EstimateCombine />}
							>
							</Route>

							<Route exact path="/login" >
								<AdminLoginPage />
							</Route>

							{/* For protected routes, the view could show one of several things on the same route.  Visiting localhost:3000/user will show the AdminLandingPage if the user is logged in.  If the user is not logged in, the ProtectedRoute will show the LoginPage (component).  Even though it seems like they are different pages, the user is always on localhost:3000/user */}
							{/* // logged in shows AdminLandingPage else shows LoginPage */}

							<AdminRoute exact path="/User" >
								<AdminLandingPage />
							</AdminRoute>

							<AdminRoute exact path="/AdminUpdates" >
								<AdminUpdates />
							</AdminRoute>

							<AdminRoute exact path="/AdminOrders" >
								<AdminOrders />
							</AdminRoute>

							<AdminRoute exact path="/AdminUpdateTypes" >
								<AdminUpdateTypes />
							</AdminRoute>

							<AdminRoute exact path="/AdminUpdateLicenses" >
								<AdminUpdateLicenses />
							</AdminRoute>

							<AdminRoute exact path="/AdminUpdateMaterials" >
								<AdminUpdateMaterials />
							</AdminRoute>

							<AdminRoute exact path="/AdminUpdateShipping" >
								<AdminUpdateShipping />
							</AdminRoute>

							<AdminRoute exact path="/AdminOrders">
								<AdminOrders />
							</AdminRoute>

							<AdminRoute exact path="/LicenseeAccounts">
								<LicenseeAccounts />
							</AdminRoute>

							{/* If logged in and user permissions is 1, that makes the super-admin and allows them to see this system admin page */}
							<SysAdminRoute exact path="/SystemAdmin" >
								<SystemAdmin />
							</SysAdminRoute>

							{/* If none of the other routes matched, we will show a 404. */}
							<Route>
								<Error404Page />
							</Route>

						</Switch>

						<Footer />
					</div>

				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
