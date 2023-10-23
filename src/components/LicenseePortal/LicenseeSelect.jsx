import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, MenuItem, Popper, Fade, Paper, ClickAwayListener, MenuList } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export default function LicenseeSelect({ companies = [], setSelectedLicenseeId }) {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);
	const [selectedCompany, setSelectedCompany] = useState(companies[0] || null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event, selectedCompany) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);

		if (selectedCompany) {
			setSelectedCompany(selectedCompany);
			setSelectedLicenseeId(selectedCompany.licensee_id);
		}
	};

	const handleListKeyDown = (event) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	};

	const prevOpen = useRef(open);
	useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}
		prevOpen.current = open;
	}, [open]);

	const options = [
		...companies,
	];

	return (
		<>
			<Button
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup="true"
				onClick={handleToggle}
				color="primary"
			>
				{selectedCompany ? `Viewing ${selectedCompany.licensee_contractor_name}` : 'Select a Company'} <ArrowDropDownIcon />
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
									{options.map((option) => (
										<MenuItem
											key={option.licensee_id}
											onClick={(event) => handleClose(event, option)}
											selected={selectedCompany && option.licensee_id === selectedCompany.licensee_id}
										>
											View {option.licensee_contractor_name}
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Fade>
				)}
			</Popper>
		</>
	);
}
