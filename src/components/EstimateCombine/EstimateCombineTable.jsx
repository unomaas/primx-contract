import ButtonToggle from '../ButtonToggle/ButtonToggle';
// ⬇ Dependent Functionality:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import { Button, MenuItem, TextField, Select, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormHelperText, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useParams } from 'react-router';
import { useStyles } from '../MuiStyling/MuiStyling';


export default function EstimateCombineTable() {

// ⬇ first,second,thirdEstimate below are objects searched from the DB
const firstEstimate = useSelector(store => store.estimatesReducer.searchedEstimate);
const secondEstimate = useSelector(store => store.estimatesReducer.searchedEstimate);
const thirdEstimate = useSelector(store => store.estimatesReducer.searchedEstimate);



  // ⬇ Rendering below:
  return (
    <div className="EstimateCombineTable-wrapper">

      {/* Conditionally render entire code block below if the user has successfully searched an estimate */}
      {/* Contains some conditional rendering within */}
        <>
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

                      <TableRow>
                        <TableCell><b>Project Name:</b></TableCell>
                        <TableCell>
                          {searchResult?.project_name}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                        <TableCell>
                          {searchResult?.licensee_contractor_name}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Project General Contractor:</b></TableCell>
                        <TableCell>
                          {searchResult?.project_general_contractor}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Project Manager Name:</b></TableCell>
                        <TableCell>
                          {searchResult?.project_manager_name}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Project Manager Email:</b></TableCell>
                        <TableCell>
                          {searchResult?.project_manager_email}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Project Manager Cell:</b></TableCell>
                        <TableCell>
                          {searchResult?.project_manager_phone}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Floor Type:</b></TableCell>
                        <TableCell>
                          {searchResult?.floor_type}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Placement Type:</b></TableCell>
                        <TableCell>
                          {searchResult?.placement_type}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Unit of Measurement:</b></TableCell>
                        <TableCell>
                          {searchResult?.measurement_units}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Estimate Creation Date:</b></TableCell>
                        <TableCell>
                          {searchResult?.date_created}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Anticipated First Pour Date:</b></TableCell>
                        <TableCell>
                          {searchResult?.anticipated_first_pour_date}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Shipping Street Address:</b></TableCell>
                        <TableCell>
                          {searchResult?.ship_to_address}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Shipping City:</b></TableCell>
                        <TableCell>
                          {searchResult?.ship_to_city}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Shipping State/Province:</b></TableCell>
                        <TableCell>
                          {searchResult?.ship_to_state_province}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
                        <TableCell>
                          {searchResult?.zip_postal_code}
                        </TableCell>
                      </TableRow>

                      <TableRow>
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
                      <h3>Project #1 Quantity Calculations</h3>
                      <Table size="small">
                        <TableBody>

                          <TableRow>
                            <TableCell><b>Square Feet:</b></TableCell>
                            <TableCell>
                              {searchResult?.square_feet?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (in):</b></TableCell>
                            <TableCell>
                              {searchResult?.thickness_inches}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_yards_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
                            <TableCell>
                              {searchResult?.waste_factor_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.design_cubic_yards_total?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #1 Thickened Edge Calculator</h3>
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
                              {searchResult?.thickened_edge_perimeter_lineal_feet?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.thickened_edge_construction_joint_lineal_feet}
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
                              {searchResult?.additional_thickness_inches}
                            </TableCell>
                            <TableCell>
                              {searchResult?.additional_thickness_inches}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #2 Quantity Calculations</h3>
                      <Table size="small">
                        <TableBody>

                          <TableRow>
                            <TableCell><b>Square Feet:</b></TableCell>
                            <TableCell>
                              {searchResult?.square_feet?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (in):</b></TableCell>
                            <TableCell>
                              {searchResult?.thickness_inches}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_yards_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
                            <TableCell>
                              {searchResult?.waste_factor_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.design_cubic_yards_total?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #2 Thickened Edge Calculator</h3>
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
                              {searchResult?.thickened_edge_perimeter_lineal_feet?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.thickened_edge_construction_joint_lineal_feet}
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
                              {searchResult?.additional_thickness_inches}
                            </TableCell>
                            <TableCell>
                              {searchResult?.additional_thickness_inches}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #3 Quantity Calculations</h3>
                      <Table size="small">
                        <TableBody>

                          <TableRow>
                            <TableCell><b>Square Feet:</b></TableCell>
                            <TableCell>
                              {searchResult?.square_feet?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (in):</b></TableCell>
                            <TableCell>
                              {searchResult?.thickness_inches}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_yards_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
                            <TableCell>
                              {searchResult?.waste_factor_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.design_cubic_yards_total?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #3 Thickened Edge Calculator</h3>
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
                              {searchResult?.thickened_edge_perimeter_lineal_feet?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.thickened_edge_construction_joint_lineal_feet}
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
                              {searchResult?.additional_thickness_inches}
                            </TableCell>
                            <TableCell>
                              {searchResult?.additional_thickness_inches}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Yards:</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_yards?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_yards?.toLocaleString('en-US')}
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
                      <h3>Project #1 Quantity Calculations</h3>
                      <Table size="small">
                        <TableBody>

                          <TableRow>
                            <TableCell><b>Square Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.square_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (mm):</b></TableCell>
                            <TableCell>
                              {searchResult?.thickness_millimeters}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_meters_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
                            <TableCell>
                              {searchResult?.waste_factor_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.design_cubic_meters_total?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #1 Thickened Edge Calculator</h3>
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
                              {searchResult?.thickened_edge_perimeter_lineal_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.thickened_edge_construction_joint_lineal_meters?.toLocaleString('en-US')}
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
                              {searchResult?.additional_thickness_millimeters}
                            </TableCell>
                            <TableCell>
                              {searchResult?.additional_thickness_millimeters}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #2 Quantity Calculations</h3>
                      <Table size="small">
                        <TableBody>

                          <TableRow>
                            <TableCell><b>Square Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.square_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (mm):</b></TableCell>
                            <TableCell>
                              {searchResult?.thickness_millimeters}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_meters_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
                            <TableCell>
                              {searchResult?.waste_factor_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.design_cubic_meters_total?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #2 Thickened Edge Calculator</h3>
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
                              {searchResult?.thickened_edge_perimeter_lineal_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.thickened_edge_construction_joint_lineal_meters?.toLocaleString('en-US')}
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
                              {searchResult?.additional_thickness_millimeters}
                            </TableCell>
                            <TableCell>
                              {searchResult?.additional_thickness_millimeters}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #3 Quantity Calculations</h3>
                      <Table size="small">
                        <TableBody>

                          <TableRow>
                            <TableCell><b>Square Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.square_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickness (mm):</b></TableCell>
                            <TableCell>
                              {searchResult?.thickness_millimeters}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Subtotal:</b></TableCell>
                            <TableCell>
                              {searchResult?.cubic_meters_subtotal?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Waste Factor @ {searchResult?.waste_factor_percentage}%:</b></TableCell>
                            <TableCell>
                              {searchResult?.waste_factor_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Total Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.design_cubic_meters_total?.toLocaleString('en-US')}
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>

                      <h3>Project #3 Thickened Edge Calculator</h3>
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
                              {searchResult?.thickened_edge_perimeter_lineal_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.thickened_edge_construction_joint_lineal_meters?.toLocaleString('en-US')}
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
                              {searchResult?.additional_thickness_millimeters}
                            </TableCell>
                            <TableCell>
                              {searchResult?.additional_thickness_millimeters}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell><b>Cubic Meters:</b></TableCell>
                            <TableCell>
                              {searchResult?.perimeter_thickening_cubic_meters?.toLocaleString('en-US')}
                            </TableCell>
                            <TableCell>
                              {searchResult?.construction_joint_thickening_cubic_meters?.toLocaleString('en-US')}
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
                  <h3>Total Combined Materials Table</h3>
                  <Table size="small">

                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        {/* Conditionally render either imperial or metric table headings */}
                        {combinedResult.measurement_units == 'imperial' ?
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
                      <TableRow>
                        {/* Conditionally render either imperial or metric dosage numbers */}
                        {combinedResult.measurement_units == 'imperial' ?
                          <>
                            <TableCell><b>Dosage Rate (per yd³):</b></TableCell>
                            <TableCell>67</TableCell>
                            <TableCell>{combinedResult?.primx_flow_dosage_liters}</TableCell>
                            <TableCell>{combinedResult?.primx_steel_fibers_dosage_lbs}</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>{combinedResult?.primx_cpea_dosage_liters}</TableCell>
                          </> : <>
                            <TableCell><b>Dosage Rate (per m³):</b></TableCell>
                            <TableCell>40</TableCell>
                            <TableCell>{combinedResult?.primx_flow_dosage_liters}</TableCell>
                            <TableCell>{combinedResult?.primx_steel_fibers_dosage_kgs}</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>{combinedResult?.primx_cpea_dosage_liters}</TableCell>
                          </>
                        } {/* End conditionally rendered dosages*/}
                        <TableCell></TableCell>
                      </TableRow>

                      {/* Total amounts share key names between imperial and metric */}
                      <TableRow>
                        <TableCell><b>Total Amount:</b></TableCell>
                        <TableCell>{combinedResult?.primx_dc_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_flow_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_steel_fibers_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_ultracure_blankets_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_cpea_total_amount_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Packaging Capacity:</b></TableCell>
                        {/* Conditionally render either imperial or metric packaging capacity numbers */}
                        {combinedResult.measurement_units == 'imperial' ?
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
                        <TableCell>{combinedResult?.primx_dc_packages_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_flow_packages_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_steel_fibers_packages_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_ultracure_blankets_packages_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_cpea_packages_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Total Order Quantity:</b></TableCell>
                        <TableCell>{combinedResult?.primx_dc_total_order_quantity}</TableCell>
                        <TableCell>{combinedResult?.primx_flow_total_order_quantity}</TableCell>
                        <TableCell>{combinedResult?.primx_steel_fibers_total_order_quantity}</TableCell>
                        <TableCell>{combinedResult?.primx_ultracure_blankets_total_order_quantity}</TableCell>
                        <TableCell>{combinedResult?.primx_cpea_total_order_quantity}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Materials Price:</b></TableCell>
                        <TableCell>{combinedResult?.primx_dc_unit_price}</TableCell>
                        <TableCell>{combinedResult?.primx_flow_unit_price}</TableCell>
                        <TableCell>{combinedResult?.primx_steel_fibers_unit_price}</TableCell>
                        <TableCell>{combinedResult?.primx_ultracure_blankets_unit_price}</TableCell>
                        <TableCell>{combinedResult?.primx_cpea_unit_price}</TableCell>
                        <TableCell><b>Totals:</b></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Total Materials Price:</b></TableCell>
                        <TableCell>{combinedResult?.primx_dc_total_materials_price}</TableCell>
                        <TableCell>{combinedResult?.primx_flow_total_materials_price}</TableCell>
                        <TableCell>{combinedResult?.primx_steel_fibers_total_materials_price}</TableCell>
                        <TableCell>{combinedResult?.primx_ultracure_blankets_total_materials_price}</TableCell>
                        <TableCell>{combinedResult?.primx_cpea_total_materials_price}</TableCell>
                        <TableCell>{combinedResult?.design_total_materials_price}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Containers:</b></TableCell>
                        <TableCell>{combinedResult?.primx_dc_containers_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_flow_containers_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.primx_steel_fibers_containers_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>{combinedResult?.primx_cpea_containers_needed?.toLocaleString('en-US')}</TableCell>
                        <TableCell>{combinedResult?.design_total_containers?.toLocaleString('en-US')}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Shipping Estimate:</b></TableCell>
                        <TableCell>{combinedResult?.primx_dc_calculated_shipping_estimate}</TableCell>
                        <TableCell>{combinedResult?.primx_flow_calculated_shipping_estimate}</TableCell>
                        <TableCell>{combinedResult?.primx_steel_fibers_calculated_shipping_estimate}</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>{combinedResult?.primx_cpea_calculated_shipping_estimate}</TableCell>
                        <TableCell>{combinedResult?.design_total_shipping_estimate}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Total Cost:</b></TableCell>
                        <TableCell><b>{combinedResult?.primx_dc_total_cost_estimate}</b></TableCell>
                        <TableCell><b>{combinedResult?.primx_flow_total_cost_estimate}</b></TableCell>
                        <TableCell><b>{combinedResult?.primx_steel_fibers_total_cost_estimate}</b></TableCell>
                        <TableCell><b>{combinedResult?.primx_ultracure_blankets_total_cost_estimate}</b></TableCell>
                        <TableCell><b>{combinedResult?.primx_cpea_total_cost_estimate}</b></TableCell>
                        <TableCell><b>{combinedResult?.design_total_price_estimate}</b></TableCell>
                      </TableRow>

                      {/* Render the following table row for any orders that haven't been placed yet */}
                      {/* {!searchResult.ordered_by_licensee && */}
                        <>
                          <TableRow>
                            <TableCell colSpan={7} align="right">
                              <section className="removeInPrint">
                                {/* Edit Estimate Button:
                                <Button
                                  variant="contained"
                                  // color="secondary"
                                  onClick={handleEdit}
                                  className={classes.LexendTeraFont11}
                                >
                                  Edit This Estimate
                                </Button> */}
                                &nbsp; &nbsp;

                                {/* Recalculate Costs Button:
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleRecalculateCosts}
                                  className={classes.LexendTeraFont11}
                                >
                                  Recalculate Costs
                                </Button> */}
                                &nbsp; &nbsp;
                                
                                    <TextField
                                      onChange={(event) => setPoNumber(event.target.value)}
                                      size="small"
                                      label="PO Number"
                                      helperText={poNumError}
                                    >
                                    </TextField>

                                &nbsp; &nbsp;

                                {/* Submit Order Button */}

                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      // onClick={handlePlaceOrder}
                                      className={classes.LexendTeraFont11}
                                    >
                                      Place Order
                                    </Button>
                              </section>
                            </TableCell>
                          </TableRow>
                        </>
{/* End conditional render on materials table displaying buttons*/}

                      {/* End Materials Table */}

                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          <h3>
            Your estimate number is: <span style={{ color: 'red' }}>{searchResult?.estimate_number}</span>
          </h3>


          {/* Render messages underneath the table if an estimate has been submitted as an order */}
          {/* Display this message if an estimate has been ordered by the licensee but not yet processed by an admin */}
          {searchResult.ordered_by_licensee && !searchResult.marked_as_ordered &&
            <>
              <h3>
                This order is currently being processed. Please contact your PrīmX representative for more details.
              </h3>
            </>
          }
          {/* Display this message if an estimate has been processed by an admin */}
          {searchResult.marked_as_ordered &&
            <>
              <h3>
                This order has been processed. Please contact your PrīmX representative for more details.
              </h3>
            </>
          }
        </>
       {/* End full table conditional render*/}

      {/* Conditonally render a failed search message if the search came back with nothing */}
      {!searchResult.estimate_number && estimate_number_searched &&
        <>
          <h3>
            No matching estimate was found, please try again. Contact your PrīmX representative if you need further assistance.
          </h3>
        </>
      }
    </div >
  )
}


