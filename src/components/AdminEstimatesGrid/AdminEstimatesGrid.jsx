import './AdminEstimatesGrid.css';
import React from 'react';
import { useDispatch } from 'react-redux';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button'
import { useStyles } from '../MuiStyling/MuiStyling';



// component that renders a Material UI Data Grid, needs an array of estimates as props. gridSource is a string that references which data grid is
// being created, the current strings are 'pending', 'processed', and 'open'
export default function AdminEstimatesGrid({estimatesArray, gridSource}) {
    const dispatch = useDispatch();
    const classes = useStyles();


    // rendering function for creating a button inside a data grid cell, to be used on the pending orders grid to process orders
    const renderProcessButton = (params) => {
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={
                    () => handleProcessOrder(params)
                }
            >
                Process Order
            </Button>
        )
    }

    // columns for Data Grid
    const columns = [
        // estimate/contractor information
        {field: 'estimate_number', headerName: 'Estimate Number', width: 175},
        {field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 175},
        {field: 'date_created', headerName: 'Date Created', width: 175},
        
        // this is a custom created address that contains the full address in one grid cell, it can't be edited so each component got split up
        // {
        //     field: 'Shipping_Address', // Editable + validation? Will be tricky since this is a value getter
        //     headerName: 'Ship To Address', 
        //     width: 250,
        //     valueGetter: (params) => 
        //         `${params.getValue(params.id, 'ship_to_address') || ''}, ${params.getValue(params.id, 'ship_to_city') || ''},
        //         ${params.getValue(params.id, 'ship_to_state_province') || ''}, ${params.getValue(params.id, 'zip_postal_code') || ''}
        //         ${params.getValue(params.id, 'country') || ''
        //         }`,
        // },

        {field: 'ship_to_address', headerName: 'Ship To Address', width: 175, editable: true},
        {field: 'ship_to_city', headerName: 'Ship To City', width: 175, editable: true},
        {field: 'ship_to_state_province', headerName: 'State/Province', width: 175},
        {field: 'zip_postal_code', headerName: 'Zip/Postal Code', width: 175, editable: true},
        {field: 'country', headerName: 'Country', width: 175, editable: true},
        {field: 'anticipated_first_pour_date', headerName: 'Anticipated First Pour', width: 175, editable: true}, // Need edit validation?
        {field: 'project_general_contractor', headerName: 'General Contractor', width: 175, editable: true},
        {field: 'project_manager_name', headerName: 'Project Manager', width: 175, editable: true},
        {field: 'project_manager_email', headerName: 'Project Manager Email', width: 175, editable: true},
        {field: 'project_manager_phone', headerName: 'Project Manager Phone', width: 175, editable: true},
        {field: 'project_name', headerName: 'Project Name', width: 175, editable: true},

        // technical job details
        {field: 'measurement_units', headerName: 'Units', width: 100, hide: true}, // Editable + validation?
        {field: 'floor_type', headerName: 'Floor Type', width: 175, hide: true}, // Editable + validation?
        {field: 'placement_type', headerName: 'Placement Type', width: 175, hide: true}, // Editable + validation?
        {field: 'square_feet', headerName: 'Square Feet', width: 175, hide: true }, // Editable + validation?
        {field: 'thickness_inches', headerName: 'Thickness(inches)', width: 175, hide: true }, // Editable + validation?
        {field: 'square_meters', headerName: 'Square Meters', width: 175, hide: true }, // Editable + validation?
        {field: 'thickness_millimeters', headerName: 'Thickness(mm)', width: 175, hide: true }, // Editable + validation?
        {field: 'waste_factor_percentage', headerName: 'Waste Factor (%)', width: 175, hide: true }, // Editable + validation?
        {field: 'thickened_edge_construction_joint_lineal_feet', headerName: 'Thickened Edge Construction Joint (lineal ft)', width: 175, hide: true }, // Editable + validation?
        {field: 'thickened_edge_perimeter_lineal_feet', headerName: 'Thickened Edge Perimeter (lineal ft)', width: 175, hide: true }, // Editable + validation?
        {field: 'thickened_edge_construction_joint_lineal_meters', headerName: 'Thickened Edge Construction Joint (lineal m)', width: 175, hide: true }, // Editable + validation?
        {field: 'thickened_edge_perimeter_lineal_meters', headerName: 'Thickened Edge Perimeter (lineal m)', width: 175, hide: true }, // Editable + validation?
        
        // material details ******** Change Shipping Estimate if math function is used based on the current shipping snapshot instead of a total cost ******
        // Prices and shipping estimates are calculated at the time of estimate creation, and will be able to be updated later. Probably shouldn't
        // be editable columns

        // fields commented out are deprecated, the database stores current unit prices for calculation instead of total materials price. The data
        // grid doesn't need to have the unit price, we'll add back in the total materials prices once the math functions are finished
        
        // {field: 'primx_dc_total_materials_price', headerName: 'DC Total Material Price', width: 175, hide: true }, 
        {field: 'primx_dc_shipping_estimate', headerName: 'DC Shipping Estimate', width: 175, hide: true },
        {field: 'primx_flow_dosage_liters', headerName: 'Flow Dosage (liters)', width: 175, hide: true }, // Editable + validation?
        // {field: 'primx_flow_total_materials_price', headerName: 'Flow Total Material Price', width: 175, hide: true },
        {field: 'primx_flow_shipping_estimate', headerName: 'Flow Shipping Estimate', width: 175, hide: true },
        {field: 'primx_steel_fibers_dosage_lbs', headerName: 'Steel Fiber Dosage (lbs)', width: 175, hide: true }, // Editable + validation?
        {field: 'primx_steel_fibers_dosage_kgs', headerName: 'Steel Fiber Dosage (kgs)', width: 175, hide: true }, // Editable + validation?
        // {field: 'primx_steel_fibers_total_materials_price', headerName: 'Steel Fiber Total Material Price', width: 175, hide: true },
        {field: 'primx_steel_fibers_shipping_estimate', headerName: 'Steel Fiber Shipping Estimate', width: 175, hide: true },
        // {field: 'primx_ultracure_blankets_total_materials_price', headerName: 'Ultracure Blankets Total Material Price', width: 175, hide: true },
        {field: 'primx_cpea_dosage_liters', headerName: 'CPEA Dosage (liters)', width: 175, hide: true }, // Editable + validation?
        // {field: 'primx_cpea_total_materials_price', headerName: 'CPEA Total Material Price', width: 175, hide: true },
        {field: 'primx_cpea_shipping_estimate', headerName: 'CPEA Shipping Estimate', width: 175, hide: true },
        // need the math-created fields below
    ]

    // add additional columns based on the data source for the data grid
    const addGridColumns = (dataSource) => {
        if (dataSource == 'pending' || dataSource == 'processed') {
            // add the Purchase Order number and the order number to each of the pending and processed tables
            columns.push( 
                {field: 'po_number', headerName: 'Purchase Order', width: 175, hide: true },
                {field: 'order_number', headerName: 'Order Number', width: 175, hide: true }
            )
        }
        if (dataSource == 'pending') {
            // add the process order button to the beginning of the pending table
            columns.unshift(
                {
                    field: '', 
                    headerName: 'Process Order', 
                    width: 175,
                    disableClickEventBubbling: true,
                    renderCell: renderProcessButton // function declared above, creates a button in each row of the pending column
                }
            )
        } else if (dataSource == 'processed') {
            // ad the processed by name to the processed table
            columns.push(
                {field: 'processed_by', headerName: 'Processed By', width: 175, hide: true }
            )
        }
    }
    // run the addGridColumns function using the props from table as an argument
    addGridColumns(gridSource);

    // rows for data grid come in as the estimatesArray prop
    let rows = estimatesArray;


    // submit handler for in-line cell edits on the data grid
    const handleEditSubmit = ( {id, field, props} ) => {
        console.log('in handle edit submit for id, field, props', id, field, props);
        // id argument is the db id of the row being edited, field is the column name, and props.value is the new value after submitting the edit
        dispatch({ type: 'EDIT_ESTIMATE_DATA', payload: {
            id: id,
            dbColumn: field,
            newValue: props.value
        }})
    }

    // click listener for the process order buttons inside the pending order table
    const handleProcessOrder = (params) => {
        // params has a key of id which contains the db id for the estimate that corresponds to the button clicked
        dispatch({ type:'EDIT_PROCESS_ORDER', payload: params})
    }


    return (
        <div
          style={{ height: 350, width: '95%'}}
          className="AdminEstimatesGrid-wrapper"
        >
            <DataGrid 
                style={{fontFamily: 'Times New Roman', fontSize: '14px'}}
                rows={rows}
                columns={columns}
                pageSize={5}
                checkboxSelection
                onEditCellChangeCommitted={handleEditSubmit}
            />
        </div>
    )
}