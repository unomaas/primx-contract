import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//import components
import AdminUpdates from './AdminUpdates';
import SystemAdminUpdateUsersGrid from './SystemAdminUpdateUsersGrid';
import AdminRegisterForm from '../AdminRegisterForm/AdminRegisterForm';

export default function SystemAdmin() {
  const dispatch = useDispatch();
  useEffect(() => {
    // GET all users on page load
    dispatch({ type: 'FETCH_ADMIN_INFO' });
  }, [])

  return (
    <div>
      <div>
        {/* shows nav dropdown */}
        <AdminUpdates />
      </div>
{/* 
      <div>
        <AdminRegisterForm />
      </div> */}

      {/* providing some spacing */}


      {/* <div> */}
        {/* grid component where all of the info and work is happening */}
        <SystemAdminUpdateUsersGrid />
      {/* </div> */}
    </div>
  )
}
