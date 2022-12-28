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
import { useParams, useLocation } from 'react-router';
import { useStyles } from '../MuiStyling/MuiStyling';
import EstimateLookupTable from './EstimateLookupTable';
import EstimateCombineTable from '../EstimateCombine/EstimateCombineTable';
//#endregion ⬆⬆ All document setup above.



export default function EstimateLookup() {
	//#region ⬇⬇ All state variables below:
	const companies = useSelector(store => store.companies);
	// ⬇ searchResult below is an estimate object searched from the DB that has already been mutated by the useEstimateCalculations function.
	const searchResult = useSelector(store => store.estimatesReducer.searchedEstimate);
	const searchQuery = useSelector(store => store.estimatesReducer.searchQuery);
	const [error, setError] = useState(false);
	const classes = useStyles(); // Keep in for MUI styling. 
	const [selectError, setSelectError] = useState("");
	// ⬇ showDataTable handles the state of showing table: 
	const showDataTable = useSelector(store => store.combineEstimatesReducer.showDataTable);
	const showLookupTable = useSelector(store => store.combineEstimatesReducer.showLookupTable);
	// ⬇ first,second,thirdEstimate below are objects searched from the DB
	const firstEstimate = useSelector(store => store.combineEstimatesReducer.firstCombinedEstimate);
	const secondEstimate = useSelector(store => store.combineEstimatesReducer.secondCombinedEstimate);
	const thirdEstimate = useSelector(store => store.combineEstimatesReducer.thirdCombinedEstimate);
	const calcCombinedEstimate = useSelector(store => store.combineEstimatesReducer.calcCombinedEstimate);
	// ⬇ Component has a main view at /lookup and a sub-view of /lookup/... where ... is the licensee ID appended with the estimate number.
	const { licensee_id_searched, estimate_number_searched } = useParams();
	const dispatch = useDispatch();
	const history = useHistory();
	// ⬇ Run on page load:
	useEffect(() => {
		// ⬇ Make the toggle button show this selection:
		dispatch({ type: 'SET_BUTTON_STATE', payload: 'lookup' }),
			// ⬇ Fetch the current companies for drop-down menu options:
			dispatch({ type: 'FETCH_ACTIVE_COMPANIES' }),
			dispatch({ type: 'SET_RECALCULATED_FALSE' })
	}, []);
	// ⬇ Run on estimate search complete:
	useEffect(() => {
		// ⬇ If the user got here with params, either by searching from the lookup view or by clicking a link in the admin table view, dispatch the data in the url params to run a GET request to the DB.
		if (estimate_number_searched?.charAt(estimate_number_searched?.length - 1) === "C") {
			dispatch({
				type: "FETCH_COMBINED_ESTIMATE_QUERY",
				payload: {
					licenseeId: licensee_id_searched,
					estimateNumber: estimate_number_searched,
					// Sending history for navigation:
					history: history
				} // End payload
			}); // If not a combined estimate, do normal GET:
		} else if (licensee_id_searched && estimate_number_searched) {
			dispatch({
				type: 'FETCH_ESTIMATE_QUERY',
				payload: {
					licensee_id: licensee_id_searched,
					estimate_number: estimate_number_searched
				} // End payload
			}); // End dispatch
		}; // End if/else
		// }
	}, [licensee_id_searched, estimate_number_searched]);
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
		// ⬇ Clearing validation each time: 
		setError(false);
		setSelectError("");
		// ⬇ Select dropdown validation:
		if (searchQuery.licensee_id !== 0) {
			// If they selected a company name from dropdown:
			// use history to send user to the details subview of their search query
			history.push(`/lookup/${searchQuery.licensee_id}/${searchQuery.estimate_number}`)
		} else {
			// If they haven't, pop up warning and prevent them:
			setError(true);
			setSelectError("Please select a company.");
		} // End if/else
	}; // End handleSubmit
	//#endregion ⬆⬆ Event handlers above. 

	// ⬇ Rendering below:
	return (
		<div className="EstimateCreate-wrapper">

			{/* <section className="removeInPrint">
				<ButtonToggle />
			</section> <br /> */}

			{/* <section className="removeInPrint">
        <ButtonToggle />

        <br />

        <form onSubmit={handleSubmit}>
          <Grid container
            spacing={2}
            justifyContent="center"
          >

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
                                return (<MenuItem key={companies.licensee_id} value={companies.licensee_id}>{companies.licensee_contractor_name}</MenuItem>)
                              }
                              )}
                            </Select>
                            <FormHelperText>{selectError}</FormHelperText>
                          </FormControl>
                        </TableCell>

                        <TableCell><b>Estimate Number:</b></TableCell>
                        <TableCell>
                          <TextField
                            onChange={event => handleChange('estimate_number', event.target.value.toLocaleUpperCase())}
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
      <br /> */}
			{/* End estimate search form */}

			{showLookupTable === 'single' &&
				<>
					<EstimateLookupTable />
					<h3>
						Your estimate number is: <b style={{ color: 'red' }}>{searchResult?.estimate_number}</b>
					</h3>
				</>
			}

			{showLookupTable === 'combined' &&
				<>
					<EstimateCombineTable
						firstEstimate={firstEstimate}
						secondEstimate={secondEstimate}
						thirdEstimate={thirdEstimate}
						calcCombinedEstimate={calcCombinedEstimate}
					/>
					<h3>
						Your estimate number is: <b style={{ color: 'red' }}>{calcCombinedEstimate?.estimate_number}</b>
					</h3>
				</>
			}

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

