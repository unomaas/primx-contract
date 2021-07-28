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
        // estimate and contractor details input by licensee
        {field: 'estimate_number', headerName: 'Estimate Number', width: 175},
        {field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 175},
        {field: 'date_created', headerName: 'Date Created', width: 175},
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

        // technical job details input by licensee
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
        {field: 'primx_flow_dosage_liters', headerName: 'Flow Dosage (liters)', width: 175, hide: true }, // Editable + validation?
        {field: 'primx_steel_fibers_dosage_lbs', headerName: 'Steel Fiber Dosage (lbs)', width: 175, hide: true }, // Editable + validation?
        {field: 'primx_steel_fibers_dosage_kgs', headerName: 'Steel Fiber Dosage (kgs)', width: 175, hide: true }, // Editable + validation?
        {field: 'primx_cpea_dosage_liters', headerName: 'CPEA Dosage (liters)', width: 175, hide: true }, // Editable + validation?
        
        // All calculated values are listed below
        // PrimX DC calculated values
        {field: 'primx_dc_total_amount_needed', headerName: 'DC Total Amount Needed', width: 175, hide: true }, 
        {field: 'primx_dc_packages_needed', headerName: 'DC Packages Needed', width: 175, hide: true }, 
        {field: 'primx_dc_total_order_quantity', headerName: 'DC Total Order Quantity', width: 175, hide: true }, 
        {field: 'primx_dc_total_materials_price', headerName: 'DC Total Material Price', width: 175, hide: true }, 
        {field: 'primx_dc_containers_needed', headerName: 'DC Containers Needed', width: 175, hide: true }, 
        {field: 'primx_dc_calculated_shipping_estimate', headerName: 'DC Shipping Estimate', width: 175, hide: true }, 
        {field: 'primx_dc_total_cost_estimate', headerName: 'DC Total Cost', width: 175, hide: true }, 

        // PrimX Flow calculated values
        {field: 'primx_flow_total_amount_needed', headerName: 'Flow Total Amount Needed', width: 175, hide: true }, 
        {field: 'primx_flow_packages_needed', headerName: 'Flow Packages Needed', width: 175, hide: true }, 
        {field: 'primx_flow_total_order_quantity', headerName: 'Flow Total Order Quantity', width: 175, hide: true }, 
        {field: 'primx_flow_total_materials_price', headerName: 'Flow Total Material Price', width: 175, hide: true }, 
        {field: 'primx_flow_containers_needed', headerName: 'Flow Containers Needed', width: 175, hide: true }, 
        {field: 'primx_flow_calculated_shipping_estimate', headerName: 'Flow Shipping Estimate', width: 175, hide: true }, 
        {field: 'primx_flow_total_cost_estimate', headerName: 'Flow Total Cost', width: 175, hide: true },
        
        // PrimX Steel Fibers calculated values
        {field: 'primx_steel_fibers_total_amount_needed', headerName: 'Steel Fibers Total Amount Needed', width: 175, hide: true }, 
        {field: 'primx_steel_fibers_packages_needed', headerName: 'Steel Fibers Packages Needed', width: 175, hide: true }, 
        {field: 'primx_steel_fibers_total_order_quantity', headerName: 'Steel Fibers Total Order Quantity', width: 175, hide: true }, 
        {field: 'primx_steel_fibers_total_materials_price', headerName: 'Steel Fibers Total Material Price', width: 175, hide: true }, 
        {field: 'primx_steel_fibers_containers_needed', headerName: 'Steel Fibers Containers Needed', width: 175, hide: true }, 
        {field: 'primx_steel_fibers_calculated_shipping_estimate', headerName: 'Steel Fibers Shipping Estimate', width: 175, hide: true }, 
        {field: 'primx_steel_fibers_total_cost_estimate', headerName: 'Steel Fibers Total Cost', width: 175, hide: true },

        // PrimX Ultracure Blankets calculated values
        {field: 'primx_ultracure_blankets_total_amount_needed', headerName: 'Ultracure Blankets Total Amount Needed', width: 175, hide: true }, 
        {field: 'primx_ultracure_blankets_packages_needed', headerName: 'Ultracure Blankets Packages Needed', width: 175, hide: true }, 
        {field: 'primx_ultracure_blankets_total_order_quantity', headerName: 'Ultracure Blankets Total Order Quantity', width: 175, hide: true }, 
        {field: 'primx_ultracure_blankets_total_materials_price', headerName: 'Ultracure Blankets Total Material Price', width: 175, hide: true }, 
        {field: 'primx_ultracure_blankets_total_cost_estimate', headerName: 'Ultracure Blankets Total Cost', width: 175, hide: true },

        // PrimX CPEA calculated values
        {field: 'primx_cpea_total_amount_needed', headerName: 'CPEA Total Amount Needed', width: 175, hide: true }, 
        {field: 'primx_cpea_packages_needed', headerName: 'CPEA Packages Needed', width: 175, hide: true }, 
        {field: 'primx_cpea_total_order_quantity', headerName: 'CPEA Total Order Quantity', width: 175, hide: true }, 
        {field: 'primx_cpea_total_materials_price', headerName: 'CPEA Total Material Price', width: 175, hide: true }, 
        {field: 'primx_cpea_containers_needed', headerName: 'CPEA Containers Needed', width: 175, hide: true }, 
        {field: 'primx_cpea_calculated_shipping_estimate', headerName: 'CPEA Shipping Estimate', width: 175, hide: true }, 
        {field: 'primx_cpea_total_cost_estimate', headerName: 'CPEA Total Cost', width: 175, hide: true },

        
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