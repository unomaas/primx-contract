import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import Typography from '@material-ui/core/Typography';
// components
import AdminEstimatesGrid from '../AdminEstimatesGrid/AdminEstimatesGrid';

export default function AdminOrders() {
  const dispatch = useDispatch();
  // useSelector looks at the array of estimate objects from adminEstimates reducer
  const estimatesArray = useSelector(store => store.adminEstimates);
  
  useEffect(() => {
    // GET all estimates data on page load
    dispatch({type: 'FETCH_ALL_ESTIMATES' });
  }, [])


  return (
    <div>
      <Typography variant="h3" component="h2" align="center">
        Pending Orders
      </Typography>
      {/* Pending data grid here */}
      <Typography variant="h3" component="h2" align="center">
        Processed Orders
      </Typography>
      {/* Processed data grid here */}
      <Typography variant="h3" component="h2" align="center">
        Open Estimates
      </Typography>
      <AdminEstimatesGrid estimatesArray={estimatesArray} />
    </div>
  )
}
