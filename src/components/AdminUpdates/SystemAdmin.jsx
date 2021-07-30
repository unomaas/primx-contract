import React from 'react'


//import components
import AdminUpdates from './AdminUpdates';
import SystemAdminUpdateUsersGrid from './SystemAdminUpdateUsersGrid';
import AdminRegisterForm from '../AdminRegisterForm/AdminRegisterForm';


export default function SystemAdmin() {

  
  return (
    <div>

      <div>
        <AdminUpdates />
      </div>
      
      <div>
        <AdminRegisterForm />
      </div>

      <br></br>
      <br></br>

      <div>
        <SystemAdminUpdateUsersGrid />
      </div>

    </div>
  )
}
