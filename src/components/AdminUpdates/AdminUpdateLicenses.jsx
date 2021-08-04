import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import AdminUpdates from './AdminUpdates';

//material ui imports
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid } from '@material-ui/data-grid';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { useStyles } from '../MuiStyling/MuiStyling';


export default function AdminUpdateLicenses() {

  // establish usedispatch as dispatch
  const dispatch = useDispatch();
  // establish companies with a use selector from the companies reducer
  const companies = useSelector(store => store.companies);
  // establish add company input state with use state
  let [companyNameInput, setCompanyNameInput] = useState('');
  // establish snackbar variables for notifications
  const snack = useSelector(store => store.snackBar);
  //defining classes for MUI
  const classes = useStyles();
  
  useEffect(() => {
    // GET products and prices
    dispatch({ type: 'FETCH_ALL_COMPANIES' });
  }, [])

  // renders a button to mark a licensee as active or inactive
  const renderActivateButton = (params) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleActivateDeactivateClick(params)}
      >
        {/* Render as Deactivate if the licensee is currently active, or as Reactivate if licensee is currently inactive */}
        {params.row.active ? 
        <>
          Deactivate
        </> :
        <>
          Reactivate
        </>
        }
      </Button>
    )
  }

  const handleActivateDeactivateClick = (params) => {
    console.log('Clicked! Params:', params);
  }

  //establish rows with campanies array for datagrid
  let rows = companies;

  //estabish columns for datagrid
  const columns = [
    { field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 300, editable: true },
    {
      field: 'active_inactive',
      headerName: 'Activate/ Deactivate',
      width: 225,
      disableClickEventBubbling: true,
      renderCell: renderActivateButton, // function declared above
      align: 'center'
    },
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
    if (companyNameInput == '') {
      dispatch({ type: 'SET_EMPTY_ERROR' })
    } else {
      dispatch({ type: 'ADD_COMPANY', payload: companyNameInput });
      setCompanyNameInput('');
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({ type: 'SET_CLOSE' })
  };


  return (
    <div >
      <AdminUpdates />
      <h2>Update Licensee</h2>
      <TextField id="outlined-basic" className={classes.AddLicenseeInput} label="Add New Licensee" variant="outlined" value={companyNameInput} onChange={handleCompanyInputChange} />
      <Fab className={classes.AddLicenseeInput} onClick={handleAddCompany} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <div className={classes.licenseeGrid}>
        <DataGrid
          className={classes.dataGridTables}
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={10}
          onEditCellChangeCommitted={handleEditSubmit}
        />
        <Snackbar open={snack.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snack.severity}>
            {snack.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  )
}
