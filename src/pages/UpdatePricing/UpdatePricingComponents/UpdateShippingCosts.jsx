
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, MenuItem, Menu, TablePagination, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';
import Papa from 'papaparse';


export default function UpdateShippingCosts() {
	//#region - State Variables Below: 
	const classes = useStyles();
	const dispatch = useDispatch();
	const { viewState, dataState } = useSelector(store => store.pricingLog);
	const shippingCosts = viewState.newShippingCosts;



	const [selectedRow, setSelectedRow] = useState(null);
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [tableMounted, setTableMounted] = useState(false);
	// columns for Data Grid
	const columns = [

		{
			headerName: 'Destination',
			field: 'destination_name',
			flex: 1.5,
			disableColumnMenu: true,
			headerClassName: classes.header,
		},
		{
			headerName: 'DC 20ft',
			field: 'dc_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'DC 40ft',
			field: 'dc_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Fibers 20ft',
			field: 'fibers_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Fibers 40ft',
			field: 'fibers_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'CPEA 20ft',
			field: 'cpea_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'CPEA 40ft',
			field: 'cpea_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Flow 20ft',
			field: 'flow_20ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
		{
			headerName: 'Flow 40ft',
			field: 'flow_40ft',
			flex: 1,
			headerClassName: classes.header,
			disableColumnMenu: true,
			editable: true,
			sortable: false,
			type: 'number',
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
	]; // End columns
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	const [rows, setRows] = useState(shippingCosts || []);



	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {


		const handleFileUpload = (event) => {
			const file = event.target.files[0];
			parseCSV(file);
		};

		const parseCSV = (file) => {
			Papa.parse(file, {
				complete: updateData,
				header: true
			});
		};

		const validateData = (data) => {

			// ⬇ Create a function to loop through columns and create an array of headerName's: 
			const expectedHeaders = columns.map(column => column.headerName);


			const headers = Object.keys(data[0]).filter(header =>
				!header.startsWith('_') && header.trim() !== ''
			);

			console.log('validateData 1', { headers, expectedHeaders });

			return JSON.stringify(headers) === JSON.stringify(expectedHeaders);
		};

		const cleanData = (data) => {

			let cleanedData = data.filter(row => row["Destination"].trim() !== "");
			console.log('cleanedData1', { cleanedData });

			cleanedData = cleanedData.map(row => {
				// Remove unnecessary columns
				for (let key in row) {
					if (key === "" || key.startsWith("_")) {
						delete row[key];
					}
				}
				return row;
			});

			console.log('cleanedData2', { cleanedData });
			// const expectedHeaders = ["Destination", "DC 20ft", "DC 40ft", "Fibers 20ft", "Fibers 40ft", "CPEA 20ft", "CPEA 40ft", "Flow 20ft", "Flow 40ft"]; 
			// const headers = Object.keys(data[0]);

			return cleanedData;
		};

		const updateRowsWithCSVData = (rows, csvData) => {
			// Mapping between CSV headers and rows keys
			const mapping = {
				"DC 20ft": "dc_20ft",
				"DC 40ft": "dc_40ft",
				"Fibers 20ft": "fibers_20ft",
				"Fibers 40ft": "fibers_40ft",
				"CPEA 20ft": "cpea_20ft",
				"CPEA 40ft": "cpea_40ft",
				"Flow 20ft": "flow_20ft",
				"Flow 40ft": "flow_40ft"
			};
		
			// Loop through each row
			for (let row of rows) {
				// Find the corresponding CSV data entry
				const csvEntry = csvData.find(entry => entry.Destination === row.destination_name);
				if (csvEntry) {
					// Update the prices using the mapping
					for (let csvKey in mapping) {
						row[mapping[csvKey]] = csvEntry[csvKey];
					}
				}
			}
		
			return rows;
		};


		const updateData = (result) => {

			console.log('pre clean', result.data);
			const cleanedData = cleanData(result.data);
			// Here, you can set the state or dispatch an action to update your store
			// For instance: setRows(result.data);

			if (validateData(cleanedData)) {

				console.log('post clean and validated]', cleanedData);
				console.log({rows, cleanedData});

				const updatedRows = updateRowsWithCSVData(rows, cleanedData);
				console.log(`Ryan Here: \n `, {updatedRows});
        setRows(prevRows => [...updatedRows]);  // Update the state with the new rows


			} else {
				console.error("CSV format is incorrect");
			}
		};

		console.log('counting renders', {rows})
		console.count('renders')

		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied shipping costs to each active destination, for each product, in a 20ft or 40ft trailer.<br /><br />To edit the shipping cost for pricing going forward, double-click on the desired cell.<br /><br />You are able to go forward and backward in the navigation stepper to see the effects of any changes shown in Step 4.</p>}
					placement="right-start"
					arrow
				>
					<Button
						color="primary"
						size="small"
					>
						<HelpIcon style={{ marginRight: "8px", marginLeft: "-2px" }} /> Help
					</Button>
				</Tooltip>
			)
		}; // End TableInstructions
		const [anchorEl, setAnchorEl] = useState(null);
		const menuItems = [
			<GridToolbarExport />,
			<Divider />,
			<GridToolbarFilterButton />,
			<Divider />,
			<GridToolbarColumnsButton />,
			<Divider />,
			<GridToolbarDensitySelector />,
			<Divider />,
			<TableInstructions />,
		]; // End menuItems

		// ⬇ Action Handlers: 
		const handleStateFilter = (value) => {
			setStateFilter(value);
		}; // End handleStateFilter

		return (
			<GridToolbarContainer >

				<input
					type="file"
					id="csv-upload"
					style={{ display: 'none' }}
					onChange={handleFileUpload}
				/>


				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "flex-start",
					height: "45px"
				}}>
					<Button
						aria-controls="customized-menu"
						aria-haspopup="true"
						color="primary"
						size="small"
						style={{ marginBottom: "4px" }}
						onClick={event => setAnchorEl(event.currentTarget)}
					>
						<ArrowDropDownIcon /> Options
					</Button>
					<Menu
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={() => setAnchorEl(null)}
						elevation={3}
						getContentAnchorEl={null}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
					>
						{menuItems.map((item, index) => {
							if (item.type === Divider) {
								return <Divider variant="middle" key={index} />
							} else {
								return (
									<MenuItem key={index} disableGutters onClick={() => setAnchorEl(null)}>
										{item}
									</MenuItem>
								)
							}
						})}
					</Menu>
				</div>

				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "center",
					fontSize: "12px",
					fontFamily: "Lexend Tera",
				}}>
					Shipping Costs
				</div>

				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "flex-end",
					fontSize: "11px",
					fontFamily: "Lexend Tera",
				}}>
					<Button
						color="primary"
						onClick={() => document.getElementById('csv-upload').click()}
					>
						Upload CSV
					</Button>
				</div>
			</GridToolbarContainer>
		); // End return
	}; // End CustomToolbar

	const CustomPagination = () => {
		// ⬇ State Variables: 
		const { state, apiRef } = useGridSlotComponentProps();

		//#region - Pagination Action Handlers:
		// ⬇ We only want the page size to be set once, on initial render (otherwise it defaults to 100):
		useEffect(() => {
			if (tableMounted === false) {
				apiRef.current.setPageSize(rowsPerPageOptions[0]);
				setTableMounted(true);
			}; // End if
		}, []); // End useEffect

		const handleOnPageChange = (value) => {
			apiRef.current.setPage(value);
			setSelectedRow(null);
		}; // End handleOnPageChange


		const handleOnRowsPerPageChange = (size) => {
			apiRef.current.setPageSize(size.props.value);
			setRowsPerPage(size.props.value);
			handleOnPageChange(0);
			setSelectedRow(null);
		}; // End handleOnRowsPerPageChange
		//#endregion - Pagination Action Handlers.

		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-end",
			}}>
				<TablePagination
					component='div'
					count={state.rows.totalRowCount}
					page={state.pagination.page}
					onPageChange={(event, value) => handleOnPageChange(value)}
					rowsPerPageOptions={rowsPerPageOptions}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={(event, size) => handleOnRowsPerPageChange(size)}
				/>
			</div>
		); // End return
	}; // End PaginationComponent

	const CustomFooter = () => {




		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-start",
			}}>

				<CustomPagination />
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 


	// ⬇ Submit handler for in-line cell edits on the data grid:
	const handleInCellEditSubmit = ({ id, field, value }) => {
		const destination = shippingCosts.find(destination => destination.destination_id === id);
		// ⬇ If the value is the same as the original, don't submit the edit:
		if (destination[field] === value) return;
		// ⬇ If the value is different, modify the product object:
		destination[field] = value;
	}; // End handleInCellEditSubmit

	// ⬇ Rendering below: 
	return (
		<Paper
			elevation={3}
			className={classes.shippingGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				rows={rows}
				getRowId={(row) => row.shipping_cost_id}
				autoHeight
				onCellEditCommit={handleInCellEditSubmit}
				pagination
				// onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				disableSelectionOnClick
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			// density={"compact"}
			/>

			{/* {selectedRow &&
				<ShippingCostsEditModal />
			} */}


		</Paper>
	)
}

