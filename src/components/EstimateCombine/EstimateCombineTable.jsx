//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
// ⬇ Dependent Functionality:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, Select, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormHelperText, Snackbar } from '@material-ui/core';
import { useParams } from 'react-router';
import { useStyles } from '../MuiStyling/MuiStyling';
//#endregion ⬆⬆ All document setup above.



export default function EstimateCombineTable({ firstEstimate, secondEstimate, thirdEstimate, calcCombinedEstimate }) {
	//#region ⬇⬇ All state variables below:
	// ⬇ Deprecated, used for Styling MUI components. 
	const classes = useStyles();
	// ⬇ Sets the error state for a faulty search:
	const [poNumError, setPoNumError] = useState("");
	const [poNumber, setPoNumber] = useState('');
	// ⬇ Used for page navigation:
	const dispatch = useDispatch();
	const history = useHistory();
	// ⬇ hasRecalculated is a boolean that defaults to false. When a user recalculates costs, the boolean gets set to true, which activates the Submit Order button.
	const hasRecalculated = useSelector(store => store.estimatesReducer.hasRecalculated);
	// ⬇ Used for handle the state of how many tables to show:
	const [tableWidth, setTableWidth] = useState(4);
	// ⬇ Checks if the third estimate is populated, and if so, adjusts the table size to display accordingly:
	useEffect(() => {
		if (Object.keys(thirdEstimate).length != 0) {
			setTableWidth(6);
		} else {
			setTableWidth(4);
		} // End if/else
	}, [thirdEstimate]); // End useEffect 
	//#endregion ⬆⬆ All state variables above. 


	//#region ⬇⬇ Event handlers below:
	/** ⬇ handleRecalculateCosts:
	 * Click handler for the recalculate costs button. When clicked, runs the calculateEstimate function to get updated cost numbers with current shipping and materials pricing, saves (POSTS) the updates as a new estimate, brings the user to the new estimate view, and allows user to click the submit order button
	 */
	const handleRecalculateCosts = () => {
		// ⬇ Attach history from useHistory to the searchResult object to allow navigation from inside the saga:
		calcCombinedEstimate.history = history;
		// ⬇ Needs to GET shipping information and pricing information before recalculating
		dispatch({ type: 'RECALCULATE_ESTIMATE', payload: calcCombinedEstimate });
		dispatch({ type: 'GET_RECALCULATE_INFO' });
	} // End handleRecalculateCosts

	/** ⬇ handleSave:
	 * When clicked, this will post the object to the DB and send the user back to the dashboard. 
	 */
	const handleSave = event => {
		// ⬇ Attach history from useHistory to the estimate object to allow navigation from inside the saga:
		calcCombinedEstimate.history = history;
		// Attach the estimate numbers to use inside the POST: 
		calcCombinedEstimate.estimate_number_combined_1 = firstEstimate.estimate_number;
		calcCombinedEstimate.estimate_number_combined_2 = secondEstimate.estimate_number;
		calcCombinedEstimate.estimate_number_combined_3 = thirdEstimate.estimate_number;
		// ⬇ Send the estimate object to be POSTed:
		dispatch({ type: 'ADD_ESTIMATE', payload: calcCombinedEstimate });
		// ⬇ Sweet Alert to let them know to save the Estimate #:
		swal({
			title: "Estimate saved!",
			text: "NOTE: Your estimate number has changed! Please print or save it, as you will need it to look up this estimate again, and submit the order for processing.",
			icon: "info",
			buttons: "I understand",
		}).then(() => {
			// ⬇ Pop-up print confirmation:
			window.print();
		}); // End swal
	} // End handleSave

	/** ⬇ handlePlaceOrder:
 * Click handler for the Place Order button. 
 */
	const handlePlaceOrder = () => {
		// ⬇ If they haven't entered a PO number, pop up an error helperText:
		if (poNumber == "") {
			setPoNumError("Please enter a P.O. Number.")
			// ⬇ If they have entered a PO number, proceed with order submission:
		} else {
			swal({
				title: "This order has been submitted! Your PrimX representative will be in touch.",
				text: "Please print or save this page. You will need the estimate number to check the order status in the future.",
				icon: "success",
				buttons: "I understand",
			}) // End swal
			// ⬇ We're disabling the print confirmation now that the estimate numbers are easier to recall:
			// .then(() => {
			//   window.print();
			// }); // End swal
			dispatch({
				type: 'MARK_COMBINED_ESTIMATE_ORDERED',
				payload: {
					calcCombinedEstimate: calcCombinedEstimate,
					poNumber: poNumber
				}
			}) // End dispatch
		} // End if/else.
	} // End handlePlaceOrder
	//#endregion ⬆⬆ Event handlers above. 


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
							<h3>Estimate {calcCombinedEstimate.estimate_number}</h3>
							<h4>Licensee & Project Information</h4>
							<Table size="small">
								<TableBody>

									<TableRow hover={true}>
										<TableCell><b>Project Name:</b></TableCell>
										<TableCell>
											{firstEstimate?.project_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Licensee/Contractor Name:</b></TableCell>
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
											{firstEstimate?.floor_type}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Placement Type:</b></TableCell>
										<TableCell>
											{firstEstimate?.placement_type}
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
											{firstEstimate?.date_created}
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
											{firstEstimate?.ship_to_state_province}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
										<TableCell>
											{firstEstimate?.zip_postal_code}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Country:</b></TableCell>
										<TableCell>
											{firstEstimate?.country}
										</TableCell>
									</TableRow>

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
									{thirdEstimate.estimate_number &&
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

									<h4>Materials Table</h4>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell></TableCell>
												<TableCell align="right"><b>Dosage Rate (per yd³)</b></TableCell>
												<TableCell align="right"><b>Amount Needed</b></TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>PrīmX DC (lbs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_dc_dosage_lbs_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_dc_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_flow_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_flow_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Steel Fibers (lbs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_steel_fibers_dosage_lbs_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_steel_fibers_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX UltraCure Blankets (ft²):</b></TableCell>
												<TableCell align="right">
													N/A
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_ultracure_blankets_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_cpea_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_cpea_total_project_amount}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
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

									<h4>Materials Table</h4>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell></TableCell>
												<TableCell align="right"><b>Dosage Rate (per yd³)</b></TableCell>
												<TableCell align="right"><b>Amount Needed</b></TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>PrīmX DC (lbs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_dc_dosage_lbs_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_dc_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_flow_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_flow_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Steel Fibers (lbs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_steel_fibers_dosage_lbs_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_steel_fibers_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX UltraCure Blankets (ft²):</b></TableCell>
												<TableCell align="right">
													N/A
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_ultracure_blankets_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_cpea_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_cpea_total_project_amount}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>

								</TableContainer>
							</Paper>
						</Grid>

						{thirdEstimate && thirdEstimate.measurement_units == 'imperial' &&
							<>
								<Grid item xs={6}>
									<Paper elevation={3}>
										<TableContainer>

											<h3>Estimate {thirdEstimate.estimate_number}</h3>
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

											<h4>Materials Table</h4>
											<Table size="small">
												<TableHead>
													<TableRow>
														<TableCell></TableCell>
														<TableCell align="right"><b>Dosage Rate (per yd³)</b></TableCell>
														<TableCell align="right"><b>Amount Needed</b></TableCell>
													</TableRow>
												</TableHead>

												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>PrīmX DC (lbs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_dc_dosage_lbs_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_dc_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_flow_dosage_liters_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_flow_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX Steel Fibers (lbs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_steel_fibers_dosage_lbs_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_steel_fibers_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX UltraCure Blankets (ft²):</b></TableCell>
														<TableCell align="right">
															N/A
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_ultracure_blankets_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_cpea_dosage_liters_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_cpea_total_project_amount}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
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

									<h3>Estimate #1 Materials Table</h3>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell></TableCell>
												<TableCell align="right"><b>Dosage Rate (per m³)</b></TableCell>
												<TableCell align="right"><b>Amount Needed</b></TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>PrīmX DC (kgs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_dc_dosage_kgs_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_dc_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_flow_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_flow_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Steel Fibers (kgs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_steel_fibers_dosage_kgs_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_steel_fibers_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX UltraCure Blankets (m²):</b></TableCell>
												<TableCell align="right">
													N/A
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_ultracure_blankets_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_cpea_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{firstEstimate?.primx_cpea_total_project_amount}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
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

									<h3>Estimate #2 Materials Table</h3>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell></TableCell>
												<TableCell align="right"><b>Dosage Rate (per m³)</b></TableCell>
												<TableCell align="right"><b>Amount Needed</b></TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>PrīmX DC (kgs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_dc_dosage_kgs_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_dc_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_flow_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_flow_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX Steel Fibers (kgs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_steel_fibers_dosage_kgs_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_steel_fibers_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX UltraCure Blankets (m²):</b></TableCell>
												<TableCell align="right">
													N/A
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_ultracure_blankets_total_project_amount}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_cpea_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{secondEstimate?.primx_cpea_total_project_amount}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						</Grid>


						{thirdEstimate && thirdEstimate.measurement_units == 'metric' &&
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

											<h3>Estimate #3 Materials Table</h3>
											<Table size="small">
												<TableHead>
													<TableRow>
														<TableCell></TableCell>
														<TableCell align="right"><b>Dosage Rate (per m³)</b></TableCell>
														<TableCell align="right"><b>Amount Needed</b></TableCell>
													</TableRow>
												</TableHead>

												<TableBody>
													<TableRow hover={true}>
														<TableCell><b>PrīmX DC (kgs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_dc_dosage_kgs_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_dc_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_flow_dosage_liters_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_flow_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX Steel Fibers (kgs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_steel_fibers_dosage_kgs_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_steel_fibers_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX UltraCure Blankets (m²):</b></TableCell>
														<TableCell align="right">
															N/A
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_ultracure_blankets_total_project_amount}
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_cpea_dosage_liters_display}
														</TableCell>
														<TableCell align="right">
															{thirdEstimate?.primx_cpea_total_project_amount}
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
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
							<h3>Total Combined Materials Table</h3>
							<Table size="small">

								<TableHead>
									<TableRow hover={true}>
										<TableCell></TableCell>
										{/* Conditionally render either imperial or metric table headings */}
										{calcCombinedEstimate.measurement_units == 'imperial' ?
											<>
												<TableCell align="right"><b>PrīmX DC (lbs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Flow (ltrs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Steel Fibers (lbs)</b></TableCell>
												<TableCell align="right"><b>PrīmX UltraCure Blankets (ft²)</b></TableCell>
												<TableCell align="right"><b>PrīmX CPEA (ltrs)</b></TableCell>
											</> : <>
												<TableCell align="right"><b>PrīmX DC (kgs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Flow (ltrs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Steel Fibers (kgs)</b></TableCell>
												<TableCell align="right"><b>PrīmX UltraCure Blankets (m²)</b></TableCell>
												<TableCell align="right"><b>PrīmX CPEA (ltrs)</b></TableCell>
											</>
										} {/* End conditionally rendered table headings*/}
										<TableCell></TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{/* Total amounts share key names between imperial and metric */}
									<TableRow hover={true}>
										<TableCell><b>Total Project Amount:</b></TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_dc_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_flow_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_steel_fibers_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_ultracure_blankets_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_cpea_total_project_amount}
										</TableCell>
										<TableCell></TableCell>
									</TableRow>

									{calcCombinedEstimate?.materials_on_hand &&
										<>
											{calcCombinedEstimate.measurement_units == "imperial" ?
												<TableRow hover={true}>
													<TableCell><b>Materials On Hand:</b></TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_dc_on_hand_lbs_display}
													</TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_flow_on_hand_liters_display}
													</TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_steel_fibers_on_hand_lbs_display}
													</TableCell>
													<TableCell align="right"
													>{calcCombinedEstimate?.primx_ultracure_blankets_on_hand_sq_ft_display}
													</TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_cpea_on_hand_liters_display}
													</TableCell>
													<TableCell align="right"></TableCell>
												</TableRow>
												:	// Else measurement_units == 'metric', below: 
												<TableRow hover={true}>
													<TableCell><b>Materials On Hand:</b></TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_dc_on_hand_kgs_display}
													</TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_flow_on_hand_liters_display}
													</TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_steel_fibers_on_hand_kgs_display}</TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_ultracure_blankets_on_hand_sq_m_display}
													</TableCell>
													<TableCell align="right">
														{calcCombinedEstimate?.primx_cpea_on_hand_liters_display}
													</TableCell>
													<TableCell align="right"></TableCell>
												</TableRow>
											} {/* End imperial/metric conditional rendering */}
											{/* These rows are shared for both imperial and metric, but only shown if Materials On Hand is checked: */}
											<TableRow hover={true}>
												<TableCell><b>Total Order Amount:</b></TableCell>
												<TableCell align="right">
													{calcCombinedEstimate.primx_dc_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{calcCombinedEstimate.primx_flow_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{calcCombinedEstimate.primx_steel_fibers_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{calcCombinedEstimate.primx_ultracure_blankets_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{calcCombinedEstimate.primx_cpea_total_order_amount}
												</TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
										</>
									} {/* End Materials On Hand Conditional Rendering */}

									<TableRow hover={true}>
										<TableCell><b>Packaging Capacity:</b></TableCell>
										{/* Conditionally render either imperial or metric packaging capacity numbers */}
										{calcCombinedEstimate.measurement_units == 'imperial' ?
											<>
												<TableCell align="right">2,756</TableCell>
												<TableCell align="right">1,000</TableCell>
												<TableCell align="right">42,329</TableCell>
												<TableCell align="right">6,458</TableCell>
												<TableCell align="right">1,000</TableCell>
											</> :
											<>
												<TableCell align="right">1,250</TableCell>
												<TableCell align="right">1,000</TableCell>
												<TableCell align="right">19,200</TableCell>
												<TableCell align="right">600</TableCell>
												<TableCell align="right">1,000</TableCell>
											</>
										} {/* End conditionally rendered packaging capacity numbers*/}
										<TableCell></TableCell>
									</TableRow>

									{/* All following table data has shared key names between both metric and imperial */}
									<TableRow hover={true}>
										<TableCell><b>Packages Needed:</b></TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_dc_packages_needed}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_flow_packages_needed}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_steel_fibers_packages_needed}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_ultracure_blankets_packages_needed}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_cpea_packages_needed}
										</TableCell>
										<TableCell></TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Final Order Amount:</b></TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_dc_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_flow_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_steel_fibers_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_ultracure_blankets_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_cpea_final_order_amount}
										</TableCell>
										<TableCell></TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Materials Price:</b></TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_dc_unit_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_flow_unit_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_steel_fibers_unit_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_ultracure_blankets_unit_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_cpea_unit_price}
										</TableCell>
										<TableCell align="right">
											<b>Totals</b>
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Total Materials Price:</b></TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_dc_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_flow_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_steel_fibers_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_ultracure_blankets_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_cpea_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.design_total_materials_price}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Containers:</b></TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_dc_containers_needed}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_flow_containers_needed}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_steel_fibers_containers_needed}
										</TableCell>
										<TableCell align="right">
											0</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_cpea_containers_needed}
										</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.design_total_containers}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Estimate:</b></TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_dc_calculated_shipping_estimate}
											</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_flow_calculated_shipping_estimate}
											</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_steel_fibers_calculated_shipping_estimate}
											</TableCell>
										<TableCell align="right">
											0</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.primx_cpea_calculated_shipping_estimate}
											</TableCell>
										<TableCell align="right">
											{calcCombinedEstimate?.design_total_shipping_estimate}
											</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Total Cost:</b></TableCell>
										<TableCell align="right">
											<b>{calcCombinedEstimate?.primx_dc_total_cost_estimate}</b>
											</TableCell>
										<TableCell align="right">
											<b>{calcCombinedEstimate?.primx_flow_total_cost_estimate}</b>
											</TableCell>
										<TableCell align="right">
											<b>{calcCombinedEstimate?.primx_steel_fibers_total_cost_estimate}</b>
											</TableCell>
										<TableCell align="right">
											<b>{calcCombinedEstimate?.primx_ultracure_blankets_total_cost_estimate}</b>
											</TableCell>
										<TableCell align="right">
											<b>{calcCombinedEstimate?.primx_cpea_total_cost_estimate}</b>
											</TableCell>
										<TableCell align="right">
											<b>{calcCombinedEstimate?.design_total_price_estimate}</b>
											</TableCell>
									</TableRow>

									{calcCombinedEstimate.measurement_units == "imperial" ?
										<TableRow hover={true}>
											<TableCell><b>Cost per ft²:</b></TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_dc_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_flow_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_steel_fibers_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_ultracure_blankets_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_cpea_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_design_total_cost_per_sq_ft}
											</TableCell>
										</TableRow>
										: // Else measurement_units == 'metric', below: 
										<TableRow hover={true}>
											<TableCell><b>Cost per m²:</b></TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_dc_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_flow_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_steel_fibers_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_ultracure_blankets_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_cpea_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{calcCombinedEstimate?.primx_design_total_cost_per_sq_m}
											</TableCell>
										</TableRow>
									}

									{/* Render the following table row for any orders that haven't been placed yet */}
									{!calcCombinedEstimate?.ordered_by_licensee &&
										<>
											<TableRow hover={true}>
												<TableCell colSpan={7} align="right">
													<section className="removeInPrint">

														{/* Recalculate Costs Button: */}
														<Button
															variant="contained"
															color="primary"
															onClick={handleRecalculateCosts}
															className={classes.LexendTeraFont11}
														>
															Recalculate Costs
														</Button>

														&nbsp; &nbsp;

														{/* Conditional rendering below:
                          - If recalculated is true, show the next set:
                          - If these estimate numbers have been saved in an estimate prior, show submit: */}
														{hasRecalculated ?
															<>
																{/* Recalc True ALL: */}
																{((firstEstimate.used_in_a_combined_order == true) &&
																	(secondEstimate.used_in_a_combined_order == true) &&
																	((JSON.stringify(thirdEstimate) === '{}') || (thirdEstimate.used_in_a_combined_order == true))) ?
																	<>
																		{/* Recalc True and Saved True -- Show submit Button */}
																		<TextField
																			onChange={(event) => setPoNumber(event.target.value)}
																			size="small"
																			label="PO Number"
																			helperText={poNumError}
																		/>
																		&nbsp; &nbsp;
																		<Button
																			variant="contained"
																			color="secondary"
																			onClick={handlePlaceOrder}
																			className={classes.LexendTeraFont11}
																		>
																			Place Order
																		</Button>
																	</> : <>
																		{/* Recalc True and Saved False -- Show Save Button */}
																		<Button
																			variant="contained"
																			color="secondary"
																			onClick={handleSave}
																			className={classes.LexendTeraFont11}
																		>
																			Save Estimate
																		</Button>
																	</>
																}
															</> : <>
																{/* Recalc False ALL: */}
																{((firstEstimate.used_in_a_combined_order == true) &&
																	(secondEstimate.used_in_a_combined_order == true) &&
																	(JSON.stringify(thirdEstimate) === '{}' || thirdEstimate.used_in_a_combined_order == true)) ?
																	<>
																		{/* Realc False and Saved True -- Show grayed out submit */}
																		Recalculate costs before placing order.
																		&nbsp; &nbsp;
																		<Button
																			variant="contained"
																			disabled
																			className={classes.LexendTeraFont11}
																		>
																			Place Order
																		</Button>
																	</> : <>
																		{/* Recalc False and Saved False -- Show grayed out Save */}
																		<Button
																			variant="contained"
																			disabled
																			className={classes.LexendTeraFont11}
																		>
																			Save Estimate
																		</Button>
																	</>
																}
															</>
														}
													</section>
												</TableCell>
											</TableRow>
										</>
									} {/* End conditional render on materials table displaying buttons*/}

									{/* End Materials Table */}

								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>

		</>
	)
}


