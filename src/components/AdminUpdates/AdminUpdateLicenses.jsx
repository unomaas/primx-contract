import React from 'react'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import { useDispatch, useSelector } from 'react-redux';


export default function AdminUpdateLicenses() {

    const dispatch = useDispatch();
    const companies = useSelector(store => store.companies);

    const columns = [
    {field: 'licensee_contractor_name', headerName: 'Company Name', width: 90}
    ];

    let rows = [];

    const handleEditSubmit = ( {id, field, props} ) => {
      console.log('Got to Edit Submit', id, field, props);
      let dataToSend = {};
      companies.forEach(company => {
          if (company.id === id) {
              dataToSend = company;
          }
      })
      for (const key in dataToSend) {
          if (key === field) {
              console.log('Found it! key, value:', key, field);
              dataToSend.key = props.value;
          }
      }
      
      dataToSend[field] = props.value
      console.log('data to send:', dataToSend);
      dispatch({ type: 'EDIT_COMPANY_NAME', payload: dataToSend })
     
    }
  return (
    <div>
        <h2>Update Licensee</h2>
        <input type='text'></input>
        <Button><AddCircleOutlineRoundedIcon/></Button>

        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
            onSelectionModelChange={(e) => 
                setValueChange(e.selectionModel)
            }
            // disablesSelectionOnClick
            // editRowsModel={editRowsModel}
            // onEditRowModelChange={handleEditRowModelChange}
            // onEditCellChange={handleEditCellChange}
            onEditCellChangeCommitted={handleEditSubmit}
        />
    </div>

    
  )
}
