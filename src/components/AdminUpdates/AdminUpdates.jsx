import React from 'react'
import { useState } from 'react'
import Select from '@material-ui/core/Select'

export default function AdminUpdates() {

  //holds value of selection to for page render conditionals
  let [selectedPage,setSelectedPage] = useState("");

  let [updateLicenseesRender,setUpdateLicenseesRender] = useState(false);
  let [addFloorAndPlacementTypesRender,setAddFloorAndPlacementTypesRender] = useState(false);
  let [updateShippingCostsRender,setUpdateShippingCostsRender] = useState(false);
  let [updateMaterialCostsAndInventoryRender,setUpdateMaterialCostsAndInventoryRender] = useState(false);
  let [systemAdminRender,setSystemAdminRender] = useState(false);

  //handles values of selected page change on event change
  const handleSelectPage = (event) => {
    setSelectedPage(event.target.value);
    // logic for activating render based on selected value
    if (selectedPage == 1) {
      setUpdateLicenseesRender(true);
      setAddFloorAndPlacementTypesRender(false);
      setUpdateShippingCostsRender(false);
      setUpdateMaterialCostsAndInventoryRender(false);
      setSystemAdminRender(false);
    } else if (selectedPage == 2) {
      setUpdateLicenseesRender(false);
      setAddFloorAndPlacementTypesRender(true);
      setUpdateShippingCostsRender(false);
      setUpdateMaterialCostsAndInventoryRender(false);
      setSystemAdminRender(false);
    } else if (selectedPage == 3) {
      setUpdateLicenseesRender(false);
      setAddFloorAndPlacementTypesRender(false);
      setUpdateShippingCostsRender(true);
      setUpdateMaterialCostsAndInventoryRender(false);
      setSystemAdminRender(false);
    } else if (selectedPage == 4) {
      setUpdateLicenseesRender(false);
      setAddFloorAndPlacementTypesRender(false);
      setUpdateShippingCostsRender(false);
      setUpdateMaterialCostsAndInventoryRender(true);
      setSystemAdminRender(false);
    } else if (selectedPage == 5) {
      setUpdateLicenseesRender(false);
      setAddFloorAndPlacementTypesRender(false);
      setUpdateShippingCostsRender(false);
      setUpdateMaterialCostsAndInventoryRender(false);
      setSystemAdminRender(true);
    }
    
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
