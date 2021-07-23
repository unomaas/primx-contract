import React from 'react'
import { useState } from 'react'
import Select from '@material-ui/core'

export default function AdminUpdates() {

  let [selectedPage,setSelectedPage] = useState("")

  const handleSelectPage = (event) => {
    setSelectedPage(event.target.value)
    
  }


  return (
    <div>
        <H2>Select Update Field</H2>
        {/* drop down for page selection */}
        <Select value={""} onchange={handleSelectPage}>
          <option>Select Page</option>
          <option value={1}>Update Licensees</option>
          <option value={2}>Add Floor Types/Placement Types</option>
          <option value={3}>Update Shipping Costs</option>
          <option value={4} >Update Material Costs/Inventory</option>
          {/* need to add conditional render for super user for system admin */}
          <option value={5}>System Admin</option>
        </Select>
    </div>
  )
}
