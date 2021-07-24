import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'

export default function AdminOrders() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // GET all estimates data on page load
    dispatch({type: 'FETCH_ALL_ESTIMATES' });
  }, [])


  return (
    <div>
      
    </div>
  )
}
