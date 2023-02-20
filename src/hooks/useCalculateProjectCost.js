import useValueFormatter from "./useValueFormatter";
import useArrayToObjectConverter from "./useArrayToObjectConverter.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { parse } from "pg-protocol";
import { Alert } from "@material-ui/lab";
import useDifferenceBetweenDates from "./useDifferenceBetweenDates";

export default function useCalculateProjectCost(estimate, options) {

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


	//#region Step 1 - Determining the data we're using: 
	// ⬇ Empty variables to set later: 
	let primxDcProductInfo, primxSteelFiberProductInfo, primxFlowProductInfo, primxUltraCureProductInfo, primxCpeaProductInfo, primxDcDosageRateInfo, primxSteelFiberDosageRateInfo_75_50, primxSteelFiberDosageRateInfo_90_60, primxFlowDosageRateInfo, primxCpeaDosageRateInfo = null;

	// ⬇ Determine whether we're using imperial or metric units for the products: 
	if (estimate.measurement_units == 'imperial') {
		// ⬇ Find the product info for imperial, then set the dosage rate to the imperial dosage rate:
		primxDcProductInfo = products.find(product => product.product_id === 1);
		primxDcDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 1);
		primxDcDosageRateInfo.dosage_rate = primxDcDosageRateInfo.lbs_y3;
		primxDcProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 1).USA_percent;

		primxSteelFiberProductInfo = products.find(product => product.product_id === 4);
		primxSteelFiberDosageRateInfo_75_50 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 3);
		primxSteelFiberDosageRateInfo_90_60 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 4);
		primxSteelFiberDosageRateInfo_75_50.dosage_rate = primxSteelFiberDosageRateInfo_75_50.lbs_y3;
		primxSteelFiberDosageRateInfo_90_60.dosage_rate = primxSteelFiberDosageRateInfo_90_60.lbs_y3;
		primxSteelFiberProductInfo.custom_duty_percentage_75_50 = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 3).USA_percent;
		primxSteelFiberProductInfo.custom_duty_percentage_90_60 = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 4).USA_percent;

		primxFlowProductInfo = products.find(product => product.product_id === 3);
		primxFlowDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 3);
		primxFlowDosageRateInfo.dosage_rate = primxFlowDosageRateInfo.lbs_y3;
		primxFlowProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 2).USA_percent;

		primxCpeaProductInfo = products.find(product => product.product_id === 8);
		primxCpeaDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 8);
		primxCpeaDosageRateInfo.dosage_rate = primxCpeaDosageRateInfo.lbs_y3;
		primxCpeaProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 6).USA_percent;

		primxUltraCureProductInfo = products.find(product => product.product_id === 6);

	} else if (estimate.measurement_units == 'metric') {
		// ⬇ Find the product info for metric, then set the dosage rate to the metric dosage rate:
		primxDcProductInfo = products.find(product => product.product_id === 2);
		primxDcDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 2);
		primxDcDosageRateInfo.dosage_rate = primxDcDosageRateInfo.kg_m3;
		primxDcProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 1).CAN_percent;

		primxSteelFiberProductInfo = products.find(product => product.product_id === 5);
		primxSteelFiberDosageRateInfo_75_50 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 5);
		primxSteelFiberDosageRateInfo_90_60 = dosageRates.find(dosageRate => dosageRate.dosage_rate_id === 6);
		primxSteelFiberDosageRateInfo_75_50.dosage_rate = primxSteelFiberDosageRateInfo_75_50.kg_m3;
		primxSteelFiberDosageRateInfo_90_60.dosage_rate = primxSteelFiberDosageRateInfo_90_60.kg_m3;
		primxSteelFiberProductInfo.custom_duty_percentage_75_50 = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 3).CAN_percent;
		primxSteelFiberProductInfo.custom_duty_percentage_90_60 = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 4).CAN_percent;

		primxFlowProductInfo = products.find(product => product.product_id === 3);
		primxFlowDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 3);
		primxFlowDosageRateInfo.dosage_rate = primxFlowDosageRateInfo.kg_m3;
		primxFlowProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 2).CAN_percent;

		primxCpeaProductInfo = products.find(product => product.product_id === 8);
		primxCpeaDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 8);
		primxCpeaDosageRateInfo.dosage_rate = primxCpeaDosageRateInfo.kg_m3;
		primxCpeaProductInfo.custom_duty_percentage = customsDuties.find(customsDuty => customsDuty.custom_duty_id === 6).CAN_percent;

		primxUltraCureProductInfo = products.find(product => product.product_id === 7);
	}; // End if
	//#endregion - Step 1.



	//#region Step 2 - Set Cost and Container Info. Determine the cost and container pricing information based off of matching product_id, destination_id, and container_length_ft.  Do this for each product, for both container sizes:
	// ⬇ PrimX DC 20ft & 40ft:
	const primxDc20ftCostInfo = shippingCosts.find(cost => cost.product_id == primxDcProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 20);
	const primxDc20ftContainerInfo = productContainers.find(container => container.product_container_id == primxDc20ftCostInfo.product_container_id);
	const primxDc40ftCostInfo = shippingCosts.find(cost => cost.product_id == primxDcProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 40);
	const primxDc40ftContainerInfo = productContainers.find(container => container.product_container_id == primxDc40ftCostInfo.product_container_id);

	// ⬇ PrimX Steel Fibers 20ft & 40ft:
	const primxSteelFiber20ftCostInfo = shippingCosts.find(cost => cost.product_id == primxSteelFiberProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 20);
	const primxSteelFiber20ftContainerInfo = productContainers.find(container => container.product_container_id == primxSteelFiber20ftCostInfo.product_container_id);
	const primxSteelFiber40ftCostInfo = shippingCosts.find(cost => cost.product_id == primxSteelFiberProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 40);
	const primxSteelFiber40ftContainerInfo = productContainers.find(container => container.product_container_id == primxSteelFiber40ftCostInfo.product_container_id);

	// ⬇ PrimX Flow 20ft & 40ft:
	const primxFlow20ftCostInfo = shippingCosts.find(cost => cost.product_id == primxFlowProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 20);
	const primxFlow20ftContainerInfo = productContainers.find(container => container.product_container_id == primxFlow20ftCostInfo.product_container_id);
	const primxFlow40ftCostInfo = shippingCosts.find(cost => cost.product_id == primxFlowProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 40);
	const primxFlow40ftContainerInfo = productContainers.find(container => container.product_container_id == primxFlow40ftCostInfo.product_container_id);

	// ⬇ PrimX Cpea 20ft & 40ft:
	const primxCpea20ftCostInfo = shippingCosts.find(cost => cost.product_id == primxCpeaProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 20);
	const primxCpea20ftContainerInfo = productContainers.find(container => container.product_container_id == primxCpea20ftCostInfo.product_container_id);
	const primxCpea40ftCostInfo = shippingCosts.find(cost => cost.product_id == primxCpeaProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 40);
	const primxCpea40ftContainerInfo = productContainers.find(container => container.product_container_id == primxCpea40ftCostInfo.product_container_id);
	//#endregion - Step 2.



	//#region Step 3 - Calculate the cost per unit for each product, for both container sizes:
	// ⬇ PrimX DC 20ft & 40ft:
	const primxDc20ftTransportationCostPerLb = parseFloat(primxDc20ftCostInfo.shipping_cost) / (parseFloat(primxDc20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc20ftContainerInfo.max_pallets_per_container));
	const primxDc40ftTransportationCostPerLb = parseFloat(primxDc40ftCostInfo.shipping_cost) / (parseFloat(primxDc40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxDc40ftContainerInfo.max_pallets_per_container));

	// ⬇ PrimX Steel Fibers 20ft & 40ft:
	const primxSteelFiber20ftTransportationCostPerLb = parseFloat(primxSteelFiber20ftCostInfo.shipping_cost) / (parseFloat(primxSteelFiber20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber20ftContainerInfo.max_pallets_per_container));
	const primxSteelFiber40ftTransportationCostPerLb = parseFloat(primxSteelFiber40ftCostInfo.shipping_cost) / (parseFloat(primxSteelFiber40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxSteelFiber40ftContainerInfo.max_pallets_per_container));

	// ⬇ PrimX Flow 20ft & 40ft:
	const primxFlow20ftTransportationCostPerLb = parseFloat(primxFlow20ftCostInfo.shipping_cost) / (parseFloat(primxFlow20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxFlow20ftContainerInfo.max_pallets_per_container));
	const primxFlow40ftTransportationCostPerLb = parseFloat(primxFlow40ftCostInfo.shipping_cost) / (parseFloat(primxFlow40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxFlow40ftContainerInfo.max_pallets_per_container));

	// ⬇ PrimX Cpea 20ft & 40ft:
	const primxCpea20ftTransportationCostPerLb = parseFloat(primxCpea20ftCostInfo.shipping_cost) / (parseFloat(primxCpea20ftContainerInfo.net_weight_of_pallet) * parseFloat(primxCpea20ftContainerInfo.max_pallets_per_container));
	const primxCpea40ftTransportationCostPerLb = parseFloat(primxCpea40ftCostInfo.shipping_cost) / (parseFloat(primxCpea40ftContainerInfo.net_weight_of_pallet) * parseFloat(primxCpea40ftContainerInfo.max_pallets_per_container));
	//#endregion - Step 3.



	//#region Step 4 - Compare the Cost Per Lb of 20ft and 40ft containers, and choose the cheapest:
	// ⬇ PrimX DC:
	const cheapestPrimXDcTransportationCostPerLb = primxDc20ftTransportationCostPerLb < primxDc40ftTransportationCostPerLb ? primxDc20ftTransportationCostPerLb : primxDc40ftTransportationCostPerLb;

	// ⬇ PrimX Steel Fibers:
	const cheapestPrimxSteelFiberTransportationCostPerLb = primxSteelFiber20ftTransportationCostPerLb < primxSteelFiber40ftTransportationCostPerLb ? primxSteelFiber20ftTransportationCostPerLb : primxSteelFiber40ftTransportationCostPerLb;

	// ⬇ PrimX Flow:
	const cheapestPrimxFlowTransportationCostPerLb = primxFlow20ftTransportationCostPerLb < primxFlow40ftTransportationCostPerLb ? primxFlow20ftTransportationCostPerLb : primxFlow40ftTransportationCostPerLb;

	// ⬇ PrimX Cpea:
	const cheapestPrimxCpeaTransportationCostPerLb = primxCpea20ftTransportationCostPerLb < primxCpea40ftTransportationCostPerLb ? primxCpea20ftTransportationCostPerLb : primxCpea40ftTransportationCostPerLb;
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
	const primxDcTransportationCostPlusMaterialCostPerUnit = cheapestPrimXDcTransportationCostPerLb + primxDcProductPlusCustomDutyPercentage;

	// ⬇ PrimX Steel Fibers:
	let primxSteelFiberTransportationCostPlusMaterialCostPerUnit_75_50 = cheapestPrimxSteelFiberTransportationCostPerLb + primxSteelFiberProductPlusCustomDutyPercentage_75_50;
	let primxSteelFiberTransportationCostPlusMaterialCostPerUnit_90_60 = cheapestPrimxSteelFiberTransportationCostPerLb + primxSteelFiberProductPlusCustomDutyPercentage_90_60;

	// ⬇ PrimX Flow:
	const primxFlowTransportationCostPlusMaterialCostPerUnit = cheapestPrimxFlowTransportationCostPerLb + primxFlowProductPlusCustomDutyPercentage;

	// ⬇ PrimX Cpea:
	let primxCpeaTransportationCostPlusMaterialCostPerUnit = cheapestPrimxCpeaTransportationCostPerLb + primxCpeaProductPlusCustomDutyPercentage;

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
	// ⬇ Calculate the sales price per unit:
	const dollarSalesCostPerUnit_75_50 = dollarSelfCostPerUnit_75_50 / (1.00 - parseFloat(currentMarkup[0].margin_applied));
	const dollarSalesCostPerUnit_90_60 = dollarSelfCostPerUnit_90_60 / (1.00 - parseFloat(currentMarkup[0].margin_applied));
	// ! Ryan Here, save this number: 379540 square feet by 10 inches thickness to get the numbers shown in their estimate example
	//#endregion - Step 8. 



	//#region Step 9 - Calculate total project cost:
	// ⬇ If this is a new estimate, we want to calculate the total project cost.  If it's a saved estimate, we want to use the previously calculated total project cost to respect the price guaranteet:
	if (!estimate.estimate_number || options.difference_in_months >= 3 || estimate.force_recalculate) {
		// ⬇ Calculate the total project cost:
		estimate.price_per_unit_75_50 = dollarSalesCostPerUnit_75_50;
		estimate.price_per_unit_90_60 = dollarSalesCostPerUnit_90_60;
	};


	if (estimate.measurement_units == "imperial") {

		estimate.total_project_cost_75_50 = dollarSalesCostPerUnit_75_50 * parseFloat(estimate.design_cubic_yards_total);
		estimate.total_project_cost_90_60 = dollarSalesCostPerUnit_90_60 * parseFloat(estimate.design_cubic_yards_total);

	} else if (estimate.measurement_units == "metric") {
		estimate.total_project_cost_75_50 = dollarSalesCostPerUnit_75_50 * parseFloat(estimate.design_cubic_meters_total);
		estimate.total_project_cost_90_60 = dollarSalesCostPerUnit_90_60 * parseFloat(estimate.design_cubic_meters_total);
	}; // End if/else
	//#endregion - Step 9.



	return estimate;
} // End of useCalculateSingleEstimate
