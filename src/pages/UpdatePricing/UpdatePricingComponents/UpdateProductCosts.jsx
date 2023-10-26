
import { React, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import { Button, MenuItem, Menu, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
// import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function UpdateProductCosts() {
	//#region - State Variables Below: 
	const classes = useClasses();
	const dispatch = useDispatch();
	const { viewState, dataState } = useSelector(store => store.pricingLog);
	const productsArray = viewState.newProductCosts;
	//#endregion - End State Variables.

	// ⬇ Logic to handle setting the table rows on first load: 
	const columns = [
		{
			field: 'product_label',
			headerName: 'Product',
			flex: 2,
			headerClassName: classes.header,
		},
		{
			field: 'product_self_cost',
			type: 'number',
			headerName: 'Self Cost',
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
	let rows = productsArray;

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


	const CustomFooter = () => {

		return (
			<div style={{
				flex: "1",
				display: "flex",
				justifyContent: "flex-end",
				height: "52px",
			}}>
				<>
					{/* <Button
						color="primary"
						size="small"
						onClick={() => dispatch({ type: 'SET_PRICING_LOG_VIEW', payload: { updatePricingStep: 2 } })}
					>
						Next <ArrowRightIcon />
					</Button> */}
				</>
			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Table Setup. 


	// ⬇ Submit handler for in-line cell edits on the data grid:
	const handleInCellEditSubmit = ({ id, field, value }) => {
		const product = productsArray.find(product => product.product_id === id);
		// ⬇ If the value is the same as the original, don't submit the edit:
		if (product[field] === value) return;
		// ⬇ If the value is different, modify the product object:
		product[field] = value;
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
					<DataGrid
						className={classes.dataGridTables}
						disableSelectionOnClick
						columns={columns}
						rows={rows}
						getRowId={(row) => row.product_id}
						autoHeight
						onCellEditCommit={handleInCellEditSubmit}
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

