//#region ⬇⬇ All document setup, below:
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import { Alert } from '@material-ui/lab';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment, Snackbar, Radio, RadioGroup, FormControl, FormControlLabel, Tooltip } from '@material-ui/core';
import { useClasses } from '../MuiStyling/MuiStyling';
import { makeStyles, createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import swal from 'sweetalert';
import dayjs from 'dayjs';
import InfoIcon from '@material-ui/icons/Info';
import { differenceBetweenDates } from '../../utils/dateUtils';
//#endregion ⬆⬆ All document setup above.

const theme = createTheme({
	overrides: {
		MuiTooltip: {
			tooltip: {
				fontSize: "1em",
			}
		}
	}
});

export default function EstimateCreateTable({ saveButton }) {
	// //#region ⬇⬇ All state variables below:
	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useClasses();
	const calculateEstimate = useEstimateCalculations;
	const estimateData = useSelector(store => store.estimatesReducer.estimatesReducer);
	const calculatedDisplayObject = useSelector(store => store.estimatesReducer.setCalcEstimate);
	// const [saveButton, setSaveButton] = useState(false);
	const editState = useSelector(store => store.estimatesReducer.editState);
	const [tableSize, setTableSize] = useState(4);

	const products = useSelector(store => store.products.productsArray);
	const shippingDestinations = useSelector(store => store.shippingDestinations.shippingActiveDestinations);
	const currentMarkup = useSelector(store => store.products.currentMarkupMargin);
	const shippingCosts = useSelector(store => store.shippingCosts.shippingCostsArray);
	const productContainers = useSelector(store => store.productContainers.productContainersArray);
	const dosageRates = useSelector(store => store.dosageRates.dosageRatesArray);
	const customsDuties = useSelector(store => store.customsDuties.customsDutiesArray);
	const user = useSelector(store => store.user);

	const [materialsEditWarning, setMaterialsEditWarning] = useState(false);

	let cubic_measurement_unit = estimateData.measurement_units === "imperial" ? "yd³" : "m³";
	// ⬇ Have a useEffect looking at the estimateData object. If all necessary keys exist indicating user has entered all necessary form data, run the estimate calculations functions to display the rest of the table. This also makes the materials table adjust automatically if the user changes values.
	// useEffect(() => {
	// 	estimateData.difference_in_months = differenceBetweenDates(estimateData.date_created).total_months;


	// 	if (
	// 		estimateData.total_project_volume
	// 	) {
	// 		dispatch({
	// 			type: 'HANDLE_CALCULATED_ESTIMATE',
	// 			payload: {
	// 				estimate: estimateData,
	// 				options: {
	// 					products: products,
	// 					shippingDestinations: shippingDestinations,
	// 					currentMarkup: currentMarkup,
	// 					shippingCosts: shippingCosts,
	// 					productContainers: productContainers,
	// 					dosageRates: dosageRates,
	// 					customsDuties: customsDuties
	// 				}
	// 			}
	// 		});
	// 		setSaveButton(true);
	// 	}
	// 	// else if (
	// 	// 	estimateData.square_meters &&
	// 	// 	estimateData.thickness_millimeters &&
	// 	// 	estimateData.thickened_edge_construction_joint_lineal_meters &&
	// 	// 	estimateData.thickened_edge_perimeter_lineal_meters
	// 	// ) {
	// 	// 	dispatch({
	// 	// 		type: 'HANDLE_CALCULATED_ESTIMATE',
	// 	// 		payload: {
	// 	// 			estimate: estimateData,
	// 	// 			products: products,
	// 	// 			shippingDestinations: shippingDestinations,
	// 	// 			currentMarkup: currentMarkup,
	// 	// 			shippingCosts: shippingCosts,
	// 	// 			productContainers: productContainers,
	// 	// 			dosageRates: dosageRates,
	// 	// 			customsDuties: customsDuties,
	// 	// 			editState: editState,
	// 	// 		}
	// 	// 	});
	// 	// 	setSaveButton(true);
	// 	// } // End if/else if
	// }, [estimateData]); // End useEffect
	//#endregion ⬆⬆ All state variables above.


	//#region ⬇⬇ Event handlers below:
	/** ⬇ handleChange:
	 * When the user types, this will set their input to the kit object with keys for each field. 
	 */
	const handleChange = (key, value) => {

		// setNewEstimate({ ...newEstimate, [key]: value });

		if (editState == true && materialsEditWarning == false) {
			if (!window.confirm(`⚠️ WARNING: Editing the materials included on an already saved estimate will force the estimate to be recalculated at today's current rates, resetting the price guarantee.  Please only click "Save Edits" if you are sure you want to do this, as it is not reversible.  If you do not wish to do this, click "Cancel".`)) return;
			setMaterialsEditWarning(true);
		}; // End if

		if (key == 'materials_excluded' && editState == true) {
			estimateData.force_recalculate = true;
		};

		dispatch({
			type: 'SET_ESTIMATE',
			payload: { key: key, value: value }
		});
	} // End handleChange

	/** ⬇ handleSave:
	 * When clicked, this will post the object to the DB and send the user back to the dashboard. 
	 */
	const handleSave = event => {
		// ⬇ Attach history from useHistory to the estimate object to allow navigation from inside the saga:
		estimateData.history = history;
		// ⬇ Don't refresh until submit:
		event.preventDefault();

		// ⬇ Add in the prices from the calculations to be saved:
		estimateData.price_per_unit_75_50 = calculatedDisplayObject.price_per_unit_75_50;
		estimateData.price_per_unit_90_60 = calculatedDisplayObject.price_per_unit_90_60;
		estimateData.total_project_cost_75_50 = calculatedDisplayObject.total_project_cost_75_50;
		estimateData.total_project_cost_90_60 = calculatedDisplayObject.total_project_cost_90_60;

		estimateData.total_number_of_20ft_containers = parseInt(calculatedDisplayObject.total_number_of_20ft_containers);
		estimateData.total_number_of_40ft_containers = parseInt(calculatedDisplayObject.total_number_of_40ft_containers);
		estimateData.total_number_of_pallets = calculatedDisplayObject.total_number_of_pallets;

		// ⬇ Send the estimate object to be POSTed:
		dispatch({ type: 'ADD_ESTIMATE', payload: estimateData });
		// // ⬇ Sweet Alert to let them know to save the Estimate #:
		// swal({
		// 	title: "Estimate saved!",
		// 	text: "Please print or save your estimate number! You will need it to look up this estimate again, and submit the order for processing.",
		// 	icon: "info",
		// 	buttons: "I understand",
		// }).then(() => {
		// 	// // ⬇ Pop-up print confirmation:
		// 	// window.print();
		// }); // End swal
	} // End handleSave

	/** ⬇ handleEdit:
	 * When clicked, this will save the edits and send the user to the view estimate page:
	 */
	const handleEdit = event => {
		// ⬇ Attach history from useHistory to the estimate object to allow navigation from inside the saga:
		estimateData.history = history;
		// ⬇ Send the estimate object to be updated:
		dispatch({ type: 'EDIT_ESTIMATE', payload: estimateData });


		// // ⬇ Sweet Alert to let them know to save the Estimate #:
		// swal({
		// 	title: "Your edits have been saved!",
		// 	text: "Please print or save your estimate number! You will need it to look up this estimate again, and submit the order for processing.",
		// 	icon: "info",
		// 	buttons: "I understand",
		// }).then(() => {
		// 	// ⬇ Pop-up print confirmation:
		// 	window.print();
		// }); // End swal
		// ⬇ Triggers to flip the show table state and show edit button state:
		// dispatch({ type: 'SET_EDIT_STATE', payload: false });
		// dispatch({ type: 'SET_TABLE_STATE', payload: false });
	} // End handleEdit

	/** ⬇ Table Size Validation:
	 * The user has the option of stating whether or not they have materials on hand.  If true (aka, they have materials), then the table size will adjust to accommodate these new input fields. 
	 */
	// useEffect(() => {
	// 	if (estimateData.materials_on_hand) {
	// 		setTableSize(4);
	// 	} else if (!estimateData.materials_on_hand) {
	// 		setTableSize(6);
	// 	} // End if/else
	// }, [estimateData.materials_on_hand]);
	//#endregion ⬆⬆ Event handles above. 

	// ⬇ Use dayjs to get today's date in YYYY-MM-DD format:
	let startDate = dayjs().format('YYYY-MM-DD');
	if (estimateData.date_created) startDate = estimateData.date_created;

	const threeMonthGuaranteeDate = dayjs(startDate).add(3, 'month').format('YYYY-MM-DD');
	const sixMonthGuaranteeDate = dayjs(startDate).add(6, 'month').format('YYYY-MM-DD');


	// ⬇ Rendering:
	return (
		<>

			<form onSubmit={handleSave}>

				<Grid container
					spacing={2}
					justifyContent="center"
				>

					<Grid item xs={4}>
						<Paper elevation={3}>
							<TableContainer>
								<h3>Total PrīmX Materials:</h3>
								<Table size='small'>
									<TableBody>
										<TableRow hover={true}>
											<TableCell><b>Total Cubic {estimateData.measurement_units == "imperial" ? "Yards" : "Meters"}:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.total_project_volume?.toLocaleString()}
											</TableCell>
										</TableRow>

										{calculatedDisplayObject?.total_number_of_20ft_containers != 0 &&
											<TableRow hover={true}>
												<TableCell><b>Total Containers, 20':</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.total_number_of_20ft_containers?.toLocaleString()}
												</TableCell>
											</TableRow>
										}

										{calculatedDisplayObject?.total_number_of_40ft_containers != 0 &&
											<TableRow hover={true}>
												<TableCell><b>Total Containers, 40':</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.total_number_of_40ft_containers?.toLocaleString()}
												</TableCell>
											</TableRow>
										}

										<TableRow hover={true}>
											<TableCell><b>Total Pallets:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.total_number_of_pallets?.toLocaleString()}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>

							</TableContainer>
						</Paper>
					</Grid>

					<Grid item xs={8}>
						<Paper elevation={3}>
							<TableContainer>
								<h3>Materials Required Calculations</h3>
								<Table size="small">
									<TableBody>
										<TableRow hover={true}>
											<TableCell><b>Price Options:</b></TableCell>
											<TableCell>
												<FormControl
												// disabled={editState ? true : false}
												>
													<RadioGroup
														value={estimateData.materials_excluded}
														style={{ display: 'inline' }}
														onChange={event => handleChange('materials_excluded', event.target.value)}
													>
														<FormControlLabel
															label="Include All Materials"
															value='none'
															control={<Radio />}
														/>
														{user && user.permission_level <= 3 &&
															<FormControlLabel
																label="Exclude PrīmX CPEA"
																value="exclude_cpea"
																control={<Radio />}
															/>
														}
														{/* <FormControlLabel
															label="Exclude PrīmX Steel Fibers"
															value="exclude_fibers"
															control={<Radio />}
														/> */}
													</RadioGroup>
												</FormControl>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>

											<TableCell><b>Materials Included:</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.materials_excluded == 'none' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX Fibers, PrīmX UltraCure Blankets'}
												{calculatedDisplayObject?.materials_excluded == 'exclude_cpea' && 'PrīmX DC, PrīmX Flow, PrīmX Fibers, PrīmX UltraCure Blankets'}
												{calculatedDisplayObject?.materials_excluded == 'exclude_fibers' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX UltraCure Blankets'}
											</TableCell>
										</TableRow>

									</TableBody>

								</Table>

								<h3>PrīmX Material Price for the Project</h3>
								<Table size="small">
									<TableBody>
										{calculatedDisplayObject?.materials_excluded != 'exclude_fibers' &&
											<TableRow hover={true}>
												<TableCell><b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b></TableCell>
												{estimateData?.measurement_units === 'imperial'
													? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
													: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
												}
											</TableRow>
										}
										<TableRow hover={true}>
											<TableCell><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
											<TableCell align="right">{calculatedDisplayObject?.total_project_volume?.toLocaleString()}</TableCell>
											{/* {estimateData?.measurement_units === 'imperial'
												? <TableCell align="right">{calculatedDisplayObject?.design_cubic_yards_total}</TableCell>
												: <TableCell align="right">{calculatedDisplayObject?.design_cubic_meters_total}</TableCell>
											} */}
										</TableRow>
										<TableRow hover={true}>
											<TableCell><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
											<TableCell align="right">{calculatedDisplayObject?.price_per_unit_75_50_display}</TableCell>
										</TableRow>
										<TableRow hover={true}>
											<TableCell><b>Total PrīmX Price per Project (USD):</b></TableCell>
											<TableCell align="right">{calculatedDisplayObject?.total_project_cost_75_50_display}</TableCell>
										</TableRow>
										<TableRow>
										</TableRow>
									</TableBody>
								</Table>
								{/* <br /> <br /> */}

								<Table size="small">
									<TableBody>
										{calculatedDisplayObject?.materials_excluded != 'exclude_fibers' &&
											<>
												<br /> <br />

												<TableRow hover={true}>
													<TableCell><b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b></TableCell>
													{estimateData?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
													}
												</TableRow>
												<TableRow hover={true}>
													<TableCell><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
													<TableCell align="right">{calculatedDisplayObject?.total_project_volume?.toLocaleString()}</TableCell>
													{/* {estimateData?.measurement_units === 'imperial'
														? <TableCell align="right">{calculatedDisplayObject?.design_cubic_yards_total}</TableCell>
														: <TableCell align="right">{calculatedDisplayObject?.design_cubic_meters_total}</TableCell>
													} */}
												</TableRow>
												<TableRow hover={true}>
													<TableCell><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
													<TableCell align="right">{calculatedDisplayObject?.price_per_unit_90_60_display}</TableCell>
												</TableRow>
												<TableRow hover={true}>
													<TableCell><b>Total PrīmX Price per Project (USD):</b></TableCell>
													<TableCell align="right">{calculatedDisplayObject?.total_project_cost_90_60_display}</TableCell>
												</TableRow>
											</>
										}

										<TableRow hover={true}>
											<TableCell colSpan={2} align="right">
												{/* Conditional rendering to show the Edit or Save button based off whether they've came here from the Edit Estimate button or not: */}
												{editState ? (
													// If they are editing this estimate, show the Save Edit:
													<>
														<Button
															onClick={event => handleEdit(event)}
															variant="contained"
															className={classes.LexendTeraFont11}
															color="secondary"
														>
															Save Edits
														</Button>
													</>
												) : (
													// If they are not editing, show the Save Estimate conditional rendering: 
													<>
														{/* Conditional rendering for the save button to be enabled or disabled based off whether they've filled out all the inputs: */}
														{saveButton ? (
															// If they have filled out all of the inputs, make it enabled:
															<>
																<MuiThemeProvider theme={theme}>
																	<Tooltip
																		placement="left"
																		arrow
																		title="Saving the estimate will enable a 6-month warranty period.  The estimate will  be stored in the system and is available for later conversion to PO.  After the estimate is saved, you may print the page or export it as a PDF file."
																		color="primary"
																		style={{
																			marginBottom: "-9px",
																			marginRight: "10px",
																		}}
																	>
																		<InfoIcon />
																	</Tooltip>
																	{/* <Tooltip
																		placement="left"
																		arrow
																		title="Saving the estimate will enable a 6-month warranty period.  The estimate will  be stored in the system and is available for later conversion to PO.  After the estimate is saved, you may print the page or export it as a PDF file."
																		color="primary"
																	> */}
																	<Button
																		type="submit"
																		// ⬇⬇⬇⬇ COMMENT THIS CODE IN/OUT FOR FORM VALIDATION:
																		// onClick={event => handleSave(event)}
																		color="primary"
																		variant="contained"
																		className={classes.LexendTeraFont11}
																	// style={{backgroundColor: "green"}}
																	>
																		Save Estimate
																	</Button>
																	{/* </Tooltip> */}
																</MuiThemeProvider>

															</>
														) : (
															// If they haven't filled out the inputs, make it disabled:
															<>
																<MuiThemeProvider theme={theme}>
																	<Tooltip
																		placement="left"
																		arrow
																		title="Saving the estimate will enable a 6-month warranty period.  The estimate will  be stored in the system and is available for later conversion to PO.  After the estimate is saved, you may print the page or export it as a PDF file."
																		color="primary"
																		style={{
																			marginBottom: "-9px",
																			marginRight: "10px",
																		}}
																	>
																		<InfoIcon />
																	</Tooltip>
																</MuiThemeProvider>
																<Button
																	variant="contained"
																	className={classes.LexendTeraFont11}
																	disabled
																>
																	Save Estimate
																</Button>
															</>

														)}
														{/* End conditional rendering for saveButton ? */}
													</>
												)}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>

							</TableContainer>
							<br />
							<div style={{
								padding: "20px",
							}}>
								<b>Price Guarantee Disclaimer:</b>
								<br />The prices above are guaranteed to be eligible for six months, from the date it's saved until {sixMonthGuaranteeDate}.
							</div>

							{/* {estimateData.materials_excluded === 'exclude_fibers' && */}
							<div style={{
								padding: "20px",
							}}>
								<b>Total PrīmX Materials Disclaimer:</b>
								<br />The amount of materials calculated above is approximate.  It will be precised after PO placement.
							</div>
							{/* } */}
						</Paper>
					</Grid>
				</Grid>
			</form>


		</>
	)
}
