import { React, useState, useEffect } from 'react'
import Select from '@material-ui/core/Select'
import { MenuItem } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export default function AdminUpdates() {
  // defines usehistory
  const history = useHistory();
  //holds value of selection to for page render conditionals
  let [selectedPage, setSelectedPage] = useState("");
  const user = useSelector((store) => store.user);

  //holds values for conditional render boolean
  let [conditionalBool, setConditionalBool] = useState(false);



  //handles values of selected page change on event change
  const handleSelectPage = (event) => {
    setSelectedPage(event.target.value);
  }

  const renderComponent = () => {

    if (selectedPage == 1) {
      history.push('/AdminUpdateLicenses')
    } else if (selectedPage == 2) {
      history.push('/AdminUpdateTypes')
    } else if (selectedPage == 3) {
      history.push('/AdminUpdateShipping')
    } else if (selectedPage == 4) {
      history.push('/AdminUpdateMaterials')
    } else if (selectedPage == 5) {
      history.push('/LicenseeAccounts')
    } else if (selectedPage == 6) {
      history.push('/SystemAdmin')
    }
  }

  // fetches companies on page load for update licenses page
  useEffect(() => {
    renderComponent();
  }, [selectedPage]);


  return (
    <div>
      <h2>Administrator Update Fields</h2>
      {/* drop down for page selection */}
      {/* <FormControl>
        <InputLabel> Select Page </InputLabel> */}
      <Select
        defaultValue={0}
        // value={selectedPage}
        onChange={handleSelectPage}
      >
        <MenuItem key={0} value={0}>Please Select a Category Here</MenuItem>
        <MenuItem key={1} value={1}>Licensees by Company</MenuItem>
        <MenuItem key={2} value={2}>Floor & Placement Types</MenuItem>
        <MenuItem key={3} value={3}>Shipping Costs by Destination</MenuItem>
        <MenuItem key={4} value={4}>Material Costs & Inventory</MenuItem>
        <MenuItem key={5} value={5}>Manage Licensee Accounts</MenuItem>
        {/* Conditional rendering to show system admin portal: */}
        {user.permission_level == '1' && (
          // If user is system admin (permission_level is 1):
          <MenuItem key={6} value={6}>System Admin</MenuItem>
        )}{/* End System Admin conditional rendering. */}
      </Select>
      <br />       <br />      <br />
      {/* </FormControl> */}
      {/* {conditionalBool ? conditionalRender : <></>} */}
    </div>
  )
}
