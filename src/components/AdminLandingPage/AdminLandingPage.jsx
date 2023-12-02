import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useClasses } from '../MuiStyling/MuiStyling';
// MUI Imports
import Button from '@material-ui/core/Button';


function AdminLandingPage() {
  //  renders user reducer info to the DOM
  const user = useSelector((store) => store.user);
  //defines history
  const history = useHistory();
  const classes = useClasses();


  // functions for navigating with the two main buttons
  const goToOrdersAndEstimates = () => {
    history.push('./AdminOrders');
  }
  const goToAdminUpdates = () => {
    history.push('./AdminUpdates');
  }


  return (
    <div className="container">
      <center>
        <h2>
          Welcome, {user?.username?.charAt(0)?.toUpperCase() + user?.username?.slice(1)}!
        </h2>
      </center>

      {/* navigate to orders and estimates page */}
      <h3>View Orders and Estimates</h3>
      <Button
        onClick={goToOrdersAndEstimates}
        variant="contained"
        color="primary"
        className={classes.LexendTeraFont11}
      >
        Go
      </Button>

      {user && user.permission_level <= 2 &&
        <>

          {/* navigate to the admin updates page */}
          <h3>Update Items</h3>
          <Button
            onClick={goToAdminUpdates}
            variant="contained"
            color="primary"
            className={classes.LexendTeraFont11}
          >
            Go
          </Button>

          <h3>Set New Pricing</h3>
          <Button
            onClick={() => { history.push('./UpdatePricing') }}
            variant="contained"
            color="primary"
            className={classes.LexendTeraFont11}
          >
            Go
          </Button>

          <h3>View Pricing Log</h3>
          <Button
            onClick={() => { history.push('./PricingLog') }}
            variant="contained"
            color="primary"
            className={classes.LexendTeraFont11}
          >
            Go
          </Button>
        </>
      }

    </div >
  );
}

// this allows us to use <App /> in index.js
export default AdminLandingPage;
