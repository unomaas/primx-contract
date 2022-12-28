import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//components
import AdminUpdates from './AdminUpdates';
import UpdateShippingCostsGrid from './UpdateShippingCostsGrid';

//imports for MUI
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';


export default function AdminUpdateShipping() {
  // establish dispatch for calls to reducers and sagas
  const dispatch = useDispatch();


  // establish shipping cost prices for specific states locally
  let [newShippingCost, setNewShippingCost] = useState({ ship_to_state_province: '', dc_price: '', flow_cpea_price: '', fibers_price: '' });


  //styles for MUI
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    updateShippingSubmit: {
      margin: '-50% 0% -50% 800px',
    },
  }));
  //defining classes for MUI
  const classes = useStyles();

  //the following handle...change functions set the values for newShippingCost object
  const handleShipToChange = (event) => {
    setNewShippingCost({ ...newShippingCost, ship_to_state_province: event.target.value });
  }
  const handleDCChange = (event) => {
    setNewShippingCost({ ...newShippingCost, dc_price: event.target.value });
  }
  const handleFlowCPEAChange = (event) => {
    setNewShippingCost({ ...newShippingCost, flow_cpea_price: event.target.value });
  }
  const handleFibersChange = (event) => {
    setNewShippingCost({ ...newShippingCost, fibers_price: event.target.value });
  }

  //handle the submit of the form
  const handleSubmit = () => {

    //shows an error is one of the fields is empty
    if (newShippingCost.dc_price == '' || newShippingCost.ship_to_state_province == '' || newShippingCost.flow_cpea_price == '' ||
      newShippingCost.fibers_price == '') {
      dispatch({ type: 'SET_EMPTY_ERROR' })

    } else {
      // dispatch sent to shippingCost saga, payload as below
      dispatch({ type: 'ADD_SHIPPING_COSTS', payload: newShippingCost });
      setNewShippingCost({ ship_to_state_province: '', dc_price: '', flow_cpea_price: '', fibers_price: '' });
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: 'SET_CLOSE' })
  };

  return (
    <div>
      <div>
        {/* shows the dropdown menu to navigate to specific updates */}
        <AdminUpdates />
      </div>

      {/* the grid below is being imported in - this grid shows the current shipping lanes and their pricing info */}
      <UpdateShippingCostsGrid />
    </div>
  )
}
