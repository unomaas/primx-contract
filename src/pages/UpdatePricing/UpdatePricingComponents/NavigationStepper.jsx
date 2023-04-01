import React from 'react'


import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';


export default function NavigationStepper() {

	const pricingLogData = useSelector(store => store.pricingLog);
	const { viewState, dataState } = pricingLogData;
	const dispatch = useDispatch();

	// const classes = useStyles();
	// const [activeStep, setActiveStep] = useState(1);
	// const steps = getSteps();

	// const handleNext = () => {
	//   setActiveStep((prevActiveStep) => prevActiveStep + 1);
	// };

	// const handleBack = () => {
	//   setActiveStep((prevActiveStep) => prevActiveStep - 1);
	// };

	// const handleReset = () => {
	//   setActiveStep(0);
	// };

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
			label: 'Set Tax Rates',
		},
		4: {
			step: 4,
			label: 'Set Product Discounts',
		},
		5: {
			step: 5,
			label: 'Set Product Promotions',
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
		console.log(`Ryan Here: handleStepperClick \n `, { step });
		// dispatch({ type: 'UPDATE_PRICING_SET_STEP', payload: step });
		// dispatch({
		// 	type: "SET_PRICING_LOG_DATA", payload: { viewState.updatePricingStep = step }
		// })
	}



	const activeStep = stepsObject[viewState.updatePricingStep];
	console.log(`Ryan Here: NavigationStepper \n `, { stepsObject, activeStep, viewState });

	return (
		<div id="wrapper">
			<Stepper activeStep={activeStep.step - 1} connector={<ColorlibConnector />}>
				{Object.values(stepsObject).map((step) => (
					<Step
						alternativeLabel
						key={step.label}
						// onClick={(event) => handleStepperClick(step.step)}
					>
						<StepLabel>{step.label}</StepLabel>
					</Step>
				))}
			</Stepper>
		</div>
	)
}
