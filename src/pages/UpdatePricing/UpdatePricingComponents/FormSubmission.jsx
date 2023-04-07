
import { React, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useStyles } from '../../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@material-ui/data-grid';
import { Button, Menu, Divider, Tooltip, Paper, FormControl, Select, MenuItem, FormHelperText, InputLabel } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
// import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';

export default function FormSubmission() {
	const dispatch = useDispatch();
	const { viewState, dataState } = useSelector(store => store.pricingLog);
	const {
		monthOptions,
		saveMonthOptions,
		nextMonthToSave,
		monthToSaveTo,
	} = viewState;


	const handleMonthChange = (value) => {
		console.log(`Ryan Here handleMonthChange \n `, { value, monthToSaveTo });
		dispatch({ type: 'SET_PRICING_LOG_VIEW', payload: { monthToSaveTo: value } })
	}

	const handlePricingSubmission = () => {
		dispatch({
			type: 'SUBMIT_NEW_PRICING_CHANGES', payload: {
				monthToSaveTo: monthToSaveTo,
				newCustomsDuties: viewState.newCustomsDuties,
				newShippingCosts: viewState.newShippingCosts,
				newProductCosts: viewState.newProductCosts,
				newMarkup: viewState.newMarkup,
				currentCustomsDuties: dataState.currentCustomsDuties,
				currentShippingCosts: dataState.currentShippingCosts,
				currentProductCosts: dataState.currentProductCosts,
				currentMarkup: dataState.currentMarkup,
			}
		})
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Paper
				elevation={3}
				style={{
					width: "400px",
				}}
			>
				{/* Create a simple doc with a header that says "Form Submission", a select with some month options, and a submit button */}
				<div style={{
					padding: "20px",
				}}>
					<div
						id="header"
						style={{
							fontSize: "16px",
							fontFamily: "Lexend Tera",
							padding: "10px",
							marginBottom: "10px",
						}}
					>
						Submit Pricing Changes
					</div>
					<Tooltip
						title={<p>Please select a month to save the current prices to for the historical pricing log, after which the new prices will take effect.
							<br /> <br />
							You are able to save the current prices to only one month.  If you save to a month that already has prices saved, the previous prices will be overwritten <b>AND</b> the prices will be updated to the new prices going forward.
							<br /> <br />
							If you do not save the current prices to a month, the new prices will take effect immediately.
							<br /> <br />
							The new prices are not saved until you click the "Submit" button and receive the success message. You can go back to any step and make changes to the prices before submitting.</p>}
						placement="right-start"
						arrow
						style={{ color: "gray" }}
					>
						<HelpIcon />
					</Tooltip>

					<div
						style={{
							width: "100%",
						}}
					>
						<FormControl style={{ width: "100%", margin: "10px 0" }} >
							<InputLabel id="month-select">Select a month to save the current prices to</InputLabel>
							<Select
								id="month-select"
								fullWidth
								size="small"
								value={monthToSaveTo}
								onChange={(event) => dispatch({ type: 'SET_PRICING_LOG_VIEW', payload: { monthToSaveTo: event.target.value } })}
							>
								<MenuItem value={-1}>Don't save current prices, just set new pricing.</MenuItem>
								{saveMonthOptions.map((month, index) => {
									return (
										<MenuItem key={index} value={month.value}>{month.label}: {month.saved ? `Prices saved on ${month.date_saved_full}.` : "Prices not yet saved."}</MenuItem>
									)
								})}
							</Select>
							{saveMonthOptions.find(month => month.value === monthToSaveTo)?.saved &&
								<FormHelperText style={{ color: "red" }}>Warning: Overwriting previously saved prices.</FormHelperText>
							}
						</FormControl>

					</div>
					<br /> <br />

					<Button
						variant="contained"
						color="primary"
						style={{
							width: "100%",
						}}
						// onClick={() => dispatch({ type: 'SUBMIT_NEW_PRICING_CHANGES', payload: viewState })}
						onClick={() => handlePricingSubmission()}
					>
						Submit Changes
					</Button>





				</div>
			</Paper>

		</div>
	)
}
