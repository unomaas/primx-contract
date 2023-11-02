
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// Material-UI components
import { useClasses } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';

export default function UpdateCustomsDuties() {
	//#region - State Variables Below: 
	const classes = useClasses();
	const dispatch = useDispatch();

	const rowsPerPageOptions = [10, 25, 50, 100];
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

	const { viewState, dataState } = useSelector(store => store.pricingLog);
	const customsDuties = viewState.newCustomsDuties;
	;
	// ⬇ Logic to handle setting the table rows on first load: 

	const columns = [
		{
			field: 'duty_label',
			headerName: 'Duty Label',
			flex: 2.5,
			headerClassName: classes.header
		},
		{
			field: 'usa_percent_label',
			headerName: 'USA',
			flex: 1,
			headerClassName: classes.header,
			valueFormatter: (params) => {
				return `${params.value}%`;
			},
			disableColumnMenu: true,
			type: 'number',
			editable: true,
		},
		{
			field: 'can_percent_label',
			headerName: 'Canada',
			flex: 1,
			headerClassName: classes.header,
			valueFormatter: (params) => {
				return `${params.value}%`;
			},
			disableColumnMenu: true,
			type: 'number',
			editable: true,
		},
	]; // End columns
	//#endregion - End State Variables.

	//#region - Table Setup Below:
	// let rows = [];
	// if (customsDuties.length > 0) {
	// 	customsDuties.forEach((duty) => {
	// 		duty.usa_percent_label = (duty.usa_percent * 100);
	// 		duty.CAN_percent_label = (duty.can_percent * 100);
	// 		rows.push(duty)
	// 	}); // End customsDuties.forEach
	// } // End if

	let rows = customsDuties;


	//#region - Custom Table Components Below: 
	// ⬇ A Custom Toolbar specifically made for the Shipping Costs Data Grid:
	const CustomToolbar = () => {
		// ⬇ State Variables:
		const TableInstructions = () => {
			return (
				<Tooltip
					title={<p>This table shows the currently applied Customs percentage applied to each product.<br /><br />To edit the percentage for pricing going forward, double-click on the desired cell.<br /><br />You are able to go forward and backward in the navigation stepper to see the effects of any changes shown in Step 4.</p>}
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
					Customs Duties Percentages
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
				justifyContent: "flex-start",
				height: "52px",
			}}>

			</div>
		); // End return
	}; // End CustomFooter
	//#endregion - Custom Table Components.
	//#endregion - Table Setup. 

	// ⬇ Submit handler for in-line cell edits on the data grid:
	const handleInCellEditSubmit = ({ id, field, value }) => {
		const duty = customsDuties.find(duty => duty.custom_duty_id === id);

		// ⬇ If the value is the same as the original, don't submit the edit:
		if (duty[field] === value) return;

		let percentage = value;
		let decimal = value / 100;
		let value_field = field.slice(0, -6);

		// ⬇ If the value is different, modify the product object:
		duty[field] = value;
		duty[value_field] = decimal;

	}; // End handleInCellEditSubmit

	// ⬇ Rendering below: 
	return (
		<Paper
			elevation={3}
			className={classes.customsGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				columns={columns}
				onCellEditCommit={handleInCellEditSubmit}
				rows={rows}
				disableSelectionOnClick
				getRowId={(row) => row.custom_duty_id}
				autoHeight
				pagination
				// onSelectionModelChange={(id_array) => handleSelectionModelChange(id_array)}
				components={{
					Toolbar: CustomToolbar,
					Footer: CustomFooter,
				}}
			/>


		</Paper>
	)
}

