//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './AdminEstimatesGrid.css';
// ⬇ Dependent Functionality:
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button'
import { useStyles } from '../MuiStyling/MuiStyling';
import swal from 'sweetalert';


// ⬇ Component that renders a Material UI Data Grid, needs an array of estimates as props. gridSource is a string that references which data grid is being created, the current strings are 'pending', 'processed', and 'open':
export default function AdminEstimatesGrid({ estimatesArray, gridSource }) {
  //#region ⬇⬇ All state variables below:
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  // ⬇ Create number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  //#endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:
  // ⬇ Rendering function to display the row's estimate number in a clickable div that will navigate admin to the estimate lookup view for the clicked estimate:
  const renderEstimateNumber = (params) => {
    return (
      // ⬇ On click sends the admin user to the estimate lookup for the clicked estimate number
      <div onClick={
        () => history.push(`/lookup/${params.row.licensee_id}/${params.row.estimate_number}`)
      }
        className="estimate-nav"
      >
        {params.row.estimate_number}
      </div>
    )
  }

  // ⬇ Function for creating delete button inside a data grid cell
  const addDeleteButton = (params) => {
    return (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDelete(params)}
        className={classes.LexendTeraFont11}
      >
        Delete
      </Button>
    )
  }

  // ⬇ Click listener for delete button
  const handleDelete = (params) => {
    // ⬇ Open sweetalert to confirm order delete
    swal({
      title: `Do you want to delete this estimate?`,
      text: 'This will permanently delete the estimate and cannot be undone.',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // ⬇ Params has a key of id which contains the db id for the estimate that corresponds to the button clicked
        dispatch({ type: 'DELETE_ESTIMATE', payload: params })
        swal(`Estimate has been deleted!`, {
          icon: 'success',
        })
      }
    });
  }

  // ⬇ Rendering function for creating a button inside a data grid cell, to be used on the pending orders grid to process orders
  const renderProcessButton = (params) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleProcessOrder(params)}
        className={classes.LexendTeraFont11}
      >
        Process Order
      </Button>
    )
  }

  // ⬇ Rendering function for creating a button inside a data grid cell, to be used on the open estimates grid to archive estimates
  const renderArchiveButton = (params) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleArchiveEstimate(params)}
        className={classes.LexendTeraFont11}
      >
        Archive
      </Button>
    )
  }

  // ⬇ Click listener for the archive estimates buttons inside the open estimates table
  const handleArchiveEstimate = (params) => {
    // ⬇ Open a sweetalert message confirming an estimate as being archived
    swal({
      title: 'Do you want to archive this estimate?',
      text: 'This marks the estimate as archived and cannot be undone.',
      icon: 'warning',
      buttons: ['Cancel', 'Archive'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // ⬇ Params has a key of id which contains the db id for the estimate that corresponds to the button clicked
        dispatch({ type: 'ARCHIVE_ESTIMATE', payload: params })
        swal('Order has been archived!', {
          icon: 'success',
        })
      }
    });
  }

  // ⬇ Click listener for the process order buttons inside the pending order table
  const handleProcessOrder = (params) => {
    // ⬇ Open a sweetalert message confirming an order as being processed
    swal({
      title: 'Do you want to process this order?',
      text: 'This marks the order as complete and cannot be undone.',
      icon: 'warning',
      buttons: ['Cancel', 'Process Order'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // ⬇ Params has a key of id which contains the db id for the estimate that corresponds to the button clicked
        dispatch({ type: 'EDIT_PROCESS_ORDER', payload: params })
        swal('Order has been processed!', {
          icon: 'success',
        })
      }
    });
  }

  // ⬇ Submit handler for in-line cell edits on the data grid:
  const handleEditSubmit = ({ id, field, value }) => {
    // ⬇ ID argument is the db id of the row being edited, field is the column name, and value is the new value after submitting the edit
    dispatch({
      type: 'EDIT_ESTIMATE_DATA', payload: {
        id: id,
        dbColumn: field,
        newValue: value
      }
    })
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    )
  }
  //#endregion ⬆⬆ Event handlers above. 


  //#region ⬇⬇ MUI Data Grid specifications below:
  // ⬇ Columns for Data Grid:
  const columns = [
    // ⬇ Estimate and contractor details input by licensee:
    {
      field: 'estimate_number',
      headerClassName: classes.header,
      headerName: 'Estimate Number',
      width: 200,
      disableClickEventBubbling: true,
      renderCell: renderEstimateNumber // function declared above, creates a div with navigation in each of the estimate number cells
    },
    { field: 'licensee_contractor_name', headerClassName: classes.header, headerName: 'Licensee/Contractor', width: 175 },
    { field: 'date_created', headerClassName: classes.header, headerName: 'Date Created', width: 175 },
    { field: 'ship_to_address', headerClassName: classes.header, headerName: 'Ship To Address', width: 175, editable: true },
    { field: 'ship_to_city', headerClassName: classes.header, headerName: 'Ship To City', width: 175, editable: true },
    { field: 'ship_to_state_province', headerClassName: classes.header, headerName: 'State/Province', width: 175 },
    { field: 'zip_postal_code', headerClassName: classes.header, headerName: 'Zip/Postal Code', width: 175, editable: true },
    { field: 'country', headerClassName: classes.header, headerName: 'Country', width: 175, editable: true },
    { field: 'anticipated_first_pour_date', headerClassName: classes.header, headerName: 'Anticipated First Pour', width: 175, editable: true }, // Need edit validation?
    { field: 'project_general_contractor', headerClassName: classes.header, headerName: 'General Contractor', width: 175, editable: true },
    { field: 'project_manager_name', headerClassName: classes.header, headerName: 'Project Manager', width: 175, editable: true },
    { field: 'project_manager_email', headerClassName: classes.header, headerName: 'Project Manager Email', width: 175, editable: true },
    { field: 'project_manager_phone', headerClassName: classes.header, headerName: 'Project Manager Phone', width: 175, editable: true },
    { field: 'project_name', headerClassName: classes.header, headerName: 'Project Name', width: 175, editable: true },

    // ⬇ Technical job details input by licensee
    { field: 'measurement_units', headerClassName: classes.header, headerName: 'Units', width: 100 }, // Editable + validation?
    { field: 'floor_type', headerClassName: classes.header, headerName: 'Floor Type', width: 175 }, // Editable + validation?
    { field: 'placement_type', headerClassName: classes.header, headerName: 'Placement Type', width: 175 }, // Editable + validation?
    { field: 'square_feet', headerClassName: classes.header, headerName: 'Square Feet', width: 175, editable: true }, // Editable + validation?
    { field: 'thickness_inches', headerClassName: classes.header, headerName: 'Thickness(inches)', width: 175, editable: true }, // Editable + validation?
    { field: 'square_meters'.toLocaleString('en-US'), headerClassName: classes.header, headerName: 'Square Meters', width: 175, editable: true }, // Editable + validation?
    { field: 'thickness_millimeters', headerClassName: classes.header, headerName: 'Thickness(mm)', width: 175, editable: true }, // Editable + validation?
    { field: 'waste_factor_percentage', headerClassName: classes.header, headerName: 'Waste Factor (%)', width: 175, editable: true }, // Editable + validation?
    { field: 'thickened_edge_construction_joint_lineal_feet', headerClassName: classes.header, headerName: 'Thickened Edge Construction Joint (lineal ft)', width: 175, editable: true }, // Editable + validation?
    { field: 'thickened_edge_perimeter_lineal_feet', headerClassName: classes.header, headerName: 'Thickened Edge Perimeter (lineal ft)', width: 175, editable: true }, // Editable + validation?
    { field: 'thickened_edge_construction_joint_lineal_meters', headerClassName: classes.header, headerName: 'Thickened Edge Construction Joint (lineal m)', width: 175, editable: true }, // Editable + validation?
    { field: 'thickened_edge_perimeter_lineal_meters', headerClassName: classes.header, headerName: 'Thickened Edge Perimeter (lineal m)', width: 175, editable: true }, // Editable + validation?
    { field: 'primx_flow_dosage_liters', headerClassName: classes.header, headerName: 'Flow Dosage (liters)', width: 175, editable: true }, // Editable + validation?
    { field: 'primx_steel_fibers_dosage_lbs', headerClassName: classes.header, headerName: 'Steel Fiber Dosage (lbs)', width: 175, editable: true }, // Editable + validation?
    { field: 'primx_steel_fibers_dosage_kgs', headerClassName: classes.header, headerName: 'Steel Fiber Dosage (kgs)', width: 175, editable: true }, // Editable + validation?
    { field: 'primx_cpea_dosage_liters', headerClassName: classes.header, headerName: 'CPEA Dosage (liters)', width: 175, editable: true }, // Editable + validation?

    // ⬇ All calculated values are listed below
    // ⬇ PrimX DC calculated values
    { field: 'primx_dc_total_amount_needed', headerClassName: classes.header, headerName: 'DC Total Amount Needed', width: 175 },
    { field: 'primx_dc_packages_needed', headerClassName: classes.header, headerName: 'DC Packages Needed', width: 175 },
    { field: 'primx_dc_total_order_quantity', headerClassName: classes.header, headerName: 'DC Total Order Quantity', width: 175 },
    { field: 'primx_dc_total_materials_price', headerClassName: classes.header, headerName: 'DC Total Material Price', width: 175 },
    { field: 'primx_dc_containers_needed', headerClassName: classes.header, headerName: 'DC Containers Needed', width: 175 },
    { field: 'primx_dc_calculated_shipping_estimate', headerClassName: classes.header, headerName: 'DC Shipping Estimate', width: 175 },
    { field: 'primx_dc_total_cost_estimate', headerClassName: classes.header, headerName: 'DC Total Cost', width: 175 },

    // ⬇ PrimX Flow calculated values
    { field: 'primx_flow_total_amount_needed', headerClassName: classes.header, headerName: 'Flow Total Amount Needed', width: 175 },
    { field: 'primx_flow_packages_needed', headerClassName: classes.header, headerName: 'Flow Packages Needed', width: 175 },
    { field: 'primx_flow_total_order_quantity', headerClassName: classes.header, headerName: 'Flow Total Order Quantity', width: 175 },
    { field: 'primx_flow_total_materials_price', headerClassName: classes.header, headerName: 'Flow Total Material Price', width: 175 },
    { field: 'primx_flow_containers_needed', headerClassName: classes.header, headerName: 'Flow Containers Needed', width: 175 },
    { field: 'primx_flow_calculated_shipping_estimate', headerClassName: classes.header, headerName: 'Flow Shipping Estimate', width: 175 },
    { field: 'primx_flow_total_cost_estimate', headerClassName: classes.header, headerName: 'Flow Total Cost', width: 175 },

    // ⬇ PrimX Steel Fibers calculated values
    { field: 'primx_steel_fibers_total_amount_needed', headerClassName: classes.header, headerName: 'Steel Fibers Total Amount Needed', width: 175 },
    { field: 'primx_steel_fibers_packages_needed', headerClassName: classes.header, headerName: 'Steel Fibers Packages Needed', width: 175 },
    { field: 'primx_steel_fibers_total_order_quantity', headerClassName: classes.header, headerName: 'Steel Fibers Total Order Quantity', width: 175 },
    { field: 'primx_steel_fibers_total_materials_price', headerClassName: classes.header, headerName: 'Steel Fibers Total Material Price', width: 175 },
    { field: 'primx_steel_fibers_containers_needed', headerClassName: classes.header, headerName: 'Steel Fibers Containers Needed', width: 175 },
    { field: 'primx_steel_fibers_calculated_shipping_estimate', headerClassName: classes.header, headerName: 'Steel Fibers Shipping Estimate', width: 175 },
    { field: 'primx_steel_fibers_total_cost_estimate', headerClassName: classes.header, headerName: 'Steel Fibers Total Cost', width: 175 },

    // PrimX Ultracure Blankets calculated values
    { field: 'primx_ultracure_blankets_total_amount_needed', headerClassName: classes.header, headerName: 'Ultracure Blankets Total Amount Needed', width: 175 },
    { field: 'primx_ultracure_blankets_packages_needed', headerClassName: classes.header, headerName: 'Ultracure Blankets Packages Needed', width: 175 },
    { field: 'primx_ultracure_blankets_total_order_quantity', headerClassName: classes.header, headerName: 'Ultracure Blankets Total Order Quantity', width: 175 },
    { field: 'primx_ultracure_blankets_total_materials_price', headerClassName: classes.header, headerName: 'Ultracure Blankets Total Material Price', width: 175 },
    { field: 'primx_ultracure_blankets_total_cost_estimate', headerClassName: classes.header, headerName: 'Ultracure Blankets Total Cost', width: 175 },

    // PrimX CPEA calculated values
    { field: 'primx_cpea_total_amount_needed', headerClassName: classes.header, headerName: 'CPEA Total Amount Needed', width: 175 },
    { field: 'primx_cpea_packages_needed', headerClassName: classes.header, headerName: 'CPEA Packages Needed', width: 175 },
    { field: 'primx_cpea_total_order_quantity', headerClassName: classes.header, headerName: 'CPEA Total Order Quantity', width: 175 },
    { field: 'primx_cpea_total_materials_price', headerClassName: classes.header, headerName: 'CPEA Total Material Price', width: 175 },
    { field: 'primx_cpea_containers_needed', headerClassName: classes.header, headerName: 'CPEA Containers Needed', width: 175 },
    { field: 'primx_cpea_calculated_shipping_estimate', headerClassName: classes.header, headerName: 'CPEA Shipping Estimate', width: 175 },
    { field: 'primx_cpea_total_cost_estimate', headerClassName: classes.header, headerName: 'CPEA Total Cost', width: 175 },

    // totals and design size
    { field: 'design_cubic_yards_total', headerClassName: classes.header, headerName: 'Design Volume (cubic yards)', width: 175 },
    { field: 'design_cubic_meters_total', headerClassName: classes.header, headerName: 'Design Volume (cubic meters)', width: 175 },
    { field: 'design_total_materials_price', headerClassName: classes.header, headerName: 'Total Materials Sum', width: 175 },
    { field: 'design_total_shipping_estimate', headerClassName: classes.header, headerName: 'Total Shipping Estimate Sum', width: 175 },
    { field: 'design_total_price_estimate', headerClassName: classes.header, headerName: 'Total Cost', width: 175 },
    { field: 'combined_est_1', headerClassName: classes.header, headerName: 'Estimate Number 1', width: 175 },
    { field: 'combined_est_1', headerClassName: classes.header, headerName: 'Estimate Number 2', width: 175 },
    { field: 'combined_est_1', headerClassName: classes.header, headerName: 'Estimate Number 3', width: 175 },
  ]

  // ⬇ Add additional columns based on the data source for the data grid:
  const addGridColumns = (dataSource) => {
    if (dataSource != 'pending' && dataSource != 'processed' && dataSource != 'archived') {
      columns.unshift(
        {
          field: 'archive_button',
          headerClassName: classes.header,
          headerName: 'Archive',
          width: 130,
          renderCell: renderArchiveButton // function declared above, creates a button in each row of the open estimates table
        }
      )
    }

    if (dataSource == 'archived') {
      // ⬇ Add delete button to open estimates
      columns.unshift(
        {
          field: 'delete_button',
          headerClassName: classes.header,
          headerName: 'Delete',
          width: 130,
          disableClickEventBubbling: true,
          renderCell: addDeleteButton
        }
      )
    }
    if (dataSource == 'pending' || dataSource == 'processed') {
      // ⬇ Add the Purchase Order number and the order number to each of the pending and processed tables:
      columns.push(
        { field: 'po_number', headerClassName: classes.header, headerName: 'Purchase Order', width: 175, editable: true }
      )
    }
    if (dataSource == 'pending') {
      // ⬇ Add the process order button to the beginning of the pending table:
      columns.unshift(
        {
          field: 'process_order_buton',
          headerClassName: classes.header,
          headerName: 'Process Order',
          width: 175,
          disableClickEventBubbling: true,
          renderCell: renderProcessButton // function declared above, creates a button in each row of the pending column
        }
      )
    } else if (dataSource == 'processed') {
      // ⬇ Add the processed by name to the processed table:
      columns.push(
        { field: 'order_number', headerClassName: classes.header, headerName: 'Order Number', width: 175 },
        { field: 'processed_by', headerClassName: classes.header, headerName: 'Processed By', width: 175 }
      )
    }
    // Add and archive button if an open estimate (not pending nor processed)

  }

  // ⬇ Run the addGridColumns function using the props from table as an argument:
  addGridColumns(gridSource);

  // ⬇ Rows for data grid come in as the estimatesArray prop:
  let rows = estimatesArray;
  //#endregion ⬆⬆ MUI Data Grid specifications above. 


  // ⬇ Rendering below:
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
        onCellEditCommit={handleEditSubmit}
        components={{
          Toolbar: CustomToolbar
        }}
      />
    </div>
  )
}