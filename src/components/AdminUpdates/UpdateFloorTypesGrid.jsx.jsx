
import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';
import { useStyles } from '../MuiStyling/MuiStyling';



// component that renders a Material UI Data Grid, needs an array of floor types and placement types as props.
export default function UpdateFloorTypesGrid({floorTypes}) {
 
    // columns for Data Grid
    const floorColumns = [

        {field: 'floor_type', headerName: 'Floor Type', width: 1000}, // Editable + validation?
    ]

    let floorRows = floorTypes

    return (
        <div
          style={{ height: 350, width: '50%'}}
          className="AdminEstimatesGrid-wrapper"
        >
            <DataGrid 
                // className={classes.dataGridTables}
                style={{fontFamily: 'Times New Roman', fontSize: '1em'}}
                rows={floorRows}
                columns={floorColumns}
                pageSize={5}
            />
        </div>
    )
}