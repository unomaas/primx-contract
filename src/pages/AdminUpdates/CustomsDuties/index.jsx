import React from 'react'
// import AdminUpdates from '../../../AdminUpdates/AdminUpdates';
// import ShippingDestinationTable from './ShippingDestinationTable';
import CustomsDutiesTable from './CustomsDutiesTable';

export default function index() {
	return (
    <div>
      <div>
        {/* shows the dropdown menu to navigate to specific updates */}
        <AdminUpdates />
      </div>

      {/* the grid below is being imported in - this grid shows the current shipping lanes and their pricing info */}
      <CustomsDutiesTable />
    </div>
	)
}
