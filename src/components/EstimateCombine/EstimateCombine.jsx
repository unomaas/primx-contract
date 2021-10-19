//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
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
//#endregion ⬆⬆ All document setup above.



export default function EstimateCombine() {
  //#region ⬇⬇ All state variables below:
  const companies = useSelector(store => store.companies);
  // ⬇ searchResult below is an estimate object searched from the DB that has already been mutated by the useEstimateCalculations function.
  const searchResult = useSelector(store => store.estimatesReducer.searchedEstimate);
  // ⬇ hasRecalculated is a boolean that defaults to false. When a user recalculates costs, the boolean gets set to true, which activates the Submit Order button.
  const hasRecalculated = useSelector(store => store.estimatesReducer.hasRecalculated);
  const searchQuery = useSelector(store => store.estimatesReducer.searchQuery);
  const [error, setError] = useState(false);
  const classes = useStyles(); // Keep in for MUI styling. 
  const [selectError, setSelectError] = useState("");
  const [poNumError, setPoNumError] = useState("");
  const [poNumber, setPoNumber] = useState('');
  // ⬇ Component has a main view at /lookup and a sub-view of /lookup/... where ... is the licensee ID appended with the estimate number.
  const { estimate_number_searched, licensee_id_searched } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  // ⬇ Run on page load:
  useEffect(() => {
    // ⬇ Make the toggle button show this selection:
    dispatch({ type: 'SET_BUTTON_STATE', payload: 'combine' }),
      // ⬇ Fetch the current companies for drop-down menu options:
      dispatch({ type: 'FETCH_ACTIVE_COMPANIES' })
  }, []);
  // ⬇ Run on estimate search complete:
  useEffect(() => {
    // ⬇ If the user got here with params, either by searching from the lookup view or by clicking a link in the admin table view, dispatch the data in the url params to run a GET request to the DB.
    if (estimate_number_searched && licensee_id_searched) {
      dispatch({
        type: 'FETCH_ESTIMATE_QUERY',
        payload: {
          licensee_id: licensee_id_searched,
          estimate_number: estimate_number_searched
        } // End payload
      }) // End dispatch
    } // End if statement
  }, [estimate_number_searched, licensee_id_searched]);
  //#endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:
  /** ⬇ handleChange:
   * Change handler for the estimate search form. Will send their entries to a reducer.
   */
  const handleChange = (key, value) => {
    // setSearchQuery({ ...searchQuery, [key]: value })
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: { key: key, value: value }
    }); // End dispatch
  }; // End handleChange

  /** ⬇ handleSubmit:
   * When submitted, will search for the entered estimate to populate the tables. 
   */
  const handleSubmit = () => {
    // ⬇ Select dropdown validation:
    if (searchQuery.licensee_id !== "0") {
      // If they selected a company name from dropdown:
      // use history to send user to the details subview of their search query
      history.push(`/lookup/${searchQuery.licensee_id}/${searchQuery.estimate_number}`)
    } else {
      // If they haven't, pop up warning and prevent them:
      setError(true);
      setSelectError("Please select a value.");
    } // End if/else
  }; // End handleSubmit


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
        type: 'EDIT_PLACE_ORDER',
        payload: {
          id: searchResult.id,
          po_number: poNumber,
          licensee_id: searchResult.licensee_id,
          estimate_number: searchResult.estimate_number
        } // End payload
      }) // End dispatch
    } // End if/else.
  } // End handlePlaceOrder

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
                              value={searchQuery.licensee_id}
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

                        <TableCell><b>Estimate Number:</b></TableCell>
                        <TableCell>
                          <TextField
                            onChange={event => handleChange('estimate_number', event.target.value)}
                            required
                            type="search"
                            size="small"
                            fullWidth
                            value={searchQuery.estimate_number}
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


    </div>
  )
}
