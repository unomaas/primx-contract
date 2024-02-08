//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './EstimateCreate.css';
// ⬇ Dependent Functionality:
import { Button, FormControl, FormControlLabel, FormHelperText, Grid, MenuItem, Paper, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, TableHead, InputAdornment, Tooltip } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ButtonToggle from '../ButtonToggle/ButtonToggle';
import { useClasses } from '../MuiStyling/MuiStyling';
import EstimateCreateTable from './EstimateCreateTable';
import { differenceBetweenDates } from '../../utils/dateUtils';
//#endregion ⬆⬆ All document setup above.



export default function EstimateCreate() {
	//#region ⬇⬇ All state variables below:
	const dispatch = useDispatch();
	const classes = useClasses();
	const today = new Date().toISOString().substring(0, 10);
	const companies = useSelector(store => store.companies);
	// const shippingDestinations = useSelector(store => store.shippingDestinations.shippingActiveDestinations);
	const floorTypes = useSelector(store => store.floorTypes);
	const placementTypes = useSelector(store => store.placementTypes);
	const estimateData = useSelector(store => store.estimatesReducer.estimatesReducer);
	// const products = useSelector(store => store.products.productsObject);
	const showTables = useSelector(store => store.estimatesReducer.tableState);
	const editState = useSelector(store => store.estimatesReducer.editState);
	const [error, setError] = useState(false);
	const [radioError, setRadioError] = useState("");
	const [leadTime, setLeadTime] = useState("");
	const user = useSelector(store => store.user);
	const [saveButton, setSaveButton] = useState(false);
	const products = useSelector(store => store.products.productsArray);
	const shippingDestinations = useSelector(store => store.shippingDestinations.shippingActiveDestinations);
	const currentMarkup = useSelector(store => store.products.currentMarkupMargin);
	const shippingCosts = useSelector(store => store.shippingCosts.shippingCostsArray);
	const productContainers = useSelector(store => store.productContainers.productContainersArray);
	const dosageRates = useSelector(store => store.dosageRates.dosageRatesArray);
	const customsDuties = useSelector(store => store.customsDuties.customsDutiesArray);
	const [materialsEditWarning, setMaterialsEditWarning] = useState(false);

	// ⬇ Run on page load:
	useEffect(() => {
		dispatch({ type: 'SET_BUTTON_STATE', payload: 'create' }),
			// Fetches and set all fields for dropdown menus
			dispatch({ type: 'FETCH_FIELD_SELECT' }),
			dispatch({ type: 'FETCH_ALL_FOR_CALCULATE' });


	}, []);

	useEffect(() => {
		// ⬇ If the user is logged in, have the company select default to their company:
		if (user && user.licensee_id && companies) {
			handleChange('licensee_id', user.licensee_id);

			const licensee = companies.find(company => company.licensee_id == user.licensee_id);
			// if (licensee?.default_measurement) handleMeasurementUnits(licensee?.default_measurement);
		}; // End if statement
	}, [user, companies])

	useEffect(() => {
		if (
			estimateData.total_project_volume && 
			estimateData.destination_id
		) {
			estimateData.difference_in_months = differenceBetweenDates(estimateData.date_created).total_months;
			dispatch({
				type: 'HANDLE_CALCULATED_ESTIMATE',
				payload: {
					estimate: estimateData,
					options: {
						products: products,
						shippingDestinations: shippingDestinations,
						currentMarkup: currentMarkup,
						shippingCosts: shippingCosts,
						productContainers: productContainers,
						dosageRates: dosageRates,
						customsDuties: customsDuties
					}
				}
			});
			setSaveButton(true);
		}
	}, [estimateData]); 

	let filteredDestinations = shippingDestinations;

	// ⬇ If the user is a licensee, limit the destinations they're allowed to select:
	if (user?.licensee_id && user?.permission_level >= 4 && companies?.length > 0) {
		const licensee = companies.find(company => company.licensee_id === user.licensee_id);

		if (licensee && licensee.operating_regions) {
			// Filter shippingDestinations based on operatingRegions
			filteredDestinations = shippingDestinations.filter(destination =>
				licensee.operating_regions.includes(destination.destination_country)
			);
		}; // End if statement
	} // End if statement
	//#endregion ⬆⬆ All state variables above. 




	//#region ⬇⬇ Event handlers below:
	/** ⬇ timeDifference:
	 * A function to calculate the time difference in weeks between today's date and the first anticipated pour date, to validate whether the job is 8 weeks out or not. 
	 */
	const timeDifference = (chosenDate) => {
		// ⬇ Using the chosen date, run the change handler to set estimateData in the reducer for the chosen date
		handleChange('anticipated_first_pour_date', chosenDate)
		const chosenDateInMilliseconds = Date.parse(chosenDate);
		const todayInMilliseconds = Date.now();
		const differenceInSeconds = (chosenDateInMilliseconds - todayInMilliseconds) / 1000;
		const differenceInWeeks = differenceInSeconds / (60 * 60 * 24 * 7);
		// ⬇ Set lead time state with a rounded number in weeks:
		setLeadTime(Math.abs(Math.round(differenceInWeeks)));
		if (leadTime < 8) {
			dispatch({ type: 'SET_ERROR_LEADTIME' });
		} // End if statement
	} // End timeDifference

	/** ⬇ handleChange:
	 * When the user types, this will set their input to the kit object with keys for each field. 
	 */
	const handleChange = (key, value) => {

		if (key == 'total_project_volume' && editState == true && materialsEditWarning == false) {
			if (!window.confirm(`⚠️ WARNING: Editing the materials included on an already saved estimate will force the estimate to be recalculated at today's current rates, resetting the price guarantee.  Please only click "Save Edits" if you are sure you want to do this, as it is not reversible.  If you do not wish to do this, click "Cancel".`)) return;
			setMaterialsEditWarning(true);
		}; // End if

		// ⬇ If they change the destination while editing, force a recalculate of the estimate price per unit:
		if (key == 'destination_id' && editState == true) {
			estimateData.force_recalculate = true;
		}; // End if

		// ⬇ If they set the destination_id, we need to set the default unit of measurement:
		if (key == 'destination_id') {
			const destination = shippingDestinations.find(destination => destination.destination_id == value);
			if (destination?.default_measurement) handleMeasurementUnits(destination?.default_measurement);
			// return;
		}

		// ⬇ If they're setting the Licensee Id, we want to set the default unit of measurement for that licensee. 
		// if (key === 'licensee_id') {
		// 	// ⬇ Find the Licensee by the ID:
		// 	const licensee = companies.find(company => company.licensee_id == value);
		// 	if (licensee?.default_measurement) handleMeasurementUnits(licensee?.default_measurement);
		// }; // End if

		dispatch({
			type: 'SET_ESTIMATE',
			payload: { key: key, value: value }
		}); // End dispatch
	} // End handleChange

	/** ⬇ handleShipping:
	 * Change handler for the Shipping State/Province dropdown: gets passed the id of the ship to state
	 */
	const handleShipping = (id) => {
		// ⬇ Sends the keys/values to the estimate reducer object: 
		dispatch({
			type: 'SET_ESTIMATE',
			payload: { key: 'destination_id', value: id }
		});

		// If user is in the edit view, recalculate estimate values with new shipping data:
		if (editState) {
			dispatch({
				type: 'HANDLE_CALCULATED_ESTIMATE',
				payload: estimateData
			}); // End dispatch
		} // End if statement
	} // End handleShipping

	/** ⬇ handleMeasurementUnits:
	 * This function will add of metric or imperial costs to the estimateData package depending on their selection of the radio buttons.
	 */
	const handleMeasurementUnits = (units) => {
		// ⬇ Making sure validation doesn't trigger:
		setError(false);
		setRadioError("");

		dispatch({
			type: 'SET_ESTIMATE',
			payload: { key: 'measurement_units', value: units }
		}); // End dispatch

		dispatch({ type: 'CLEAR_CALCULATED_ESTIMATE' });
	} // End handleMeasurementUnits

	/** ⬇ handleSubmit:
	 * When clicked, this will post the object to the DB and send the user back to the dashboard. 
	 */
	const handleSubmit = (event) => {
		// ⬇ Don't refresh until submit:
		event.preventDefault();
		// ⬇ Radio button validation:
		if (!estimateData.measurement_units) {
			setError(true);
			setRadioError("Please select a value.");
		} // ⬇ Dropdown menu validation:
		else if (!estimateData.licensee_id || !estimateData.floor_type_id || !estimateData.placement_type_id || !estimateData.destination_id) {
			dispatch({ type: 'SET_EMPTY_ERROR' });
		} // ⬇ Show table:
		else {
			dispatch({ type: 'SET_TABLE_STATE', payload: true })
			dispatch({ type: 'SET_EDIT_STATE', payload: false })
		} // End else
	} // End handleSubmit
	//#endregion ⬆⬆ Event handles above. 


	// ⬇ Rendering:
	return (
		<div className="EstimateCreate-wrapper">

			<ButtonToggle />

			<br />

			<form onSubmit={handleSubmit}>

				<Grid
					container
					spacing={2}
					justifyContent="center"
				>

					{/* Grid Table #1: Display the Licensee/Project Info Form */}
					<Grid item xs={6}>
						<Paper elevation={3}>
							<TableContainer >
								<h3>Project Information</h3>
								<Table size="small">
									<TableBody>

										<TableRow hover={true}>
											<TableCell><b>Project Name:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('project_name', event.target.value)}
													required
													type="search"
													size="small"
													fullWidth
													value={estimateData.project_name}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Contractor Name:</b></TableCell>
											<TableCell>
												<Select
													onChange={event => handleChange('licensee_id', event.target.value)}
													required
													size="small"
													fullWidth
													value={estimateData.licensee_id}
												// disabled={user?.licensee_id ? true : false}
												>
													<MenuItem key="0" value="0">Please Select</MenuItem>
													{companies.map(companies => {

														if (user?.licensee_id && companies.licensee_id !== user.licensee_id) return;

														return (<MenuItem key={companies.licensee_id} value={companies.licensee_id}>{companies.licensee_contractor_name}</MenuItem>)
													}
													)}
												</Select>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Project General Contractor:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('project_general_contractor', event.target.value)}
													required
													type="search"
													size="small"
													fullWidth
													value={estimateData.project_general_contractor}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Project Manager Name:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('project_manager_name', event.target.value)}
													required
													type="search"
													size="small"
													fullWidth
													value={estimateData.project_manager_name}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Project Manager Email:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('project_manager_email', event.target.value)}
													required
													type="search"
													size="small"
													fullWidth
													value={estimateData.project_manager_email}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Project Manager Phone:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('project_manager_phone', event.target.value)}
													required
													type="search"
													size="small"
													fullWidth
													value={estimateData.project_manager_phone}
												/>
											</TableCell>
										</TableRow>


										<TableRow hover={true}>
											<TableCell><b>Floor Type:</b></TableCell>
											<TableCell>
												<Select
													onChange={event => handleChange('floor_type_id', event.target.value)}
													required
													size="small"
													fullWidth
													value={estimateData.floor_type_id}
												>
													<MenuItem key="0" value="0">Please Select</MenuItem>
													{floorTypes.map(types => {
														return (<MenuItem key={types.floor_type_id} value={types.floor_type_id}>{types.floor_type_label}</MenuItem>)
													})}
												</Select>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Placement Type:</b></TableCell>
											<TableCell>
												<Select
													onChange={event => handleChange('placement_type_id', event.target.value)}
													required
													size="small"
													fullWidth
													value={estimateData.placement_type_id}
												>
													<MenuItem value="0">Please Select</MenuItem>
													{placementTypes.map(placementTypes => {
														return (<MenuItem key={placementTypes.placement_type_id} value={placementTypes.placement_type_id}>{placementTypes.placement_type_label}</MenuItem>)
													})}
												</Select>
											</TableCell>
										</TableRow>
										{/* 
										<TableRow hover={true}>
											<TableCell><b>Unit of Measurement:</b></TableCell>
											<TableCell>
												<FormControl error={error} disabled={editState ? true : false} >
													<RadioGroup
														value={estimateData.measurement_units}
														style={{ display: 'inline' }}
														onChange={event => handleMeasurementUnits(event.target.value)}
													>
														<FormControlLabel
															label="Imperial"
															value="imperial"
															control={<Radio />}
														/>
														<FormControlLabel
															label="Metric"
															value="metric"
															control={<Radio />}
														/>
													</RadioGroup>
													<FormHelperText>{radioError}</FormHelperText>
												</FormControl>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
												<TableCell>
													<b>Total Volume:</b>
												</TableCell>
												<TableCell>
													<TextField
														// onChange={event => handleChange('square_feet', event.target.value)}
														required
														type="number"
														size="small"
														fullWidth
														InputProps={{
															endAdornment: <InputAdornment position="end">{estimateData.measurement_units == 'imperial' ? 'yd³' : 'm³'}</InputAdornment>
														}}
														value={estimateData.total_project_volume}
													/>
												</TableCell>
											</TableRow> */}

									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>

					<Grid item xs={6}>
						<Paper elevation={3}>
							<TableContainer>
								<h3>Lead Time & Shipping Information</h3>
								<Table size="small">
									<TableBody>

										<TableRow hover={true}>
											<TableCell><b>Today's Date:</b></TableCell>
											<TableCell>
												<TextField
													// ⬇ Won't work with value=today. 
													// onChange={event => handleChange('date_created', event.target.value)} 
													required
													type="date"
													size="small"
													fullWidth
													value={today}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Anticipated First Pour Date:</b></TableCell>
											<TableCell>
												<TextField
													// run the time difference function with the chosen date when selecting
													onChange={event => timeDifference(event.target.value)}
													required
													type="date"
													size="small"
													fullWidth
													value={estimateData.anticipated_first_pour_date}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Lead Time (In Weeks):</b></TableCell>
											{/* This styling will trigger a background and snackbar if the lead time is under 8 weeks: */}
											<TableCell style={{ backgroundColor: leadTime >= 8 || leadTime === '' ? "" : "rgba(255, 0, 0, 0.7)" }}>
												{leadTime}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Shipping Street Address:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('ship_to_address', event.target.value)}
													required
													type="search"
													size="small"
													fullWidth
													value={estimateData.ship_to_address}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Shipping City:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('ship_to_city', event.target.value)}
													required
													type="search"
													size="small"
													fullWidth
													value={estimateData.ship_to_city}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Shipping State/Province:</b></TableCell>
											<TableCell>
												<Select
													onChange={event => handleChange('destination_id', event.target.value)}
													required
													size="small"
													fullWidth
													value={estimateData.destination_id}
													disabled={editState ? true : false}
												>
													<MenuItem key="0" value="0">Please Select</MenuItem>
													{filteredDestinations.map(state => {
														if (user?.permission_level === 3 && !user?.region_ids?.includes(state?.region_id)) return;

														return (
															<MenuItem key={state.destination_id} value={state.destination_id}>
																{state.destination_name}, {state.destination_country}
															</MenuItem>
														);
													})}
												</Select>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('zip_postal_code', event.target.value)}
													required
													type="text"
													size="small"
													fullWidth
													value={estimateData.zip_postal_code}
												/>
											</TableCell>
										</TableRow>

										{/* <TableRow hover={true}>
											<TableCell><b>Shipping Country:</b></TableCell>
											<TableCell>
												<Select
													onChange={event => handleChange('country', event.target.value)}
													required
													size="small"
													fullWidth
													value={estimateData.country}
												>
													<MenuItem key="0" value="0">Please Select</MenuItem>
													<MenuItem key="United States" value="United States">United States</MenuItem>
													<MenuItem key="Canada" value="Canada">Canada</MenuItem>
												</Select>
											</TableCell>
										</TableRow> */}

									</TableBody>
									{/* </Table>
							</TableContainer>

							<TableContainer> */}
									<TableBody>
										<TableRow >
											<TableCell colSpan="2" align="center">
												<h3>Project Quantity</h3>
											</TableCell>
										</TableRow>
									</TableBody>

									{/* <Table size="small"> */}
									<TableBody>
										<TableRow hover={true}>
											<TableCell>
												<b>Total Project Volume:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('total_project_volume', event.target.value)}
													required
													type="number"
													size="small"
													fullWidth
													InputProps={{
														endAdornment: <InputAdornment position="end">{estimateData.measurement_units == 'imperial' ? 'yd³' : 'm³'}</InputAdornment>
													}}
													value={estimateData.total_project_volume}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}										>
											<TableCell><b>Unit of Measurement:</b></TableCell>
											<TableCell>
												<Tooltip
													placement="left"
													arrow
													title="Unit of measurement will be determined by selecting a destination."
													color="primary"
													style={{
														marginBottom: "-9px",
														marginRight: "10px",
													}}
												>
													<FormControl
														error={error}
														disabled={true}
													>
														<RadioGroup
															value={estimateData.measurement_units}
															style={{ display: 'inline' }}
															onChange={event => handleMeasurementUnits(event.target.value)}
														>
															<FormControlLabel
																label="Imperial"
																value="imperial"
																control={<Radio />}
															/>
															<FormControlLabel
																label="Metric"
																value="metric"
																control={<Radio />}
															/>
														</RadioGroup>
														<FormHelperText>{radioError}</FormHelperText>
													</FormControl>
												</Tooltip>

											</TableCell>
										</TableRow>




										<TableRow >
											<TableCell
												colSpan={2}
												align="right">
												<Button
													type="submit"
													// ! Ryan Here. ⬇⬇⬇⬇ COMMENT THIS CODE IN/OUT FOR FORM VALIDATION: 
													// onClick={event => dispatch({ type: 'SET_TABLE_STATE', payload: true })}
													variant="contained"
													className={classes.LexendTeraFont11}
													color="primary"
													disabled={showTables ? true : false}
												>
													Next
												</Button>
											</TableCell>
										</TableRow>

									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>
					{/* End Grid Table #2 */}
				</Grid>
			</form >

			<br />

			{/* Conditional rendering to show or hide tables based off submit button: */}
			{showTables &&
				<EstimateCreateTable saveButton={saveButton} />
			}


		</div >
	)
}

