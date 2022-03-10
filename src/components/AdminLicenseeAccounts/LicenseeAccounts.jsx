import React from 'react'

//import components
import AdminUpdates from '../AdminUpdates/AdminUpdates';
import LicenseeUpdateUsersGrid from './LicenseeUpdateUsersGrid';
import LicenseeRegisterForm from './LicenseeRegisterForm';
import AdminRegisterForm from '../AdminRegisterForm/AdminRegisterForm';

export default function LicenseeAccounts() {


  return (
    <div>
      <div>
        {/* shows nav dropdown */}
        <AdminUpdates />
      </div>

      <div>
        <LicenseeRegisterForm />
      </div>

      {/* providing some spacing */}
      <br></br>
      <br></br>

      <div>
        {/* grid component where all of the info and work is happening */}
        <LicenseeUpdateUsersGrid />
      </div>
    </div>
  )
}
