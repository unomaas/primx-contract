import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector } from 'react-redux';
import AdminUpdates from '../AdminUpdates/AdminUpdates';
import { useHistory } from "react-router-dom";

// MUI Imports
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


function AdminLandingPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const history = useHistory();

  //styles for MUI
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));
  //defining classes for MUI
  const classes = useStyles();

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
