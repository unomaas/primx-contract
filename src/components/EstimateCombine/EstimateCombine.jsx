//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import ButtonToggle from '../ButtonToggle/ButtonToggle';
import EstimateCombineTable from './EstimateCombineTable';
// ⬇ Dependent Functionality:
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, Select, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormHelperText, Snackbar } from '@material-ui/core';
import { useParams } from 'react-router';
import { useStyles } from '../MuiStyling/MuiStyling';
//#endregion ⬆⬆ All document setup above.


export default function EstimateCombine() {
  //#region ⬇⬇ All state variables below:
  // ⬇ Used for page navigation:
  const dispatch = useDispatch();
  const history = useHistory();
  // ⬇ Used for company drop-down select:
  const companies = useSelector(store => store.companies);
  // ⬇ Used for the combine query:
  const combineQuery = useSelector(store => store.combineEstimatesReducer.combineQuery);
  // ⬇ calcCombinedEstimate is the object returned by searching for multiple estimates to combined, with updated quotes. 
  const calcCombinedEstimate = useSelector(store => store.combineEstimatesReducer.calcCombinedEstimate);
  // ⬇ showDataTable handles the state of showing table: 
  const showDataTable = useSelector(store => store.combineEstimatesReducer.showDataTable);
  // ⬇ Sets the error state for a faulty search:
  const [error, setError] = useState(false);
  const [selectError, setSelectError] = useState("");
  // ⬇ Deprecated, used for Styling MUI components. 
  const classes = useStyles(); // Keep in for MUI styling. 
  // ⬇ Component has a main view at /lookup and a sub-view of /lookup/... where ... is the licensee ID appended with the estimate number.
  const { licensee_id_searched, first_estimate_number_combined, second_estimate_number_combined, third_estimate_number_combined } = useParams();
  // ⬇ first,second,thirdEstimate below are objects searched from the DB
  const firstEstimate = useSelector(store => store.combineEstimatesReducer.firstCombinedEstimate);
  const secondEstimate = useSelector(store => store.combineEstimatesReducer.secondCombinedEstimate);
  const thirdEstimate = useSelector(store => store.combineEstimatesReducer.thirdCombinedEstimate);
  // ⬇ Run once on page load:
  useEffect(() => {
    // ⬇ Make the toggle button show this selection:
    dispatch({ type: 'SET_BUTTON_STATE', payload: 'combine' }),
      // ⬇ Fetch the current companies for drop-down menu options:
      dispatch({ type: 'FETCH_ACTIVE_COMPANIES' }),
      dispatch({ type: 'SET_RECALCULATED_FALSE' })
  }, []); // End useEffect
  // ⬇ Run on estimate search complete:
  useEffect(() => {
    // ⬇ If the user got here with params by searching from the lookup view, dispatch the data in the URL params to run a GET request to the DB:
    if (licensee_id_searched && first_estimate_number_combined && second_estimate_number_combined) {
      dispatch({
        type: 'FETCH_MANY_ESTIMATES_QUERY',
        payload: {
          licensee_id: licensee_id_searched,
          first_estimate_number: first_estimate_number_combined,
          second_estimate_number: second_estimate_number_combined,
          third_estimate_number: third_estimate_number_combined,
          // Sending history for navigation:
          history: history,
        } // End payload
      }) // End dispatch
    } // End if statement
  }, [licensee_id_searched, first_estimate_number_combined, second_estimate_number_combined, third_estimate_number_combined]
  ); // End useEffect 
  // #endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:
  /** ⬇ handleChange:
   * Change handler for the estimate search form. Will send their entries to a reducer. 
   */
  const handleChange = (key, value) => {
    // setSearchQuery({ ...searchQuery, [key]: value })
    dispatch({
      type: 'SET_COMBINE_QUERY',
      payload: { key: key, value: value }
    }); // End dispatch
  }; // End handleChange

  /** ⬇ handleSubmit:
   * When submitted, will search for the entered estimate to populate the tables. 
   */
  const handleSubmit = (event) => {
    // ⬇ Don't refresh until submit:
    event.preventDefault();
    // ⬇ Clearing validation each time: 
    setError(false);
    setSelectError("");
    // ⬇ Clearing reducers data before submission to prevent zombie data:
    dispatch({ type: 'CLEAR_COMBINED_ESTIMATES_DATA' })
    // ⬇ Select dropdown validation:
    if (combineQuery.licensee_id === 0) {
      // ⬇ If they haven't selected a drop-down, pop up warning and prevent them:
      setError(true);
      setSelectError("Please select a value.");
    } // ⬇ If they have selected a drop-down, run another if statement to see if two or three estimates were entered:
    else {
      // ⬇ If they entered three estimate numbers:
      if (combineQuery.first_estimate_number && combineQuery.second_estimate_number && combineQuery.third_estimate_number) {
        history.push(`/combine/${combineQuery.licensee_id}/${combineQuery.first_estimate_number}/${combineQuery.second_estimate_number}/${combineQuery.third_estimate_number}`);
      } // ⬇ If they only entered two estimate numbers: 
      else if (combineQuery.first_estimate_number && combineQuery.second_estimate_number) {
        history.push(`/combine/${combineQuery.licensee_id}/${combineQuery.first_estimate_number}/${combineQuery.second_estimate_number}`);
      } // End if/else statement
    } // End if statement
  }; // End handleSubmit
  //#endregion ⬆⬆ Event handlers above. 


  // ⬇ Rendering below:
  return (
    <div className="EstimateCreate-wrapper">

      <section className="removeInPrint">
        <ButtonToggle />

        <br />

        <form onSubmit={handleSubmit}>
          <Grid container
            spacing={2}
            justifyContent="center"
          >

            {/* Grid #1: The Search Bar for Estimate Lookup */}
            <Grid item xs={12}>
              <Paper elevation={3}>
                <TableContainer >
                  <Table size="small">
                    <TableBody>
                      <TableRow>

                        <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                        <TableCell>
                          <FormControl error={error}>
                            <Select
                              onChange={event => handleChange('licensee_id', event.target.value)}
                              required
                              size="small"
                              fullWidth
                              value={combineQuery.licensee_id}
                            >
                              <MenuItem key="0" value="0">Please Select</MenuItem>
                              {companies.map(companies => {
                                return (<MenuItem key={companies.id} value={companies.id}>{companies.licensee_contractor_name}</MenuItem>)
                              }
                              )}
                            </Select>
                            <FormHelperText>{selectError}</FormHelperText>
                          </FormControl>
                        </TableCell>

                        <TableCell><b>First Estimate Number:</b></TableCell>
                        <TableCell>
                          <TextField
                            onChange={event => handleChange('first_estimate_number', event.target.value.toLocaleUpperCase())}
                            required
                            type="search"
                            size="small"
                            fullWidth
                            value={combineQuery.first_estimate_number}
                          />
                        </TableCell>

                        <TableCell colSpan={2} align="right">
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell><b>Second Estimate Number:</b></TableCell>
                        <TableCell>
                          <TextField
                            onChange={event => handleChange('second_estimate_number', event.target.value.toLocaleUpperCase())}
                            required
                            type="search"
                            size="small"
                            fullWidth
                            value={combineQuery.second_estimate_number}
                          />
                        </TableCell>

                        <TableCell><b>Third Estimate Number:</b></TableCell>
                        <TableCell>
                          <TextField
                            onChange={event => handleChange('third_estimate_number', event.target.value.toLocaleUpperCase())}
                            type="search"
                            size="small"
                            fullWidth
                            value={combineQuery.third_estimate_number}
                          />
                        </TableCell>

                        <TableCell colSpan={2} align="right">
                          <Button
                            type="submit"
                            variant="contained"
                            className={classes.LexendTeraFont11}
                            color="primary"
                          >
                            Search
                          </Button>
                        </TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </section>
      <br />
      {/* End estimate search form */}

      {/* Conditional rendering for showing the info graphic or showing the combined estimates table. */}
      {!showDataTable ? (
        // If they haven't searched, show these instructions:
        <Grid container
          spacing={2}
          justifyContent="center"
        >
          <Grid item xs={12}>
            <Paper
              elevation={3}
              style={{ padding: '1em 2em' }}
            >
              <h3>Combine Multiple Estimates:</h3>
              <p>
                This feature allows you to combine up to three (3) existing estimates into one order for a reduced shipping cost. The first and second estimate numbers are required to use this feature.  The third estimate number is optional.
              </p>
              <p>
                <b>Please be aware that whatever the Shipping/Contact Information is for the FIRST estimate number entered, that will be the information used for the other estimate(s).</b> All estimates MUST go to the same shipping location in order to qualify for this reduced rate.
              </p>
              <p>
                If you need to edit the information for any of the estimates used, that must be done via the "Search For Estimate" page.
              </p>
              <p>
                Lastly, please be aware that combining estimates together will result in a new <b>combined estimate number</b> that ends with a "<b>-C</b>" notation. You will need this to lookup and place that order later.
              </p>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        // If they have searched, show the table: 
        <EstimateCombineTable
          firstEstimate={firstEstimate}
          secondEstimate={secondEstimate}
          thirdEstimate={thirdEstimate}
          calcCombinedEstimate={calcCombinedEstimate}
        />
      )} {/* End conditional rendering */}
    </div >
  )
}


