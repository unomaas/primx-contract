import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminUpdates from './AdminUpdates';

//import sweet alert
import swal from 'sweetalert';

//material ui imports
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid } from '@material-ui/data-grid';

export default function AdminUpdateLicenses() {

  // establish usedispatch as dispatch
  const dispatch = useDispatch();
  // establish companies with a use selector from the companies reducer
  const companies = useSelector(store => store.companies);
  // establish add company input state with use state
  let [companyNameInput,setCompanyNameInput] = useState('');

     //styles for MUI
     const useStyles = makeStyles((theme) => ({
      root: {
        '& > *': {
          margin: theme.spacing(1),
        },
      },
    }));
    //defining classes for MUI
    const classes = useStyles();


  //establish rows with campanies array for datagrid
  let rows = companies;

  //estabish columns for datagrid
  const columns = [
    { field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 300, editable: true },
  ];

  //handles edit of datagrid cells
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
      swal("Error", "You need to input the company name to add", "error");
    } else {
      dispatch({type: 'ADD_COMPANY', payload: companyNameInput});
      setCompanyNameInput('');
      swal("Success!", "New Company Added", "success", {
        button: "OK",
      });
    }

  }


return (
  <div >
    <AdminUpdates />
    <h2>Update Licensee</h2>
    <TextField id="outlined-basic" label="Add New Licensee" variant="outlined" value={companyNameInput} onChange={handleCompanyInputChange}/>
    <Fab className={classes.root} onClick={handleAddCompany} color="primary" aria-label="add">
              <AddIcon />
            </Fab>
    <div style={{ height: 350, width: '28%' }}
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
