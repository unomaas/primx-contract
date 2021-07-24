import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';

// component that renders a Material UI Data Grid, needs an array of estimates as props
export default function AdminEstimatesGrid({estimatesArray}) {

    

    // columns for Data Grid
    const columns = [
        // estimate/contractor information
        {field: 'estimate_number', headerName: 'Estimate Number', width: 175},
        {field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 175},
        {field: 'date_created', headerName: 'Date Created', width: 175},
        {
            field: 'Shipping_Address', 
            headerName: 'Ship To Address', 
            width: 250,
            valueGetter: (params) => 
                `${params.getValue(params.id, 'ship_to_address') || ''}, ${params.getValue(params.id, 'ship_to_city') || ''},
                ${params.getValue(params.id, 'ship_to_state_province') || ''}, ${params.getValue(params.id, 'zip_postal_code') || ''}
                ${params.getValue(params.id, 'country') || ''
                }`,
        },
        {field: 'anticipated_first_pour_date', headerName: 'Anticipated First Pour', width: 175},
        {field: 'project_general_contractor', headerName: 'General Contractor', width: 175},
        {field: 'project_manager_name', headerName: 'Project Manager', width: 175},
        {field: 'project_manager_email', headerName: 'Project Manager Email', width: 175},
        {field: 'project_manager_phone', headerName: 'Project Manager Phone', width: 175},
        {field: 'project_name', headerName: 'Project Name', width: 175},

        // technical job details
        {field: 'measurement_units', headerName: 'Units', width: 100},
        {field: 'floor_type', headerName: 'Floor Type', width: 175},
        {field: 'placement_type', headerName: 'Placement Type', width: 175},
        

        // {field: '', headerName: '', width: },
    ]

    
    let rows = estimatesArray;


    console.log('estimates array, rows:', estimatesArray);
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