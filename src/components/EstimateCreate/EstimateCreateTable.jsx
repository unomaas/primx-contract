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



export default function EstimateCreateTable() {
	// //#region ⬇⬇ All state variables below:
	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useStyles();
	const calculateEstimate = useEstimateCalculations;
	const estimateData = useSelector(store => store.estimatesReducer.estimatesReducer);
	const calculatedDisplayObject = useSelector(store => store.estimatesReducer.setCalcEstimate);
	const [saveButton, setSaveButton] = useState(false);
	const editState = useSelector(store => store.estimatesReducer.editState);
	const [tableSize, setTableSize] = useState(4);
	// ⬇ Have a useEffect looking at the estimateData object. If all necessary keys exist indicating user has entered all necessary form data, run the estimate calculations functions to display the rest of the table. This also makes the materials table adjust automatically if the user changes values.
	useEffect(() => {
		if (
			estimateData.square_feet &&
			estimateData.thickness_inches &&
			estimateData.thickened_edge_construction_joint_lineal_feet &&
			estimateData.thickened_edge_perimeter_lineal_feet &&
			estimateData.primx_flow_dosage_liters &&
			estimateData.primx_steel_fibers_dosage_lbs &&
			estimateData.primx_cpea_dosage_liters
		) {
			dispatch({
				type: 'HANDLE_CALCULATED_ESTIMATE',
				payload: estimateData
			});
			setSaveButton(true);
		} else if (
			estimateData.square_meters && 
			estimateData.thickness_millimeters && 
			estimateData.thickened_edge_construction_joint_lineal_meters &&
			estimateData.thickened_edge_perimeter_lineal_meters && 
			estimateData.primx_flow_dosage_liters && 
			estimateData.primx_steel_fibers_dosage_kgs &&
			estimateData.primx_cpea_dosage_liters
		) {
			dispatch({
				type: 'HANDLE_CALCULATED_ESTIMATE',
				payload: estimateData
			});
			setSaveButton(true);
		} // End if/else if
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

	/** ⬇ Table Size Validation:
	 * The user has the option of stating whether or not they have materials on hand.  If true (aka, they have materials), then the table size will adjust to accommodate these new input fields. 
	 */
	useEffect(() => {
		if (estimateData.materials_on_hand) {
			setTableSize(3);
		} else if (!estimateData.materials_on_hand) {
			setTableSize(4);
		} // End if/else
	}, [estimateData.materials_on_hand]);
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
					<Grid item xs={tableSize}>
						<Paper elevation={3}>
							<TableContainer>
								<Table size="small">

									<TableHead>
										<TableRow>
											<TableCell align="center" colSpan={2}>
												<h3>Project Quantity Inputs</h3>
											</TableCell>
										</TableRow>
									</TableHead>

									{estimateData.measurement_units == "imperial" ?
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
														onClick={() => dispatch({ type: 'GET_WASTE_FACTOR' })}
													>
													</TextField>
												</TableCell>
											</TableRow>
										</TableBody>
										:
										<TableBody>
											<TableRow hover={true}>
												<TableCell>
													<b>Square Meters:</b>
												</TableCell>
												<TableCell>
													<TextField
														onChange={event => handleChange('square_meters', event.target.value)}
														required
														type="number"
														size="small"
														fullWidth
														InputProps={{
															endAdornment: <InputAdornment position="end">m²</InputAdornment>,
														}}
														value={estimateData.square_meters}
													/>
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell>
													<b>Thickness:</b>
												</TableCell>
												<TableCell>
													<TextField
														onChange={event => handleChange('thickness_millimeters', event.target.value)}
														required
														type="number"
														size="small"
														fullWidth
														InputProps={{
															endAdornment: <InputAdornment position="end">mm</InputAdornment>,
														}}
														value={estimateData.thickness_millimeters}
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
									}
								</Table>
							</TableContainer>
						</Paper>
					</Grid>

					{/* Input Table #2: Materials Required */}
					<Grid item xs={tableSize}>
						<Paper elevation={3}>
							<TableContainer>
								<Table size="small">

									<TableHead>
										<TableRow>
											<TableCell align="center" colSpan={2}>
												<h3>Materials Required Inputs</h3>
											</TableCell>
										</TableRow>
									</TableHead>

									{estimateData.measurement_units == "imperial" ?
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
														onChange={event => handleChange('primx_dc_dosage_lbs', event.target.value)}
														required
														type="number"
														size="small"
														InputProps={{
															endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
														}}
														fullWidth
														value={estimateData.primx_dc_dosage_lbs}
													/>
												</TableCell>
											</TableRow>
										</TableBody>
										:
										<TableBody>
											<TableRow hover={true}>
												<TableCell>
													<b>PrīmX Flow @ Dosage Rate per m³:</b>
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
													<b>PrīmX Steel Fibers @ Dosage Rate per m³:</b>
												</TableCell>
												<TableCell>
													<TextField
														onChange={event => handleChange('primx_steel_fibers_dosage_kgs', event.target.value)}
														required
														type="number"
														size="small"
														InputProps={{
															endAdornment: <InputAdornment position="end">kgs</InputAdornment>,
														}}
														fullWidth
														value={estimateData.primx_steel_fibers_dosage_kgs}
														onClick={event => dispatch({ type: 'GET_PRIMX_STEEL_KGS' })}
													/>
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell>
													<b>PrīmX CPEA @ Dosage Rate per m³:</b>
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
													<b>PrīmX DC @ Dosage Rate per m³:</b>
												</TableCell>
												<TableCell>
													<TextField
														onChange={event => handleChange('primx_dc_dosage_kgs', event.target.value)}
														required
														type="number"
														size="small"
														InputProps={{
															endAdornment: <InputAdornment position="end">kgs</InputAdornment>,
														}}
														fullWidth
														value={estimateData.primx_dc_dosage_kgs}
													/>
												</TableCell>
											</TableRow>
										</TableBody>
									}
								</Table>
							</TableContainer>
						</Paper>
					</Grid>

					{/* Input Table #4: Materials On Hand */}
					{estimateData.materials_on_hand &&
						<Grid item xs={tableSize}>
							<Paper elevation={3}>
								<TableContainer>
									<Table size="small">

										<TableHead>
											<TableRow>
												<TableCell align="center" colSpan={2}>
													<h3>Materials On Hand Inputs</h3>
												</TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											<TableRow hover={true}>
												<TableCell>
													<b>PrīmX Flow:</b>
												</TableCell>
												<TableCell>
													<TextField
														onChange={event => handleChange('primx_flow_on_hand_liters', event.target.value)}
														required
														type="number"
														size="small"
														InputProps={{
															endAdornment: <InputAdornment position="end">ltrs</InputAdornment>,
														}}
														fullWidth
														value={estimateData.primx_flow_on_hand_liters}
														onClick={event => dispatch({ type: 'GET_PRIMX_FLOW_LTRS' })}
													/>
												</TableCell>
											</TableRow>

											{estimateData.measurement_units == "imperial" ?
												<TableRow hover={true}>
													<TableCell>
														<b>PrīmX Steel Fibers:</b>
													</TableCell>
													<TableCell>
														<TextField
															onChange={event => handleChange('primx_steel_fibers_on_hand_lbs', event.target.value)}
															required
															type="number"
															size="small"
															InputProps={{
																endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
															}}
															fullWidth
															value={estimateData.primx_steel_fibers_on_hand_lbs}
															onClick={event => dispatch({ type: 'GET_PRIMX_STEEL_LBS' })}
														/>
													</TableCell>
												</TableRow>
												:
												<TableRow hover={true}>
													<TableCell>
														<b>PrīmX Steel Fibers:</b>
													</TableCell>
													<TableCell>
														<TextField
															onChange={event => handleChange('primx_steel_fibers_on_hand_kgs', event.target.value)}
															required
															type="number"
															size="small"
															InputProps={{
																endAdornment: <InputAdornment position="end">kgs</InputAdornment>,
															}}
															fullWidth
															value={estimateData.primx_steel_fibers_on_hand_kgs}
															onClick={event => dispatch({ type: 'GET_PRIMX_STEEL_KGS' })}
														/>
													</TableCell>
												</TableRow>
											}

											<TableRow hover={true}>
												<TableCell>
													<b>PrīmX CPEA:</b>
												</TableCell>
												<TableCell>
													<TextField
														onChange={event => handleChange('primx_cpea_on_hand_liters', event.target.value)}
														required
														type="number"
														size="small"
														InputProps={{
															endAdornment: <InputAdornment position="end">ltrs</InputAdornment>,
														}}
														fullWidth
														value={estimateData.primx_cpea_on_hand_liters}
													/>
												</TableCell>
											</TableRow>

											{estimateData.measurement_units == "imperial" ?
												<>
													<TableRow hover={true}>
														<TableCell>
															<b>PrīmX DC:</b>
														</TableCell>
														<TableCell>
															<TextField
																onChange={event => handleChange('primx_dc_on_hand_lbs', event.target.value)}
																required
																type="number"
																size="small"
																InputProps={{
																	endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
																}}
																fullWidth
																value={estimateData.primx_dc_on_hand_lbs}
															/>
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell>
															<b>PrīmX UltraCure Blankets:</b>
														</TableCell>
														<TableCell>
															<TextField
																onChange={event => handleChange('primx_ultracure_blankets_on_hand_sq_ft', event.target.value)}
																required
																type="number"
																size="small"
																InputProps={{
																	endAdornment: <InputAdornment position="end">ft²</InputAdornment>,
																}}
																fullWidth
																value={estimateData.primx_ultracure_blankets_on_hand_sq_ft}
															/>
														</TableCell>
													</TableRow>
												</> : <>
													<TableRow hover={true}>
														<TableCell>
															<b>PrīmX DC:</b>
														</TableCell>
														<TableCell>
															<TextField
																onChange={event => handleChange('primx_dc_on_hand_kgs', event.target.value)}
																required
																type="number"
																size="small"
																InputProps={{
																	endAdornment: <InputAdornment position="end">kgs</InputAdornment>,
																}}
																fullWidth
																value={estimateData.primx_dc_on_hand_kgs}
															/>
														</TableCell>
													</TableRow>

													<TableRow hover={true}>
														<TableCell>
															<b>PrīmX UltraCure Blankets:</b>
														</TableCell>
														<TableCell>
															<TextField
																onChange={event => handleChange('primx_ultracure_blankets_on_hand_sq_m', event.target.value)}
																required
																type="number"
																size="small"
																InputProps={{
																	endAdornment: <InputAdornment position="end">m²</InputAdornment>,
																}}
																fullWidth
																value={estimateData.primx_ultracure_blankets_on_hand_sq_m}
															/>
														</TableCell>
													</TableRow>
												</>
											}
										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						</Grid>
					}

					{/* Input Table #3: Thickened Edge */}
					<Grid item xs={tableSize}>
						<Paper elevation={3}>
							<TableContainer>
								<Table size="small">

									<TableHead>
										<TableRow>
											<TableCell align="center" colSpan={2}>
												<h3>Thickened Edge Inputs</h3>
											</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										{estimateData.measurement_units == "imperial" ?
											<>
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
											</> : <>
												<TableRow hover={true}>
													<TableCell>
														<b>Lineal Meters @ Perimeter:</b>
													</TableCell>
													<TableCell>
														<TextField
															onChange={event => handleChange('thickened_edge_perimeter_lineal_meters', event.target.value)}
															required
															type="number"
															size="small"
															InputProps={{
																endAdornment: <InputAdornment position="end">m</InputAdornment>,
															}}
															fullWidth
															value={estimateData.thickened_edge_perimeter_lineal_meters}
															onClick={event => dispatch({ type: 'GET_LINEAL_METERS' })}
														/>
													</TableCell>
												</TableRow>

												<TableRow hover={true}>
													<TableCell>
														<b>Lineal Meters @ Construction Joint:</b>
													</TableCell>
													<TableCell>
														<TextField
															onChange={event => handleChange('thickened_edge_construction_joint_lineal_meters', event.target.value)}
															required
															type="number"
															size="small"
															fullWidth
															InputProps={{
																endAdornment: <InputAdornment position="end">m</InputAdornment>,
															}}
															value={estimateData.thickened_edge_construction_joint_lineal_meters}
															onClick={event => dispatch({ type: 'GET_LINEAL_METERS' })}
														/>
													</TableCell>
												</TableRow>
											</>
										}

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
								{calculatedDisplayObject.measurement_units == "imperial" ?
									<Table size="small">
										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Square Feet:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.square_feet_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (in):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.thickness_inches_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.perimeter_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.construction_joint_thickening_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.cubic_yards_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor (yd³):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.waste_factor_cubic_yards}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.design_cubic_yards_total}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									:
									<Table size="small">
										<TableBody>
											<TableRow hover={true}>
												<TableCell><b>Square Meters:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.square_meters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (mm):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.thickness_millimeters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.perimeter_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.construction_joint_thickening_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Subtotal:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.cubic_meters_subtotal}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Waste Factor (m³):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.waste_factor_cubic_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Total Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.design_cubic_meters_total}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								}

								<h3>Thickened Edge Calculations</h3>
								{calculatedDisplayObject.measurement_units == "imperial" ?
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
													{calculatedDisplayObject?.thickened_edge_perimeter_lineal_feet_display}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.thickened_edge_construction_joint_lineal_feet_display}
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
													{calculatedDisplayObject?.additional_thickness_inches}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.additional_thickness_inches}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Yards:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.perimeter_thickening_cubic_yards}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.construction_joint_thickening_cubic_yards}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									:
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
													{calculatedDisplayObject?.thickened_edge_perimeter_lineal_meters_display}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.thickened_edge_construction_joint_lineal_meters_display}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Width (m³):</b></TableCell>
												<TableCell align="right">1.5</TableCell>
												<TableCell align="right">3.0</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Additional Thickness (mm):</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.additional_thickness_millimeters}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.additional_thickness_millimeters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Cubic Meters:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.perimeter_thickening_cubic_meters}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.construction_joint_thickening_cubic_meters}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								}
							</TableContainer>
						</Paper>
					</Grid>

					<Grid item xs={8}>
						<Paper elevation={3}>
							<TableContainer>
								<h3>Materials Required Calculations</h3>
								<Table size="small">
									<TableHead>
										{calculatedDisplayObject.measurement_units == "imperial" ?
											<TableRow>
												<TableCell></TableCell>
												<TableCell align="right"><b>PrīmX DC (lbs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Flow (ltrs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Steel Fibers (lbs)</b></TableCell>
												<TableCell align="right"><b>PrīmX UltraCure Blankets (ft²)</b></TableCell>
												<TableCell align="right"><b>PrīmX CPEA (ltrs)</b></TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
											:
											<TableRow>
												<TableCell></TableCell>
												<TableCell align="right"><b>PrīmX DC (kgs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Flow (ltrs)</b></TableCell>
												<TableCell align="right"><b>PrīmX Steel Fibers (kgs)</b></TableCell>
												<TableCell align="right"><b>PrīmX UltraCure Blankets (m²)</b></TableCell>
												<TableCell align="right"><b>PrīmX CPEA (ltrs)</b></TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
										}
									</TableHead>

									<TableBody>
										{calculatedDisplayObject.measurement_units == "imperial" ?
											<TableRow hover={true}>
												<TableCell><b>Dosage Rate per yd³:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_dc_dosage_lbs_display}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_flow_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_steel_fibers_dosage_lbs_display}
												</TableCell>
												<TableCell align="right">N/A</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_cpea_dosage_liters_display}
												</TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
											:
											<TableRow hover={true}>
												<TableCell><b>Dosage Rate per m³:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_dc_dosage_kgs_display}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_flow_dosage_liters_display}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_steel_fibers_dosage_kgs_display}
												</TableCell>
												<TableCell align="right">N/A</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_cpea_dosage_liters_display}
												</TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
										}

										<TableRow hover={true}>
											<TableCell><b>Total Project Amount:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_dc_total_project_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_flow_total_project_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_steel_fibers_total_project_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_ultracure_blankets_total_project_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_cpea_total_project_amount}
											</TableCell>
											<TableCell align="right"></TableCell>
										</TableRow>

										{estimateData.materials_on_hand &&
											<>
												{calculatedDisplayObject.measurement_units == "imperial" ?
													<TableRow hover={true}>
														<TableCell><b>Materials On Hand:</b></TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_dc_on_hand_lbs_display}
														</TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_flow_on_hand_liters_display}
														</TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_steel_fibers_on_hand_lbs_display}
														</TableCell>
														<TableCell align="right"
														>{calculatedDisplayObject?.primx_ultracure_blankets_on_hand_sq_ft_display}
														</TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_cpea_on_hand_liters_display}
														</TableCell>
														<TableCell align="right"></TableCell>
													</TableRow>
													:	// Else measurement_units == 'metric', below: 
													<TableRow hover={true}>
														<TableCell><b>Materials On Hand:</b></TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_dc_on_hand_kgs_display}
														</TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_flow_on_hand_liters_display}
														</TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_steel_fibers_on_hand_kgs_display}</TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_ultracure_blankets_on_hand_sq_m_display}
														</TableCell>
														<TableCell align="right">
															{calculatedDisplayObject?.primx_cpea_on_hand_liters_display}
														</TableCell>
														<TableCell align="right"></TableCell>
													</TableRow>
												} {/* End imperial/metric conditional rendering */}
												{/* These rows are shared for both imperial and metric, but only shown if Materials On Hand is checked: */}
												<TableRow hover={true}>
													<TableCell><b>Total Order Amount:</b></TableCell>
													<TableCell align="right">
														{calculatedDisplayObject.primx_dc_total_order_amount}
													</TableCell>
													<TableCell align="right">
														{calculatedDisplayObject.primx_flow_total_order_amount}
													</TableCell>
													<TableCell align="right">
														{calculatedDisplayObject.primx_steel_fibers_total_order_amount}
													</TableCell>
													<TableCell align="right">
														{calculatedDisplayObject.primx_ultracure_blankets_total_order_amount}
													</TableCell>
													<TableCell align="right">
														{calculatedDisplayObject.primx_cpea_total_order_amount}
													</TableCell>
													<TableCell align="right"></TableCell>
												</TableRow>
											</>
										} {/* End Materials On Hand Conditional Rendering */}

										{calculatedDisplayObject.measurement_units == "imperial" ?
											<TableRow hover={true}>
												<TableCell><b>Packaging Capacity:</b></TableCell>
												<TableCell align="right">2,756</TableCell>
												<TableCell align="right">1,000</TableCell>
												<TableCell align="right">42,329</TableCell>
												<TableCell align="right">6,458</TableCell>
												<TableCell align="right">1,000</TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
											:
											<TableRow hover={true}>
												<TableCell><b>Packaging Capacity:</b></TableCell>
												<TableCell align="right">1,250</TableCell>
												<TableCell align="right">1,000</TableCell>
												<TableCell align="right">19,200</TableCell>
												<TableCell align="right">600</TableCell>
												<TableCell align="right">1,000</TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
										}

										<TableRow hover={true}>
											<TableCell><b>Packages Needed:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_dc_packages_needed}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_flow_packages_needed}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_steel_fibers_packages_needed}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_ultracure_blankets_packages_needed}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_cpea_packages_needed}
											</TableCell>
											<TableCell align="right"></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Final Order Amount:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_dc_final_order_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_flow_final_order_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_steel_fibers_final_order_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_ultracure_blankets_final_order_amount}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_cpea_final_order_amount}
											</TableCell>
											<TableCell align="right"></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Materials Price:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_dc_unit_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_flow_unit_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_steel_fibers_unit_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_ultracure_blankets_unit_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_cpea_unit_price}
											</TableCell>
											<TableCell align="right"><b>Totals</b></TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Total Materials Price:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_dc_total_materials_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_flow_total_materials_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_steel_fibers_total_materials_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_ultracure_blankets_total_materials_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_cpea_total_materials_price}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.design_total_materials_price}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Containers:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_dc_containers_needed}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_flow_containers_needed}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_steel_fibers_containers_needed}
											</TableCell>
											<TableCell align="right">
												0
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_cpea_containers_needed}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.design_total_containers}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Shipping Estimate:</b></TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_dc_calculated_shipping_estimate}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_flow_calculated_shipping_estimate}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_steel_fibers_calculated_shipping_estimate}
											</TableCell>
											<TableCell align="right">
												0
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.primx_cpea_calculated_shipping_estimate}
											</TableCell>
											<TableCell align="right">
												{calculatedDisplayObject?.design_total_shipping_estimate}
											</TableCell>
										</TableRow>

										<TableRow hover={true}>
											<TableCell><b>Total Cost:</b></TableCell>
											<TableCell align="right"><b>
												{calculatedDisplayObject?.primx_dc_total_cost_estimate}
											</b></TableCell>
											<TableCell align="right"><b>
												{calculatedDisplayObject?.primx_flow_total_cost_estimate}
											</b></TableCell>
											<TableCell align="right"><b>
												{calculatedDisplayObject?.primx_steel_fibers_total_cost_estimate}
											</b></TableCell>
											<TableCell align="right"><b>
												{calculatedDisplayObject?.primx_ultracure_blankets_total_cost_estimate}
											</b></TableCell>
											<TableCell align="right"><b>
												{calculatedDisplayObject?.primx_cpea_total_cost_estimate}
											</b></TableCell>
											<TableCell align="right"><b>
												{calculatedDisplayObject?.design_total_price_estimate}
											</b></TableCell>
										</TableRow>

										{calculatedDisplayObject.measurement_units == "imperial" ?
											<TableRow hover={true}>
												<TableCell><b>Cost per ft²:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_dc_cost_per_sq_ft}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_flow_cost_per_sq_ft}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_steel_fibers_cost_per_sq_ft}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_ultracure_blankets_cost_per_sq_ft}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_cpea_cost_per_sq_ft}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_design_total_cost_per_sq_ft}
												</TableCell>
											</TableRow>
											: // Else measurement_units == 'metric', below: 
											<TableRow hover={true}>
												<TableCell><b>Cost per m²:</b></TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_dc_cost_per_sq_m}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_flow_cost_per_sq_m}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_steel_fibers_cost_per_sq_m}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_ultracure_blankets_cost_per_sq_m}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_cpea_cost_per_sq_m}
												</TableCell>
												<TableCell align="right">
													{calculatedDisplayObject?.primx_design_total_cost_per_sq_m}
												</TableCell>
											</TableRow>
										}


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
