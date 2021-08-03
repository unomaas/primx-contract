import './AdminEstimatesGrid.css';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
// Material-UI components
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button'
import { useStyles } from '../MuiStyling/MuiStyling';

import swal from 'sweetalert';


// component that renders a Material UI Data Grid, needs an array of estimates as props. gridSource is a string that references which data grid is
// being created, the current strings are 'pending', 'processed', and 'open'
export default function AdminEstimatesGrid({ estimatesArray, gridSource }) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();

    // Create number formatter.
    const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

    // rendering function to display the row's estimate number in a clickable div that will navigate admin to the estimate lookup view for the
    // clicked estimate
    const renderEstimateNumber = (params) => {
        return (
            // on click sends the admin user to the estimate lookup for the clicked estimate number
            <div onClick={
                () => history.push(`/lookup/${params.row.licensee_id}/${params.row.estimate_number}`)
            }
                className="estimate-nav"
            >
                {params.row.estimate_number}
            </div>
        )
    }

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

    // click listener for the process order buttons inside the pending order table
    const handleProcessOrder = (params) => {
        // open a sweetalert message confirming an order as being processed
        swal({
            title: 'Process this order?',
            text: 'This cannot be undone',
            icon: 'warning',
            buttons: ['Cancel', 'Process Order'],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    // params has a key of id which contains the db id for the estimate that corresponds to the button clicked
                    dispatch({ type: 'EDIT_PROCESS_ORDER', payload: params })
                    swal('Order has been processed!', {
                        icon: 'success',
                    })
                } else {
                    swal('Order is still pending');
                }
            });
    }

    // submit handler for in-line cell edits on the data grid
    const handleEditSubmit = ({ id, field, props }) => {
        console.log('in handle edit submit for id, field, props', id, field, props);
        // id argument is the db id of the row being edited, field is the column name, and props.value is the new value after submitting the edit
        dispatch({
            type: 'EDIT_ESTIMATE_DATA', payload: {
                id: id,
                dbColumn: field,
                newValue: props.value
            }
        })
    }

    // columns for Data Grid
    const columns = [
        // estimate and contractor details input by licensee
        {
            field: 'estimate_number',
            headerName: 'Estimate Number',
            width: 300,
            disableClickEventBubbling: true,
            renderCell: renderEstimateNumber // function declared above, creates a div with navigation in each of the estimate number cells
        },
        { field: 'licensee_contractor_name', headerName: 'Licensee/Contractor', width: 175 },
        { field: 'date_created', headerName: 'Date Created', width: 175 },
        { field: 'ship_to_address', headerName: 'Ship To Address', width: 175, editable: true },
        { field: 'ship_to_city', headerName: 'Ship To City', width: 175, editable: true },
        { field: 'ship_to_state_province', headerName: 'State/Province', width: 175 },
        { field: 'zip_postal_code', headerName: 'Zip/Postal Code', width: 175, editable: true },
        { field: 'country', headerName: 'Country', width: 175, editable: true },
        { field: 'anticipated_first_pour_date', headerName: 'Anticipated First Pour', width: 175, editable: true }, // Need edit validation?
        { field: 'project_general_contractor', headerName: 'General Contractor', width: 175, editable: true },
        { field: 'project_manager_name', headerName: 'Project Manager', width: 175, editable: true },
        { field: 'project_manager_email', headerName: 'Project Manager Email', width: 175, editable: true },
        { field: 'project_manager_phone', headerName: 'Project Manager Phone', width: 175, editable: true },
        { field: 'project_name', headerName: 'Project Name', width: 175, editable: true },

        // technical job details input by licensee
        { field: 'measurement_units', headerName: 'Units', width: 100 }, // Editable + validation?
        { field: 'floor_type', headerName: 'Floor Type', width: 175 }, // Editable + validation?
        { field: 'placement_type', headerName: 'Placement Type', width: 175 }, // Editable + validation?
        { field: 'square_feet', headerName: 'Square Feet', width: 175 }, // Editable + validation?
        { field: 'thickness_inches', headerName: 'Thickness(inches)', width: 175 }, // Editable + validation?
        { field: 'square_meters', headerName: 'Square Meters', width: 175 }, // Editable + validation?
        { field: 'thickness_millimeters', headerName: 'Thickness(mm)', width: 175 }, // Editable + validation?
        { field: 'waste_factor_percentage', headerName: 'Waste Factor (%)', width: 175 }, // Editable + validation?
        { field: 'thickened_edge_construction_joint_lineal_feet', headerName: 'Thickened Edge Construction Joint (lineal ft)', width: 175 }, // Editable + validation?
        { field: 'thickened_edge_perimeter_lineal_feet', headerName: 'Thickened Edge Perimeter (lineal ft)', width: 175 }, // Editable + validation?
        { field: 'thickened_edge_construction_joint_lineal_meters', headerName: 'Thickened Edge Construction Joint (lineal m)', width: 175 }, // Editable + validation?
        { field: 'thickened_edge_perimeter_lineal_meters', headerName: 'Thickened Edge Perimeter (lineal m)', width: 175 }, // Editable + validation?
        { field: 'primx_flow_dosage_liters', headerName: 'Flow Dosage (liters)', width: 175 }, // Editable + validation?
        { field: 'primx_steel_fibers_dosage_lbs', headerName: 'Steel Fiber Dosage (lbs)', width: 175 }, // Editable + validation?
        { field: 'primx_steel_fibers_dosage_kgs', headerName: 'Steel Fiber Dosage (kgs)', width: 175 }, // Editable + validation?
        { field: 'primx_cpea_dosage_liters', headerName: 'CPEA Dosage (liters)', width: 175 }, // Editable + validation?

        // All calculated values are listed below
        // PrimX DC calculated values
        { field: 'primx_dc_total_amount_needed', headerName: 'DC Total Amount Needed', width: 175 },
        { field: 'primx_dc_packages_needed', headerName: 'DC Packages Needed', width: 175 },
        { field: 'primx_dc_total_order_quantity', headerName: 'DC Total Order Quantity', width: 175 },
        { field: 'primx_dc_total_materials_price', headerName: 'DC Total Material Price', width: 175 },
        { field: 'primx_dc_containers_needed', headerName: 'DC Containers Needed', width: 175 },
        { field: 'primx_dc_calculated_shipping_estimate', headerName: 'DC Shipping Estimate', width: 175 },
        { field: 'primx_dc_total_cost_estimate', headerName: 'DC Total Cost', width: 175 },

        // PrimX Flow calculated values
        { field: 'primx_flow_total_amount_needed', headerName: 'Flow Total Amount Needed', width: 175 },
        { field: 'primx_flow_packages_needed', headerName: 'Flow Packages Needed', width: 175 },
        { field: 'primx_flow_total_order_quantity', headerName: 'Flow Total Order Quantity', width: 175 },
        { field: 'primx_flow_total_materials_price', headerName: 'Flow Total Material Price', width: 175 },
        { field: 'primx_flow_containers_needed', headerName: 'Flow Containers Needed', width: 175 },
        { field: 'primx_flow_calculated_shipping_estimate', headerName: 'Flow Shipping Estimate', width: 175 },
        { field: 'primx_flow_total_cost_estimate', headerName: 'Flow Total Cost', width: 175 },

        // PrimX Steel Fibers calculated values
        { field: 'primx_steel_fibers_total_amount_needed', headerName: 'Steel Fibers Total Amount Needed', width: 175 },
        { field: 'primx_steel_fibers_packages_needed', headerName: 'Steel Fibers Packages Needed', width: 175 },
        { field: 'primx_steel_fibers_total_order_quantity', headerName: 'Steel Fibers Total Order Quantity', width: 175 },
        { field: 'primx_steel_fibers_total_materials_price', headerName: 'Steel Fibers Total Material Price', width: 175 },
        { field: 'primx_steel_fibers_containers_needed', headerName: 'Steel Fibers Containers Needed', width: 175 },
        { field: 'primx_steel_fibers_calculated_shipping_estimate', headerName: 'Steel Fibers Shipping Estimate', width: 175 },
        { field: 'primx_steel_fibers_total_cost_estimate', headerName: 'Steel Fibers Total Cost', width: 175 },

        // PrimX Ultracure Blankets calculated values
        { field: 'primx_ultracure_blankets_total_amount_needed', headerName: 'Ultracure Blankets Total Amount Needed', width: 175 },
        { field: 'primx_ultracure_blankets_packages_needed', headerName: 'Ultracure Blankets Packages Needed', width: 175 },
        { field: 'primx_ultracure_blankets_total_order_quantity', headerName: 'Ultracure Blankets Total Order Quantity', width: 175 },
        { field: 'primx_ultracure_blankets_total_materials_price', headerName: 'Ultracure Blankets Total Material Price', width: 175 },
        { field: 'primx_ultracure_blankets_total_cost_estimate', headerName: 'Ultracure Blankets Total Cost', width: 175 },

        // PrimX CPEA calculated values
        { field: 'primx_cpea_total_amount_needed', headerName: 'CPEA Total Amount Needed', width: 175 },
        { field: 'primx_cpea_packages_needed', headerName: 'CPEA Packages Needed', width: 175 },
        { field: 'primx_cpea_total_order_quantity', headerName: 'CPEA Total Order Quantity', width: 175 },
        { field: 'primx_cpea_total_materials_price', headerName: 'CPEA Total Material Price', width: 175 },
        { field: 'primx_cpea_containers_needed', headerName: 'CPEA Containers Needed', width: 175 },
        { field: 'primx_cpea_calculated_shipping_estimate', headerName: 'CPEA Shipping Estimate', width: 175 },
        { field: 'primx_cpea_total_cost_estimate', headerName: 'CPEA Total Cost', width: 175 },

        // totals and design size
        { field: 'design_cubic_yards_total', headerName: 'Design Volume (cubic yards)', width: 175 },
        { field: 'design_cubic_meters_total', headerName: 'Design Volume (cubic meters)', width: 175 },
        { field: 'design_total_materials_price', headerName: 'Total Materials Sum', width: 175 },
        { field: 'design_total_shipping_estimate', headerName: 'Total Shipping Estimate Sum', width: 175 },
        { field: 'design_total_price_estimate', headerName: 'Total Cost', width: 175 },
    ]

    // add additional columns based on the data source for the data grid
    const addGridColumns = (dataSource) => {
        if (dataSource == 'pending' || dataSource == 'processed') {
            // add the Purchase Order number and the order number to each of the pending and processed tables
            columns.push(
                { field: 'po_number', headerName: 'Purchase Order', width: 175 },
                { field: 'order_number', headerName: 'Order Number', width: 175 }
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
                { field: 'processed_by', headerName: 'Processed By', width: 175 }
            )
        }
    }
    // run the addGridColumns function using the props from table as an argument
    addGridColumns(gridSource);

    // rows for data grid come in as the estimatesArray prop
    let rows = estimatesArray;





    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    }

    return (
        <div
            className={classes.AdminEstimatesGridwrapper}
        >
            <DataGrid
                className={classes.dataGridTables}
                autoHeight
                rows={rows}
                columns={columns}
                pageSize={10}
                checkboxSelection
                onEditCellChangeCommitted={handleEditSubmit}
                components={{
                    Toolbar: CustomToolbar
                }}
            />
        </div>
    )
}