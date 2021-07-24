import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

export default function AdminOrders() {
  const dispatch = useDispatch();
  // useSelector looks at the array of estimate objects from adminEstimates reducer
  const estimatesArray = useSelector(store => store.adminEstimates);
  
  useEffect(() => {
    // GET all estimates data on page load
    dispatch({type: 'FETCH_ALL_ESTIMATES' });
  }, [])


  console.log('estimates array:', estimatesArray);
  return (
    <div>
      
    </div>
  )
}
