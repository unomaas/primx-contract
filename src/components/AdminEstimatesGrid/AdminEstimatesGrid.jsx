//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './AdminEstimatesGrid.css';
// ⬇ Dependent Functionality:
import { React, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button'
import { useStyles } from '../MuiStyling/MuiStyling';
import swal from 'sweetalert';


// ⬇ Component that renders a Material UI Data Grid, needs an array of estimates as props. gridSource is a string that references which data grid is being created, the current strings are 'pending', 'processed', and 'open':
export default function AdminEstimatesGrid({ estimatesArray, gridSource }) {

	//#region ⬇⬇ All state variables below:
	const dispatch = useDispatch();
	const classes = useStyles();
	const history = useHistory();
	const user = useSelector(store => store.user);
	const [pageSize, setPageSize] = useState(10);
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
				Process
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
				dispatch({ type: 'EDIT_PROCESS_ORDER', payload: { params: params, user: user } })
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
				<GridToolbarColumnsButton />
				<GridToolbarFilterButton />
				<GridToolbarDensitySelector />
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
		{ field: 'licensee_contractor_name', headerClassName: classes.header, headerName: 'Licensee/Contractor', width: 200 },
		{ field: 'date_created', headerClassName: classes.header, headerName: 'Date Created', width: 200 },
		{ field: 'ship_to_address', headerClassName: classes.header, headerName: 'Ship To Address', width: 200, },
		{ field: 'ship_to_city', headerClassName: classes.header, headerName: 'Ship To City', width: 200, },
		{ field: 'destination_name', headerClassName: classes.header, headerName: 'State/Province', width: 200 },
		{ field: 'zip_postal_code', headerClassName: classes.header, headerName: 'Zip/Postal Code', width: 200, },
		{ field: 'anticipated_first_pour_date', headerClassName: classes.header, headerName: 'Anticipated First Pour', width: 200, }, // Need edit validation?
		{ field: 'project_general_contractor', headerClassName: classes.header, headerName: 'General Contractor', width: 200, },
		{ field: 'project_manager_name', headerClassName: classes.header, headerName: 'Project Manager', width: 200, },
		{ field: 'project_manager_email', headerClassName: classes.header, headerName: 'Project Manager Email', width: 200, },
		{ field: 'project_manager_phone', headerClassName: classes.header, headerName: 'Project Manager Phone', width: 200, },
		{ field: 'project_name', headerClassName: classes.header, headerName: 'Project Name', width: 200, },

		// ⬇ Technical job details input by licensee
		{ field: 'measurement_units', headerClassName: classes.header, headerName: 'Units', width: 100 }, // Editable + validation?
		{ field: 'floor_type_label', headerClassName: classes.header, headerName: 'Floor Type', width: 200 }, // Editable + validation?
		{ field: 'placement_type_label', headerClassName: classes.header, headerName: 'Placement Type', width: 200 }, // Editable + validation?
		{ field: 'square_feet', headerClassName: classes.header, headerName: 'Square Feet', width: 200, }, // Editable + validation?
		{ field: 'thickness_inches', headerClassName: classes.header, headerName: 'Thickness(inches)', width: 200, }, // Editable + validation?
		{ field: 'square_meters'.toLocaleString('en-US'), headerClassName: classes.header, headerName: 'Square Meters', width: 200, }, // Editable + validation?
		{ field: 'thickness_millimeters', headerClassName: classes.header, headerName: 'Thickness(mm)', width: 200, }, // Editable + validation?
		{ field: 'waste_factor_percentage', headerClassName: classes.header, headerName: 'Waste Factor (%)', width: 200, }, // Editable + validation?
		// { field: 'thickened_edge_construction_joint_lineal_feet', headerClassName: classes.header, headerName: 'Thickened Edge Construction Joint (lineal ft)', width: 200,  }, // Editable + validation?
		// { field: 'thickened_edge_perimeter_lineal_feet', headerClassName: classes.header, headerName: 'Thickened Edge Perimeter (lineal ft)', width: 200,  }, // Editable + validation?
		// { field: 'thickened_edge_construction_joint_lineal_meters', headerClassName: classes.header, headerName: 'Thickened Edge Construction Joint (lineal m)', width: 200,  }, // Editable + validation?
		// { field: 'thickened_edge_perimeter_lineal_meters', headerClassName: classes.header, headerName: 'Thickened Edge Perimeter (lineal m)', width: 200,  }, // Editable + validation?

		// totals and design size
		{ field: 'design_cubic_yards_total', headerClassName: classes.header, headerName: 'Design Volume (cubic yards)', width: 200 },
		{ field: 'design_cubic_meters_total', headerClassName: classes.header, headerName: 'Design Volume (cubic meters)', width: 200 },
		{
			field: 'selected_steel_fiber_dosage',
			headerClassName: classes.header,
			headerName: 'Selected Steel Fiber Dosage',
			width: 200,
			valueFormatter: (params) => { return params?.value?.replaceAll('_', '/') }
		},
	];

	if (gridSource == 'pending' || gridSource == 'processed') {
		columns.push(
			{
				field: 'final_price_per_unit',
				headerClassName: classes.header,
				headerName: 'Final Price Per Unit',
				width: 200,
				valueFormatter: (params) => {
					if (params.value) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value)
				}
			},
			{
				field: 'final_total_project_cost',
				headerClassName: classes.header,
				headerName: 'Final Total Project Cost',
				width: 200,
				valueFormatter: (params) => { if (params.value) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
			},
		)
	} else {
		columns.push(
			{
				field: 'price_per_unit_75_50',
				headerClassName: classes.header,
				headerName: 'Price Per Unit, 75/50 SF Dosage',
				width: 200,
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
			},
			{
				field: 'price_per_unit_90_60',
				headerClassName: classes.header,
				headerName: 'Price Per Unit, 90/60 SF Dosage',
				width: 200,
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
			},
			{
				field: 'total_project_cost_75_50',
				headerClassName: classes.header,
				headerName: 'Total Project Cost, 75/50 SF Dosage',
				width: 200,
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
			},
			{
				field: 'total_project_cost_90_60',
				headerClassName: classes.header,
				headerName: 'Total Project Cost, 90/60 SF Dosage',
				width: 200,
				valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
			},
		);
	}




	columns.push(
		// {
		// 	field: 'price_per_unit_75_50',
		// 	headerClassName: classes.header,
		// 	headerName: 'Price Per Unit, 75/50 SF Dosage',
		// 	width: 200,
		// 	valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
		// },
		// {
		// 	field: 'price_per_unit_90_60',
		// 	headerClassName: classes.header,
		// 	headerName: 'Price Per Unit, 90/60 SF Dosage',
		// 	width: 200,
		// 	valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
		// },
		// {
		// 	field: 'total_project_cost_75_50',
		// 	headerClassName: classes.header,
		// 	headerName: 'Total Project Cost, 75/50 SF Dosage',
		// 	width: 200,
		// 	valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
		// },
		// {
		// 	field: 'total_project_cost_90_60',
		// 	headerClassName: classes.header,
		// 	headerName: 'Total Project Cost, 90/60 SF Dosage',
		// 	width: 200,
		// 	valueFormatter: (params) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(params?.value) }
		// },
		{
			field: 'estimate_number_combined_1',
			headerClassName: classes.header,
			headerName: '1st Estimate Number',
			width: 200
		},
		{
			field: 'estimate_number_combined_1_sf_dosage',
			headerClassName: classes.header,
			headerName: '#1 SF Dosage',
			width: 200, valueFormatter: (params) => { return params?.value?.replaceAll('_', '/') }
		},
		{
			field: 'estimate_number_combined_2',
			headerClassName: classes.header,
			headerName: '2nd Estimate Number',
			width: 200
		},
		{
			field: 'estimate_number_combined_2_sf_dosage',
			headerClassName: classes.header,
			headerName: '#2 SF Dosage',
			width: 200, valueFormatter: (params) => { return params?.value?.replaceAll('_', '/') }
		},
		{
			field: 'estimate_number_combined_3',
			headerClassName: classes.header,
			headerName: '3rd Estimate Number',
			width: 200
		},
		{
			field: 'estimate_number_combined_3_sf_dosage',
			headerClassName: classes.header,
			headerName: '#3 SF Dosage',
			width: 200, valueFormatter: (params) => { return params?.value?.replaceAll('_', '/') }
		},
	);

	// ⬇ Add additional columns based on the data source for the data grid:
	// const addGridColumns = (gridSource) => {
	if (gridSource != 'pending' && gridSource != 'processed' && gridSource != 'archived') {
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

	if (gridSource == 'archived') {
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
	// if (gridSource == 'pending' || gridSource == 'processed') {
	// 	// ⬇ Add the Purchase Order number and the order number to each of the pending and processed tables:
	// 	columns.push(
	// 		{ field: 'po_number', headerClassName: classes.header, headerName: 'Purchase Order', width: 200, }
	// 	);
	// }
	if (gridSource == 'pending') {
		// ⬇ Add the process order button to the beginning of the pending table:
		columns.unshift(
			{
				field: 'process_order_buton',
				headerClassName: classes.header,
				headerName: 'Process Order',
				width: 200,
				disableClickEventBubbling: true,
				renderCell: renderProcessButton // function declared above, creates a button in each row of the pending column
			}
		)
		columns.push(
			{ field: 'po_number', headerClassName: classes.header, headerName: 'Purchase Order', width: 200, }
		);
	}
	if (gridSource == 'processed') {
		columns.push(
			{ field: 'po_number', headerClassName: classes.header, headerName: 'Purchase Order', width: 200, }
		);
		// ⬇ Add the processed by name to the processed table:
		columns.push(
			{ field: 'order_number', headerClassName: classes.header, headerName: 'Order Number', width: 200 },
			{ field: 'username', headerClassName: classes.header, headerName: 'Processed By', width: 200 }
		)
	}
	// Add and archive button if an open estimate (not pending nor processed)

	// }

	// ⬇ Run the addGridColumns function using the props from table as an argument:
	// addGridColumns(gridSource);

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
				getRowId={(row) => row.estimate_id}
				columns={columns}
				rowsPerPageOptions={[10, 25, 50, 100]}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				pagination
				checkboxSelection
				onCellEditCommit={handleEditSubmit}
				components={{
					Toolbar: CustomToolbar
				}}
			/>
		</div>
	)
}