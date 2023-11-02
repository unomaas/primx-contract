//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
// ⬇ Dependent Functionality:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, Select, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormHelperText, Snackbar, Radio, Tooltip } from '@material-ui/core';
import { useParams } from 'react-router';
import { useClasses } from '../MuiStyling/MuiStyling';
import { differenceBetweenDates } from '../../utils/dateUtils';
import HelpIcon from '@material-ui/icons/Help';

//#endregion ⬆⬆ All document setup above.



export default function EstimateCombineTable({ firstEstimate, secondEstimate, thirdEstimate, calcCombinedEstimate }) {

	//#region ⬇⬇ All state variables below:
	// ⬇ Deprecated, used for Styling MUI components. 
	const classes = useClasses();
	// ⬇ Sets the error state for a faulty search:
	const [poNumError, setPoNumError] = useState("");
	const [poNumber, setPoNumber] = useState("");

	// ⬇ Used for page navigation:
	const dispatch = useDispatch();
	const history = useHistory();
	// ⬇ hasRecalculated is a boolean that defaults to false. When a user recalculates costs, the boolean gets set to true, which activates the Submit Order button.
	const hasRecalculated = useSelector(store => store.estimatesReducer.hasRecalculated);
	// ⬇ Used for handle the state of how many tables to show:
	const [tableWidth, setTableWidth] = useState(4);
	let cubic_measurement_unit = firstEstimate?.measurement_units === "imperial" ? "yd³" : "m³";
	const dosageRates = useSelector(store => store.dosageRates.dosageRatesArray);

	const firstEstimateAgeInMonths = differenceBetweenDates(firstEstimate?.date_created).total_months;
	const secondEstimateAgeInMonths = differenceBetweenDates(secondEstimate?.date_created).total_months;
	const thirdEstimateAgeInMonths = differenceBetweenDates(thirdEstimate?.date_created).total_months;
	const calcEstimateAgeInMonths = differenceBetweenDates(calcCombinedEstimate?.date_created).total_months;

	const [editState, setEditState] = useState(false);

	useEffect(() => {
		if (Object.keys(calcCombinedEstimate).length > 0 && calcCombinedEstimate.estimate_number != poNumber) {
			setPoNumber(calcCombinedEstimate.estimate_number);
		};
	}, [calcCombinedEstimate]);


	// ⬇ Checks if the third estimate is populated, and if so, adjusts the table size to display accordingly:
	useEffect(() => {
		if (Object.keys(thirdEstimate).length != 0) {
			setTableWidth(6);
		} else {
			setTableWidth(4);
		} // End if/else
	}, [thirdEstimate]); // End useEffect 
	//#endregion ⬆⬆ All state variables above. 
	const formatter = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value);
	}


	//#region ⬇⬇ Event handlers below:
	/** ⬇ handleRecalculateCosts:
	 * Click handler for the recalculate costs button. When clicked, runs the calculateEstimate function to get updated cost numbers with current shipping and materials pricing, saves (POSTS) the updates as a new estimate, brings the user to the new estimate view, and allows user to click the submit order button
	 */
	const handleRecalculateCosts = (estimate, order) => {
		// ⬇ Attach history from useHistory to the firstEstimate object to allow navigation from inside the saga:
		estimate.options = { order: order };
		// ⬇ Needs to GET shipping information and pricing information before recalculating
		// dispatch({ type: 'RECALCULATE_ESTIMATE', payload: estimate });

		if (order == "calcCombinedEstimate") {
			dispatch({ type: 'RECALCULATE_COMBINED_ESTIMATE', payload: calcCombinedEstimate });
		} else {
			dispatch({ type: 'RECALCULATE_ESTIMATE', payload: estimate });
		}
		// dispatch({ type: 'GET_RECALCULATE_INFO' });
	} // End handleRecalculateCosts

	/** ⬇ handleSave:
	 * When clicked, this will post the object to the DB and send the user back to the dashboard. 
	 */
	const handleSave = event => {
		// ⬇ Attach history from useHistory to the estimate object to allow navigation from inside the saga:
		calcCombinedEstimate.history = history;
		// Attach the estimate numbers to use inside the POST: 
		calcCombinedEstimate.estimate_number_combined_1 = firstEstimate.estimate_number;
		calcCombinedEstimate.estimate_number_combined_1_sf_dosage = firstEstimate.selected_steel_fiber_dosage;
		calcCombinedEstimate.estimate_number_combined_2 = secondEstimate.estimate_number;
		calcCombinedEstimate.estimate_number_combined_2_sf_dosage = secondEstimate.selected_steel_fiber_dosage;
		calcCombinedEstimate.estimate_number_combined_3 = thirdEstimate?.estimate_number;
		calcCombinedEstimate.estimate_number_combined_3_sf_dosage = thirdEstimate?.selected_steel_fiber_dosage;
		// ⬇ Send the estimate object to be POSTed:
		dispatch({ type: 'ADD_ESTIMATE', payload: calcCombinedEstimate });
		// ⬇ Sweet Alert to let them know to save the Estimate #:
		// swal({
		// 	title: "Estimate saved!",
		// 	text: "NOTE: Your estimate number has changed! Please print or save it, as you will need it to look up this estimate again, and submit the order for processing.",
		// 	icon: "info",
		// 	buttons: "I understand",
		// }).then(() => {
		// 	// ⬇ Pop-up print confirmation:
		// 	window.print();
		// }); // End swal
	} // End handleSave

	/** ⬇ handleSave:
 * When clicked, this will post the object to the DB and send the user back to the dashboard. 
 */
	const handleEditSave = event => {
		// ⬇ Attach history from useHistory to the estimate object to allow navigation from inside the saga:
		calcCombinedEstimate.history = history;
		// Attach the estimate numbers to use inside the POST: 
		calcCombinedEstimate.estimate_number_combined_1_sf_dosage = firstEstimate.selected_steel_fiber_dosage;
		calcCombinedEstimate.estimate_number_combined_2_sf_dosage = secondEstimate.selected_steel_fiber_dosage;
		calcCombinedEstimate.estimate_number_combined_3_sf_dosage = thirdEstimate?.selected_steel_fiber_dosage;
		// ⬇ Send the estimate object to be POSTed:
		dispatch({ type: 'EDIT_COMBINED_ESTIMATE', payload: calcCombinedEstimate });
		setEditState(false);
	} // End handleSave

	/** ⬇ handlePlaceOrder:
 * Click handler for the Place Order button. 
 */
	const handlePlaceOrder = () => {
		// ⬇ If they haven't entered a PO number, pop up an error helperText:
		if (poNumber == "") {
			setPoNumError("Please enter a P.O. Number.")
			return;
			// ⬇ If they have entered a PO number, proceed with order submission:
		}
		// else {
		// 	swal({
		// 		title: "This order has been submitted! Your PrīmX representative will be in touch.",
		// 		text: "Please print or save this page. You will need the estimate number to check the order status in the future.",
		// 		icon: "success",
		// 		buttons: "I understand",
		// 	}) // End swal
		// 	// ⬇ We're disabling the print confirmation now that the estimate numbers are easier to recall:
		// 	// .then(() => {
		// 	//   window.print();
		// 	// }); // End swal
		dispatch({
			type: 'MARK_COMBINED_ESTIMATE_ORDERED',
			payload: {
				calcCombinedEstimate: calcCombinedEstimate,
				poNumber: poNumber
			}
		}) // End dispatch
		// } // End if/else.
	} // End handlePlaceOrder


	const handleSteelFiberSelection = (value, order) => {
		dispatch({ type: `SET_STEEL_FIBER_SELECTION_${order}`, payload: value })
	}; // End handleSteelFiberSelection
	//#endregion ⬆⬆ Event handlers above. 

	//#region - Random logic I'm just fast filling for this page to work until I can refactor this site:
	let isThereThirdEstimate = false;
	if (JSON.stringify(thirdEstimate) != '{}') isThereThirdEstimate = true;

	let showFinalCostRow = false;
	if (!isThereThirdEstimate && firstEstimate.selected_steel_fiber_dosage && secondEstimate.selected_steel_fiber_dosage) showFinalCostRow = true;
	if (isThereThirdEstimate && firstEstimate.selected_steel_fiber_dosage && secondEstimate.selected_steel_fiber_dosage && thirdEstimate.selected_steel_fiber_dosage) showFinalCostRow = true;



	if (firstEstimate?.materials_excluded == 'exclude_fibers') firstEstimate.selected_steel_fiber_dosage = '75_50';
	if (secondEstimate?.materials_excluded == 'exclude_fibers') secondEstimate.selected_steel_fiber_dosage = '75_50';
	if (isThereThirdEstimate && thirdEstimate?.materials_excluded == 'exclude_fibers') thirdEstimate.selected_steel_fiber_dosage = '75_50';

	useEffect(() => {
		if (showFinalCostRow) {
			dispatch({
				type: 'COMBINE_ESTIMATE_TOTALS',
				payload: {
					firstEstimate: firstEstimate,
					secondEstimate: secondEstimate,
					thirdEstimate: thirdEstimate || null,
					combinedEstimate: calcCombinedEstimate,
				},
			}); // End dispatch
		}; // End if
	}, [firstEstimate?.selected_steel_fiber_dosage, secondEstimate?.selected_steel_fiber_dosage, thirdEstimate?.selected_steel_fiber_dosage])

	let isThisASavedCombinedEstimate = calcCombinedEstimate?.estimate_number?.charAt(calcCombinedEstimate.estimate_number.length - 1) === "C" ? true : false;

	if (editState) isThisASavedCombinedEstimate = false;

	if (isThisASavedCombinedEstimate) {
		firstEstimate.selected_steel_fiber_dosage = calcCombinedEstimate?.estimate_number_combined_1_sf_dosage;
		secondEstimate.selected_steel_fiber_dosage = calcCombinedEstimate?.estimate_number_combined_2_sf_dosage;
		if (isThereThirdEstimate) thirdEstimate.selected_steel_fiber_dosage = calcCombinedEstimate?.estimate_number_combined_3_sf_dosage;
	}; // End if
	//#endregion


	// ⬇ Rendering below:

	return (
		<>
			<Grid container
				spacing={2}
				justifyContent="center"
			>
				{/* Grid Table #1: Display the Licensee/Project Info Form : Shared between imperial and metric*/}
				<Grid item xs={tableWidth}>
					{/* 4 if doesn't exist, or 6 if does */}
					<Paper elevation={3}>
						<TableContainer>
							{/* <h3>Estimate {calcCombinedEstimate.estimate_number}</h3> */}
							{isThisASavedCombinedEstimate && <h3>Estimate {calcCombinedEstimate.estimate_number}</h3>}
							<h4>Project Information</h4>
							<Table size="small">
								<TableBody>

									<TableRow hover={true}>
										<TableCell><b>Project Name:</b></TableCell>
										<TableCell>
											{firstEstimate?.project_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Contractor Name:</b></TableCell>
										<TableCell>
											{firstEstimate?.licensee_contractor_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project General Contractor:</b></TableCell>
										<TableCell>
											{firstEstimate?.project_general_contractor}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project Manager Name:</b></TableCell>
										<TableCell>
											{firstEstimate?.project_manager_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project Manager Email:</b></TableCell>
										<TableCell>
											{firstEstimate?.project_manager_email}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project Manager Cell:</b></TableCell>
										<TableCell>
											{firstEstimate?.project_manager_phone}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Floor Type:</b></TableCell>
										<TableCell>
											{firstEstimate?.floor_type_label}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Placement Type:</b></TableCell>
										<TableCell>
											{firstEstimate?.placement_type_label}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Unit of Measurement:</b></TableCell>
										<TableCell>
											{firstEstimate?.measurement_units?.charAt(0)?.toUpperCase() + firstEstimate?.measurement_units?.slice(1)}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Estimate Creation Date:</b></TableCell>
										<TableCell>
											{calcCombinedEstimate?.date_created?.split('T')[0] || firstEstimate?.date_created?.split('T')[0]}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Anticipated First Pour Date:</b></TableCell>
										<TableCell>
											{firstEstimate?.anticipated_first_pour_date}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Street Address:</b></TableCell>
										<TableCell>
											{firstEstimate?.ship_to_address}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping City:</b></TableCell>
										<TableCell>
											{firstEstimate?.ship_to_city}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping State/Province:</b></TableCell>
										<TableCell>
											{firstEstimate?.destination_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
										<TableCell>
											{firstEstimate?.zip_postal_code}
										</TableCell>
									</TableRow>

									{/* <TableRow hover={true}>
										<TableCell><b>Shipping Country:</b></TableCell>
										<TableCell>
											{firstEstimate?.country}
										</TableCell>
									</TableRow> */}

									<TableRow hover={true}>
										<TableCell><b>First Estimate Number:</b></TableCell>
										<TableCell>
											{firstEstimate?.estimate_number}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Second Estimate Number:</b></TableCell>
										<TableCell>
											{secondEstimate?.estimate_number}
										</TableCell>
									</TableRow>

									{/* Conditional rendering to only show third estimate number if it exists: */}
									{thirdEstimate?.estimate_number &&
										<TableRow hover={true}>
											<TableCell><b>Third Estimate Number:</b></TableCell>
											<TableCell>
												{thirdEstimate?.estimate_number}
											</TableCell>
										</TableRow>
									} {/* End conditional rendering */}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
				{/* End Licensee and Project Information table */}

				{/* Table #2 Imperial: conditionally render the imperial needs*/}
				{firstEstimate.measurement_units == 'imperial' &&
					<>
						<Grid item xs={tableWidth}>
							<Paper elevation={3}>
								<TableContainer>
									<h3>Estimate {firstEstimate.estimate_number}</h3>
									<h4>Quantity Calculations</h4>
									<Table size="small">
										<TableBody>

											<TableRow hover={true}>
												<TableCell><b>Square Feet:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.square_feet_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (in):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.thickness_inches_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.perimeter_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.construction_joint_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.cubic_yards_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor @ {firstEstimate?.waste_factor_percentage}%:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.waste_factor_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.design_cubic_yards_total}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>

									{(firstEstimate?.thickened_edge_perimeter_lineal_feet > 0 || firstEstimate?.thickened_edge_construction_joint_lineal_feet > 0) &&
										<>
											<h4>Thickened Edge Calculator</h4>
											<p>If applicable, for slabs under 6in.</p>
											<Table size="small">

												<TableHead>
													<TableRow>
														<TableCell></TableCell>
														<TableCell align="right"><b>Perimeter</b></TableCell>
														<TableCell align="right"><b>Construction Joint</b></TableCell>
													</TableRow>
												</TableHead>

												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>Lineal Feet:</b></TableCell>
														<TableCell align="right">
															{firstEstimate?.thickened_edge_perimeter_lineal_feet_display}
														</TableCell>
														<TableCell align="right">
															{firstEstimate?.thickened_edge_construction_joint_lineal_feet_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Width (yd³):</b></TableCell>
														<TableCell align="right">
															5
														</TableCell>
														<TableCell align="right">
															10
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Additional Thickness (in):</b></TableCell>
														<TableCell align="right">
															{firstEstimate?.additional_thickness_inches}
														</TableCell>
														<TableCell align="right">
															{firstEstimate?.additional_thickness_inches}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Cubic Yards:</b></TableCell>
														<TableCell align="right">
															{firstEstimate?.perimeter_thickening_cubic_yards}
														</TableCell>
														<TableCell align="right">
															{firstEstimate?.construction_joint_thickening_cubic_yards}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</>
									}

									<h3>Total PrīmX Materials:</h3>
									<Table size='small'>
										<TableBody>
											{firstEstimate?.total_number_of_20ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 20':</b></TableCell>
													<TableCell align="right">
														{firstEstimate?.total_number_of_20ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											{firstEstimate?.total_number_of_40ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 40':</b></TableCell>
													<TableCell align="right">
														{firstEstimate?.total_number_of_40ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											<TableRow hover={true}>
												<TableCell><b>Total Pallets:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.total_number_of_pallets?.toLocaleString()}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>

									<h3>PrīmX Material Price for the Project</h3>
									<Table size='small'>
										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Materials Included:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.materials_excluded == 'none' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{firstEstimate?.materials_excluded == 'exclude_cpea' && 'PrīmX DC, PrīmX Flow, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{firstEstimate?.materials_excluded == 'exclude_fibers' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX UltraCure Blankets'}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									<br /><br />
									<Table size="small">
										<TableBody>
											{firstEstimate?.materials_excluded != 'exclude_fibers' &&
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={firstEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={firstEstimate?.selected_steel_fiber_dosage == '75_50'}
																		onChange={() => handleSteelFiberSelection('75_50', 'FIRST')}
																		value="75_50"
																		disabled={firstEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{firstEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
													}
												</TableRow>
											}
											<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
												{firstEstimate?.measurement_units === 'imperial'
													? <TableCell align="right">{firstEstimate?.design_cubic_yards_total}</TableCell>
													: <TableCell align="right">{firstEstimate?.design_cubic_meters_total}</TableCell>
												}
											</TableRow>
											<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
												<TableCell align="right">{firstEstimate?.price_per_unit_75_50_display}</TableCell>
											</TableRow>
											<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
												<TableCell align="right">{firstEstimate?.total_project_cost_75_50_display}</TableCell>
											</TableRow>
											<TableRow>
											</TableRow>
										</TableBody>
									</Table>
									<br /> <br />

									{firstEstimate?.materials_excluded != 'exclude_fibers' &&
										<Table size="small">
											<TableBody>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={firstEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={firstEstimate?.selected_steel_fiber_dosage == '90_60'}
																		onChange={() => handleSteelFiberSelection('90_60', 'FIRST')}
																		value="90_60"
																		disabled={firstEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{firstEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
													{firstEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{firstEstimate?.design_cubic_yards_total}</TableCell>
														: <TableCell align="right">{firstEstimate?.design_cubic_meters_total}</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
													<TableCell align="right">{firstEstimate?.price_per_unit_90_60_display}</TableCell>
												</TableRow>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
													<TableCell align="right">{firstEstimate?.total_project_cost_90_60_display}</TableCell>
												</TableRow>

												{firstEstimateAgeInMonths >= 6 && !calcCombinedEstimate.estimate_number &&
													<>
														<TableRow hover={true}>

															<TableCell colSpan={7} align="right">
																<Button
																	variant="contained"
																	color="primary"
																	onClick={() => handleRecalculateCosts(firstEstimate, 'firstEstimate')}
																	style={{ marginTop: "13px" }}
																	className={classes.LexendTeraFont11}
																>
																	Recalculate Costs
																</Button>
															</TableCell>
														</TableRow>
													</>
												}
											</TableBody>
										</Table>
									}
								</TableContainer>
							</Paper>
						</Grid>

						<Grid item xs={tableWidth}>
							<Paper elevation={3}>
								<TableContainer>
									<h3>Estimate {secondEstimate.estimate_number}</h3>
									<h4>Quantity Calculations</h4>
									<Table size="small">
										<TableBody>

											<TableRow hover={true}>
												<TableCell><b>Square Feet:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.square_feet_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (in):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.thickness_inches_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.perimeter_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.construction_joint_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.cubic_yards_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor @ {secondEstimate?.waste_factor_percentage}%:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.waste_factor_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.design_cubic_yards_total}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>

									{(secondEstimate?.thickened_edge_perimeter_lineal_feet > 0 || secondEstimate?.thickened_edge_construction_joint_lineal_feet > 0) &&
										<>
											<h4>Thickened Edge Calculator</h4>
											<p>If applicable, for slabs under 6in.</p>
											<Table size="small">

												<TableHead>
													<TableRow>
														<TableCell></TableCell>
														<TableCell align="right"><b>Perimeter</b></TableCell>
														<TableCell align="right"><b>Construction Joint</b></TableCell>
													</TableRow>
												</TableHead>

												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>Lineal Feet:</b></TableCell>
														<TableCell align="right">
															{secondEstimate?.thickened_edge_perimeter_lineal_feet_display}
														</TableCell>
														<TableCell align="right">
															{secondEstimate?.thickened_edge_construction_joint_lineal_feet_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Width (yd³):</b></TableCell>
														<TableCell align="right">
															5
														</TableCell>
														<TableCell align="right">
															10
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Additional Thickness (in):</b></TableCell>
														<TableCell align="right">
															{secondEstimate?.additional_thickness_inches}
														</TableCell>
														<TableCell align="right">
															{secondEstimate?.additional_thickness_inches}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Cubic Yards:</b></TableCell>
														<TableCell align="right">
															{secondEstimate?.perimeter_thickening_cubic_yards}
														</TableCell>
														<TableCell align="right">
															{secondEstimate?.construction_joint_thickening_cubic_yards}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</>
									}

									<h3>Total PrīmX Materials:</h3>
									<Table size='small'>
										<TableBody>
											{secondEstimate?.total_number_of_20ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 20':</b></TableCell>
													<TableCell align="right">
														{secondEstimate?.total_number_of_20ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											{secondEstimate?.total_number_of_40ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 40':</b></TableCell>
													<TableCell align="right">
														{secondEstimate?.total_number_of_40ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											<TableRow hover={true}>
												<TableCell><b>Total Pallets:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.total_number_of_pallets?.toLocaleString()}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>

									<h3>PrīmX Material Price for the Project</h3>
									<Table size='small'>
										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Materials Included:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.materials_excluded == 'none' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{secondEstimate?.materials_excluded == 'exclude_cpea' && 'PrīmX DC, PrīmX Flow, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{secondEstimate?.materials_excluded == 'exclude_fibers' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX UltraCure Blankets'}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									<br /><br />
									<Table size="small">
										<TableBody>
											{secondEstimate?.materials_excluded != 'exclude_fibers' &&
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={secondEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={secondEstimate?.selected_steel_fiber_dosage == '75_50'}
																		onChange={() => handleSteelFiberSelection('75_50', 'SECOND')}
																		value="75_50"
																		disabled={secondEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{secondEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
													}
												</TableRow>
											}
											<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
												{secondEstimate?.measurement_units === 'imperial'
													? <TableCell align="right">{secondEstimate?.design_cubic_yards_total}</TableCell>
													: <TableCell align="right">{secondEstimate?.design_cubic_meters_total}</TableCell>
												}
											</TableRow>
											<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
												<TableCell align="right">{secondEstimate?.price_per_unit_75_50_display}</TableCell>
											</TableRow>
											<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
												<TableCell align="right">{secondEstimate?.total_project_cost_75_50_display}</TableCell>
											</TableRow>
											<TableRow>
											</TableRow>
										</TableBody>
									</Table>
									<br /> <br />

									{secondEstimate?.materials_excluded != 'exclude_fibers' &&
										<Table size="small">
											<TableBody>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={secondEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={secondEstimate?.selected_steel_fiber_dosage == '90_60'}
																		onChange={() => handleSteelFiberSelection('90_60', 'SECOND')}
																		value="90_60"
																		disabled={secondEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{secondEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
													{secondEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{secondEstimate?.design_cubic_yards_total}</TableCell>
														: <TableCell align="right">{secondEstimate?.design_cubic_meters_total}</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
													<TableCell align="right">{secondEstimate?.price_per_unit_90_60_display}</TableCell>
												</TableRow>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
													<TableCell align="right">{secondEstimate?.total_project_cost_90_60_display}</TableCell>
												</TableRow>

												{/* Render the following table row for any orders that haven't been placed yet */}
												{secondEstimateAgeInMonths >= 6 && !calcCombinedEstimate.estimate_number &&
													<>
														<TableRow hover={true}>

															<TableCell colSpan={7} align="right">
																<Button
																	variant="contained"
																	color="primary"
																	onClick={() => handleRecalculateCosts(secondEstimate, 'secondEstimate')}
																	style={{ marginTop: "13px" }}
																	className={classes.LexendTeraFont11}
																>
																	Recalculate Costs
																</Button>
															</TableCell>
														</TableRow>
													</>
												}
											</TableBody>
										</Table>
									}
								</TableContainer>
							</Paper>
						</Grid>

						{isThereThirdEstimate && thirdEstimate.measurement_units == 'imperial' &&
							<>
								<Grid item xs={6}>
									<Paper elevation={3}>
										<TableContainer>

											<h3>Estimate {thirdEstimate?.estimate_number}</h3>
											<h4>Quantity Calculations</h4>
											<Table size="small">
												<TableBody>

													<TableRow hover={true}>
														<TableCell><b>Square Feet:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.square_feet_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Thickness (in):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.thickness_inches_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Cubic Yards:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.cubic_yards}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.perimeter_thickening_cubic_yards}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.construction_joint_thickening_cubic_yards}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Subtotal:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.cubic_yards_subtotal}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Waste Factor @ {thirdEstimate?.waste_factor_percentage}%:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.waste_factor_cubic_yards}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Total Cubic Yards:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.design_cubic_yards_total}
														</TableCell>
													</TableRow>

												</TableBody>
											</Table>

											{(thirdEstimate?.thickened_edge_perimeter_lineal_feet > 0 || thirdEstimate?.thickened_edge_construction_joint_lineal_feet > 0) &&
												<>
													<h4>Thickened Edge Calculator</h4>
													<p>If applicable, for slabs under 6in.</p>
													<Table size="small">

														<TableHead>
															<TableRow>
																<TableCell></TableCell>
																<TableCell align="right"><b>Perimeter</b></TableCell>
																<TableCell align="right"><b>Construction Joint</b></TableCell>
															</TableRow>
														</TableHead>

														<TableBody>
															<TableRow hover={true}>
																<TableCell><b>Lineal Feet:</b></TableCell>
																<TableCell align="right">
																	{thirdEstimate?.thickened_edge_perimeter_lineal_feet_display}
																</TableCell>
																<TableCell align="right">
																	{thirdEstimate?.thickened_edge_construction_joint_lineal_feet_display}
																</TableCell>
															</TableRow>

															<TableRow hover={true}>
																<TableCell><b>Width (yd³):</b></TableCell>
																<TableCell align="right">
																	5
																</TableCell>
																<TableCell align="right">
																	10
																</TableCell>
															</TableRow>

															<TableRow hover={true}>
																<TableCell><b>Additional Thickness (in):</b></TableCell>
																<TableCell align="right">
																	{thirdEstimate?.additional_thickness_inches}
																</TableCell>
																<TableCell align="right">
																	{thirdEstimate?.additional_thickness_inches}
																</TableCell>
															</TableRow>

															<TableRow hover={true}>
																<TableCell><b>Cubic Yards:</b></TableCell>
																<TableCell align="right">
																	{thirdEstimate?.perimeter_thickening_cubic_yards}
																</TableCell>
																<TableCell align="right">
																	{thirdEstimate?.construction_joint_thickening_cubic_yards}
																</TableCell>
															</TableRow>
														</TableBody>
													</Table>
												</>
											}

											<h3>Total PrīmX Materials:</h3>
											<Table size='small'>
												<TableBody>
													{thirdEstimate?.total_number_of_20ft_containers != 0 &&
														<TableRow hover={true}>
															<TableCell><b>Total Containers, 20':</b></TableCell>
															<TableCell align="right">
																{thirdEstimate?.total_number_of_20ft_containers?.toLocaleString()}
															</TableCell>
														</TableRow>
													}
													{thirdEstimate?.total_number_of_40ft_containers != 0 &&
														<TableRow hover={true}>
															<TableCell><b>Total Containers, 40':</b></TableCell>
															<TableCell align="right">
																{thirdEstimate?.total_number_of_40ft_containers?.toLocaleString()}
															</TableCell>
														</TableRow>
													}
													<TableRow hover={true}>
														<TableCell><b>Total Pallets:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.total_number_of_pallets?.toLocaleString()}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>

											<h3>PrīmX Material Price for the Project</h3>
											<Table size='small'>
												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>Materials Included:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.materials_excluded == 'none' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX Fibers, PrīmX UltraCure Blankets'}
															{thirdEstimate?.materials_excluded == 'exclude_cpea' && 'PrīmX DC, PrīmX Flow, PrīmX Fibers, PrīmX UltraCure Blankets'}
															{thirdEstimate?.materials_excluded == 'exclude_fibers' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX UltraCure Blankets'}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
											<br /><br />
											<Table size="small">
												<TableBody>
													{thirdEstimate?.materials_excluded != 'exclude_fibers' &&
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
																<Tooltip title={thirdEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
																	<span>
																		{!isThisASavedCombinedEstimate &&
																			<Radio
																				checked={thirdEstimate?.selected_steel_fiber_dosage == '75_50'}
																				onChange={() => handleSteelFiberSelection('75_50', 'THIRD')}
																				value="75_50"
																				disabled={thirdEstimateAgeInMonths >= 6 ? true : false}
																			/>
																		}
																	</span>
																</Tooltip>
																<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
															</TableCell>
															{thirdEstimate?.measurement_units === 'imperial'
																? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
																: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
															}
														</TableRow>
													}
													<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
														<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
														{thirdEstimate?.measurement_units === 'imperial'
															? <TableCell align="right">{thirdEstimate?.design_cubic_yards_total}</TableCell>
															: <TableCell align="right">{thirdEstimate?.design_cubic_meters_total}</TableCell>
														}
													</TableRow>
													<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
														<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
														<TableCell align="right">{thirdEstimate?.price_per_unit_75_50_display}</TableCell>
													</TableRow>
													<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
														<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
														<TableCell align="right">{thirdEstimate?.total_project_cost_75_50_display}</TableCell>
													</TableRow>
													<TableRow>
													</TableRow>
												</TableBody>
											</Table>
											<br /> <br />

											{thirdEstimate?.materials_excluded != 'exclude_fibers' &&
												<Table size="small">
													<TableBody>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
																<Tooltip title={thirdEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
																	<span>
																		{!isThisASavedCombinedEstimate &&
																			<Radio
																				checked={thirdEstimate?.selected_steel_fiber_dosage == '90_60'}
																				onChange={() => handleSteelFiberSelection('90_60', 'THIRD')}
																				value="90_60"
																				disabled={thirdEstimateAgeInMonths >= 6 ? true : false}
																			/>
																		}
																	</span>
																</Tooltip>
																<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
															</TableCell>
															{thirdEstimate?.measurement_units === 'imperial'
																? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
																: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
															}
														</TableRow>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
															{thirdEstimate?.measurement_units === 'imperial'
																? <TableCell align="right">{thirdEstimate?.design_cubic_yards_total}</TableCell>
																: <TableCell align="right">{thirdEstimate?.design_cubic_meters_total}</TableCell>
															}
														</TableRow>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
															<TableCell align="right">{thirdEstimate?.price_per_unit_90_60_display}</TableCell>
														</TableRow>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
															<TableCell align="right">{thirdEstimate?.total_project_cost_90_60_display}</TableCell>
														</TableRow>

														{/* Render the following table row for any orders that haven't been placed yet */}
														{thirdEstimateAgeInMonths >= 6 && !calcCombinedEstimate.estimate_number &&
															<>
																<TableRow hover={true}>

																	<TableCell colSpan={7} align="right">
																		<Button
																			variant="contained"
																			color="primary"
																			onClick={() => handleRecalculateCosts(thirdEstimate, 'thirdEstimate')}
																			style={{ marginTop: "13px" }}
																			className={classes.LexendTeraFont11}
																		>
																			Recalculate Costs
																		</Button>
																	</TableCell>
																</TableRow>
															</>
														}
													</TableBody>
												</Table>
											}
										</TableContainer>
									</Paper>
								</Grid>
							</>}
					</>
				} {/* End imperial conditional rendering*/}


				{/* Table #3: Metric - conditionally render the metric needs */}
				{firstEstimate.measurement_units == 'metric' &&
					<>
						<Grid item xs={tableWidth}>
							<Paper elevation={3}>
								<TableContainer>
									<h3>Estimate #1 Quantity Calculations</h3>
									<Table size="small">
										<TableBody>

											<TableRow hover={true}>
												<TableCell><b>Square Meters:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.square_meters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (mm):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.thickness_millimeters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.perimeter_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.construction_joint_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.cubic_meters_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor @ {firstEstimate?.waste_factor_percentage}%:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.waste_factor_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.design_cubic_meters_total}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>

									{firstEstimate?.thickened_edge_perimeter_lineal_meters > 0 || firstEstimate?.thickened_edge_construction_joint_lineal_meters > 0 &&
										<>
											<h3>Estimate #1 Thickened Edge Calculator</h3>
											<p>If applicable, for slabs under 150mm.</p>
											<Table size="small">

												<TableHead>
													<TableRow>
														<TableCell></TableCell>
														<TableCell align="right"><b>Perimeter</b></TableCell>
														<TableCell align="right"><b>Construction Joint</b></TableCell>
													</TableRow>
												</TableHead>

												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>Lineal Meters:</b></TableCell>
														<TableCell align="right">
															{firstEstimate?.thickened_edge_perimeter_lineal_meters_display}
														</TableCell>
														<TableCell align="right">
															{firstEstimate?.thickened_edge_construction_joint_lineal_meters_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Width (m³):</b></TableCell>
														<TableCell align="right">
															1.5
														</TableCell>
														<TableCell align="right">
															3.0
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Additional Thickness (mm):</b></TableCell>
														<TableCell align="right">
															{firstEstimate?.additional_thickness_millimeters}
														</TableCell>
														<TableCell align="right">
															{firstEstimate?.additional_thickness_millimeters}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Cubic Meters:</b></TableCell>
														<TableCell align="right">
															{firstEstimate?.perimeter_thickening_cubic_meters}
														</TableCell>
														<TableCell align="right">
															{firstEstimate?.construction_joint_thickening_cubic_meters}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</>
									}

									<h3>Total PrīmX Materials:</h3>
									<Table size='small'>
										<TableBody>
											{firstEstimate?.total_number_of_20ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 20':</b></TableCell>
													<TableCell align="right">
														{firstEstimate?.total_number_of_20ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											{firstEstimate?.total_number_of_40ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 40':</b></TableCell>
													<TableCell align="right">
														{firstEstimate?.total_number_of_40ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											<TableRow hover={true}>
												<TableCell><b>Total Pallets:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.total_number_of_pallets?.toLocaleString()}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>

									<h3>PrīmX Material Price for the Project</h3>
									<Table size='small'>
										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Materials Included:</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.materials_excluded == 'none' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{firstEstimate?.materials_excluded == 'exclude_cpea' && 'PrīmX DC, PrīmX Flow, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{firstEstimate?.materials_excluded == 'exclude_fibers' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX UltraCure Blankets'}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									<br /><br />
									<Table size="small">
										<TableBody>
											{firstEstimate?.materials_excluded != 'exclude_fibers' &&
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={firstEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={firstEstimate?.selected_steel_fiber_dosage == '75_50'}
																		onChange={() => handleSteelFiberSelection('75_50', 'FIRST')}
																		value="75_50"
																		disabled={firstEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{firstEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
													}
												</TableRow>
											}
											<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
												{firstEstimate?.measurement_units === 'imperial'
													? <TableCell align="right">{firstEstimate?.design_cubic_yards_total}</TableCell>
													: <TableCell align="right">{firstEstimate?.design_cubic_meters_total}</TableCell>
												}
											</TableRow>
											<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
												<TableCell align="right">{firstEstimate?.price_per_unit_75_50_display}</TableCell>
											</TableRow>
											<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
												<TableCell align="right">{firstEstimate?.total_project_cost_75_50_display}</TableCell>
											</TableRow>
											<TableRow>
											</TableRow>
										</TableBody>
									</Table>
									<br /> <br />

									{firstEstimate?.materials_excluded != 'exclude_fibers' &&
										<Table size="small">
											<TableBody>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={firstEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={firstEstimate?.selected_steel_fiber_dosage == '90_60'}
																		onChange={() => handleSteelFiberSelection('90_60', 'FIRST')}
																		value="90_60"
																		disabled={firstEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{firstEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
													{firstEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{firstEstimate?.design_cubic_yards_total}</TableCell>
														: <TableCell align="right">{firstEstimate?.design_cubic_meters_total}</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
													<TableCell align="right">{firstEstimate?.price_per_unit_90_60_display}</TableCell>
												</TableRow>
												<TableRow hover={true} style={firstEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
													<TableCell align="right">{firstEstimate?.total_project_cost_90_60_display}</TableCell>
												</TableRow>

												{/* Render the following table row for any orders that haven't been placed yet */}
												{firstEstimateAgeInMonths >= 6 && !calcCombinedEstimate.estimate_number &&
													<>
														<TableRow hover={true}>

															<TableCell colSpan={7} align="right">
																<Button
																	variant="contained"
																	color="primary"
																	onClick={() => handleRecalculateCosts(firstEstimate, 'firstEstimate')}
																	style={{ marginTop: "13px" }}
																	className={classes.LexendTeraFont11}
																>
																	Recalculate Costs
																</Button>
															</TableCell>
														</TableRow>
													</>
												}
											</TableBody>
										</Table>
									}
								</TableContainer>
							</Paper>
						</Grid>

						<Grid item xs={tableWidth}>
							<Paper elevation={3}>
								<TableContainer>

									<h3>Estimate #2 Quantity Calculations</h3>
									<Table size="small">
										<TableBody>

											<TableRow hover={true}>
												<TableCell><b>Square Meters:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.square_meters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (mm):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.thickness_millimeters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.perimeter_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.construction_joint_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.cubic_meters_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor @ {firstEstimate?.waste_factor_percentage}%:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.waste_factor_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.design_cubic_meters_total}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>

									{secondEstimate?.thickened_edge_perimeter_lineal_meters > 0 || secondEstimate?.thickened_edge_construction_joint_lineal_meters > 0 &&
										<>
											<h3>Estimate #2 Thickened Edge Calculator</h3>
											<p>If applicable, for slabs under 150mm.</p>
											<Table size="small">

												<TableHead>
													<TableRow>
														<TableCell></TableCell>
														<TableCell align="right"><b>Perimeter</b></TableCell>
														<TableCell align="right"><b>Construction Joint</b></TableCell>
													</TableRow>
												</TableHead>

												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>Lineal Meters:</b></TableCell>
														<TableCell align="right">
															{secondEstimate?.thickened_edge_perimeter_lineal_meters_display}
														</TableCell>
														<TableCell align="right">
															{secondEstimate?.thickened_edge_construction_joint_lineal_meters_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Width (m³):</b></TableCell>
														<TableCell align="right">
															1.5
														</TableCell>
														<TableCell align="right">
															3.0
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Additional Thickness (mm):</b></TableCell>
														<TableCell align="right">
															{secondEstimate?.additional_thickness_millimeters}
														</TableCell>
														<TableCell align="right">
															{secondEstimate?.additional_thickness_millimeters}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Cubic Meters:</b></TableCell>
														<TableCell align="right">
															{secondEstimate?.perimeter_thickening_cubic_meters}
														</TableCell>
														<TableCell align="right">
															{secondEstimate?.construction_joint_thickening_cubic_meters}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</>
									}

									<h3>Total PrīmX Materials:</h3>
									<Table size='small'>
										<TableBody>
											{secondEstimate?.total_number_of_20ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 20':</b></TableCell>
													<TableCell align="right">
														{secondEstimate?.total_number_of_20ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											{secondEstimate?.total_number_of_40ft_containers != 0 &&
												<TableRow hover={true}>
													<TableCell><b>Total Containers, 40':</b></TableCell>
													<TableCell align="right">
														{secondEstimate?.total_number_of_40ft_containers?.toLocaleString()}
													</TableCell>
												</TableRow>
											}
											<TableRow hover={true}>
												<TableCell><b>Total Pallets:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.total_number_of_pallets?.toLocaleString()}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>

									<h3>PrīmX Material Price for the Project</h3>
									<Table size='small'>
										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Materials Included:</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.materials_excluded == 'none' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{secondEstimate?.materials_excluded == 'exclude_cpea' && 'PrīmX DC, PrīmX Flow, PrīmX Fibers, PrīmX UltraCure Blankets'}
													{secondEstimate?.materials_excluded == 'exclude_fibers' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX UltraCure Blankets'}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									<br /><br />
									<Table size="small">
										<TableBody>
											{secondEstimate?.materials_excluded != 'exclude_fibers' &&
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={secondEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={secondEstimate?.selected_steel_fiber_dosage == '75_50'}
																		onChange={() => handleSteelFiberSelection('75_50', 'SECOND')}
																		value="75_50"
																		disabled={secondEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{secondEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
													}
												</TableRow>
											}
											<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
												{secondEstimate?.measurement_units === 'imperial'
													? <TableCell align="right">{secondEstimate?.design_cubic_yards_total}</TableCell>
													: <TableCell align="right">{secondEstimate?.design_cubic_meters_total}</TableCell>
												}
											</TableRow>
											<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
												<TableCell align="right">{secondEstimate?.price_per_unit_75_50_display}</TableCell>
											</TableRow>
											<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
												<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
												<TableCell align="right">{secondEstimate?.total_project_cost_75_50_display}</TableCell>
											</TableRow>
											<TableRow>
											</TableRow>
										</TableBody>
									</Table>
									<br /> <br />

									{secondEstimate?.materials_excluded != 'exclude_fibers' &&
										<Table size="small">
											<TableBody>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
														<Tooltip title={secondEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
															<span>
																{!isThisASavedCombinedEstimate &&
																	<Radio
																		checked={secondEstimate?.selected_steel_fiber_dosage == '90_60'}
																		onChange={() => handleSteelFiberSelection('90_60', 'SECOND')}
																		value="90_60"
																		disabled={secondEstimateAgeInMonths >= 6 ? true : false}
																	/>
																}
															</span>
														</Tooltip>
														<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
													</TableCell>
													{secondEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
														: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
													{secondEstimate?.measurement_units === 'imperial'
														? <TableCell align="right">{secondEstimate?.design_cubic_yards_total}</TableCell>
														: <TableCell align="right">{secondEstimate?.design_cubic_meters_total}</TableCell>
													}
												</TableRow>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
													<TableCell align="right">{secondEstimate?.price_per_unit_90_60_display}</TableCell>
												</TableRow>
												<TableRow hover={true} style={secondEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
													<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
													<TableCell align="right">{secondEstimate?.total_project_cost_90_60_display}</TableCell>
												</TableRow>

												{/* Render the following table row for any orders that haven't been placed yet */}
												{secondEstimateAgeInMonths >= 6 && !calcCombinedEstimate.estimate_number &&
													<>
														<TableRow hover={true}>

															<TableCell colSpan={7} align="right">
																<Button
																	variant="contained"
																	color="primary"
																	onClick={() => handleRecalculateCosts(secondEstimate, 'secondEstimate')}
																	style={{ marginTop: "13px" }}
																	className={classes.LexendTeraFont11}
																>
																	Recalculate Costs
																</Button>
															</TableCell>
														</TableRow>
													</>
												}
											</TableBody>
										</Table>
									}
								</TableContainer>
							</Paper>
						</Grid>


						{isThereThirdEstimate && thirdEstimate.measurement_units == 'metric' &&
							<>
								<Grid item xs={6}>
									<Paper elevation={3}>
										<TableContainer>

											<h3>Estimate #3 Quantity Calculations</h3>
											<Table size="small">
												<TableBody>

													<TableRow hover={true}>
														<TableCell><b>Square Meters:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.square_meters_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Thickness (mm):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.thickness_millimeters_display}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Cubic Meters:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.cubic_meters}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.perimeter_thickening_cubic_meters}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.construction_joint_thickening_cubic_meters}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Subtotal:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.cubic_meters_subtotal}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Waste Factor @ {thirdEstimate?.waste_factor_percentage}%:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.waste_factor_cubic_meters}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>Total Cubic Meters:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.design_cubic_meters_total}
														</TableCell>
													</TableRow>

												</TableBody>
											</Table>

											{thirdEstimate?.thickened_edge_perimeter_lineal_meters > 0 || thirdEstimate?.thickened_edge_construction_joint_lineal_meters > 0 &&
												<>
													<h3>Estimate #3 Thickened Edge Calculator</h3>
													<p>If applicable, for slabs under 150mm.</p>
													<Table size="small">

														<TableHead>
															<TableRow>
																<TableCell></TableCell>
																<TableCell align="right"><b>Perimeter</b></TableCell>
																<TableCell align="right"><b>Construction Joint</b></TableCell>
															</TableRow>
														</TableHead>

														<TableBody>
															<TableRow hover={true}>
																<TableCell><b>Lineal Meters:</b></TableCell>
																<TableCell align="right">
																	{thirdEstimate?.thickened_edge_perimeter_lineal_meters_display}
																</TableCell>
																<TableCell align="right">
																	{thirdEstimate?.thickened_edge_construction_joint_lineal_meters_display}
																</TableCell>
															</TableRow>

															<TableRow hover={true}>
																<TableCell><b>Width (m³):</b></TableCell>
																<TableCell align="right">
																	1.5
																</TableCell>
																<TableCell align="right">
																	3.0
																</TableCell>
															</TableRow>

															<TableRow hover={true}>
																<TableCell><b>Additional Thickness (mm):</b></TableCell>
																<TableCell align="right">
																	{thirdEstimate?.additional_thickness_millimeters}
																</TableCell>
																<TableCell align="right">
																	{thirdEstimate?.additional_thickness_millimeters}
																</TableCell>
															</TableRow>

															<TableRow hover={true}>
																<TableCell><b>Cubic Meters:</b></TableCell>
																<TableCell align="right">
																	{thirdEstimate?.perimeter_thickening_cubic_meters}
																</TableCell>
																<TableCell align="right">
																	{thirdEstimate?.construction_joint_thickening_cubic_meters}
																</TableCell>
															</TableRow>

														</TableBody>
													</Table>
												</>
											}

											<h3>Total PrīmX Materials:</h3>
											<Table size='small'>
												<TableBody>
													{thirdEstimate?.total_number_of_20ft_containers != 0 &&
														<TableRow hover={true}>
															<TableCell><b>Total Containers, 20':</b></TableCell>
															<TableCell align="right">
																{thirdEstimate?.total_number_of_20ft_containers?.toLocaleString()}
															</TableCell>
														</TableRow>
													}
													{thirdEstimate?.total_number_of_40ft_containers != 0 &&
														<TableRow hover={true}>
															<TableCell><b>Total Containers, 40':</b></TableCell>
															<TableCell align="right">
																{thirdEstimate?.total_number_of_40ft_containers?.toLocaleString()}
															</TableCell>
														</TableRow>
													}
													<TableRow hover={true}>
														<TableCell><b>Total Pallets:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.total_number_of_pallets?.toLocaleString()}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>

											<h3>PrīmX Material Price for the Project</h3>
											<Table size='small'>
												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>Materials Included:</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.materials_excluded == 'none' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX Fibers, PrīmX UltraCure Blankets'}
															{thirdEstimate?.materials_excluded == 'exclude_cpea' && 'PrīmX DC, PrīmX Flow, PrīmX Fibers, PrīmX UltraCure Blankets'}
															{thirdEstimate?.materials_excluded == 'exclude_fibers' && 'PrīmX DC, PrīmX Flow, PrīmX CPEA, PrīmX UltraCure Blankets'}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
											<br /><br />
											<Table size="small">
												<TableBody>
													{thirdEstimate?.materials_excluded != 'exclude_fibers' &&
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
																<Tooltip title={thirdEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
																	<span>
																		{!isThisASavedCombinedEstimate &&
																			<Radio
																				checked={thirdEstimate?.selected_steel_fiber_dosage == '75_50'}
																				onChange={() => handleSteelFiberSelection('75_50', 'THIRD')}
																				value="75_50"
																				disabled={thirdEstimateAgeInMonths >= 6 ? true : false}
																			/>
																		}
																	</span>
																</Tooltip>
																<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
															</TableCell>
															{thirdEstimate?.measurement_units === 'imperial'
																? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
																: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
															}
														</TableRow>
													}
													<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
														<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
														{thirdEstimate?.measurement_units === 'imperial'
															? <TableCell align="right">{thirdEstimate?.design_cubic_yards_total}</TableCell>
															: <TableCell align="right">{thirdEstimate?.design_cubic_meters_total}</TableCell>
														}
													</TableRow>
													<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
														<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
														<TableCell align="right">{thirdEstimate?.price_per_unit_75_50_display}</TableCell>
													</TableRow>
													<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '75_50' ? { backgroundColor: '#ece9e9' } : {}}>
														<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
														<TableCell align="right">{thirdEstimate?.total_project_cost_75_50_display}</TableCell>
													</TableRow>
													<TableRow>
													</TableRow>
												</TableBody>
											</Table>
											<br /> <br />

											{thirdEstimate?.materials_excluded != 'exclude_fibers' &&
												<Table size="small">
													<TableBody>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={isThisASavedCombinedEstimate ? { paddingLeft: "60px" } : {}}>
																<Tooltip title={thirdEstimateAgeInMonths >= 6 ? "This estimate is older than 6 months.  Please recalculate it to be current with today's pricing before being able to select a price." : ""}>
																	<span>
																		{!isThisASavedCombinedEstimate &&
																			<Radio
																				checked={thirdEstimate?.selected_steel_fiber_dosage == '90_60'}
																				onChange={() => handleSteelFiberSelection('90_60', 'THIRD')}
																				value="90_60"
																				disabled={thirdEstimateAgeInMonths >= 6 ? true : false}
																			/>
																		}
																	</span>
																</Tooltip>
																<b>PrīmX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b>
															</TableCell>
															{thirdEstimate?.measurement_units === 'imperial'
																? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
																: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
															}
														</TableRow>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={{ paddingLeft: "60px" }}><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
															{thirdEstimate?.measurement_units === 'imperial'
																? <TableCell align="right">{thirdEstimate?.design_cubic_yards_total}</TableCell>
																: <TableCell align="right">{thirdEstimate?.design_cubic_meters_total}</TableCell>
															}
														</TableRow>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={{ paddingLeft: "60px" }}><b>PrīmX Price per {cubic_measurement_unit} (USD):</b></TableCell>
															<TableCell align="right">{thirdEstimate?.price_per_unit_90_60_display}</TableCell>
														</TableRow>
														<TableRow hover={true} style={thirdEstimate?.selected_steel_fiber_dosage == '90_60' ? { backgroundColor: '#ece9e9' } : {}}>
															<TableCell style={{ paddingLeft: "60px" }}><b>Total PrīmX Price per Project (USD):</b></TableCell>
															<TableCell align="right">{thirdEstimate?.total_project_cost_90_60_display}</TableCell>
														</TableRow>

														{/* Render the following table row for any orders that haven't been placed yet */}
														{thirdEstimateAgeInMonths >= 6 && !calcCombinedEstimate.estimate_number &&
															<>
																<TableRow hover={true}>

																	<TableCell colSpan={7} align="right">
																		<Button
																			variant="contained"
																			color="primary"
																			onClick={() => handleRecalculateCosts(thirdEstimate, 'thirdEstimate')}
																			style={{ marginTop: "13px" }}
																			className={classes.LexendTeraFont11}
																		>
																			Recalculate Costs
																		</Button>
																	</TableCell>
																</TableRow>
															</>
														}
													</TableBody>
												</Table>
											}
										</TableContainer>
									</Paper>
								</Grid>
							</>}
					</>
				} {/* End Metric Conditional Render */}


				{/* Table #4, Materials Costs Table */}
				<Grid item xs={12}>
					<Paper elevation={3}>
						<TableContainer>
							<h3>Summary Per Project</h3>
							<Table size="small">

								<TableHead>
									<TableRow>
										<TableCell><b>Estimate #</b></TableCell>
										<TableCell><b>Project Name</b></TableCell>
										<TableCell><b>Floor Type</b></TableCell>
										{calcCombinedEstimate.measurement_units == 'imperial'
											? <>
												<TableCell align="right"><b>Area (ft²)</b></TableCell>
												<TableCell align="right"><b>Concrete Amt (yd³)</b></TableCell>
											</>
											: <>
												<TableCell align="right"><b>Area (m²)</b></TableCell>
												<TableCell align="right"><b>Concrete Amt (m³)</b></TableCell>
											</>
										}
										<TableCell><b>Materials Included</b></TableCell>
										<TableCell align="right"><b>Steel Fiber Dosage</b></TableCell>
										{calcCombinedEstimate.measurement_units == 'imperial'
											? <TableCell align="right"><b>Cost per yd³</b></TableCell>
											: <TableCell align="right"><b>Cost per m³</b></TableCell>
										}
										<TableCell align="right"><b>Project Total (USD)</b></TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									<TableRow hover={true}>
										<TableCell>{firstEstimate?.estimate_number}</TableCell>
										<TableCell>{firstEstimate?.project_name}</TableCell>
										<TableCell>{firstEstimate?.floor_type_label}</TableCell>
										{firstEstimate.measurement_units == 'imperial'
											? <>
												<TableCell align="right">{firstEstimate?.square_feet_display}</TableCell>
												<TableCell align="right">{firstEstimate?.design_cubic_yards_total}</TableCell>
											</>
											: <>
												<TableCell align="right">{firstEstimate?.square_meters_display}</TableCell>
												<TableCell align="right">{firstEstimate?.design_cubic_meters_total}</TableCell>
											</>
										}
										<TableCell>{firstEstimate?.materials_excluded == "none" ? "All" : firstEstimate?.materials_excluded == "exclude_cpea" ? "Exclude CPEA" : "Exclude Fibers"}</TableCell>
										<TableCell align="right">
											{firstEstimate.measurement_units == 'imperial' && firstEstimate.selected_steel_fiber_dosage == "75_50" && firstEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</>
											}
											{firstEstimate.measurement_units == 'imperial' && firstEstimate.selected_steel_fiber_dosage == "90_60" && firstEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</>
											}

											{firstEstimate.measurement_units == 'metric' && firstEstimate.selected_steel_fiber_dosage == "75_50" && firstEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}lbs</>
											}
											{firstEstimate.measurement_units == 'metric' && firstEstimate.selected_steel_fiber_dosage == "90_60" && firstEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}lbs</>
											}
											{firstEstimate.materials_excluded == "exclude_fibers" &&
												<>N/A</>
											}
										</TableCell>
										<TableCell align="right">
											{firstEstimate.selected_steel_fiber_dosage && firstEstimate.selected_steel_fiber_dosage == '75_50' &&
												<>{firstEstimate.price_per_unit_75_50_display}</>
											}
											{firstEstimate.selected_steel_fiber_dosage && firstEstimate.selected_steel_fiber_dosage == '90_60' &&
												<>{firstEstimate.price_per_unit_90_60_display}</>
											}
										</TableCell>
										<TableCell align="right">
											{firstEstimate.selected_steel_fiber_dosage && firstEstimate.selected_steel_fiber_dosage == '75_50' &&
												<>{firstEstimate.total_project_cost_75_50_display}</>
											}
											{firstEstimate.selected_steel_fiber_dosage && firstEstimate.selected_steel_fiber_dosage == '90_60' &&
												<>{firstEstimate.total_project_cost_90_60_display}</>
											}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell>{secondEstimate?.estimate_number}</TableCell>
										<TableCell>{secondEstimate?.project_name}</TableCell>
										<TableCell>{secondEstimate?.floor_type_label}</TableCell>
										{firstEstimate.measurement_units == 'imperial'
											? <>
												<TableCell align="right">{secondEstimate?.square_feet_display}</TableCell>
												<TableCell align="right">{secondEstimate?.design_cubic_yards_total}</TableCell>
											</>
											: <>
												<TableCell align="right">{secondEstimate?.square_meters_display}</TableCell>
												<TableCell align="right">{secondEstimate?.design_cubic_meters_total}</TableCell>
											</>
										}
										<TableCell>{secondEstimate?.materials_excluded == "none" ? "All" : secondEstimate?.materials_excluded == "exclude_cpea" ? "Exclude CPEA" : "Exclude Fibers"}</TableCell>
										<TableCell align="right">
											{firstEstimate.measurement_units == 'imperial' && secondEstimate.selected_steel_fiber_dosage == "75_50" && secondEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</>
											}
											{firstEstimate.measurement_units == 'imperial' && secondEstimate.selected_steel_fiber_dosage == "90_60" && secondEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</>
											}
											{firstEstimate.measurement_units == 'metric' && secondEstimate.selected_steel_fiber_dosage == "75_50" && secondEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}lbs</>
											}
											{firstEstimate.measurement_units == 'metric' && secondEstimate.selected_steel_fiber_dosage == "90_60" && secondEstimate.materials_excluded != "exclude_fibers" &&
												<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}lbs</>
											}
											{secondEstimate.materials_excluded == "exclude_fibers" &&
												<>N/A</>
											}
										</TableCell>
										<TableCell align="right">
											{secondEstimate.selected_steel_fiber_dosage && secondEstimate.selected_steel_fiber_dosage == '75_50' &&
												<>{secondEstimate.price_per_unit_75_50_display}</>
											}
											{secondEstimate.selected_steel_fiber_dosage && secondEstimate.selected_steel_fiber_dosage == '90_60' &&
												<>{secondEstimate.price_per_unit_90_60_display}</>
											}
										</TableCell>
										<TableCell align="right">
											{secondEstimate.selected_steel_fiber_dosage && secondEstimate.selected_steel_fiber_dosage == '75_50' &&
												<>{secondEstimate.total_project_cost_75_50_display}</>
											}
											{secondEstimate.selected_steel_fiber_dosage && secondEstimate.selected_steel_fiber_dosage == '90_60' &&
												<>{secondEstimate.total_project_cost_90_60_display}</>
											}
										</TableCell>
									</TableRow>

									{isThereThirdEstimate &&
										<TableRow hover={true}>
											<TableCell>{thirdEstimate?.estimate_number}</TableCell>
											<TableCell>{thirdEstimate?.project_name}</TableCell>
											<TableCell>{thirdEstimate?.floor_type_label}</TableCell>
											{firstEstimate.measurement_units == 'imperial'
												? <>
													<TableCell align="right">{thirdEstimate?.square_feet_display}</TableCell>
													<TableCell align="right">{thirdEstimate?.design_cubic_yards_total}</TableCell>
												</>
												: <>
													<TableCell align="right">{thirdEstimate?.square_meters_display}</TableCell>
													<TableCell align="right">{thirdEstimate?.design_cubic_meters_total}</TableCell>
												</>
											}
											<TableCell>{thirdEstimate?.materials_excluded == "none" ? "All" : thirdEstimate?.materials_excluded == "exclude_cpea" ? "Exclude CPEA" : "Exclude Fibers"}</TableCell>
											<TableCell align="right">
												{firstEstimate.measurement_units == 'imperial' && thirdEstimate.selected_steel_fiber_dosage == "75_50" && thirdEstimate.materials_excluded != "exclude_fibers" &&
													<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</>
												}
												{firstEstimate.measurement_units == 'imperial' && thirdEstimate.selected_steel_fiber_dosage == "90_60" && thirdEstimate.materials_excluded != "exclude_fibers" &&
													<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</>
												}
												{firstEstimate.measurement_units == 'metric' && thirdEstimate.selected_steel_fiber_dosage == "75_50" && thirdEstimate.materials_excluded != "exclude_fibers" &&
													<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}lbs</>
												}
												{firstEstimate.measurement_units == 'metric' && thirdEstimate.selected_steel_fiber_dosage == "90_60" && thirdEstimate.materials_excluded != "exclude_fibers" &&
													<>{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}lbs</>
												}
												{thirdEstimate.materials_excluded == "exclude_fibers" &&
													<>N/A</>
												}
											</TableCell>
											<TableCell align="right">
												{thirdEstimate.selected_steel_fiber_dosage && thirdEstimate.selected_steel_fiber_dosage == '75_50' &&
													<>{thirdEstimate.price_per_unit_75_50_display}</>
												}
												{thirdEstimate.selected_steel_fiber_dosage && thirdEstimate.selected_steel_fiber_dosage == '90_60' &&
													<>{thirdEstimate.price_per_unit_90_60_display}</>
												}
											</TableCell>
											<TableCell align="right">
												{thirdEstimate.selected_steel_fiber_dosage && thirdEstimate.selected_steel_fiber_dosage == '75_50' &&
													<>{thirdEstimate.total_project_cost_75_50_display}</>
												}
												{thirdEstimate.selected_steel_fiber_dosage && thirdEstimate.selected_steel_fiber_dosage == '90_60' &&
													<>{thirdEstimate.total_project_cost_90_60_display}</>
												}
											</TableCell>
										</TableRow>
									}

									{/* {showFinalCostRow && <> */}
									<br /> <br />
									<TableRow hover={true}>
										<TableCell colSpan={8} align="right">
											<b>Total Concrete Amt ({cubic_measurement_unit}):</b>
										</TableCell>
										<TableCell align="right">
											{showFinalCostRow &&
												calcCombinedEstimate?.measurement_units == 'imperial'
												? calcCombinedEstimate?.design_cubic_yards_total?.toLocaleString('en-US')
												: calcCombinedEstimate?.design_cubic_meters_total?.toLocaleString('en-US')
											}
										</TableCell>
									</TableRow>
									<TableRow hover={true}>

										<TableCell colSpan={8} align="right">
											<b>Total for All Floors (USD):</b>
										</TableCell>
										<TableCell align="right">
											{showFinalCostRow &&
												calcCombinedEstimate?.total_project_cost_75_50_display
											}
										</TableCell>

									</TableRow>

									{!calcCombinedEstimate.ordered_by_licensee && calcEstimateAgeInMonths <= 5 && !editState &&
										<TableRow hover={true} style={{ verticalAlign: "middle" }} className="removeInPrint" >
											<TableCell colSpan={9} align="right">
												{((firstEstimate.used_in_a_combined_order == true) &&
													(secondEstimate.used_in_a_combined_order == true) &&
													((JSON.stringify(thirdEstimate) === '{}') || (thirdEstimate.used_in_a_combined_order == true))) ?
													<>
														<Button
															color="primary"
															variant="contained"
															// onClick={handleEdit}
															onClick={() => setEditState(!editState)}
															className={classes.LexendTeraFont11}
															style={{ float: "left", marginTop: "13px" }}
														>
															Edit This Estimate
														</Button>

														<Button
															variant="contained"
															color="primary"
															onClick={() => window.print()}
															className={classes.LexendTeraFont11}
															style={{ float: "left", marginTop: "13px", marginLeft: "10px" }}
														>
															Export Estimate
														</Button>

														<TextField
															onChange={(event) => setPoNumber(event.target.value)}
															value={poNumber}
															size="small"
															label="PO Number"
															helperText={poNumError}
														/>
														&nbsp; &nbsp;
														<Button
															variant="contained"
															color="secondary"
															onClick={handlePlaceOrder}
															style={{ marginTop: "13px" }}
															className={classes.LexendTeraFont11}
														>
															Place Order
														</Button>
													</> : <>
														<section className="removeInPrint">
															{!showFinalCostRow &&
																<Tooltip
																	title={`Please select dosage options for all of the above estimates before being able to save, via the circular buttons to the left of the "PrīmX Steel Fibers" label.`}
																	placement="left-end"
																	arrow
																	color="primary"
																	style={{
																		marginBottom: "-9px",
																		marginRight: "10px",
																	}}
																>
																	<HelpIcon />
																</Tooltip>
															}
															<Button
																variant="contained"
																color="primary"
																onClick={handleSave}
																className={classes.LexendTeraFont11}
																disabled={!showFinalCostRow && true}
															>
																Save Estimate
															</Button>
														</section>
													</>
												}
											</TableCell>
										</TableRow>
									}

									{!calcCombinedEstimate.ordered_by_licensee && calcEstimateAgeInMonths >= 6 &&
										<TableRow hover={true}>
											<TableCell>
												<Button
													variant="contained"
													color="primary"
													onClick={() => window.print()}
													className={classes.LexendTeraFont11}
													style={{ float: "left", marginTop: "13px", marginLeft: "10px" }}
												>
													Export Estimate
												</Button>
											</TableCell>
											<TableCell colSpan={8} align="right">
												<Tooltip title={`This estimate is more than 6 months old and must be recalculated to be current with today's rates before it can be placed for order.`} placement="right-end" arrow>
													<Button
														variant="contained"
														color="primary"
														onClick={() => handleRecalculateCosts(calcCombinedEstimate, 'calcCombinedEstimate')}
														style={{ marginTop: "13px" }}
														className={classes.LexendTeraFont11}
													>
														Recalculate Costs
													</Button>
												</Tooltip>
											</TableCell>
										</TableRow>
									}

									{editState &&
										<TableRow hover={true}>
											<TableCell colSpan={9} align="right">
												<Button
													onClick={handleEditSave}
													variant="contained"
													className={classes.LexendTeraFont11}
													color="primary"
												>
													Save Edits
												</Button>
											</TableCell>
										</TableRow>
									}

									{/* </>} */}


								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>

		</>
	)
}


