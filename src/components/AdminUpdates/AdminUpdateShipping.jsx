import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//components
import AdminUpdates from './AdminUpdates';
import UpdateShippingCostsGrid from './UpdateShippingCostsGrid';

//imports for MUI
import { makeStyles } from '@material-ui/core/styles';



export default function AdminUpdateShipping() {


  return (
    <div>
      <div>
        {/* shows the dropdown menu to navigate to specific updates */}
        <AdminUpdates />
      </div>

      {/* the grid below is being imported in - this grid shows the current shipping lanes and their pricing info */}
      <UpdateShippingCostsGrid />
    </div>
  )
}
