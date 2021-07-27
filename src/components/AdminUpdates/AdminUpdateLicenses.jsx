import React, {useState} from 'react'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import { useDispatch, useSelector } from 'react-redux';
import AdminUpdates from './AdminUpdates';

export default function AdminUpdateLicenses() {

  // establish usedispatch as dispatch
  const dispatch = useDispatch();
  // establish companies with a use selector from the companies reducer
  const companies = useSelector(store => store.companies);
  // establish add company input state with use state
  let [companyNameInput,setCompanyNameInput] = useState('');



  let rows = companies;


  const columns = [
    { field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 300, editable: true },
  ];

  const handleEditSubmit = ({ id, field, props }) => {
    console.log('in handle edit submit for id, field, props', id, field, props);
    // id argument is the db id of the row being edited and props.value is the new value after submitting the edit
    dispatch({
      type: 'UPDATE_COMPANY', payload: {
        id: id,
        newValue: props.value
      }
    })

  }
  // tracks the state of the company name input in companynameinput variable
  const handleCompanyInputChange = (event) => {
    setCompanyNameInput(event.target.value);
  }
  //handles add company button click that sends payload of company name input to saga for posting to database
  const handleAddCompany = (event) => {
    if(companyNameInput == '') {
      alert('Fill out company name');
    } else {
      dispatch({type: 'ADD_COMPANY', payload: companyNameInput});
      setCompanyNameInput('');
    }

  }


return (
  <div >
    <AdminUpdates />
    <h2>Update Licensee</h2>
    <input onChange={handleCompanyInputChange} type='text'></input>
    <Button onClick={handleAddCompany}><AddCircleOutlineRoundedIcon /></Button>
    <div style={{ height: 350, width: '95%' }}
      className="AdminEstimatesGrid-wrapper">
      <DataGrid
        style={{ fontFamily: 'Times New Roman', fontSize: '1em' }}
        rows={rows}
        columns={columns}
        pageSize={10}
        onEditCellChangeCommitted={handleEditSubmit}
      />
    </div>
  </div>


)
}
