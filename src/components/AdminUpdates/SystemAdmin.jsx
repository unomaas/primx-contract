import React from 'react'


//import components
import AdminUpdates from './AdminUpdates';
import SystemAdminUpdateUsersGrid from './SystemAdminUpdateUsersGrid';

export default function SystemAdmin() {

  
  return (
    <div>

      <AdminUpdates />

      <div>
        <SystemAdminUpdateUsersGrid />
      </div>

    </div>
  )
}
