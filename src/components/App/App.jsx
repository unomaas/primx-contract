//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './App.css';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import AboutPage from '../AboutPage/AboutPage';
import AdminLandingPage from '../AdminLandingPage/AdminLandingPage';
import InfoPage from '../InfoPage/InfoPage';
import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import AdminLoginPage from '../AdminLoginPage/AdminLoginPage';
import AdminRegisterPage from '../AdminRegisterPage/AdminRegisterPage';
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';
import AdminOrders from '../AdminOrders/AdminOrders';
import AdminUpdates from '../AdminUpdates/AdminUpdates';
import AdminUpdateTypes from '../AdminUpdates/AdminUpdateTypes';
import AdminUpdateLicenses from '../AdminUpdates/AdminUpdateLicenses';
import AdminUpdateMaterials from '../AdminUpdates/AdminUpdateMaterials';
import AdminUpdateShipping from '../AdminUpdates/AdminUpdateShipping';
import SystemAdmin from '../AdminUpdates/SystemAdmin';

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

            <Route 
              path="/lookup/:licensee_id_searched/:estimate_number_searched"
              children={<EstimateLookup />}
            >
            </Route>

            {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
            {/* // with authRedirect:
            // - if logged in, redirects to "/user"
            // - else shows LoginPage at /login */}
            <Route exact path="/login" >
              <AdminLoginPage />
            </Route>

            {/* Home/Landing Page with Create New or Lookup Estimate: */}
            {/* <Route exact path="/home">
              <LicenseeHomePage />
            </Route> */}

            {/* <Route exact path="/lookup">
              <EstimateLookup />
            </Route> */}

            {/* Visiting localhost:3000/about will show the about page. */}
            {/* // shows AboutPage at all times (logged in or not) */}
            <Route exact path="/about">
              <AboutPage />
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

            {user.id == '1' ?
              <ProtectedRoute exact path="/SystemAdmin" >
                <SystemAdmin />
              </ProtectedRoute>
              : <> </>}

            {/* // logged in shows InfoPage else shows LoginPage */}
            <ProtectedRoute exact path="/info">
              <InfoPage />
            </ProtectedRoute>


            {/* // with authRedirect:
            // - if logged in, redirects to "/user"
            // - else shows RegisterPage at "/registration" */}
            {user.id == '1' ?
              <Route exact path="/registration" >
                <AdminRegisterPage />
              </Route>
              : <></>}

            {/* // with authRedirect:
            // - if logged in, redirects to "/user"
            // - else shows LandingPage at "/home" */}
            {/* <ProtectedRoute exact path="/home" authRedirect="/user">
              <LicenseeHomePage />
            </ProtectedRoute> */}

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
