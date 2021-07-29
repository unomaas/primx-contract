import React from 'react'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//components
import AdminUpdates from './AdminUpdates';
import UpdateShippingCostsGrid from './UpdateShippingCostsGrid';

//imports for MUI
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import { Block } from '@material-ui/icons';

export default function AdminUpdateShipping() {

  const shippingCosts = useSelector(store => store.shippingCosts);

  const dispatch = useDispatch();



  let [newShippingCost, setNewShippingCost] = useState({ ship_to_state_province: '', dc_price: '', flow_cpea_price: '', fibers_price: '' });


  //styles for MUI
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));
  //defining classes for MUI
  const classes = useStyles();

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

    console.log('in handleSubmit, adding newShippingCost -->', newShippingCost);
    if (newShippingCost.dc_price == '' || newShippingCost.ship_to_state_province == '' || newShippingCost.flow_cpea_price == '' ||
    newShippingCost.fibers_price == '') {
      swal("Error", "You need to input all shipping fields", "error");

    } else {
    // dispatch sent to shippingCost saga, payload as below
    dispatch({ type: 'ADD_SHIPPING_COSTS', payload: newShippingCost });
    swal("Success!", "New Admin Created", "success", {
      button: "OK",
    });
  
    }
  }

  // useEffect(() => {
  //   // GET shipping cost data on page load
  //   dispatch({type: 'FETCH_SHIPPING_COSTS'});
  // }, [])

  console.log('shippingCosts in AdminUpdateShipping -->', shippingCosts)



  return (
    <div>
      <div>
        <AdminUpdates />
      </div>

      <div>
        <h3>Update Shipping Costs</h3>
      </div>

      <div>
        <form className={classes.root} noValidate autoComplete="off">
          <div>
            <div >
              <TextField id="ship-to" className={classes.root} label="Add New Shipping Location" variant="outlined" value={newShippingCost.ship_to_state_province} onChange={handleShipToChange} />
              <TextField id="dc-price" className={classes.root} label="Add New DC Price" variant="outlined" value={newShippingCost.dc_price} onChange={handleDCChange} />
            </div>

            <div >
              <TextField id="flow-cpea" className={classes.root} label="Add New Flow/CPEA Price" variant="outlined" value={newShippingCost.flow_cpea_price} onChange={handleFlowCPEAChange} />
              <TextField id="fiber-ship-price" className={classes.root} label="Add New Fibers Shipping Price" variant="outlined" value={newShippingCost.fibers_price} onChange={handleFibersChange} />
              <br></br>
              <Fab className={classes.root} onClick={handleSubmit} color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </div>
          </div>
        </form>
      </div>
      <UpdateShippingCostsGrid />
    </div>
  )
}
