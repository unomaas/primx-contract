import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';


// Material-UI components
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';


// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function SystemAdminUpdateUserGrid() {

    useEffect(() => {
        // GET all user data on page load
        dispatch({type: 'FETCH_USERINFO'});
      }, [])

    const dispatch = useDispatch();

 
    const userInfo = useSelector(store => store.userInfoReducer);

    const renderDeleteButton = (params) => {
        return (
            <Button
                variant="contained"
                color="secondary"
                onClick={
                    () => handleDeleteAdmin(params)
                }
            >
                Delete
            </Button>
        )
    }

    // columns for Data Grid
    const columns = [

        {field: 'username', headerName: 'Username', width: 385}, // Editable + validation?
        {   field: '', 
            headerName: 'Delete Admin', 
            width: 1000,
            disableClickEventBubbling: true,
            renderCell: renderDeleteButton // function declared above, creates a button in each row of the pending column
        }
        
    ]

    let rows = userInfo

    console.log('user info in grid component -->', userInfo);

    
    // click listener for the process order buttons inside the pending order table
    const handleDeleteAdmin = (params) => {
        console.log('in handleDeleteAdmin in grid component, params is -->', params);
        // params has a key of id which contains the db id for the estimate that corresponds to the button clicked
        dispatch({ type:'DELETE_ADMIN', payload: params})
    }

    return (
        <div
          style={{ height: 650, width: '40%'}}
          className="AdminEstimatesGrid-wrapper"
        >
            <DataGrid 
                // className={classes.dataGridTables}
                style={{fontFamily: 'Times New Roman', fontSize: '1em'}}
                rows={rows}
                columns={columns}
                pageSize={10}
            />
        </div>
    )
}