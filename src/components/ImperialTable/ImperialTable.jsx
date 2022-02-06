//#region ⬇⬇ All document setup, below:
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import useCalculateCostPerMeasurement from '../../hooks/useCalculateCostPerMeasurement';
import { Alert } from '@material-ui/lab';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment, Snackbar } from '@material-ui/core';
import { useStyles } from '../MuiStyling/MuiStyling';
import swal from 'sweetalert';
//#endregion ⬆⬆ All document setup above.



export default function ImperialTable() {
	// //#region ⬇⬇ All state variables below:
	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useStyles();
	const calculateEstimate = useEstimateCalculations;
	const estimateData = useSelector(store => store.estimatesReducer.estimatesReducer);
	const calculatedDisplayObject = useSelector(store => store.estimatesReducer.setCalcEstimate);
	const [saveButton, setSaveButton] = useState(false);
	const editState = useSelector(store => store.estimatesReducer.editState);
	// ⬇ Have a useEffect looking at the estimateData object. If all necessary keys exist indicating user has entered all necessary form data, run the estimate calculations functions to display the rest of the table. This also makes the materials table adjust automatically if the user changes values.
	useEffect(() => {
		if (estimateData.square_feet && estimateData.thickness_inches && estimateData.thickened_edge_construction_joint_lineal_feet &&
			estimateData.thickened_edge_perimeter_lineal_feet && estimateData.primx_flow_dosage_liters && estimateData.primx_steel_fibers_dosage_lbs &&
			estimateData.primx_cpea_dosage_liters) {
			// ⬇ Once all the keys exist, run the calculate estimate function and set the table display state for the calculated values:
			dispatch({
				type: 'HANDLE_CALCULATED_ESTIMATE',
				payload: estimateData
			});
			setSaveButton(true);
		} // End if statement 
	}, [estimateData]); // End useEffect
	//#endregion ⬆⬆ All state variables above.


	//#region ⬇⬇ Event handlers below:
	/** ⬇ handleChange:
	 * When the user types, this will set their input to the kit object with keys for each field. 
	 */
	const handleChange = (key, value) => {
		// setNewEstimate({ ...newEstimate, [key]: value });
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
		// ⬇ Send the estimate object to be POSTed:
		dispatch({ type: 'ADD_ESTIMATE', payload: estimateData });
		// ⬇ Sweet Alert to let them know to save the Estimate #:
		swal({
			title: "Estimate saved!",
			text: "Please print or save your estimate number! You will need it to look up this estimate again, and submit the order for processing.",
			icon: "info",
			buttons: "I understand",
		}).then(() => {
			// ⬇ Pop-up print confirmation:
			window.print();
		}); // End swal
	} // End handleSave

	/** ⬇ handleEdit:
	 * When clicked, this will save the edits and send the user to the view estimate page:
	 */
	const handleEdit = event => {
		// ⬇ Attach history from useHistory to the estimate object to allow navigation from inside the saga:
		estimateData.history = history;
		// ⬇ Send the estimate object to be updated:
		dispatch({ type: 'EDIT_ESTIMATE', payload: estimateData });
		// ⬇ Sweet Alert to let them know to save the Estimate #:
		swal({
			title: "Your edits have been saved!",
			text: "Please print or save your estimate number! You will need it to look up this estimate again, and submit the order for processing.",
			icon: "info",
			buttons: "I understand",
		}).then(() => {
			// ⬇ Pop-up print confirmation:
			window.print();
		}); // End swal
		// ⬇ Triggers to flip the show table state and show edit button state:
		// dispatch({ type: 'SET_EDIT_STATE', payload: false });
		// dispatch({ type: 'SET_TABLE_STATE', payload: false });
	} // End handleEdit
	//#endregion ⬆⬆ Event handles above. 


	// ⬇ Rendering:
	return (
		<>

			<form onSubmit={handleSave}>

				<Grid container
					spacing={2}
					justifyContent="center"
				>

					{/* Input Table #1: Quantity Inputs */}
					<Grid item xs={4}>
						<Paper elevation={3}>
							<TableContainer>
								<Table size="small">

									<TableHead>
										<TableRow hover={true}>
											<TableCell align="center" colSpan={2}>
												<h3>Project Quantity Inputs</h3>
											</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										<TableRow hover={true}>
											<TableCell>
												<b>Square Feet:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('square_feet', event.target.value)}
													required
													type="number"
													size="small"
													fullWidth
													InputProps={{
														endAdornment: <InputAdornment position="end">ft²</InputAdornment>,
													}}
													value={estimateData.square_feet}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell>
												<b>Thickness:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('thickness_inches', event.target.value)}
													required
													type="number"
													size="small"
													fullWidth
													InputProps={{
														endAdornment: <InputAdornment position="end">in</InputAdornment>,
													}}
													value={estimateData.thickness_inches}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell>
												<b>Waste Factor Percentage:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('waste_factor_percentage', event.target.value)}
													required
													type="number"
													size="small"
													InputProps={{
														endAdornment: <InputAdornment position="end">%</InputAdornment>,
													}}
													fullWidth
													value={estimateData.waste_factor_percentage}
													onClick={event => dispatch({ type: 'GET_WASTE_FACTOR' })}
												>
												</TextField>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>

					{/* Input Table #2: Materials Required */}
					<Grid item xs={4}>
						<Paper elevation={3}>
							<TableContainer>
								<Table size="small">

									<TableHead>
										<TableRow hover={true}>
											<TableCell align="center" colSpan={2}>
												<h3>Materials Required Inputs</h3>
											</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										<TableRow hover={true}>
											<TableCell>
												<b>PrīmX Flow @ Dosage Rate per yd³:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('primx_flow_dosage_liters', event.target.value)}
													required
													type="number"
													size="small"
													InputProps={{
														endAdornment: <InputAdornment position="end">ltrs</InputAdornment>,
													}}
													fullWidth
													value={estimateData.primx_flow_dosage_liters}
													onClick={event => dispatch({ type: 'GET_PRIMX_FLOW_LTRS' })}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell>
												<b>PrīmX Steel Fibers @ Dosage Rate per yd³:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('primx_steel_fibers_dosage_lbs', event.target.value)}
													required
													type="number"
													size="small"
													InputProps={{
														endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
													}}
													fullWidth
													value={estimateData.primx_steel_fibers_dosage_lbs}
													onClick={event => dispatch({ type: 'GET_PRIMX_STEEL_LBS' })}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell>
												<b>PrīmX CPEA @ Dosage Rate per yd³:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('primx_cpea_dosage_liters', event.target.value)}
													required
													type="number"
													size="small"
													InputProps={{
														endAdornment: <InputAdornment position="end">ltrs</InputAdornment>,
													}}
													fullWidth
													value={estimateData.primx_cpea_dosage_liters}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell>
												<b>PrīmX DC @ Dosage Rate per yd³:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('primx_dc_dosage_yards', event.target.value)}
													required
													type="number"
													size="small"
													InputProps={{
														endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
													}}
													fullWidth
													value={estimateData.primx_dc_dosage_yards}
												/>
											</TableCell>
										</TableRow>

									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>

					{/* Input Table #3: Thickened Edge */}
					<Grid item xs={4}>
						<Paper elevation={3}>
							<TableContainer>
								<Table size="small">

									<TableHead>
										<TableRow hover={true}>
											<TableCell align="center" colSpan={2}>
												<h3>Thickened Edge Inputs</h3>
											</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										<TableRow hover={true}>
											<TableCell>
												<b>Lineal Feet @ Perimeter:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('thickened_edge_perimeter_lineal_feet', event.target.value)}
													required
													type="number"
													size="small"
													InputProps={{
														endAdornment: <InputAdornment position="end">ft</InputAdornment>,
													}}
													fullWidth
													value={estimateData.thickened_edge_perimeter_lineal_feet}
													onClick={event => dispatch({ type: 'GET_LINEAL_INCHES' })}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell>
												<b>Lineal Feet @ Construction Joint:</b>
											</TableCell>
											<TableCell>
												<TextField
													onChange={event => handleChange('thickened_edge_construction_joint_lineal_feet', event.target.value)}
													required
													type="number"
													size="small"
													fullWidth
													InputProps={{
														endAdornment: <InputAdornment position="end">ft</InputAdornment>,
													}}
													value={estimateData.thickened_edge_construction_joint_lineal_feet}
													onClick={event => dispatch({ type: 'GET_LINEAL_INCHES' })}
												/>
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell colSpan={6} align="right">
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
															<Button
																type="submit"
																// ⬇⬇⬇⬇ COMMENT THIS CODE IN/OUT FOR FORM VALIDATION:
																// onClick={event => handleSave(event)}
																variant="contained"
																className={classes.LexendTeraFont11}
																color="secondary"
															>
																Save Estimate
															</Button>
														) : (
															// If they haven't filled out the inputs, make it disabled:
															<Button
																variant="contained"
																className={classes.LexendTeraFont11}
																disabled
															>
																Save Estimate
															</Button>
														)}
														{/* End conditional rendering for saveButton ? */}
													</>
												)}
												{/* End Edit Estimate conditional rendering. */}
											</TableCell>
										</TableRow>

									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>

					<Grid item xs={4}>
						<Paper elevation={3}>
							<TableContainer>
								<h3>Project Quantity Calculations</h3>
								<Table size="small">
									<TableBody>

										<TableRow hover={true}>
											<TableCell><b>Square Feet:</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.square_feet?.toLocaleString('en-US')}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Thickness (in):</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.thickness_inches}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Cubic Yards:</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.cubic_yards?.toLocaleString('en-US')}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.construction_joint_thickening_cubic_yards}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Subtotal:</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.cubic_yards_subtotal?.toLocaleString('en-US')}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Waste Factor (yd³):</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.waste_factor_cubic_yards?.toLocaleString('en-US')}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Total Cubic Yards:</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.design_cubic_yards_total?.toLocaleString('en-US')}
											</TableCell>
										</TableRow>

									</TableBody>
								</Table>

								<h3>Thickened Edge Calculations</h3>
								<Table size="small">

									<TableHead>
										<TableRow hover={true}>
											<TableCell></TableCell>
											<TableCell><b>Perimeter</b></TableCell>
											<TableCell><b>Construction Joint</b></TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										<TableRow hover={true}>
											<TableCell><b>Lineal Feet:</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.thickened_edge_perimeter_lineal_feet?.toLocaleString('en-US')}
											</TableCell>
											<TableCell>
												{calculatedDisplayObject?.thickened_edge_construction_joint_lineal_feet}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Width (yd³):</b></TableCell>
											<TableCell>
												5
											</TableCell>
											<TableCell>
												10
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Additional Thickness (in):</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.additional_thickness_inches}
											</TableCell>
											<TableCell>
												{calculatedDisplayObject?.additional_thickness_inches}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Cubic Yards:</b></TableCell>
											<TableCell>
												{calculatedDisplayObject?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
											</TableCell>
											<TableCell>
												{calculatedDisplayObject?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
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
									<TableHead>
										<TableRow hover={true}>
											<TableCell></TableCell>
											<TableCell><b>PrīmX DC (lbs)</b></TableCell>
											<TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
											<TableCell><b>PrīmX Steel Fibers (lbs)</b></TableCell>
											<TableCell><b>PrīmX UltraCure Blankets (ft²)</b></TableCell>
											<TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										<TableRow hover={true}>
											<TableCell><b>Dosage Rate per yd³:</b></TableCell>
											<TableCell>67</TableCell>
											<TableCell>
												{calculatedDisplayObject?.primx_flow_dosage_liters}
											</TableCell>
											<TableCell>
												{calculatedDisplayObject?.primx_steel_fibers_dosage_lbs}

											</TableCell>
											<TableCell>N/A</TableCell>
											<TableCell>
												{calculatedDisplayObject?.primx_cpea_dosage_liters}
											</TableCell>
											<TableCell></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Total Amount:</b></TableCell>
											<TableCell>{calculatedDisplayObject?.primx_dc_total_amount_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_flow_total_amount_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Packaging Capacity:</b></TableCell>
											<TableCell>2,756</TableCell>
											<TableCell>1,000</TableCell>
											<TableCell>42,329</TableCell>
											<TableCell>6,458</TableCell>
											<TableCell>1,000</TableCell>
											<TableCell></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Packages Needed:</b></TableCell>
											<TableCell>{calculatedDisplayObject?.primx_dc_packages_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_flow_packages_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_steel_fibers_packages_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_packages_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_cpea_packages_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Total Order Quantity:</b></TableCell>
											<TableCell>{calculatedDisplayObject?.primx_dc_total_order_quantity}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_flow_total_order_quantity}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_steel_fibers_total_order_quantity}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_total_order_quantity}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_cpea_total_order_quantity}</TableCell>
											<TableCell></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Materials Price:</b></TableCell>
											<TableCell>{calculatedDisplayObject?.primx_dc_unit_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_flow_unit_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_steel_fibers_unit_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_unit_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_cpea_unit_price}</TableCell>
											<TableCell><b>Totals:</b></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Total Materials Price:</b></TableCell>
											<TableCell>{calculatedDisplayObject?.primx_dc_total_materials_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_flow_total_materials_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_steel_fibers_total_materials_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_total_materials_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_cpea_total_materials_price}</TableCell>
											<TableCell>{calculatedDisplayObject?.design_total_materials_price}</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Containers:</b></TableCell>
											<TableCell>{calculatedDisplayObject?.primx_dc_containers_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_flow_containers_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_steel_fibers_containers_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>0</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_cpea_containers_needed?.toLocaleString('en-US')}</TableCell>
											<TableCell>
												{calculatedDisplayObject?.design_total_containers?.toLocaleString('en-US')}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Shipping Estimate:</b></TableCell>
											<TableCell>{calculatedDisplayObject?.primx_dc_calculated_shipping_estimate}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_flow_calculated_shipping_estimate}</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_steel_fibers_calculated_shipping_estimate}</TableCell>
											<TableCell>0</TableCell>
											<TableCell>{calculatedDisplayObject?.primx_cpea_calculated_shipping_estimate}</TableCell>
											<TableCell>{calculatedDisplayObject?.design_total_shipping_estimate}</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Total Cost:</b></TableCell>
											<TableCell><b>{calculatedDisplayObject?.primx_dc_total_cost_estimate}</b></TableCell>
											<TableCell><b>{calculatedDisplayObject?.primx_flow_total_cost_estimate}</b></TableCell>
											<TableCell><b>{calculatedDisplayObject?.primx_steel_fibers_total_cost_estimate}</b></TableCell>
											<TableCell><b>{calculatedDisplayObject?.primx_ultracure_blankets_total_cost_estimate}</b></TableCell>
											<TableCell><b>{calculatedDisplayObject?.primx_cpea_total_cost_estimate}</b></TableCell>
											<TableCell><b>{calculatedDisplayObject?.design_total_price_estimate}</b></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Cost per ft²:</b></TableCell>
											<TableCell>
												{useCalculateCostPerMeasurement(calculatedDisplayObject?.primx_dc_total_cost_estimate, calculatedDisplayObject?.square_feet)}
											</TableCell>
											<TableCell>
												{useCalculateCostPerMeasurement(calculatedDisplayObject?.primx_flow_total_cost_estimate, calculatedDisplayObject?.square_feet)}
											</TableCell>
											<TableCell>
												{useCalculateCostPerMeasurement(calculatedDisplayObject?.primx_steel_fibers_total_cost_estimate, calculatedDisplayObject?.square_feet)}
											</TableCell>
											<TableCell>
												{useCalculateCostPerMeasurement(calculatedDisplayObject?.primx_ultracure_blankets_total_cost_estimate, calculatedDisplayObject?.square_feet)}
											</TableCell>
											<TableCell>
												{useCalculateCostPerMeasurement(calculatedDisplayObject?.primx_cpea_total_cost_estimate, calculatedDisplayObject?.square_feet)}
											</TableCell>
											<TableCell>
												{useCalculateCostPerMeasurement(calculatedDisplayObject?.design_total_price_estimate, calculatedDisplayObject?.square_feet)}
											</TableCell>
										</TableRow>

										{/* <TableRow hover={true}>
                      <TableCell colSpan={11} align="right">
                        <Button
                          type="submit"
                          // ⬇⬇⬇⬇ COMMENT THIS CODE IN/OUT FOR FORM VALIDATION:
                          // onClick={event => handleSave(event)}
                          variant="contained"
                          className={classes.LexendTeraFont11}
                          color="secondary"
                        >
                          Save Estimate
                        </Button>
                      </TableCell>
                    </TableRow> */}

									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>
				</Grid>
			</form>


		</>
	)
}
