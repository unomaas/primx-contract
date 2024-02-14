//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
// ⬇ Dependent Functionality:
import { React, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import { Button, ButtonGroup, ClickAwayListener, Grow, Fade, Popper, MenuItem, MenuList, Paper, Menu } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useClasses } from '../MuiStyling/MuiStyling';
import swal from 'sweetalert';

export default function GridToolbarSelectDropdown() {

	// ⬇ State variables below: 
	const classes = useClasses();
	const anchorRef = useRef(null);
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const tableData = useSelector(store => store.licenseePortalReducer.tableData);
	const user = useSelector(store => store.user);


	// ⬇ Options for the drop-down menus: 
	let options = [
		"Saved Estimates",
		"Pending Orders",
		"Approved Orders",
		"Archived Orders"
	];

	const onlyOperatesInNorthAmerica = user?.operating_region_ids?.every(region => region === 1 || region === 2);

	if (onlyOperatesInNorthAmerica) {
		options = [
			"Saved Estimates",
			"Archived Orders"
		];
	}

	// ⬇ Handles opening and click away toggles for the pop-up: 
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};


	// ⬇ Handles closing and setting the values from the pop-up: 
	const handleClose = (event, index, value) => {
		// ⬇ If they're clicking the same item, return: 
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		} // End if 
		// ⬇ Dispatch to the reducer to load the appropriate data: 
		if (value && value != tableData) {
			dispatch({ type: 'SET_LICENSEE_PORTAL_TABLE', payload: value });
		} // End if 
		// ⬇ Close the pop-up: 
		setOpen(false);
	}; // End handleClose

	// ⬇ Will let a user arrow down with a keyboard for accessibility:
	const handleListKeyDown = (event) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		} // End if
	} // End 

	// ⬇ Return focus to the button when we transitioned from !open -> open:
	const prevOpen = useRef(open);
	useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		} // End if 
		prevOpen.current = open;
	}, [open]); // End useEffect

	// ⬇ Rendering below:
	return (
		<>
			<Button
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup="true"
				onClick={handleToggle}
				color="primary"
			>
				Viewing {tableData} <ArrowDropDownIcon />
			</Button>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				transition
				disablePortal
				style={{ zIndex: "10" }}
				placement="bottom-end"
			>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps}>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList
									autoFocusItem={open}
									id="menu-list-grow"
									onKeyDown={handleListKeyDown}
								>
									{options.map((option, index) => (
										<MenuItem
											key={option}
											onClick={event => handleClose(event, index, option)}
											selected={option == tableData ? true : false}
										>
											View {option}
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Fade>
				)}
			</Popper>
		</>
	); // End return
} // End component
