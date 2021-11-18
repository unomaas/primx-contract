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


// ⬇ Dependent Functionality:
import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Redirect, Switch, } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../MuiStyling/MuiStyling';
//#endregion ⬆⬆ All document setup above.



function App() {
  //#region ⬇⬇ All state variables below:
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  // ⬇ Runs on page load:
  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);
  //#endregion ⬆⬆ All state variables above. 


  // ⬇ Rendering:
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">

          {/* This manages the Snackbar alerts throughout the app: */}
          <MuiSnackbarManager />

          <Nav />

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

            {/* This route bring user to specific estimate in /lookup */}
            <Route
              exact path="/lookup/:licensee_id_searched/:estimate_number_searched/:first_estimate_number_combined/:second_estimate_number_combined"
              children={<EstimateLookup />}
            >
            </Route>

            {/* This route bring user to specific estimate in /lookup */}
            <Route
              exact path="/lookup/:licensee_id_searched/:estimate_number_searched/:first_estimate_number_combined/:second_estimate_number_combined/:third_estimate_number_combined"
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
            <ProtectedRoute exact path="/user" >
              <AdminLandingPage />
            </ProtectedRoute>

            <ProtectedRoute exact path="/AdminUpdates" >
              <AdminUpdates />
            </ProtectedRoute>

            <ProtectedRoute exact path="/AdminOrders" >
              <AdminOrders />
            </ProtectedRoute>

            <ProtectedRoute exact path="/AdminUpdateTypes" >
              <AdminUpdateTypes />
            </ProtectedRoute>

            <ProtectedRoute exact path="/AdminUpdateLicenses" >
              <AdminUpdateLicenses />
            </ProtectedRoute>

            <ProtectedRoute exact path="/AdminUpdateMaterials" >
              <AdminUpdateMaterials />
            </ProtectedRoute>

            <ProtectedRoute exact path="/AdminUpdateShipping" >
              <AdminUpdateShipping />
            </ProtectedRoute>

            {/* If logged in and user id is 1, that makes the super-admin and allows them to see this system admin page */}
            {user.id == '1' ?
              <ProtectedRoute exact path="/SystemAdmin" >
                <SystemAdmin />
              </ProtectedRoute>
              : <>
                <h1>Error 404: Page Not Found.</h1>
                <h3>Please go back and try a different option.</h3>
              </>}

            <ProtectedRoute exact path="/adminorders">
              <AdminOrders />
            </ProtectedRoute>

            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>Error 404: Page Not Found.</h1>
              <h3>Please go back and try a different option.</h3>
            </Route>

          </Switch>

          <Footer />

        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
