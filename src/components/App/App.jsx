//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './App.css';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import AdminLandingPage from '../AdminLandingPage/AdminLandingPage';
import AdminLoginPage from '../AdminLoginPage/AdminLoginPage';
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';
import AdminOrders from '../AdminOrders/AdminOrders';
import AdminUpdates from '../AdminUpdates/AdminUpdates';
import AdminUpdateTypes from '../AdminUpdates/AdminUpdateTypes';
import AdminUpdateLicenses from '../AdminUpdates/AdminUpdateLicenses';
import AdminUpdateMaterials from '../AdminUpdates/AdminUpdateMaterials';
import AdminUpdateShipping from '../AdminUpdates/AdminUpdateShipping';
import SystemAdmin from '../AdminUpdates/SystemAdmin';
import CombineEstimatesForm from '../CombineEstimatesForm/CombineEstimatesFrom';


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

            {/* /combine leads to the combine estimate view for combining up to 3 estimates */}
            <Route exact path="/combine">
              <CombineEstimatesForm />
            </Route>

            {/* This route bring user to specific estimate in /lookup */}
            <Route
              path="/lookup/:licensee_id_searched/:estimate_number_searched"
              children={<EstimateLookup />}
            >
            </Route>

            <Route exact path="/login" >
              <AdminLoginPage />
            </Route>

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the AdminLandingPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
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
              : <> </>}

            <ProtectedRoute exact path="/adminorders">
              <AdminOrders />
            </ProtectedRoute>

            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>404</h1>
            </Route>

          </Switch>

          <Footer />

        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
