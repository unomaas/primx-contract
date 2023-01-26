import React from 'react'
import AdminUpdates from '../../../components/AdminUpdates/AdminUpdates';
// import ShippingDestinationTable from './ShippingDestinationTable';
import DosageRatesTable from './DosageRatesTable';

export default function index() {
	return (
    <div>
      <div>
        {/* shows the dropdown menu to navigate to specific updates */}
        <AdminUpdates />
      </div>

      {/* the grid below is being imported in - this grid shows the current shipping lanes and their pricing info */}
      <DosageRatesTable />
    </div>
	)
}
