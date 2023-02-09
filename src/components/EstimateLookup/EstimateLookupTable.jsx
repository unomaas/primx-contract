//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
// ⬇ Dependent Functionality:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, Select, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormHelperText, Snackbar, Switch } from '@material-ui/core';
import { useStyles } from '../MuiStyling/MuiStyling';
//#endregion ⬆⬆ All document setup above.



export default function EstimateLookupTable() {
	//#region ⬇⬇ All state variables below:
	// ⬇ searchResult below is an estimate object searched from the DB that has already been mutated by the useEstimateCalculations function.
	const searchResult = useSelector(store => store.estimatesReducer.searchedEstimate);
	// ⬇ hasRecalculated is a boolean that defaults to false. When a user recalculates costs, the boolean gets set to true, which activates the Submit Order button.
	const hasRecalculated = useSelector(store => store.estimatesReducer.hasRecalculated);
	const classes = useStyles(); // Keep in for MUI styling. 
	const [poNumError, setPoNumError] = useState("");
	const [poNumber, setPoNumber] = useState('');
	const dispatch = useDispatch();
	const history = useHistory();
	const dosageRates = useSelector(store => store.dosageRates.dosageRatesArray);

	console.log(`Ryan Here \n dosageRates`, dosageRates);

	// ⬇ Component has a main view at /lookup and a sub-view of /lookup/... where ... is the licensee ID appended with the estimate number.
	const { licensee_id_searched, estimate_number_searched, first_estimate_number_combined, second_estimate_number_combined, third_estimate_number_combined } = useParams();
	let cubic_measurement_unit = searchResult?.measurement_units === "imperial" ? "yd³" : "m³";
	//#endregion ⬆⬆ All state variables above. 


	//#region ⬇⬇ Event handlers below:
	/** ⬇ handleRecalculateCosts:
	 * Click handler for the recalculate costs button. When clicked, runs the caluclateEstimate function to get updated cost numbers with current shipping and materials pricing, saves (POSTS) the updates as a new estimate, brings the user to the new estimate view, and allows user to click the submit order button
	 */
	const handleRecalculateCosts = () => {
		// ⬇ Attach history from useHistory to the searchResult object to allow navigation from inside the saga:
		searchResult.history = history;
		// ⬇ Needs to GET shipping information and pricing information before recalculating
		dispatch({ type: 'RECALCULATE_ESTIMATE', payload: searchResult });
		dispatch({ type: 'GET_RECALCULATE_INFO' });
	} // End handleRecalculateCosts

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
				// TODO: Test this works.
				type: 'MARK_ESTIMATE_ORDERED',
				payload: {
					id: searchResult.estimate_id,
					po_number: poNumber,
					licensee_id: searchResult.licensee_id,
					estimate_number: searchResult.estimate_number
				} // End payload
			}) // End dispatch
		} // End if/else.
	} // End handlePlaceOrder

	/** ⬇ handleEdit:
	 * Sends the user back to 1.0 Create Estimate with data pre-loaded to make edits. 
	 */
	const handleEdit = () => {
		dispatch({ type: 'SET_EDIT_DATA', payload: searchResult });
		dispatch({ type: 'SET_TABLE_STATE', payload: true });
		dispatch({ type: 'SET_EDIT_STATE', payload: true });
		history.push(`/create`);
	}; // End handleClose
	//#endregion ⬆⬆ Event handlers above. 


	// ⬇ Rendering below:
	return (
		<div>
			<Grid container
				spacing={2}
				justifyContent="center"
			>
				{/* Grid Table #1: Display the Licensee/Project Info Form : Shared between imperial and metric*/}
				<Grid item xs={6}>
					<Paper elevation={3}>
						<TableContainer>
							<h3>Licensee & Project Information</h3>
							<Table size="small">
								<TableBody>

									<TableRow hover={true}>
										<TableCell><b>Project Name:</b></TableCell>
										<TableCell>
											{searchResult?.project_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Licensee/Contractor Name:</b></TableCell>
										<TableCell>
											{searchResult?.licensee_contractor_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project General Contractor:</b></TableCell>
										<TableCell>
											{searchResult?.project_general_contractor}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project Manager Name:</b></TableCell>
										<TableCell>
											{searchResult?.project_manager_name}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project Manager Email:</b></TableCell>
										<TableCell>
											{searchResult?.project_manager_email}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Project Manager Cell:</b></TableCell>
										<TableCell>
											{searchResult?.project_manager_phone}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Floor Type:</b></TableCell>
										<TableCell>
											{searchResult?.floor_type_label}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Placement Type:</b></TableCell>
										<TableCell>
											{searchResult?.placement_type_label}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Unit of Measurement:</b></TableCell>
										<TableCell>
											{searchResult?.measurement_units?.charAt(0)?.toUpperCase() + searchResult?.measurement_units?.slice(1)}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Estimate Creation Date:</b></TableCell>
										<TableCell>
											{searchResult?.date_created}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Anticipated First Pour Date:</b></TableCell>
										<TableCell>
											{searchResult?.anticipated_first_pour_date}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Street Address:</b></TableCell>
										<TableCell>
											{searchResult?.ship_to_address}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping City:</b></TableCell>
										<TableCell>
											{searchResult?.ship_to_city}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping State/Province:</b></TableCell>
										<TableCell>
											{searchResult?.destination_name}, {searchResult?.destination_country}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
										<TableCell>
											{searchResult?.zip_postal_code}
										</TableCell>
									</TableRow>
									{/* 
									<TableRow hover={true}>
										<TableCell><b>Shipping Country:</b></TableCell>
										<TableCell>
											{searchResult?.country}
										</TableCell>
									</TableRow> */}

								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
				{/* End Licensee and Project Information table */}


				{/* Table #2 Imperial: conditionally render the imperial needs*/}
				{searchResult.measurement_units == 'imperial' &&
					<>
						<Grid item xs={6}>
							<Paper elevation={3}>
								<TableContainer>
									<h3>Project Quantity Calculations</h3>
									<Table size="small">
										<TableBody>

											<TableRow hover={true}>
												<TableCell><b>Square Feet:</b></TableCell>
												<TableCell align="right">
													{searchResult?.square_feet_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (in):</b></TableCell>
												<TableCell align="right">
													{searchResult?.thickness_inches_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{searchResult?.cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
												<TableCell align="right">
													{searchResult?.perimeter_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
												<TableCell align="right">
													{searchResult?.construction_joint_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{searchResult?.cubic_yards_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
												<TableCell align="right">
													{searchResult?.waste_factor_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{searchResult?.design_cubic_yards_total}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>

									<h3>Thickened Edge Calculator</h3>
									<p>If applicable, for slabs under 6in.</p>
									<Table size="small">

										<TableHead>
											<TableRow hover={true}>
												<TableCell></TableCell>
												<TableCell align="right"><b>Perimeter</b></TableCell>
												<TableCell align="right"><b>Construction Joint</b></TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Lineal Feet:</b></TableCell>
												<TableCell align="right">
													{searchResult?.thickened_edge_perimeter_lineal_feet_display}
												</TableCell>
												<TableCell align="right">
													{searchResult?.thickened_edge_construction_joint_lineal_feet_display}
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
													{searchResult?.additional_thickness_inches}
												</TableCell>
												<TableCell align="right">
													{searchResult?.additional_thickness_inches}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{searchResult?.perimeter_thickening_cubic_yards}
												</TableCell>
												<TableCell align="right">
													{searchResult?.construction_joint_thickening_cubic_yards}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						</Grid>
					</>
				} {/* End imperial conditional rendering*/}


				{/* Table #3: Metric - conditionally render the metric needs */}
				{searchResult.measurement_units == 'metric' &&
					<>
						<Grid item xs={6}>
							<Paper elevation={3}>
								<TableContainer>
									<h3>Project Quantity Calculations</h3>
									<Table size="small">
										<TableBody>

											<TableRow hover={true}>
												<TableCell><b>Square Meters:</b></TableCell>
												<TableCell align="right">
													{searchResult?.square_meters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (mm):</b></TableCell>
												<TableCell align="right">
													{searchResult?.thickness_millimeters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{searchResult?.cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
												<TableCell align="right">
													{searchResult?.perimeter_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
												<TableCell align="right">
													{searchResult?.construction_joint_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{searchResult?.cubic_meters_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
												<TableCell align="right">
													{searchResult?.waste_factor_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{searchResult?.design_cubic_meters_total}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>

									<h3>Thickened Edge Calculator</h3>
									<p>If applicable, for slabs under 150mm.</p>
									<Table size="small">

										<TableHead>
											<TableRow hover={true}>
												<TableCell></TableCell>
												<TableCell align="right"><b>Perimeter</b></TableCell>
												<TableCell align="right"><b>Construction Joint</b></TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Lineal Meters:</b></TableCell>
												<TableCell align="right">
													{searchResult?.thickened_edge_perimeter_lineal_meters_display}
												</TableCell>
												<TableCell align="right">
													{searchResult?.thickened_edge_construction_joint_lineal_meters_display}
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
													{searchResult?.additional_thickness_millimeters}
												</TableCell>
												<TableCell align="right">
													{searchResult?.additional_thickness_millimeters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{searchResult?.perimeter_thickening_cubic_meters}
												</TableCell>
												<TableCell align="right">
													{searchResult?.construction_joint_thickening_cubic_meters}
												</TableCell>
											</TableRow>

										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						</Grid>
					</>
				} {/* End Metric Conditional Render */}


				{/* Table #4, Materials Costs Table */}
				<Grid item xs={12}>
					<Paper elevation={3}>
						<TableContainer>
							<h3>PrimX Material Price for the Project</h3>
							<Table size="small">

								<TableBody>
									<TableRow hover={true}>

										<TableCell><b>Materials Included:</b></TableCell>
										<TableCell align="right">
											{searchResult?.materials_excluded == 'none' && 'PrimX DC, PrimX Flow, PrimX CPEA, PrimX Fibers, PrimX UltraCure Blankets'}
											{searchResult?.materials_excluded == 'exclude_cpea' && 'PrimX DC, PrimX Flow, PrimX Fibers, PrimX UltraCure Blankets'}
											{searchResult?.materials_excluded == 'exclude_fibers' && 'PrimX DC, PrimX Flow, PrimX CPEA, PrimX UltraCure Blankets'}
										</TableCell>
									</TableRow>
									<br /><br />
									{searchResult?.materials_excluded != 'exclude_fibers' &&
										<TableRow hover={true}>
											<TableCell><b>PrimX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b></TableCell>
											{searchResult?.measurement_units === 'imperial'
												? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3).lbs_y3}lbs</TableCell>
												: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5).kg_m3}kg</TableCell>
											}
										</TableRow>
									}
									<TableRow hover={true}>
										<TableCell><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
										{searchResult?.measurement_units === 'imperial'
											? <TableCell align="right">{searchResult?.design_cubic_yards_total}</TableCell>
											: <TableCell align="right">{searchResult?.design_cubic_meters_total}</TableCell>
										}
									</TableRow>
									<TableRow hover={true}>
										<TableCell><b>PrimX Price per {cubic_measurement_unit} (USD):</b></TableCell>
										<TableCell align="right">{searchResult?.price_per_unit_75_50_display}</TableCell>
									</TableRow>
									<TableRow hover={true}>
										<TableCell><b>Total PrimX Price per Project (USD):</b></TableCell>
										<TableCell align="right">{searchResult?.total_project_cost_75_50_display}</TableCell>
									</TableRow>
									<TableRow>
									</TableRow>
								</TableBody>
							</Table>
							<br /> <br />

							{searchResult?.materials_excluded != 'exclude_fibers' &&
								<Table size="small">
									<TableBody>
										<TableRow hover={true}>
											<TableCell><b>PrimX Steel Fibers @ Dosage Rate per {cubic_measurement_unit}:</b></TableCell>
											{searchResult?.measurement_units === 'imperial'
												? <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4).lbs_y3}lbs</TableCell>
												: <TableCell align="right">{dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6).kg_m3}kg</TableCell>
											}
										</TableRow>
										<TableRow hover={true}>
											<TableCell><b>Total Project Amount, Concrete ({cubic_measurement_unit}):</b></TableCell>
											{searchResult?.measurement_units === 'imperial'
												? <TableCell align="right">{searchResult?.design_cubic_yards_total}</TableCell>
												: <TableCell align="right">{searchResult?.design_cubic_meters_total}</TableCell>
											}
										</TableRow>
										<TableRow hover={true}>
											<TableCell><b>PrimX Price per {cubic_measurement_unit} (USD):</b></TableCell>
											<TableCell align="right">{searchResult?.price_per_unit_90_60_display}</TableCell>
										</TableRow>
										<TableRow hover={true}>
											<TableCell><b>Total PrimX Price per Project (USD):</b></TableCell>
											<TableCell align="right">{searchResult?.total_project_cost_90_60_display}</TableCell>
										</TableRow>

										{/* Render the following table row for any orders that haven't been placed yet */}
										{!searchResult.ordered_by_licensee &&
											<>
												<TableRow hover={true}>

													<TableCell colSpan={7} align="right">
														<section className="removeInPrint">
															{/* Edit Estimate Button: */}
															<Button
																variant="contained"
																// color="secondary"
																onClick={handleEdit}
																className={classes.LexendTeraFont11}
															>
																Edit This Estimate
															</Button>
															&nbsp; &nbsp;

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
															{hasRecalculated ?
																<>
																	<TextField
																		onChange={(event) => setPoNumber(event.target.value)}
																		size="small"
																		label="PO Number"
																		helperText={poNumError}
																	/>
																</> : <>
																	Recalculate costs before placing order.
																</>
															}
															&nbsp; &nbsp;

															{/* Submit Order Button, shows up as grey if user hasn't recalculated with current pricing yet */}
															{hasRecalculated ?
																<>
																	<Button
																		variant="contained"
																		color="secondary"
																		onClick={handlePlaceOrder}
																		className={classes.LexendTeraFont11}
																	>
																		Place Order
																	</Button>
																</> : <>
																	<Button
																		variant="contained"
																		disabled
																		className={classes.LexendTeraFont11}
																	>
																		Place Order
																	</Button>
																</>
															}
														</section>
													</TableCell>
												</TableRow>
											</>
										} {/* End conditional render on materials table displaying buttons*/}


									</TableBody>
								</Table>
							}
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>

		</div >
	)
}

