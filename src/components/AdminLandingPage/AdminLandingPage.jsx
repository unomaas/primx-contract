import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

// MUI Imports
import Button from '@material-ui/core/Button';


function AdminLandingPage() {
  //  renders user reducer info to the DOM
  const user = useSelector((store) => store.user);
  //defines history
  const history = useHistory();

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
        <h2>Welcome, {user.username}!</h2>
      </center>

      {/* navigate to orders and estimates page */}
      <h3>View Orders and Estimates</h3>
      <Button
        onClick={goToOrdersAndEstimates}
        variant="contained"
        color="primary"
        className="btn"
        style={{fontFamily: 'Lexend Tera', fontSize: '11px'}}
      >
        Go
      </Button>

      {/* navigate to the admin updates page */}
      <h3>Update Licensee/Costs/Inventory</h3>
      <Button
        onClick={goToAdminUpdates}
        variant="contained"
        color="primary"
        className="btn"
        style={{fontFamily: 'Lexend Tera', fontSize: '11px'}}
      >
        Go
      </Button>

    </div>
  );
}

// this allows us to use <App /> in index.js
export default AdminLandingPage;
