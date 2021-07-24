import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';

// component that renders a Material UI Data Grid, needs an array of estimates as props
export default function AdminEstimatesGrid({estimatesArray}) {


    // columns for Data Grid
    const columns = [
        {field: 'id', headerName: 'ID', width: 100},
        {field: 'estimate_number', headerName: 'Estimate Number', width: 175}
    ]

    // const rows = estimatesArray;
    let rows = [];

    estimatesArray.forEach(estimate => {
        rows.push({
            id: estimate.id,
            estimate_number: estimate.estimate_number
        })
    })


    console.log('estimates array, rows:', estimatesArray, rows);
    return (
        <div style={{ height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                checkboxSelection
            />
        </div>
    )
}