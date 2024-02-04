//#region ⬇⬇ Document setup below: 
// ⬇ File setup: 
import './NavDrawer.css';
// ⬇ Dependent functionality:
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Drawer, List, ListItem, Divider, IconButton, Box } from '@material-ui/core';
import { useClasses } from '../MuiStyling/MuiStyling';
// ⬇ Icons:
import MenuIcon from '@material-ui/icons/Menu';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import UpdateIcon from '@material-ui/icons/Update';
import StorageIcon from '@material-ui/icons/Storage'
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SaveIcon from '@material-ui/icons/Save';
import HistoryIcon from '@material-ui/icons/History';
import AutorenewIcon from '@material-ui/icons/Autorenew';
//#endregion ⬆⬆ Document setup above. 



export default function NavDrawer() {
	//#region ⬇⬇ All state variables below:
	const [open, setOpen] = useState(false);
	const classes = useClasses();
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
					{user.user_id ? (
						// If user is logged in:
						<List className={classes.LexendTeraFont} style={{ fontSize: '13px' }}>

							<ListItem button onClick={() => {
								dispatch({ type: "CLEAR_ALL_STALE_DATA" });
								history.push(`/create`)
							}}>
								<NoteAddIcon /> &nbsp;
								<p>Create New Estimate</p>
							</ListItem>

							{/* <ListItem button onClick={() => history.push(`/lookup`)}>
								<SearchIcon /> &nbsp;
								<p>Search For Estimate</p>
							</ListItem> */}

							<ListItem button onClick={() => history.push(`/combine`)}>
								<StorageIcon /> &nbsp;
								<p>Combine Estimates</p>
							</ListItem>

							{user.permission_level != 3 &&

								<ListItem button onClick={() => history.push(`/SavedEstimates`)}>
									<SaveIcon /> &nbsp;
									<p>Saved Estimates</p>
								</ListItem>
							}

							{user.permission_level <= 3 &&
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
								</>

							}

							{user.permission_level <= 2 &&
								<>
									<ListItem button onClick={() => history.push(`/adminupdates`)}>
										<UpdateIcon /> &nbsp;
										<p>Update Items</p>
									</ListItem>

									<ListItem button onClick={() => history.push(`/updatepricing`)}>
										<AutorenewIcon /> &nbsp;
										<p>Set New Pricing</p>
									</ListItem>

									<ListItem button onClick={() => history.push(`/pricinglog`)}>
										<HistoryIcon /> &nbsp;
										<p>Monthly Pricing Log</p>
									</ListItem>
								</>
							}

							{user.permission_level <= 3 &&
								<>
									<ListItem button onClick={() => history.push(`/pricinglog`)}>
										<HistoryIcon /> &nbsp;
										<p>Price By Destination</p>
									</ListItem>
								</>
							}

							{user.permission_level == 1 &&
								<>
									<Divider />
									<ListItem button onClick={() => history.push(`/systemadmin`)}>
										<SupervisorAccountIcon /> &nbsp;
										<p>System Admin</p>
									</ListItem>
								</>
							}

							<Divider />

							<ListItem button onClick={() => {
								dispatch({ type: 'LOGOUT' })
								history.push('/login')
							}}>
								<ExitToAppIcon /> &nbsp;
								<p>Log Out</p>
							</ListItem>

						</List>
					) : (
						// If user is not logged in:
						<List className={classes.LexendTeraFont} style={{ fontSize: '13px' }}>

							<ListItem button onClick={() => history.push(`/create`)}>
								<NoteAddIcon /> &nbsp;
								<p>Create New Estimate</p>
							</ListItem>

							{/* <ListItem button onClick={() => history.push(`/lookup`)}>
								<SearchIcon /> &nbsp;
								<p>Search For Estimate</p>
							</ListItem> */}

							<ListItem button onClick={() => history.push(`/combine`)}>
								<StorageIcon /> &nbsp;
								<p>Combine Estimates</p>
							</ListItem>

							<ListItem button onClick={() => history.push(`/SavedEstimates`)}>
								<SaveIcon /> &nbsp;
								<p>Saved Estimates</p>
							</ListItem>

							<Divider />

							<ListItem button onClick={() => history.push(`/login`)}>
								<ExitToAppIcon /> &nbsp;
								<p>Login</p>
							</ListItem>

						</List>
					)}
					{/* End conditional rendering for menu options. */}

				</div>
			</Drawer>

		</div>
	)
}
