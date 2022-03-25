//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
// ⬇ Dependent Functionality:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router';
import useCalculateCostPerMeasurement from '../../hooks/useCalculateCostPerMeasurement';
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
	// ⬇ Component has a main view at /lookup and a sub-view of /lookup/... where ... is the licensee ID appended with the estimate number.
	const { licensee_id_searched, estimate_number_searched, first_estimate_number_combined, second_estimate_number_combined, third_estimate_number_combined } = useParams();
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
				type: 'MARK_ESTIMATE_ORDERED',
				payload: {
					id: searchResult.id,
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
											{searchResult?.floor_type}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Placement Type:</b></TableCell>
										<TableCell>
											{searchResult?.placement_type}
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
											{searchResult?.ship_to_state_province}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
										<TableCell>
											{searchResult?.zip_postal_code}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Country:</b></TableCell>
										<TableCell>
											{searchResult?.country}
										</TableCell>
									</TableRow>

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
													{searchResult?.square_feet}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (in):</b></TableCell>
												<TableCell align="right">
													{searchResult?.thickness_inches}
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
													{searchResult?.thickened_edge_perimeter_lineal_feet}
												</TableCell>
												<TableCell align="right">
													{searchResult?.thickened_edge_construction_joint_lineal_feet}
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
													{searchResult?.square_meters}
												</TableCell>
											</TableRow>

											<TableRow hover={true}>
												<TableCell><b>Thickness (mm):</b></TableCell>
												<TableCell align="right">
													{searchResult?.thickness_millimeters}
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
													{searchResult?.thickened_edge_perimeter_lineal_meters}
												</TableCell>
												<TableCell align="right">
													{searchResult?.thickened_edge_construction_joint_lineal_meters}
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
							<h3>Materials Table</h3>
							<Table size="small">

								<TableHead>
									<TableRow>
										<TableCell></TableCell>
										{/* Conditionally render either imperial or metric table headings */}
										{searchResult.measurement_units == 'imperial' ?
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
												<TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
											</>
										} {/* End conditionally rendered table headings*/}
										<TableCell></TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									<TableRow hover={true}>
										{/* Conditionally render either imperial or metric dosage numbers */}
										{searchResult.measurement_units == 'imperial' ?
											<>
												<TableCell>
													<b>Dosage Rate (per yd³):</b>
												</TableCell>
												<TableCell align="right">
													{searchResult?.primx_dc_dosage_lbs}
												</TableCell>
												<TableCell align="right">
													{searchResult?.primx_flow_dosage_liters}
												</TableCell>
												<TableCell align="right">
													{searchResult?.primx_steel_fibers_dosage_lbs}
												</TableCell>
												<TableCell align="right">
													N/A
												</TableCell>
												<TableCell align="right">
													{searchResult?.primx_cpea_dosage_liters}
												</TableCell>
											</> : <>
												<TableCell>
													<b>Dosage Rate (per m³):</b>
												</TableCell>
												<TableCell align="right">
													{searchResult?.primx_dc_dosage_kgs}
												</TableCell>
												<TableCell align="right">
													{searchResult?.primx_flow_dosage_liters}
												</TableCell>
												<TableCell align="right">
													{searchResult?.primx_steel_fibers_dosage_kgs}
												</TableCell>
												<TableCell align="right">
													N/A</TableCell>
												<TableCell align="right">
													{searchResult?.primx_cpea_dosage_liters}
												</TableCell>
											</>
										} {/* End conditionally rendered dosages*/}
										<TableCell></TableCell>
									</TableRow>

									{/* Total amounts share key names between imperial and metric */}
									<TableRow hover={true}>
										<TableCell><b>Total Project Amount:</b></TableCell>
										<TableCell align="right">
											{searchResult?.primx_dc_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_flow_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_steel_fibers_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_ultracure_blankets_total_project_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_cpea_total_project_amount}
										</TableCell>
										<TableCell></TableCell>
									</TableRow>

									{/* //! Ryan Here, test this is working later.  */}
									{searchResult.materials_on_hand &&
										<>
											{searchResult.measurement_units == "imperial" ?
												<TableRow hover={true}>
													<TableCell><b>Materials On Hand:</b></TableCell>
													<TableCell align="right">
														{searchResult?.primx_dc_on_hand_lbs_display}
													</TableCell>
													<TableCell align="right">
														{searchResult?.primx_flow_on_hand_liters_display}
													</TableCell>
													<TableCell align="right">
														{searchResult?.primx_steel_fibers_on_hand_lbs_display}
													</TableCell>
													<TableCell align="right"
													>{searchResult?.primx_ultracure_blankets_on_hand_sq_ft_display}
													</TableCell>
													<TableCell align="right">
														{searchResult?.primx_cpea_on_hand_liters_display}
													</TableCell>
													<TableCell align="right"></TableCell>
												</TableRow>
												:	// Else measurement_units == 'metric', below: 
												<TableRow hover={true}>
													<TableCell><b>Materials On Hand:</b></TableCell>
													<TableCell align="right">
														{searchResult?.primx_dc_on_hand_kgs_display}
													</TableCell>
													<TableCell align="right">
														{searchResult?.primx_flow_on_hand_liters_display}
													</TableCell>
													<TableCell align="right">
														{searchResult?.primx_steel_fibers_on_hand_kgs_display}</TableCell>
													<TableCell align="right">
														{searchResult?.primx_ultracure_blankets_on_hand_sq_m_display}
													</TableCell>
													<TableCell align="right">
														{searchResult?.primx_cpea_on_hand_liters_display}
													</TableCell>
													<TableCell align="right"></TableCell>
												</TableRow>
											} {/* End imperial/metric conditional rendering */}
											{/* These rows are shared for both imperial and metric, but only shown if Materials On Hand is checked: */}
											<TableRow hover={true}>
												<TableCell><b>Total Order Amount:</b></TableCell>
												<TableCell align="right">
													{searchResult.primx_dc_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{searchResult.primx_flow_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{searchResult.primx_steel_fibers_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{searchResult.primx_ultracure_blankets_total_order_amount}
												</TableCell>
												<TableCell align="right">
													{searchResult.primx_cpea_total_order_amount}
												</TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
										</>
									} {/* End Materials On Hand Conditional Rendering */}

									<TableRow hover={true}>
										<TableCell><b>Packaging Capacity:</b></TableCell>
										{/* Conditionally render either imperial or metric packaging capacity numbers */}
										{searchResult.measurement_units == 'imperial' ?
											<>
												<TableCell align="right">2,756</TableCell>
												<TableCell align="right">1,000</TableCell>
												<TableCell align="right">42,329</TableCell>
												<TableCell align="right">6,458</TableCell>
												<TableCell align="right">1,000</TableCell>
											</> : <>
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
											{searchResult?.primx_dc_packages_needed}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_flow_packages_needed}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_steel_fibers_packages_needed}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_ultracure_blankets_packages_needed}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_cpea_packages_needed}
										</TableCell>
										<TableCell></TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Final Order Amount:</b></TableCell>
										<TableCell align="right">
											{searchResult?.primx_dc_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_flow_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_steel_fibers_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_ultracure_blankets_final_order_amount}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_cpea_final_order_amount}
										</TableCell>
										<TableCell></TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Materials Price:</b></TableCell>
										<TableCell align="right">
											{searchResult?.primx_dc_unit_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_flow_unit_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_steel_fibers_unit_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_ultracure_blankets_unit_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_cpea_unit_price}
										</TableCell>
										<TableCell align="right">
											<b>Totals</b>
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Total Materials Price:</b></TableCell>
										<TableCell align="right">
											{searchResult?.primx_dc_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_flow_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_steel_fibers_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_ultracure_blankets_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_cpea_total_materials_price}
										</TableCell>
										<TableCell align="right">
											{searchResult?.design_total_materials_price}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Containers:</b></TableCell>
										<TableCell align="right">
											{searchResult?.primx_dc_containers_needed}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_flow_containers_needed}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_steel_fibers_containers_needed}
										</TableCell>
										<TableCell align="right">
											0</TableCell>
										<TableCell align="right">
											{searchResult?.primx_cpea_containers_needed}
										</TableCell>
										<TableCell align="right">
											{searchResult?.design_total_containers}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Shipping Estimate:</b></TableCell>
										<TableCell align="right">
											{searchResult?.primx_dc_calculated_shipping_estimate}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_flow_calculated_shipping_estimate}
										</TableCell>
										<TableCell align="right">
											{searchResult?.primx_steel_fibers_calculated_shipping_estimate}
										</TableCell>
										<TableCell align="right">
											0</TableCell>
										<TableCell align="right">
											{searchResult?.primx_cpea_calculated_shipping_estimate}
										</TableCell>
										<TableCell align="right">
											{searchResult?.design_total_shipping_estimate}
										</TableCell>
									</TableRow>

									<TableRow hover={true}>
										<TableCell><b>Total Cost:</b></TableCell>
										<TableCell align="right">
											<b>{searchResult?.primx_dc_total_cost_estimate}</b>
										</TableCell>
										<TableCell align="right">
											<b>{searchResult?.primx_flow_total_cost_estimate}</b>
										</TableCell>
										<TableCell align="right">
											<b>{searchResult?.primx_steel_fibers_total_cost_estimate}</b>
										</TableCell>
										<TableCell align="right">
											<b>{searchResult?.primx_ultracure_blankets_total_cost_estimate}</b>
										</TableCell>
										<TableCell align="right">
											<b>{searchResult?.primx_cpea_total_cost_estimate}</b>
										</TableCell>
										<TableCell align="right">
											<b>{searchResult?.design_total_price_estimate}</b>
										</TableCell>
									</TableRow>

									{searchResult.measurement_units == "imperial" ?
										<TableRow hover={true}>
											<TableCell><b>Cost per ft²:</b></TableCell>
											<TableCell align="right">
												{searchResult?.primx_dc_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_flow_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_steel_fibers_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_ultracure_blankets_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_cpea_cost_per_sq_ft}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_design_total_cost_per_sq_ft}
											</TableCell>
										</TableRow>
										: // Else measurement_units == 'metric', below: 
										<TableRow hover={true}>
											<TableCell><b>Cost per m²:</b></TableCell>
											<TableCell align="right">
												{searchResult?.primx_dc_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_flow_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_steel_fibers_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_ultracure_blankets_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_cpea_cost_per_sq_m}
											</TableCell>
											<TableCell align="right">
												{searchResult?.primx_design_total_cost_per_sq_m}
											</TableCell>
										</TableRow>
									}

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
															</> :
															<>
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

									{/* End Materials Table */}

								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>

		</div >
	)
}

