import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';


// Material-UI components
import { DataGrid } from '@material-ui/data-grid';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function SystemAdminUpdateUserGrid() {

    useEffect(() => {
        // GET all user data on page load
        dispatch({type: 'FETCH_USERINFO'});
      }, [])

    const dispatch = useDispatch();

 
    const userInfo = useSelector(store => store.userInfoReducer);

    // columns for Data Grid
    const columns = [

        {field: 'username', headerName: 'Username', width: 200}, // Editable + validation?
        //{field: '', headerName: 'DELETE BUTTON?', width: 200}, // Editable + validation?
        
    ]

    let rows = userInfo

    console.log('user info in grid component -->', userInfo);

    

      console.log('user info in grid component -->', userInfo);

    return (
        <div
          style={{ height: 650, width: '90%'}}
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