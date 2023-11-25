
import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, MenuItem, Menu, Divider, Tooltip, Paper, TablePagination } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
// import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import ImportButton from '../../components/ImportCsvButton';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function UpdateProductCosts() {
	//#region - State Variables Below: 
	const classes = useClasses();
	const dispatch = useDispatch();
	const { viewState, dataState } = useSelector(store => store.pricingLog);
	const productsArray = viewState.newProductCosts;
	//#endregion - End State Variables.

	//#region - Table action state variables: 
	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [tableMounted, setTableMounted] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	//#endregion - Table action state variables.



	// ⬇ Logic to handle setting the table rows on first load: 
	const columns = [
		{
			field: 'product_label',
			headerName: 'Product',
			flex: 2,
			headerClassName: classes.header,
		},
		{
			field: 'destination_country',
			headerName: 'Region',
			disableColumnMenu: true,
			flex: 1,
			headerClassName: classes.header,
		},
		{
			field: 'product_self_cost',
			type: 'number',
			headerName: 'Self Cost',
			sortable: false,
			disableColumnMenu: true,
			flex: 1,
			headerClassName: classes.header,
			editable: true,
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(params.value);
			},
		},
	];
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	// let rows = productsArray;
	const [rows, setRows] = useState(productsArray || [])

	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied product self costs.<br /><br />To edit the product self cost for pricing going forward, double-click on the desired cell.<br /><br />You are able to go forward and backward in the navigation stepper to see the effects of any changes shown in Step 4.</p>}
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

		const mapping = {
			// Header Name : Column Name
			// ! Only include the columns you want updated: 
			"Self Cost": "product_self_cost",
		};


		const menuItems = [
			<ImportButton
				columns={columns}
				rows={rows}
				setRows={setRows}
				mapping={mapping}
			/>,
			<Divider />,
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

		return (
			<GridToolbarContainer >
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
					Product Self Costs
				</div>

				<div style={{
					flex: "1",
					display: "flex",
					justifyContent: "flex-end",
					fontSize: "11px",
					fontFamily: "Lexend Tera",
				}}>

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
				justifyContent: "flex-end",
				// height: "52px",
			}}>
				<CustomPagination />
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Table Setup. 


	// // ⬇ Submit handler for in-line cell edits on the data grid:
	// const handleInCellEditSubmit = ({ id, field, value }) => {

	// 	console.log(`Ryan Here: \n `, {
	// 		id,
	// 		field,
	// 		value,
	// 		productsArray,
	// 	} );
	// 	const product = productsArray.find(product => product.product_region_cost_id === id);

	// 	// ⬇ Check if the product is found
	// 	if (!product) {
	// 		console.error(`Product not found with id: ${id}`);
	// 		return;
	// 	}

	// 	// ⬇ If the value is the same as the original, don't submit the edit:
	// 	if (product[field] === value) return;

	// 	// ⬇ If the value is different, modify the product object:
	// 	product[field] = value;
	// }; // End handleInCellEditSubmit

	// ⬇ Submit handler for in-line cell edits on the data grid:
	const handleInCellEditSubmit = ({ id, field, value }) => {
		const productIndex = productsArray.findIndex(product => product.product_region_cost_id === id);

		// ⬇ Check if the product index is valid
		if (productIndex === -1) {
			console.error(`Product not found with id: ${id}`);
			return;
		}

		// ⬇ If the value is the same as the original, don't submit the edit:
		if (productsArray[productIndex][field] === value) return;

		// ⬇ Create a new array with the updated product
		const updatedProductsArray = [...productsArray];
		updatedProductsArray[productIndex] = {
			...updatedProductsArray[productIndex],
			[field]: value
		};

		// ⬇ Dispatch the updated array to the Redux store
		dispatch({
			type: 'SET_PRICING_LOG_VIEW',
			payload: { newProductCosts: updatedProductsArray }
		});

		setRows(updatedProductsArray);
	}; // End handleInCellEditSubmit


	// ⬇ Rendering below: 
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Paper
				elevation={3}
				className={classes.productsGrid}

			>
				{/* //! When you come back, keep going through the update pricing stepper. Maybe setup the import for product self costs.   */}
				<DataGrid
					className={classes.dataGridTables}
					disableSelectionOnClick
					columns={columns}
					rows={rows}
					getRowId={(row) => row.product_region_cost_id}
					autoHeight
					onCellEditCommit={(data) => handleInCellEditSubmit(data)}
					pagination
					components={{
						Toolbar: CustomToolbar,
						Footer: CustomFooter,
					}}
				// density={"compact"}
				/>

			</Paper>

		</div>
	)
}

