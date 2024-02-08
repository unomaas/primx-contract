

export default function useCalculateProjectCost(estimate, options) {

	//#region - Helpful constants:
	const {
		products,
		shippingDestinations,
		currentMarkup,
		shippingCosts,
		productContainers,
		dosageRates,
		customsDuties,
	} = options;

	if (
		products.length === 0 ||
		shippingDestinations.length === 0 ||
		currentMarkup.length === 0 ||
		shippingCosts.length === 0 ||
		productContainers.length === 0 ||
		dosageRates.length === 0 ||
		customsDuties.length === 0
	) {
		return;
	}; // End if

	const shippingDestination = shippingDestinations.find(destination => destination.destination_id === estimate.destination_id);
	estimate.destination_country = shippingDestination.destination_country;

	const needToConvertUnits = (
		(estimate.measurement_units === 'imperial' && shippingDestination.default_measurement === 'metric') ||
		(estimate.measurement_units === 'metric' && shippingDestination.default_measurement === 'imperial')
	);

	const fromUnit = estimate.measurement_units === 'imperial' ? 'lbs' : 'kgs';
	const lbsToKgsConversionRate = 0.45359237;
	const kgsToLbsConversionRate = 2.20462262;

	const convertUnits = (amount) => {
		return fromUnit === 'lbs' ? amount * lbsToKgsConversionRate : amount * kgsToLbsConversionRate;
	};
	//#endregion - Helpful constants.


	//#region Step 1 - Determining the data we're using: 
	// ⬇ Empty variables to set later: 
	let primxDcProductInfo, primxSteelFiberProductInfo, primxFlowProductInfo, primxUltraCureProductInfo, primxCpeaProductInfo, primxDcDosageRateInfo, primxSteelFiberDosageRateInfo_75_50, primxSteelFiberDosageRateInfo_90_60, primxFlowDosageRateInfo, primxCpeaDosageRateInfo = null;

	// ⬇ Determine whether we're using imperial or metric units for the products: 
	if (estimate.measurement_units == 'imperial') {

		// ⬇ Find the product info for imperial, then set the dosage rate to the imperial dosage rate:
		primxDcProductInfo = products.find(product => product.product_id === 1 && product.destination_country == estimate.destination_country);
		primxDcDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 1);
		primxDcDosageRateInfo.dosage_rate = primxDcDosageRateInfo.lbs_y3;

		primxSteelFiberProductInfo = products.find(product => product.product_id === 4 && product.destination_country == estimate.destination_country);
		primxSteelFiberDosageRateInfo_75_50 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3);
		primxSteelFiberDosageRateInfo_90_60 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4);
		primxSteelFiberDosageRateInfo_75_50.dosage_rate = primxSteelFiberDosageRateInfo_75_50.lbs_y3;
		primxSteelFiberDosageRateInfo_90_60.dosage_rate = primxSteelFiberDosageRateInfo_90_60.lbs_y3;

		primxFlowProductInfo = products.find(product => product.product_id === 3 && product.destination_country == estimate.destination_country);
		primxFlowDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 3);
		primxFlowDosageRateInfo.dosage_rate = primxFlowDosageRateInfo.lbs_y3;

		primxCpeaProductInfo = products.find(product => product.product_id === 8 && product.destination_country == estimate.destination_country);
		primxCpeaDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 8);
		primxCpeaDosageRateInfo.dosage_rate = primxCpeaDosageRateInfo.lbs_y3;

		primxUltraCureProductInfo = products.find(product => product.product_id === 6 && product.destination_country == estimate.destination_country);

	} else if (estimate.measurement_units == 'metric') {

		// ⬇ Find the product info for metric, then set the dosage rate to the metric dosage rate:
		primxDcProductInfo = products.find(product => product.product_id === 2 && product.destination_country == estimate.destination_country);
		primxDcDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 2);
		primxDcDosageRateInfo.dosage_rate = primxDcDosageRateInfo.kg_m3;

		primxSteelFiberProductInfo = products.find(product => product.product_id === 5 && product.destination_country == estimate.destination_country);
		primxSteelFiberDosageRateInfo_75_50 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5);
		primxSteelFiberDosageRateInfo_90_60 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6);
		primxSteelFiberDosageRateInfo_75_50.dosage_rate = primxSteelFiberDosageRateInfo_75_50.kg_m3;
		primxSteelFiberDosageRateInfo_90_60.dosage_rate = primxSteelFiberDosageRateInfo_90_60.kg_m3;

		primxFlowProductInfo = products.find(product => product.product_id === 3 && product.destination_country == estimate.destination_country);
		primxFlowDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 3);
		primxFlowDosageRateInfo.dosage_rate = primxFlowDosageRateInfo.kg_m3;

		primxCpeaProductInfo = products.find(product => product.product_id === 8 && product.destination_country == estimate.destination_country);
		primxCpeaDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 8);
		primxCpeaDosageRateInfo.dosage_rate = primxCpeaDosageRateInfo.kg_m3;

		primxUltraCureProductInfo = products.find(product => product.product_id === 7 && product.destination_country == estimate.destination_country);
	}; // End if

	// ⬇ Set the custom duty percentage for each product:
	primxDcProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 1 && customsDuty.destination_country == estimate.destination_country).duty_percentage;
	primxFlowProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 2 && customsDuty.destination_country == estimate.destination_country).duty_percentage;
	primxSteelFiberProductInfo.custom_duty_percentage_75_50 = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 3 && customsDuty.destination_country == estimate.destination_country).duty_percentage;
	primxSteelFiberProductInfo.custom_duty_percentage_90_60 = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 4 && customsDuty.destination_country == estimate.destination_country).duty_percentage;
	primxCpeaProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 6 && customsDuty.destination_country == estimate.destination_country).duty_percentage;
	//#endregion - Step 1.



	//#region Step 2 - Set Cost and Container Info. Determine the cost and container pricing information based off of matching product_id, destination_id, and container_length_ft.  Do this for each product, for both container sizes:

	// ⬇ PrimX DC 20ft & 40ft:
	const primxDc20ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.dc_20ft || "0";
	const primxDc20ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '20' && (container.product_id == 1 || container.product_id == 2));

	const primxDc40ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.dc_40ft || "0";
	const primxDc40ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '40' && (container.product_id == 1 || container.product_id == 2));

	// ⬇ PrimX Steel Fibers 20ft & 40ft:
	const primxSteelFiber20ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.fibers_20ft || "0";
	const primxSteelFiber20ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '20' && (container.product_id == 4 || container.product_id == 5));
	const primxSteelFiber40ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.fibers_40ft || "0";
	const primxSteelFiber40ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '40' && (container.product_id == 4 || container.product_id == 5));


	// ⬇ PrimX Flow 20ft & 40ft:
	const primxFlow20ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.flow_20ft || "0";
	const primxFlow20ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '20' && container.product_id == 3);
	const primxFlow40ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.flow_40ft || "0";
	const primxFlow40ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '40' && container.product_id == 3);

	// ⬇ PrimX Cpea 20ft & 40ft:
	const primxCpea20ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.cpea_20ft || "0";
	const primxCpea20ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '20' && container.product_id == 8);

	const primxCpea40ftCostInfo = shippingCosts.find(cost => cost.destination_id == estimate.destination_id)?.cpea_40ft || "0";
	const primxCpea40ftContainerInfo = productContainers.find(container => container.container_destination == estimate.destination_country && container.container_length_ft == '40' && container.product_id == 8);
	//#endregion - Step 2.



	//#region Step 3 - Calculate the cost per unit for each product, for both container sizes:
	// ⬇ PrimX DC 20ft & 40ft:
	const primxDc20ftTransportationCostPerUnit = (
		!needToConvertUnits
			? parseFloat(primxDc20ftCostInfo) / (parseFloat(primxDc20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc20ftContainerInfo.max_pallets_per_container))
			// : parseFloat(primxDc20ftCostInfo) / (parseFloat(primxDc20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc20ftContainerInfo.max_pallets_per_container))
			: convertUnits(parseFloat(primxDc20ftCostInfo) / (parseFloat(primxDc20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc20ftContainerInfo.max_pallets_per_container)))
	);
	const primxDc40ftTransportationCostPerUnit = (
		!needToConvertUnits
			? parseFloat(primxDc40ftCostInfo) / (parseFloat(primxDc40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc40ftContainerInfo.max_pallets_per_container))
			// : parseFloat(primxDc40ftCostInfo) / (parseFloat(primxDc40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc40ftContainerInfo.max_pallets_per_container))
			: convertUnits(parseFloat(primxDc40ftCostInfo) / (parseFloat(primxDc40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc40ftContainerInfo.max_pallets_per_container)))
	);

	// ⬇ PrimX Steel Fibers 20ft & 40ft:
	const primxSteelFiber20ftTransportationCostPerUnit = (
		!needToConvertUnits
			? parseFloat(primxSteelFiber20ftCostInfo) / (parseFloat(primxSteelFiber20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber20ftContainerInfo.max_pallets_per_container))
			// : parseFloat(primxSteelFiber20ftCostInfo) / (parseFloat(primxSteelFiber20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber20ftContainerInfo.max_pallets_per_container))
			: convertUnits(parseFloat(primxSteelFiber20ftCostInfo) / (parseFloat(primxSteelFiber20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber20ftContainerInfo.max_pallets_per_container)))
	);
	const primxSteelFiber40ftTransportationCostPerUnit = (
		!needToConvertUnits
			? parseFloat(primxSteelFiber40ftCostInfo) / (parseFloat(primxSteelFiber40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber40ftContainerInfo.max_pallets_per_container))
			// : parseFloat(primxSteelFiber40ftCostInfo) / (parseFloat(primxSteelFiber40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber40ftContainerInfo.max_pallets_per_container))
			: convertUnits(parseFloat(primxSteelFiber40ftCostInfo) / (parseFloat(primxSteelFiber40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber40ftContainerInfo.max_pallets_per_container)))
	);

	// ⬇ PrimX Flow 20ft & 40ft:
	const primxFlow20ftTransportationCostPerUnit = parseFloat(primxFlow20ftCostInfo) / (parseFloat(primxFlow20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxFlow20ftContainerInfo.max_pallets_per_container));
	const primxFlow40ftTransportationCostPerUnit = parseFloat(primxFlow40ftCostInfo) / (parseFloat(primxFlow40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxFlow40ftContainerInfo.max_pallets_per_container));

	// ⬇ PrimX Cpea 20ft & 40ft:
	const primxCpea20ftTransportationCostPerUnit = parseFloat(primxCpea20ftCostInfo) / (parseFloat(primxCpea20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxCpea20ftContainerInfo.max_pallets_per_container));
	const primxCpea40ftTransportationCostPerUnit = parseFloat(primxCpea40ftCostInfo) / (parseFloat(primxCpea40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxCpea40ftContainerInfo.max_pallets_per_container));
	//#endregion - Step 3.



	//#region Step 4 - Compare the Cost Per Lb of 20ft and 40ft containers, and choose the cheapest.  Then Determine the number of pallets and shipping containers for each product.
	// ⬇ PrimX DC:
	const cheapestPrimXDcTransportationCostPerUnit = primxDc20ftTransportationCostPerUnit < primxDc40ftTransportationCostPerUnit ? primxDc20ftTransportationCostPerUnit : primxDc40ftTransportationCostPerUnit;
	const primxDcTransportation20or40 = primxDc20ftTransportationCostPerUnit < primxDc40ftTransportationCostPerUnit ? 20 : 40;

	// ⬇ PrimX Steel Fibers:
	const cheapestPrimxSteelFiberTransportationCostPerUnit = primxSteelFiber20ftTransportationCostPerUnit < primxSteelFiber40ftTransportationCostPerUnit ? primxSteelFiber20ftTransportationCostPerUnit : primxSteelFiber40ftTransportationCostPerUnit;
	const primxSteelFiberTransportation20or40 = primxSteelFiber20ftTransportationCostPerUnit < primxSteelFiber40ftTransportationCostPerUnit ? 20 : 40;

	// ⬇ PrimX Flow:
	const cheapestPrimxFlowTransportationCostPerUnit = primxFlow20ftTransportationCostPerUnit < primxFlow40ftTransportationCostPerUnit ? primxFlow20ftTransportationCostPerUnit : primxFlow40ftTransportationCostPerUnit;
	const primxFlowTransportation20or40 = primxFlow20ftTransportationCostPerUnit < primxFlow40ftTransportationCostPerUnit ? 20 : 40;

	// ⬇ PrimX Cpea:
	const cheapestPrimxCpeaTransportationCostPerUnit = primxCpea20ftTransportationCostPerUnit < primxCpea40ftTransportationCostPerUnit ? primxCpea20ftTransportationCostPerUnit : primxCpea40ftTransportationCostPerUnit;
	const primxCpeaTransportation20or40 = primxCpea20ftTransportationCostPerUnit < primxCpea40ftTransportationCostPerUnit ? 20 : 40;


	if (estimate.measurement_units == "imperial") {
		// ⬇ PrimX DC:
		estimate.primx_dc_total_project_amount = (
			!needToConvertUnits
				? estimate.total_project_volume * parseFloat(primxDcDosageRateInfo.dosage_rate)
				// : estimate.total_project_volume * parseFloat(primxDcDosageRateInfo.dosage_rate)
				: convertUnits(estimate.total_project_volume * parseFloat(primxDcDosageRateInfo.dosage_rate))
		);
		estimate.primx_dc_pallets_needed = Math.ceil(estimate.primx_dc_total_project_amount / parseFloat(primxDc20ftContainerInfo.net_weight_of_pallet));

		// ⬇ PrimX Steel Fibers:
		estimate.primx_steel_fibers_total_project_amount_higher = (
			!needToConvertUnits
				? estimate.total_project_volume * parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate)
				// : estimate.total_project_volume * parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate)
				: convertUnits(estimate.total_project_volume * parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate))
		);
		estimate.primx_steel_fibers_pallets_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount_higher / parseFloat(primxSteelFiber20ftContainerInfo.net_weight_of_pallet));

		// ⬇ PrimX Flow:
		estimate.primx_flow_total_project_amount = estimate.total_project_volume * parseFloat(primxFlowDosageRateInfo.dosage_rate);
		estimate.primx_flow_pallets_needed = Math.ceil(estimate.primx_flow_total_project_amount / parseFloat(primxFlow20ftContainerInfo.net_weight_of_pallet));

		// ⬇ PrimX Cpea:
		estimate.primx_cpea_total_project_amount = estimate.total_project_volume * parseFloat(primxCpeaDosageRateInfo.dosage_rate);
		estimate.primx_cpea_pallets_needed = Math.ceil(estimate.primx_cpea_total_project_amount / parseFloat(primxCpea20ftContainerInfo.net_weight_of_pallet));

		// ⬇ Primx UltraCure Blankets:
		estimate.primx_ultracure_blankets_total_project_amount = estimate.total_project_volume * 1.2; // 1.2 is the factor provided by PrimX

		// ⬇ Blankets come in rolls of 6458 sq feet, need to round up:
		estimate.primx_ultracure_blankets_pallets_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 6458);

	} else if (estimate.measurement_units == "metric") {

		// ⬇ PrimX DC:
		estimate.primx_dc_total_project_amount = (
			!needToConvertUnits
				? estimate.total_project_volume * parseFloat(primxDcDosageRateInfo.dosage_rate)
				// : estimate.total_project_volume * parseFloat(primxDcDosageRateInfo.dosage_rate)
				: convertUnits(estimate.total_project_volume * parseFloat(primxDcDosageRateInfo.dosage_rate))
		);
		estimate.primx_dc_pallets_needed = Math.ceil(estimate.primx_dc_total_project_amount / parseFloat(primxDc20ftContainerInfo.net_weight_of_pallet));

		// ⬇ PrimX Steel Fibers:
		estimate.primx_steel_fibers_total_project_amount_higher = (
			!needToConvertUnits
				? estimate.total_project_volume * parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate)
				// : estimate.total_project_volume * parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate)
				: convertUnits(estimate.total_project_volume * parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate))
		);
		estimate.primx_steel_fibers_pallets_needed = Math.ceil(estimate.primx_steel_fibers_total_project_amount_higher / parseFloat(primxSteelFiber20ftContainerInfo.net_weight_of_pallet));

		// ⬇ PrimX Flow:
		estimate.primx_flow_total_project_amount = estimate.total_project_volume * parseFloat(primxFlowDosageRateInfo.dosage_rate);
		estimate.primx_flow_pallets_needed = Math.ceil(estimate.primx_flow_total_project_amount / parseFloat(primxFlow20ftContainerInfo.net_weight_of_pallet));

		// ⬇ PrimX Cpea:
		estimate.primx_cpea_total_project_amount = estimate.total_project_volume * parseFloat(primxCpeaDosageRateInfo.dosage_rate);
		estimate.primx_cpea_pallets_needed = Math.ceil(estimate.primx_cpea_total_project_amount / parseFloat(primxCpea20ftContainerInfo.net_weight_of_pallet));

		// ⬇ Primx UltraCure Blankets:
		estimate.primx_ultracure_blankets_total_project_amount = estimate.total_project_volume * 1.2; // 1.2 is the factor provided by PrimX
		// ⬇ Blankets come in rolls of 600 square meters, need to round up:
		estimate.primx_ultracure_blankets_pallets_needed = Math.ceil(estimate.primx_ultracure_blankets_total_project_amount / 600);

	}; // End if/else

	// console.log(`Ryan Here: \n `, {
	// 	primx_dc_total_project_amount: estimate.primx_dc_total_project_amount,
	// 	primx_dc_pallets_needed: estimate.primx_dc_pallets_needed,
	// 	primx_dc_net_weight_of_pallet: parseFloat(primxDc20ftContainerInfo.net_weight_of_pallet),
	// 	primx_dc_dosage_rate: parseFloat(primxDcDosageRateInfo.dosage_rate),

	// 	primx_steel_fibers_total_project_amount_higher: estimate.primx_steel_fibers_total_project_amount_higher,
	// 	primx_steel_fibers_pallets_needed: estimate.primx_steel_fibers_pallets_needed,
	// 	primx_steel_fibers_net_weight_of_pallet: parseFloat(primxSteelFiber20ftContainerInfo.net_weight_of_pallet),
	// 	primx_steel_fibers_dosage_rate: parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate),

	// 	primx_flow_total_project_amount: estimate.primx_flow_total_project_amount,
	// 	primx_flow_pallets_needed: estimate.primx_flow_pallets_needed,
	// 	primx_flow_net_weight_of_pallet: parseFloat(primxFlow20ftContainerInfo.net_weight_of_pallet),
	// 	primx_flow_dosage_rate: parseFloat(primxFlowDosageRateInfo.dosage_rate),

	// 	primx_cpea_total_project_amount: estimate.primx_cpea_total_project_amount,
	// 	primx_cpea_pallets_needed: estimate.primx_cpea_pallets_needed,
	// 	primx_cpea_net_weight_of_pallet: parseFloat(primxCpea20ftContainerInfo.net_weight_of_pallet),
	// 	primx_cpea_dosage_rate: parseFloat(primxCpeaDosageRateInfo.dosage_rate),

	// 	primx_ultracure_blankets_total_project_amount: estimate.primx_ultracure_blankets_total_project_amount,
	// 	primx_ultracure_blankets_pallets_needed: estimate.primx_ultracure_blankets_pallets_needed,
	// });

	// ⬇ If they've selected exclude_cpea or exclude_fibers, we want to null those values out for the final calculations:
	if (estimate.materials_excluded == "exclude_cpea") {
		estimate.primx_cpea_pallets_needed = 0;
	} else if (estimate.materials_excluded == "exclude_fibers") {
		estimate.primx_steel_fibers_pallets_needed = 0;
	}; // End if/else

	const totalNumberOfPallets = (
		estimate.primx_dc_pallets_needed +
		estimate.primx_steel_fibers_pallets_needed +
		estimate.primx_flow_pallets_needed +
		estimate.primx_cpea_pallets_needed
	); // End totalNumberOfPallets

	estimate.primx_dc_containers_needed = (
		primxDcTransportation20or40 == 20
			? Math.ceil(estimate.primx_dc_pallets_needed / parseInt(primxDc20ftContainerInfo.max_pallets_per_container))
			: Math.ceil(estimate.primx_dc_pallets_needed / parseInt(primxDc40ftContainerInfo.max_pallets_per_container))
	);

	estimate.primx_steel_fibers_containers_needed = (
		primxSteelFiberTransportation20or40 == 20
			? Math.ceil(estimate.primx_steel_fibers_pallets_needed / parseInt(primxSteelFiber20ftContainerInfo.max_pallets_per_container))
			: Math.ceil(estimate.primx_steel_fibers_pallets_needed / parseInt(primxSteelFiber40ftContainerInfo.max_pallets_per_container))
	);

	estimate.primx_flow_containers_needed = (
		primxFlowTransportation20or40 == 20
			? Math.ceil(estimate.primx_flow_pallets_needed / parseInt(primxFlow20ftContainerInfo.max_pallets_per_container))
			: Math.ceil(estimate.primx_flow_pallets_needed / parseInt(primxFlow40ftContainerInfo.max_pallets_per_container))
	);

	estimate.primx_cpea_containers_needed = (
		primxCpeaTransportation20or40 == 20
			? Math.ceil(estimate.primx_cpea_pallets_needed / parseInt(primxCpea20ftContainerInfo.max_pallets_per_container))
			: Math.ceil(estimate.primx_cpea_pallets_needed / parseInt(primxCpea40ftContainerInfo.max_pallets_per_container))
	);

	// ⬇ If they've selected exclude_cpea or exclude_fibers, we want to null those values out for the final calculations:
	if (estimate.materials_excluded == "exclude_cpea") {
		estimate.primx_cpea_containers_needed = 0;
	} else if (estimate.materials_excluded == "exclude_fibers") {
		estimate.primx_steel_fibers_containers_needed = 0;
	}; // End if/else

	const totalNumberOf20ftContainers = (
		0 +
		(primxDcTransportation20or40 == 20 ? estimate.primx_dc_containers_needed : 0) +
		(primxSteelFiberTransportation20or40 == 20 ? estimate.primx_steel_fibers_containers_needed : 0) +
		(primxFlowTransportation20or40 == 20 ? estimate.primx_flow_containers_needed : 0) +
		(primxCpeaTransportation20or40 == 20 ? estimate.primx_cpea_containers_needed : 0)
	); // End totalNumberOf20ftContainers

	const totalNumberOf40ftContainers = (
		0 +
		(primxDcTransportation20or40 == 40 ? estimate.primx_dc_containers_needed : 0) +
		(primxSteelFiberTransportation20or40 == 40 ? estimate.primx_steel_fibers_containers_needed : 0) +
		(primxFlowTransportation20or40 == 40 ? estimate.primx_flow_containers_needed : 0) +
		(primxCpeaTransportation20or40 == 40 ? estimate.primx_cpea_containers_needed : 0)
	); // End totalNumberOf40ftContainers

	estimate.total_number_of_20ft_containers = parseInt(totalNumberOf20ftContainers);
	estimate.total_number_of_40ft_containers = parseInt(totalNumberOf40ftContainers);
	estimate.total_number_of_pallets = parseInt(totalNumberOfPallets);
	//#endregion - Step 4.



	//#region Step 5 - Add the Custom Duties to each product: 
	// ⬇ PrimX DC:
	const primxDcProductPlusCustomDutyPercentage = parseFloat(primxDcProductInfo.product_self_cost) + (parseFloat(primxDcProductInfo.product_self_cost) * parseFloat(primxDcProductInfo.custom_duty_percentage));

	// ⬇ PrimX Steel Fibers:
	const primxSteelFiberProductPlusCustomDutyPercentage_75_50 = parseFloat(primxSteelFiberProductInfo.product_self_cost) + (parseFloat(primxSteelFiberProductInfo.product_self_cost) * parseFloat(primxSteelFiberProductInfo.custom_duty_percentage_75_50));
	const primxSteelFiberProductPlusCustomDutyPercentage_90_60 = parseFloat(primxSteelFiberProductInfo.product_self_cost) + (parseFloat(primxSteelFiberProductInfo.product_self_cost) * parseFloat(primxSteelFiberProductInfo.custom_duty_percentage_90_60));

	// ⬇ PrimX Flow:
	const primxFlowProductPlusCustomDutyPercentage = parseFloat(primxFlowProductInfo.product_self_cost) + (parseFloat(primxFlowProductInfo.product_self_cost) * parseFloat(primxFlowProductInfo.custom_duty_percentage));

	// ⬇ PrimX Cpea:
	const primxCpeaProductPlusCustomDutyPercentage = parseFloat(primxCpeaProductInfo.product_self_cost) + (parseFloat(primxCpeaProductInfo.product_self_cost) * parseFloat(primxCpeaProductInfo.custom_duty_percentage));
	//#endregion - Step 5. 


	//#region Step 6 - Calculate the transportation cost + material cost per material unit, for each product in the cheapest container:
	let primxDcTransportationCostPlusMaterialCostPerUnit = cheapestPrimXDcTransportationCostPerUnit + primxDcProductPlusCustomDutyPercentage;

	// ⬇ PrimX Steel Fibers:
	let primxSteelFiberTransportationCostPlusMaterialCostPerUnit_75_50 = cheapestPrimxSteelFiberTransportationCostPerUnit + primxSteelFiberProductPlusCustomDutyPercentage_75_50;
	let primxSteelFiberTransportationCostPlusMaterialCostPerUnit_90_60 = cheapestPrimxSteelFiberTransportationCostPerUnit + primxSteelFiberProductPlusCustomDutyPercentage_90_60;

	// ⬇ PrimX Flow:
	let primxFlowTransportationCostPlusMaterialCostPerUnit = cheapestPrimxFlowTransportationCostPerUnit + primxFlowProductPlusCustomDutyPercentage;

	// ⬇ PrimX Cpea:
	let primxCpeaTransportationCostPlusMaterialCostPerUnit = cheapestPrimxCpeaTransportationCostPerUnit + primxCpeaProductPlusCustomDutyPercentage;

	// ⬇ If they've selected exclude_cpea or exclude_fibers, we want to null those values out for the final calculations:
	if (estimate.materials_excluded == "exclude_cpea") {
		primxCpeaTransportationCostPlusMaterialCostPerUnit = 0;
	} else if (estimate.materials_excluded == "exclude_fibers") {
		primxSteelFiberTransportationCostPlusMaterialCostPerUnit_75_50 = 0;
		primxSteelFiberTransportationCostPlusMaterialCostPerUnit_90_60 = 0;
	}; // End if/else
	//#endregion - Step 6.



	//#region Step 7 - Calculate the self cost per unit for each product:
	const dollarSelfCostPerUnit_75_50 = (
		(primxDcTransportationCostPlusMaterialCostPerUnit * parseFloat(primxDcDosageRateInfo.dosage_rate)) +
		(primxSteelFiberTransportationCostPlusMaterialCostPerUnit_75_50 * parseFloat(primxSteelFiberDosageRateInfo_75_50.dosage_rate)) +
		(primxFlowTransportationCostPlusMaterialCostPerUnit * parseFloat(primxFlowDosageRateInfo.dosage_rate)) +
		(primxCpeaTransportationCostPlusMaterialCostPerUnit * parseFloat(primxCpeaDosageRateInfo.dosage_rate))
	);

	const dollarSelfCostPerUnit_90_60 = (
		(primxDcTransportationCostPlusMaterialCostPerUnit * parseFloat(primxDcDosageRateInfo.dosage_rate)) +
		(primxSteelFiberTransportationCostPlusMaterialCostPerUnit_90_60 * parseFloat(primxSteelFiberDosageRateInfo_90_60.dosage_rate)) +
		(primxFlowTransportationCostPlusMaterialCostPerUnit * parseFloat(primxFlowDosageRateInfo.dosage_rate)) +
		(primxCpeaTransportationCostPlusMaterialCostPerUnit * parseFloat(primxCpeaDosageRateInfo.dosage_rate))
	);
	//#endregion - Step 7.



	//#region Step 8 - Calculate the sales price per unit:
	const regionalMarkup = currentMarkup.find(markup => markup.destination_country == estimate.destination_country);

	// ⬇ Attach the markup percentage used to the estimate to display in historical tables: 
	estimate.markup_percentage = regionalMarkup.margin_applied;

	// ⬇ Calculate the sales price per unit:
	const dollarSalesCostPerUnit_75_50 = dollarSelfCostPerUnit_75_50 / (1.00 - parseFloat(regionalMarkup.margin_applied));
	const dollarSalesCostPerUnit_90_60 = dollarSelfCostPerUnit_90_60 / (1.00 - parseFloat(regionalMarkup.margin_applied));
	// ! Ryan Here, save this number: 379540 square feet by 10 inches thickness to get the numbers shown in their estimate example
	//#endregion - Step 8. 


	//#region Step 9 - Calculate total project cost:
	// ⬇ If this is a new estimate, we want to calculate the total project cost.  If it's a saved estimate, we want to use the previously calculated total project cost to respect the price guarantee:
	if (!estimate.estimate_number || options.difference_in_months >= 6 || estimate.force_recalculate) {
		// ⬇ Calculate the total project cost:
		estimate.price_per_unit_75_50 = dollarSalesCostPerUnit_75_50;
		estimate.price_per_unit_90_60 = dollarSalesCostPerUnit_90_60;
	};


	if (estimate.measurement_units == "imperial") {
		estimate.total_project_cost_75_50 = dollarSalesCostPerUnit_75_50 * parseFloat(estimate.total_project_volume);
		estimate.total_project_cost_90_60 = dollarSalesCostPerUnit_90_60 * parseFloat(estimate.total_project_volume);
	} else if (estimate.measurement_units == "metric") {
		estimate.total_project_cost_75_50 = dollarSalesCostPerUnit_75_50 * parseFloat(estimate.total_project_volume);
		estimate.total_project_cost_90_60 = dollarSalesCostPerUnit_90_60 * parseFloat(estimate.total_project_volume);
	}; // End if/else

	estimate.total_project_volume = parseFloat(estimate.total_project_volume);
	//#endregion - Step 9.


	return estimate;
} // End of useCalculateSingleEstimate
