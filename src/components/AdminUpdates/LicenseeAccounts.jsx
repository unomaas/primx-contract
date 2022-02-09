import React from 'react'

//import components
import AdminUpdates from './AdminUpdates';
import SystemAdminUpdateUsersGrid from './SystemAdminUpdateUsersGrid';
import AdminRegisterForm from '../AdminRegisterForm/AdminRegisterForm';

export default function LicenseeAccounts() {

	//TODO: When I come back to this, we want to change this portal to Register New Licensee Accounts.  Then from there, we want to GET only where user.permissions_level === 3.  WE want to post to a new API route and have it create users with permissions_level === 3.  We need some sort of SELECT input for hte dropdown to link a company, and that also may require updating the user DB to reference a licensee company id from that table.  Many-to-one relationship.  After that, I think we'd be able to move onto updating a new portal for the search. 

  return (
    <div>
      <div>
        {/* shows nav dropdown */}
        <AdminUpdates />
      </div>

      <div>
        <AdminRegisterForm />
      </div>

      {/* providing some spacing */}
      <br></br>
      <br></br>

      <div>
        {/* grid component where all of the info and work is happening */}
        <SystemAdminUpdateUsersGrid />
      </div>
    </div>
  )
}
