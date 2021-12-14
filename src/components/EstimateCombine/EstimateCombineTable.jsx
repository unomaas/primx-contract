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
    dispatch({ type: 'SNACK_RECALCULATE_INFO' });
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
              <h3>Estimate {firstEstimate.estimate_number}</h3>
              <h4>Licensee & Project Information</h4>
              <Table size="small">
                <TableBody>

                  <TableRow>
                    <TableCell><b>Project Name:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.project_name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.licensee_contractor_name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project General Contractor:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.project_general_contractor}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Name:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.project_manager_name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Email:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.project_manager_email}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Cell:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.project_manager_phone}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Floor Type:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.floor_type}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Placement Type:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.placement_type}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Unit of Measurement:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.measurement_units?.charAt(0)?.toUpperCase() + firstEstimate?.measurement_units?.slice(1)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Estimate Creation Date:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.date_created}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Anticipated First Pour Date:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.anticipated_first_pour_date}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Street Address:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.ship_to_address}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping City:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.ship_to_city}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping State/Province:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.ship_to_state_province}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.zip_postal_code}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Country:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.country}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>First Estimate Number:</b></TableCell>
                    <TableCell>
                      {firstEstimate?.estimate_number}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Second Estimate Number:</b></TableCell>
                    <TableCell>
                      {secondEstimate?.estimate_number}
                    </TableCell>
                  </TableRow>

                  {/* Conditional rendering to only show third estimate number if it exists: */}
                  {thirdEstimate.estimate_number &&
                    <TableRow>
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

                      <TableRow>
                        <TableCell><b>Square Feet:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.square_feet?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickness (in):</b></TableCell>
                        <TableCell>
                          {parseInt(firstEstimate?.thickness_inches)?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Yards:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Subtotal:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.cubic_yards_subtotal?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Waste Factor @ {firstEstimate?.waste_factor_percentage}%:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.waste_factor_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Total Cubic Yards:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.design_cubic_yards_total?.toLocaleString('en-US')}
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
                        <TableCell><b>Perimeter</b></TableCell>
                        <TableCell><b>Construction Joint</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>Lineal Feet:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.thickened_edge_perimeter_lineal_feet?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.thickened_edge_construction_joint_lineal_feet?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Width (yd³):</b></TableCell>
                        <TableCell>
                          5
                        </TableCell>
                        <TableCell>
                          10
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Additional Thickness (in):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.additional_thickness_inches?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.additional_thickness_inches?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Yards:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h4>Materials Table</h4>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell><b>Dosage Rate (per yd³)</b></TableCell>
                        <TableCell><b>Amount Needed</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>PrīmX DC (lbs):</b></TableCell>
                        <TableCell>
                          67
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_dc_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.primx_flow_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_flow_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Steel Fibers (lbs):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.primx_steel_fibers_dosage_lbs?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX UltraCure Blankets (ft²):</b></TableCell>
                        <TableCell>
                          N/A
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.primx_cpea_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}
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

                      <TableRow>
                        <TableCell><b>Square Feet:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.square_feet?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickness (in):</b></TableCell>
                        <TableCell>
                          {parseInt(secondEstimate?.thickness_inches)?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Yards:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Subtotal:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.cubic_yards_subtotal?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Waste Factor @ {secondEstimate?.waste_factor_percentage}%:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.waste_factor_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Total Cubic Yards:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.design_cubic_yards_total?.toLocaleString('en-US')}
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
                        <TableCell><b>Perimeter</b></TableCell>
                        <TableCell><b>Construction Joint</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>Lineal Feet:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.thickened_edge_perimeter_lineal_feet?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.thickened_edge_construction_joint_lineal_feet?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Width (yd³):</b></TableCell>
                        <TableCell>
                          5
                        </TableCell>
                        <TableCell>
                          10
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Additional Thickness (in):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.additional_thickness_inches?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.additional_thickness_inches?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Yards:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h4>Materials Table</h4>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell><b>Dosage Rate (per yd³)</b></TableCell>
                        <TableCell><b>Amount Needed</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>PrīmX DC (lbs):</b></TableCell>
                        <TableCell>
                          67
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_dc_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.primx_flow_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_flow_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Steel Fibers (lbs):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.primx_steel_fibers_dosage_lbs?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX UltraCure Blankets (ft²):</b></TableCell>
                        <TableCell>
                          N/A
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.primx_cpea_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}
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

                          <TableRow>
                            <TableCell><b>Square Feet:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.square_feet?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (in):</b></TableCell>
                            <TableCell>
                              {parseInt(thirdEstimate?.thickness_inches)?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.cubic_yards_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {thirdEstimate?.waste_factor_percentage}%:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.waste_factor_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Yards:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.design_cubic_yards_total?.toLocaleString('en-US')}
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
                            <TableCell><b>Perimeter</b></TableCell>
                            <TableCell><b>Construction Joint</b></TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell><b>Lineal Feet:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.thickened_edge_perimeter_lineal_feet?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.thickened_edge_construction_joint_lineal_feet?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Width (yd³):</b></TableCell>
                            <TableCell>
                              5
                            </TableCell>
                            <TableCell>
                              10
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Additional Thickness (in):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.additional_thickness_inches?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.additional_thickness_inches?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h4>Materials Table</h4>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell><b>Dosage Rate (per yd³)</b></TableCell>
                            <TableCell><b>Amount Needed</b></TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell><b>PrīmX DC (lbs):</b></TableCell>
                            <TableCell>
                              67
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_dc_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_flow_dosage_liters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_flow_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX Steel Fibers (lbs):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_steel_fibers_dosage_lbs?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX UltraCure Blankets (ft²):</b></TableCell>
                            <TableCell>
                              N/A
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_cpea_dosage_liters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}
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

                      <TableRow>
                        <TableCell><b>Square Meters:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.square_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickness (mm):</b></TableCell>
                        <TableCell>
                          {parseInt(firstEstimate?.thickness_inches)?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Meters:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Subtotal:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.cubic_meters_subtotal?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Waste Factor @ {firstEstimate?.waste_factor_percentage}%:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.waste_factor_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Total Cubic Meters:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.design_cubic_meters_total?.toLocaleString('en-US')}
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
                        <TableCell><b>Perimeter</b></TableCell>
                        <TableCell><b>Construction Joint</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>Lineal Meters:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.thickened_edge_perimeter_lineal_meters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.thickened_edge_construction_joint_lineal_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Width (m³):</b></TableCell>
                        <TableCell>
                          1.5
                        </TableCell>
                        <TableCell>
                          3.0
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Additional Thickness (mm):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.additional_thickness_millimeters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.additional_thickness_millimeters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Meters:</b></TableCell>
                        <TableCell>
                          {firstEstimate?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h3>Estimate #1 Materials Table</h3>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell><b>Dosage Rate (per m³)</b></TableCell>
                        <TableCell><b>Amount Needed</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>PrīmX DC (kgs):</b></TableCell>
                        <TableCell>
                          40
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_dc_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.primx_flow_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_flow_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Steel Fibers (kgs):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.primx_steel_fibers_dosage_kgs?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX UltraCure Blankets (m²):</b></TableCell>
                        <TableCell>
                          N/A
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
                        <TableCell>
                          {firstEstimate?.primx_cpea_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {firstEstimate?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}
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

                      <TableRow>
                        <TableCell><b>Square Meters:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.square_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickness (mm):</b></TableCell>
                        <TableCell>
                          {parseInt(secondEstimate?.thickness_inches)?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Meters:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Subtotal:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.cubic_meters_subtotal?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Waste Factor @ {firstEstimate?.waste_factor_percentage}%:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.waste_factor_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Total Cubic Meters:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.design_cubic_meters_total?.toLocaleString('en-US')}
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
                        <TableCell><b>Perimeter</b></TableCell>
                        <TableCell><b>Construction Joint</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>Lineal Meters:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.thickened_edge_perimeter_lineal_meters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.thickened_edge_construction_joint_lineal_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Width (m³):</b></TableCell>
                        <TableCell>
                          1.5
                        </TableCell>
                        <TableCell>
                          3.0
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Additional Thickness (mm):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.additional_thickness_millimeters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.additional_thickness_millimeters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Cubic Meters:</b></TableCell>
                        <TableCell>
                          {secondEstimate?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h3>Estimate #2 Materials Table</h3>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell><b>Dosage Rate (per m³)</b></TableCell>
                        <TableCell><b>Amount Needed</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell><b>PrīmX DC (kgs):</b></TableCell>
                        <TableCell>
                          40
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_dc_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.primx_flow_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_flow_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX Steel Fibers (kgs):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.primx_steel_fibers_dosage_kgs?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX UltraCure Blankets (m²):</b></TableCell>
                        <TableCell>
                          N/A
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
                        <TableCell>
                          {secondEstimate?.primx_cpea_dosage_liters?.toLocaleString('en-US')}
                        </TableCell>
                        <TableCell>
                          {secondEstimate?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}
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

                          <TableRow>
                            <TableCell><b>Square Meters:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.square_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (mm):</b></TableCell>
                            <TableCell>
                              {parseInt(thirdEstimate?.thickness_inches)?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.cubic_meters_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {thirdEstimate?.waste_factor_percentage?.toLocaleString('en-US')}%:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.waste_factor_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Meters:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.design_cubic_meters_total?.toLocaleString('en-US')}
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
                            <TableCell><b>Perimeter</b></TableCell>
                            <TableCell><b>Construction Joint</b></TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell><b>Lineal Meters:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.thickened_edge_perimeter_lineal_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.thickened_edge_construction_joint_lineal_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Width (m³):</b></TableCell>
                            <TableCell>
                              1.5
                            </TableCell>
                            <TableCell>
                              3.0
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Additional Thickness (mm):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.additional_thickness_millimeters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.additional_thickness_millimeters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Estimate #3 Materials Table</h3>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell><b>Dosage Rate (per m³)</b></TableCell>
                            <TableCell><b>Amount Needed</b></TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell><b>PrīmX DC (kgs):</b></TableCell>
                            <TableCell>
                              40
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_dc_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX Flow (ltrs):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_flow_dosage_liters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_flow_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX Steel Fibers (kgs):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_steel_fibers_dosage_kgs?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX UltraCure Blankets (m²):</b></TableCell>
                            <TableCell>
                              N/A
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>PrīmX CPEA (ltrs):</b></TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_cpea_dosage_liters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {thirdEstimate?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}
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
                  <TableRow>
                    <TableCell></TableCell>
                    {/* Conditionally render either imperial or metric table headings */}
                    {calcCombinedEstimate.measurement_units == 'imperial' ?
                      <>
                        <TableCell><b>PrīmX DC (lbs)</b></TableCell>
                        <TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
                        <TableCell><b>PrīmX Steel Fibers (lbs)</b></TableCell>
                        <TableCell><b>PrīmX UltraCure Blankets (ft²)</b></TableCell>
                        <TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
                      </> : <>
                        <TableCell><b>PrīmX DC (kgs)</b></TableCell>
                        <TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
                        <TableCell><b>PrīmX Steel Fibers (kgs)</b></TableCell>
                        <TableCell><b>PrīmX UltraCure Blankets (m²)</b></TableCell>
                        <TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
                      </>
                    } {/* End conditionally rendered table headings*/}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Total amounts share key names between imperial and metric */}
                  <TableRow>
                    <TableCell><b>Total Amount:</b></TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_dc_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_flow_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packaging Capacity:</b></TableCell>
                    {/* Conditionally render either imperial or metric packaging capacity numbers */}
                    {calcCombinedEstimate.measurement_units == 'imperial' ?
                      <>
                        <TableCell>2,756</TableCell>
                        <TableCell>1,000</TableCell>
                        <TableCell>42,329</TableCell>
                        <TableCell>6,458</TableCell>
                        <TableCell>1,000</TableCell>
                      </> :
                      <>
                        <TableCell>1,250</TableCell>
                        <TableCell>1,000</TableCell>
                        <TableCell>19,200</TableCell>
                        <TableCell>600</TableCell>
                        <TableCell>1,000</TableCell>
                      </>
                    } {/* End conditionally rendered packaging capacity numbers*/}
                    <TableCell></TableCell>
                  </TableRow>

                  {/* All following table data has shared key names between both metric and imperial */}
                  <TableRow>
                    <TableCell><b>Packages Needed:</b></TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_dc_packages_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_flow_packages_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_steel_fibers_packages_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_ultracure_blankets_packages_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_cpea_packages_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Order Quantity:</b></TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_dc_total_order_quantity?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_flow_total_order_quantity?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_steel_fibers_total_order_quantity?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_ultracure_blankets_total_order_quantity?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_cpea_total_order_quantity?.toLocaleString('en-US')}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Materials Price:</b></TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_dc_unit_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_flow_unit_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_steel_fibers_unit_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_ultracure_blankets_unit_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_cpea_unit_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell><b>Totals:</b></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Materials Price:</b></TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_dc_total_materials_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_flow_total_materials_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_steel_fibers_total_materials_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_ultracure_blankets_total_materials_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_cpea_total_materials_price?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.design_total_materials_price?.toLocaleString('en-US')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Containers:</b></TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_dc_containers_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_flow_containers_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_steel_fibers_containers_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_cpea_containers_needed?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.design_total_containers?.toLocaleString('en-US')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Estimate:</b></TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_dc_calculated_shipping_estimate?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_flow_calculated_shipping_estimate?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_steel_fibers_calculated_shipping_estimate?.toLocaleString('en-US')}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{calcCombinedEstimate?.primx_cpea_calculated_shipping_estimate?.toLocaleString('en-US')}</TableCell>
                    <TableCell>{calcCombinedEstimate?.design_total_shipping_estimate?.toLocaleString('en-US')}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cost:</b></TableCell>
                    <TableCell><b>{calcCombinedEstimate?.primx_dc_total_cost_estimate?.toLocaleString('en-US')}</b></TableCell>
                    <TableCell><b>{calcCombinedEstimate?.primx_flow_total_cost_estimate?.toLocaleString('en-US')}</b></TableCell>
                    <TableCell><b>{calcCombinedEstimate?.primx_steel_fibers_total_cost_estimate?.toLocaleString('en-US')}</b></TableCell>
                    <TableCell><b>{calcCombinedEstimate?.primx_ultracure_blankets_total_cost_estimate?.toLocaleString('en-US')}</b></TableCell>
                    <TableCell><b>{calcCombinedEstimate?.primx_cpea_total_cost_estimate?.toLocaleString('en-US')}</b></TableCell>
                    <TableCell><b>{calcCombinedEstimate?.design_total_price_estimate?.toLocaleString('en-US')}</b></TableCell>
                  </TableRow>

                  {/* Render the following table row for any orders that haven't been placed yet */}
                  {!calcCombinedEstimate?.ordered_by_licensee &&
                    <>
                      <TableRow>
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


