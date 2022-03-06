//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
// ⬇ Dependent Functionality:
import { React, useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import { Button, ButtonGroup, ClickAwayListener, Grow, Fade, Popper, MenuItem, MenuList, Paper, Menu } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useStyles } from '../MuiStyling/MuiStyling';
import swal from 'sweetalert';

export default function GridToolbarSelectDropdown() {

	// ⬇ State variables below: 
	const classes = useStyles();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const anchorRef = useRef(null);
	const [open, setOpen] = useState(false);
	// ⬇ Options for the drop-down menus: 
	const options = [
		"Open Orders",
		"Pending Orders",
		"Processed Orders",
		"Archived Orders"
	];

	// ⬇ Handles opening and click away toggles for the pop-up: 
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	// ⬇ Handles closing and setting the values from the pop-up: 
	const handleClose = (event, index, value) => {
		console.log('in handleClose', { event }, { index }, {value});
		// ⬇ If they're clicking the same item, return: 
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		} // End if 
		// ⬇ If they're selecting a new option, make that the selected index:
		if (index || index == 0) {
			setSelectedIndex(index);
		} // End if
		// ⬇ Dispatch to the reducer to load the appropriate data: 
		if (value) {
			// TODO: add a reducer and the logic a couple components up to switch the data appropraitely.  
		}
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
				Viewing {options[selectedIndex]} <ArrowDropDownIcon />
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
											selected={index === selectedIndex}
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
