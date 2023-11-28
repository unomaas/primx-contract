import React from 'react'
import AdminUpdates from '../../../components/AdminUpdates/AdminUpdates';
import RegionsTable from './RegionsTable';

export default function index() {
  return (
    <div>
      <div>
        <AdminUpdates />
      </div>

      <RegionsTable />
    </div>
  )
}
