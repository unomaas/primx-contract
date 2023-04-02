import React from 'react'


import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button, MenuItem, Menu, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

export default function NavigationStepper() {

	const pricingLogData = useSelector(store => store.pricingLog);
	const { viewState, dataState } = pricingLogData;
	const dispatch = useDispatch();


	const stepsObject = {

		1: {
			step: 1,
			label: 'Set Product Pricing',
		},
		2: {
			step: 2,
			label: 'Set Shipping Costs',
		},
		3: {
			step: 3,
			label: 'Set Customs Duties',
		},
		4: {
			step: 4,
			label: 'Set Markup Margin',
		},
		5: {
			step: 5,
			label: 'Submit',
		},

	};


	const ColorlibConnector = withStyles({
		// alternativeLabel: {
		//   top: 22,
		// },
		active: {
			'& $line': {
				backgroundImage:
					`linear-gradient( 95deg,rgba(63,81,181,1.0) 0%,rgba(63,81,181,0.5) 50%,rgba(63,81,181,0.33) 100%)`,
			},
		},
		completed: {
			'& $line': {
				backgroundImage:
					`linear-gradient( 95deg,rgba(63,81,181,1.0) 0%,rgba(63,81,181,1.0) 50%,rgba(63,81,181,1.0) 100%)`,
			},
		},
		line: {
			height: 3,
			border: 0,
			backgroundColor: '#eaeaf0',
			borderRadius: 1,
		},
	})(StepConnector);


	const handleStepperClick = (step) => {
		if (step < 1 || step > 5) return;
		dispatch({ type: 'SET_PRICING_LOG_VIEW', payload: { updatePricingStep: step } });
	}


	const activeStep = stepsObject[viewState.updatePricingStep];

	return (
		<div id="StepperWrapper">
			<Stepper
				activeStep={activeStep.step - 1}
				connector={<ColorlibConnector />}
				style={{ padding: "10px" }}
			>
				{Object.values(stepsObject).map((step) => (
					<Step
						alternativeLabel
						key={step.label}
					>
						<StepLabel
							onClick={(event) => handleStepperClick(step.step)}
							style={{ cursor: 'pointer' }}
						>
							{step.label}
						</StepLabel>
					</Step>
				))}
			</Stepper>
			<div id="ButtonsWrapper">
				<Button
					color="primary"
					size="small"
					disabled={viewState.updatePricingStep == 1}
					onClick={() => handleStepperClick(viewState.updatePricingStep - 1)}
				>
					<ArrowLeftIcon /> Previous
				</Button>
				<Button
					color="primary"
					size="small"
					disabled={viewState.updatePricingStep == 5}
					onClick={() => handleStepperClick(viewState.updatePricingStep + 1)}
				>
					Next <ArrowRightIcon />
				</Button>
			</div>

		</div>
	)
}
