//#region ⬇⬇ Document setup below: 
// ⬇ File setup: 
import './NavDrawer.css';
// ⬇ Dependent functionality:
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Drawer, List, ListItem, Divider, IconButton, Box } from '@material-ui/core';
import { useStyles } from '../MuiStyling/MuiStyling';
// ⬇ Icons:
import MenuIcon from '@material-ui/icons/Menu';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import UpdateIcon from '@material-ui/icons/Update';
import StorageIcon from '@material-ui/icons/Storage'
import HomeIcon from '@material-ui/icons/Home';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
//#endregion ⬆⬆ Document setup above. 



export default function NavDrawer() {
	//#region ⬇⬇ All state variables below:
	const [open, setOpen] = useState(false);
	const classes = useStyles();
	const history = useHistory();
	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	//#endregion ⬆⬆ All state variables above. 


	// ⬇ Rendering:
	return (
		<div className="NavDrawer-wrapper">

			<IconButton
				onClick={() => setOpen(true)}
			>
				<MenuIcon
					className={classes.navBarIcon}
				/>
			</IconButton>

			<Drawer
				anchor="right"
				open={open}
				onClose={() => setOpen(false)}
			// onOpen={() => { }}
			>
				<div className={'NavDrawer-menu'}>
					<Box>
						<img src="./images/PrimXLogo-Spaced-Black-01.svg" height="75"></img>
					</Box>

					<Divider />

					{/* Conditioning rendering for what menu options are: */}
					{user.id ? (
						// If user is logged in:
						<List className={classes.LexendTeraFont} style={{ fontSize: '13px' }}>

							<ListItem button onClick={() => history.push(`/create`)}>
								<AddCircleOutlineOutlinedIcon /> &nbsp;
								<p>Create New Estimate</p>
							</ListItem>

							<ListItem button onClick={() => history.push(`/lookup`)}>
								<SearchIcon /> &nbsp;
								<p>Search For Estimate</p>
							</ListItem>

							<ListItem button onClick={() => history.push(`/combine`)}>
								<StorageIcon /> &nbsp;
								<p>Combine Estimates</p>
							</ListItem>

							<ListItem button onClick={() => history.push(`/LicenseePortal`)}>
								<HomeIcon /> &nbsp;
								<p>Licensee Portal</p>
							</ListItem>

							{/* Conditional rendering to show Admin Links: */}
							{user.permission_level <= '2' &&
								<>
									<Divider />

									<ListItem button onClick={() => history.push(`/user`)}>
										<HomeOutlinedIcon /> &nbsp;
										<p>Admin Dashboard</p>
									</ListItem>

									<ListItem button onClick={() => history.push(`/adminorders`)}>
										<ViewCarouselIcon /> &nbsp;
										<p>View Pipeline</p>
									</ListItem>

									<ListItem button onClick={() => history.push(`/adminupdates`)}>
										<UpdateIcon /> &nbsp;
										<p>Update Items</p>
									</ListItem>
								</>
							} {/* End Admin conditional rendering. */}

							{/* Conditional rendering to show system admin portal: */}
							{user.permission_level == '1' &&
								<>
									<Divider />

									<ListItem button onClick={() => history.push(`/systemadmin`)}>
										<SupervisorAccountIcon /> &nbsp;
										<p>System Admin</p>
									</ListItem>
								</>
							} {/* End System Admin conditional rendering. */}

							<Divider />

							<ListItem button onClick={() => dispatch({ type: 'LOGOUT' })}>
								<ExitToAppIcon /> &nbsp;
								<p>Log Out</p>
							</ListItem>

						</List>
					) : (
						// If user is not logged in:
						<List className={classes.LexendTeraFont} style={{ fontSize: '13px' }}>

							<ListItem button onClick={() => history.push(`/create`)}>
								<AddCircleOutlineOutlinedIcon /> &nbsp;
								<p>Create New Estimate</p>
							</ListItem>

							<ListItem button onClick={() => history.push(`/lookup`)}>
								<SearchIcon /> &nbsp;
								<p>Search For Estimate</p>
							</ListItem>

							<ListItem button onClick={() => history.push(`/combine`)}>
								<StorageIcon /> &nbsp;
								<p>Combine Estimates</p>
							</ListItem>

							<ListItem button onClick={() => history.push(`/LicenseePortal`)}>
								<HomeIcon /> &nbsp;
								<p>Licensee Portal</p>
							</ListItem>

							<Divider />

							<ListItem button onClick={() => history.push(`/login`)}>
								<ExitToAppIcon /> &nbsp;
								<p>Admin Login</p>
							</ListItem>

						</List>
					)}
					{/* End conditional rendering for menu options. */}

				</div>
			</Drawer>

		</div>
	)
}
