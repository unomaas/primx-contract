import React from 'react'


//import components
import AdminUpdates from './AdminUpdates';
import SystemAdminUpdateUsersGrid from './SystemAdminUpdateUsersGrid';

export default function SystemAdmin() {

  
  return (
    <div>

      <div>
        {/* shows nav dropdown */}
        <AdminUpdates />
      </div>
      
      <br></br>
      <br></br>


      <div>
        {/* grid component where all of the info and work is happening */}
        <SystemAdminUpdateUsersGrid />
      </div>

    </div>
  )
}
