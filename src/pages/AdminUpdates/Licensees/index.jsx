import React from 'react'
import AdminUpdates from '../../../components/AdminUpdates/AdminUpdates';
import LicenseesTable from './LicenseesTable';

export default function index() {
  return (
    <div>
      <div>
        <AdminUpdates />
      </div>

      <LicenseesTable />
    </div>
  )
}
