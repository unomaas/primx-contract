
import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';
import { useStyles } from '../MuiStyling/MuiStyling';



// component that renders a Material UI Data Grid, needs an array of flor types and placement types as props.
export default function UpdatePlacementTypesGrid({placementTypes}) {
 
    // columns for Data Grid
    const placementColumns = [

        {field: 'placement_type', headerName: 'Placement Type', width: 400} // Editable + validation?
    ]
    //rows are the info from the placement type reducer
    let placementRows = placementTypes

    return (
        <div
          style={{ height: 350, width: '50%'}}
          className="AdminEstimatesGrid-wrapper"
        >
            <DataGrid 
                // className={classes.dataGridTables}
                style={{fontFamily: 'Times New Roman', fontSize: '1em'}}
                rows={placementRows}
                columns={placementColumns}
                pageSize={5}
            />
        </div>
    )
}