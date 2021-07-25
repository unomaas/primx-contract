import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';

// component that renders a Material UI Data Grid, needs an array of estimates as props. Table is a string that references which data grid is
// being created, the current strings are 'pending', 'processed', and 'open'
export default function AdminEstimatesGrid({estimatesArray, table}) {

    

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
        {field: 'measurement_units', headerName: 'Units', width: 100, hide: true},
        {field: 'floor_type', headerName: 'Floor Type', width: 175, hide: true},
        {field: 'placement_type', headerName: 'Placement Type', width: 175, hide: true},
        {field: 'square_feet', headerName: 'Square Feet', width: 175, hide: true },
        {field: 'thickness_inches', headerName: 'Thickness(inches)', width: 175, hide: true },
        {field: 'square_meters', headerName: 'Square Meters', width: 175, hide: true },
        {field: 'thickness_millimeters', headerName: 'Thickness(mm)', width: 175, hide: true },
        {field: 'waste_factor_percentage', headerName: 'Waste Factor (%)', width: 175, hide: true },
        {field: 'thickened_edge_construction_joint_lineal_feet', headerName: 'Thickened Edge Construction Joint (lineal ft)', width: 175, hide: true },
        {field: 'thickened_edge_perimeter_lineal_feet', headerName: 'Thickened Edge Perimeter (lineal ft)', width: 175, hide: true },
        {field: 'thickened_edge_construction_joint_lineal_meters', headerName: 'Thickened Edge Construction Joint (lineal m)', width: 175, hide: true },
        {field: 'thickened_edge_perimeter_lineal_meters', headerName: 'Thickened Edge Perimeter (lineal m)', width: 175, hide: true },
        
        
        // {field: '', headerName: '', width: 175, hide: true },
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