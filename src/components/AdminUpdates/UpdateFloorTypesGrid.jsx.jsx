
import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';
import { useStyles } from '../MuiStyling/MuiStyling';



// component that renders a Material UI Data Grid, needs an array of floor types and placement types as props.
export default function UpdateFloorTypesGrid({floorTypes}) {
    //Material UI classes for data grid
    const classes = useStyles();
 
    // columns for Data Grid
    const floorColumns = [

        {field: 'floor_type', headerName: 'Floor Type', width: 400} // Editable + validation?
    ]
    //rows are the info from the floor types reducer
    let floorRows = floorTypes

    return (
        <div
          className={classes.SystemAdminGrid}
        >
            <DataGrid 
                className={classes.dataGridTables}
                autoHeight
                rows={floorRows}
                columns={floorColumns}
                pageSize={5}
            />
        </div>
    )
}