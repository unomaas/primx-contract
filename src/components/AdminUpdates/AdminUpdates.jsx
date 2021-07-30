import React from 'react'
import { useState, useEffect } from 'react'
import Select from '@material-ui/core/Select'
import { FormControl, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import AdminUpdateLicenses from './AdminUpdateLicenses'
import AdminUpdateTypes from './AdminUpdateTypes'
import AdminUpdateShipping from './AdminUpdateShipping'
import AdminUpdateMaterials from './AdminUpdateMaterials'
import SystemAdmin from './SystemAdmin'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';





export default function AdminUpdates() {
  // defines dispatch
  const dispatch = useDispatch();
  // defines usehistory
  const history = useHistory();
  //holds value of selection to for page render conditionals
  let [selectedPage, setSelectedPage] = useState("");
  const user = useSelector((store) => store.user);

  //holds values for conditional render boolean
  let [conditionalRender, setConditionalRender] = useState();
  let [conditionalBool, setConditionalBool] = useState(false);



  //handles values of selected page change on event change
  const handleSelectPage = (event) => {
    setSelectedPage(event.target.value);
  }

  const renderComponent = () => {
    setConditionalBool(true);
    console.log(selectedPage)

    if (selectedPage == 1) {
      // setConditionalRender(AdminUpdateLicenses)
      history.push('/AdminUpdateLicenses')
    } else if (selectedPage == 2) {
      // setConditionalRender(AdminUpdateTypes)
      history.push('/AdminUpdateTypes')
    } else if (selectedPage == 3) {
      // setConditionalRender(AdminUpdateShipping)
      history.push('/AdminUpdateShipping')

    } else if (selectedPage == 4) {
      // setConditionalRender(AdminUpdateMaterials)
      history.push('/AdminUpdateMaterials')

    } else if (selectedPage == 5) {
      // setConditionalRender(SystemAdmin)
      history.push('/SystemAdmin')
    }
  }

  // fetches companies on page load for update licenses page
  useEffect(() => {
    renderComponent(), dispatch({ type: 'FETCH_COMPANIES' });
  }, [selectedPage]);


  return (
    <div>
      <h2>Select Update Field</h2>
      {/* drop down for page selection */}
      {/* <FormControl>
        <InputLabel> Select Page </InputLabel> */}
      <Select
        defaultValue={0}
        // value={selectedPage}
        onChange={handleSelectPage}
      >
        <MenuItem key={0} value={0}>Please select an option.</MenuItem>
        <MenuItem key={1} value={1}>Licensees by Company</MenuItem>
        <MenuItem key={2} value={2}>Floor & Placement Types</MenuItem>
        <MenuItem key={3} value={3}>Shipping Costs by State</MenuItem>
        <MenuItem key={4} value={4}>Material Costs & Inventory</MenuItem>
        {/* Conditional rendering to show system admin portal: */}
        {user.id == '1' ? (
          // If user is system admin (id is 1):
          <MenuItem key={5} value={5}>System Admin</MenuItem>
        ) : (
          // If user is NOT system admin (id is anything else):
          <div>
          </div>
        )}
        {/* End System Admin conditional rendering. */}
      </Select>
      {/* </FormControl> */}
      {/* {conditionalBool ? conditionalRender : <></>} */}
    </div>
  )
}
