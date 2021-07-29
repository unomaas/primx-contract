import React from 'react'


//import components
import AdminUpdates from './AdminUpdates';
import SystemAdminUpdateUsersGrid from './SystemAdminUpdateUsersGrid';

export default function SystemAdmin() {

  
  return (
    <div>

      <div>
        <AdminUpdates />
      </div>
      
      <br></br>
      <br></br>


      <div>
        <SystemAdminUpdateUsersGrid />
      </div>

    </div>
  )
}
