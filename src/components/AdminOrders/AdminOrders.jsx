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
  const allEstimates = useSelector(store => store.adminEstimates);

  // create holding arrays to be filled with estimate objects, then passed as props to create the needed Data Grids
  const [pendingOrders, processedOrders, openEstimates] = [ [], [], [] ];
  
  // break up all estimates into pending orders, processed orders, and open estimates
  allEstimates.forEach(estimate => {
    // sort the estimates into their individual array
    // orders are considered processed if they've been marked_as_ordered by an admin and ordered_by_licensee by a licensee
    if (estimate.marked_as_ordered && estimate.ordered_by_licensee) {
      processedOrders.push(estimate);
    } // orders are considered pending if they've been ordered_by_licensee by a licensee but not yet marked_as_ordered by an admin
    else if (estimate.ordered_by_licensee) {
      pendingOrders.push(estimate);
    } // orders where neither of those are true are considered open
    else {
      openEstimates.push(estimate);
    }
  })

  
  useEffect(() => {
    // GET all estimates data on page load
    dispatch({type: 'FETCH_ALL_ESTIMATES' });
  }, [])

  
  return (
    <div>
      <Typography variant="h3" component="h2" align="center">
        Pending Orders
      </Typography>
      <AdminEstimatesGrid estimatesArray={pendingOrders} gridSource={'pending'}/>

      <Typography variant="h3" component="h2" align="center">
        Processed Orders
      </Typography>
      <AdminEstimatesGrid estimatesArray={processedOrders} gridSource={'processed'}/>

      <Typography variant="h3" component="h2" align="center">
        Open Estimates
      </Typography>
      <AdminEstimatesGrid estimatesArray={openEstimates} gridSource={'open'}/>
    </div>
  )
}
