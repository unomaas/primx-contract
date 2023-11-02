
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../../components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';
import UpdatePricingSteps from './UpdatePricingComponents/UpdatePricingSteps'
import NavigationStepper from './UpdatePricingComponents/NavigationStepper';
import './UpdatePricing.css'

import UpdateProductCosts from './UpdatePricingComponents/UpdateProductCosts';
import UpdateShippingCosts from './UpdatePricingComponents/UpdateShippingCosts';
import UpdateCustomsDuties from './UpdatePricingComponents/UpdateCustomsDuties';
import UpdateMarkupMargin from './UpdatePricingComponents/UpdateMarkupMargin';
import FormSubmission from './UpdatePricingComponents/FormSubmission';

import TopLoadingDiv from '../components/TopLoadingDiv';

export default function index() {
	const dispatch = useDispatch();


	const { viewState, dataState } = useSelector(store => store.pricingLog);

	useEffect(() => {
		// GET shipping cost data on page load
		dispatch({ type: 'UPDATE_PRICING_INITIAL_LOAD' })
	}, [])

	if (viewState.updatePricingIsLoading) return <TopLoadingDiv />;


	return (
		<div className="EstimateCreate-wrapper">
			<NavigationStepper />

			{viewState.updatePricingStep == '1' && <UpdateProductCosts />}
			{viewState.updatePricingStep == '2' && <UpdateShippingCosts />}
			{viewState.updatePricingStep == '3' && <UpdateCustomsDuties />}
			{viewState.updatePricingStep == '4' && <UpdateMarkupMargin />}
			{viewState.updatePricingStep == '5' && <FormSubmission />}

		</div>


	)
}
