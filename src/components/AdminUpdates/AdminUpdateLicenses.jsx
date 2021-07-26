import React, {useEffect} from 'react'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import Button from '@material-ui/core/Button';
import { DataGrid} from '@material-ui/data-grid';
import { useDispatch, useSelector } from 'react-redux';
import AdminUpdates from './AdminUpdates';

export default function AdminUpdateLicenses() {
    
  
    const dispatch = useDispatch();
    const companies = useSelector(store => store.companies);

    
    let rows = companies;


    const columns = [
      {field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 300, editable: true},
    ];

    const handleEditSubmit = ( {id, field, props} ) => {
      console.log('in handle edit submit for id, field, props', id, field, props);
      // id argument is the db id of the row being edited and props.value is the new value after submitting the edit
      dispatch({ type: 'UPDATE_COMPANY', payload: {
          id: id,
          newValue: props.value
      }})
  }
  return (
    <div >
        <AdminUpdates/>
        <h2>Update Licensee</h2>
        <input type='text'></input>
        <Button><AddCircleOutlineRoundedIcon/></Button>
        <div style={{ height: 350, width: '95%'}}
        className="AdminEstimatesGrid-wrapper">
        <DataGrid 
                style={{fontFamily: 'Times New Roman', fontSize: '1em'}}
                rows={rows}
                columns={columns}
                pageSize={10}
                checkboxSelection
                onEditCellChangeCommitted={handleEditSubmit}
                />
        </div>
    </div>

    
  )
}
