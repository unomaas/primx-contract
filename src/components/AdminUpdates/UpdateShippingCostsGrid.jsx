
import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function UpdateShippingCostsGrid({shippingCosts}) {
 
    // columns for Data Grid
    const columns = [

        {field: 'ship_to_state_province', headerName: 'Ship To', width: 300}, // Editable + validation?
        {field: 'dc_price', headerName: 'DC', width: 300}, // Editable + validation?
        {field: 'flow_cpea_price', headerName: 'Flow/CPEA', width: 300}, // Editable + validation?
        {field: 'fibers_price', headerName: 'Fibers', width: 300} // Editable + validation?

    ]

    let rows = shippingCosts

    return (
        <div
          style={{ height: 350, width: '50%'}}
          className="AdminEstimatesGrid-wrapper"
        >
            <DataGrid 
                // className={classes.dataGridTables}
                style={{fontFamily: 'Times New Roman', fontSize: '1em'}}
                rows={rows}
                columns={columns}
                pageSize={5}
            />
        </div>
    )
}