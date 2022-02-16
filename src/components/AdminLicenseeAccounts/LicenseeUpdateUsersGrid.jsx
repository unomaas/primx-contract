import { React, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material-UI components
import { useStyles } from '../MuiStyling/MuiStyling';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function SystemAdminUpdateUserGrid() {

  const dispatch = useDispatch();

  const classes = useStyles();

  //grabbing all info of users from reducer
  const licenseeInfo = useSelector(store => store.userInfoReducer.licenseeInfo);

  useEffect(() => {
    // GET all user data on page load
    dispatch({ type: 'FETCH_ADMIN_INFO' });
  }, [])

  //function to render the delete button in the datagrid
  const renderDeleteButton = (params) => {
    //we only want the delete button to show if the user has an id greater than 1 - user with id === 1 is the super admin and we don't want the super admin to be deleted
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDeleteAdmin(params)}
          className={classes.LexendTeraFont11}
        >
          Delete
        </Button>
      )
  }

	// TODO: Add a select dropdown and redo the form to add the licensee company appropriately.

  // columns for Data Grid
  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      width: 200,
      headerClassName: classes.header
    },
		{
      field: 'licensee_contractor_name',
      headerName: 'Company Name',
      width: 300,
      headerClassName: classes.header
    },
    {
      field: '',
      headerName: 'Delete',
      width: 148,
      disableClickEventBubbling: true,
      renderCell: renderDeleteButton, // function declared above, creates a button in each row of the pending column
      headerClassName: classes.header
    }
  ]

  //datagrid rows are the information from userInfo reducer
  let rows = licenseeInfo;

  // click listener for the process order buttons inside the pending order table
  const handleDeleteAdmin = (params) => {
      // params has a key of id which contains the db id for the estimate that corresponds to the button clicked
      dispatch({ type: 'DELETE_ADMIN', payload: params });
  }

  return (
    <div
      className={classes.SystemAdminGrid}
    >
      <DataGrid
        className={classes.dataGridTables}
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10,25,50,100]}
      />
    </div>
  )
}