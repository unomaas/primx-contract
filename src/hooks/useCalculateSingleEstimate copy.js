import useValueFormatter from "./useValueFormatter";
import useArrayToObjectConverter from "./useArrayToObjectConverter.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { parse } from "pg-protocol";

export default function useCalculateSingleEstimate(options) {


	// const {
	// 	estimate,
	// 	products,
	// 	shippingDestinations,
	// 	currentMarkup,
	// 	shippingCosts,
	// 	productContainers,
	// 	dosageRates,
	// 	customsDuties,
	// } = options;

	//#region - Dummy data to test with: 
	const products = useSelector(store => store.products.productsArray);
	const shippingDestinations = useSelector(store => store.shippingDestinations.shippingActiveDestinations);
	const currentMarkup = useSelector(store => store.products.currentMarkupMargin);
	const shippingCosts = useSelector(store => store.shippingCosts.shippingCostsArray);
	const productContainers = useSelector(store => store.productContainers.productContainersArray);
	const dosageRates = useSelector(store => store.dosageRates.dosageRatesArray);
	const customsDuties = useSelector(store => store.customsDuties.customsDutiesArray);

	if (
		products.length === 0 ||
		shippingDestinations.length === 0 ||
		currentMarkup.length === 0 ||
		shippingCosts.length === 0 ||
		productContainers.length === 0 ||
		dosageRates.length === 0 ||
		customsDuties.length === 0
	) return;


	// const productsObject = useArrayToObjectConverter(products, 'product_id');
	// const shippingDestinationsObject = useArrayToObjectConverter(shippingDestinations, 'destination_id');
	// const currentMarkupObject = useArrayToObjectConverter(currentMarkup, 'markup_id');
	// const shippingCostsObject = useArrayToObjectConverter(shippingCosts, 'shipping_cost_id');
	// const productContainersObject = useArrayToObjectConverter(productContainers, 'product_container_id');
	// const dosageRatesObject = useArrayToObjectConverter(dosageRates, 'dosage_rate_id');
	// const customsDutiesObject = useArrayToObjectConverter(customsDuties, 'custom_duty_id');
	//#endregion - Dummy data to test with.

	const estimate = {
		"estimate_id": 1,
		"project_name": "Test Project",
		"destination_id": 4,
		"destination_name": "California",
		"destination_country": "USA",
		"measurement_units": "imperial",
		// !This won't work because I hard-coded california into the estimate data.  If I want to test with a metric one, I have to remake a new fake estimate data thing.
		// "measurement_units": "metric",
	}

	// ⬇ Step #1: Calculate transportation costs per each material uit for both container sizes, acoording to user destination input (example for Material A - PrimX DC, but the approach for all materials,  based on net pallet weight):

	// const selectedDestination = shippingDestinations.find(destination => destination.destination_id === estimate.destination_id);
	// // ⬇ Reduce the shippingCosts array to only the selected destination:
	// const selectedShippingCosts = shippingCosts.filter(cost => cost.destination_id === estimate.destination_id);

	//#region Step 1 - Determining the data we're using: 
	// ⬇ Empty variables to set later: 
	let primxDcProductInfo, primxSteelFiberProductInfo, primxFlowProductInfo, primxUltraCureProductInfo, primxCpeaProductInfo, primxDcDosageRateInfo, primxSteelFiberDosageRateInfo, primxFlowDosageRateInfo, primxCpeaDosageRateInfo = null;

	// ⬇ Determine whether we're using imperial or metric units for the products: 
	if (estimate.measurement_units == 'imperial') {
		// ⬇ Find the product info for imperial, then set the dosage rate to the imperial dosage rate:
		primxDcProductInfo = products.find(product => product.product_id === 1);
		primxDcDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 1);
		primxDcDosageRateInfo.dosage_rate = primxDcDosageRateInfo.lbs_y3;

		primxSteelFiberProductInfo = products.find(product => product.product_id === 4);
		primxSteelFiberDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 4);
		primxSteelFiberDosageRateInfo.dosage_rate = primxSteelFiberDosageRateInfo.lbs_y3;

		primxFlowProductInfo = products.find(product => product.product_id === 3);
		primxFlowDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 3);
		primxFlowDosageRateInfo.dosage_rate = primxFlowDosageRateInfo.lbs_y3;

		primxCpeaProductInfo = products.find(product => product.product_id === 8);
		primxCpeaDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 8);
		primxCpeaDosageRateInfo.dosage_rate = primxCpeaDosageRateInfo.lbs_y3;

		primxUltraCureProductInfo = products.find(product => product.product_id === 6);

	} else if (estimate.measurement_units == 'metric') {
		// ⬇ Find the product info for metric, then set the dosage rate to the metric dosage rate:
		primxDcProductInfo = products.find(product => product.product_id === 2);
		primxDcDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 2);
		primxDcDosageRateInfo.dosage_rate = primxDcDosageRateInfo.kg_m3;

		primxSteelFiberProductInfo = products.find(product => product.product_id === 5);
		primxSteelFiberDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 5);
		primxSteelFiberDosageRateInfo.dosage_rate = primxSteelFiberDosageRateInfo.kg_m3;

		primxFlowProductInfo = products.find(product => product.product_id === 3);
		primxFlowDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 3);
		primxFlowDosageRateInfo.dosage_rate = primxFlowDosageRateInfo.kg_m3;

		primxCpeaProductInfo = products.find(product => product.product_id === 8);
		primxCpeaDosageRateInfo = dosageRates.find(dosageRate => dosageRate.product_id === 8);
		primxCpeaDosageRateInfo.dosage_rate = primxCpeaDosageRateInfo.kg_m3;

		primxUltraCureProductInfo = products.find(product => product.product_id === 7);
	}; // End if

	// ⬇ Flow and CPEA are liters, so no need to check for units:
	//#endregion - Determining the data we're using.


	// const selectedDestination = shippingDestinationsObject[estimate.destination_id];

	// ⬇ Reduce the shippingCosts array to only the selected destination //! Not sure this is needed, it's just for me to look at easier. 
	const selectedShippingCosts = shippingCosts.filter(cost => cost.destination_id === estimate.destination_id);
	const selectedShippingCostsObject = useArrayToObjectConverter(selectedShippingCosts, 'shipping_cost_id');
	// const selectedProductContainer = productContainersObject[estimate.product_container_id];

	// ⬇ Determine whether we're using imperial or metric units for the products:
	// let primxDcProductInfo, primxSteelFiberProductInfo, primxFlowProductInfo, primxUltraCureProductInfo, primxCpeaProductInfo = null;
	// if (estimate.measurement_units == 'imperial') {
	// 	primxDcProductInfo = productsObject[1];
	// 	primxSteelFiberProductInfo = productsObject[4];
	// 	primxUltraCureProductInfo = productsObject[6];
	// } else if (estimate.measurement_units == 'metric') {
	// 	primxDcProductInfo = productsObject[2];
	// 	primxSteelFiberProductInfo = productsObject[5];
	// 	primxUltraCureProductInfo = productsObject[7];
	// };
	// primxFlowProductInfo = productsObject[3];
	// primxCpeaProductInfo = productsObject[8];



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
	//#endregion - Set Cost and Container Info.


	// const x1 = f / ( p * m )
	// So above, x1 is the primxDc20ftTransportationCostPerLb.  f is the shipping cost for California by size, divided by p which is the net weight of the pallet, and m which is the max pallets per container.


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
	//#endregion - Calculate the cost per unit for each product.



	//#region Step 4 - Compare the Cost Per Lb of 20ft and 40ft containers, and choose the cheapest:
	// ⬇ PrimX DC:
	const cheapestPrimXDcTransportationCostPerLb = primxDc20ftTransportationCostPerLb < primxDc40ftTransportationCostPerLb ? primxDc20ftTransportationCostPerLb : primxDc40ftTransportationCostPerLb;
	

	// ⬇ PrimX Steel Fibers:
	const cheapestPrimxSteelFiberTransportationCostPerLb = primxSteelFiber20ftTransportationCostPerLb < primxSteelFiber40ftTransportationCostPerLb ? primxSteelFiber20ftTransportationCostPerLb : primxSteelFiber40ftTransportationCostPerLb;

	// ⬇ PrimX Flow:
	const cheapestPrimxFlowTransportationCostPerLb = primxFlow20ftTransportationCostPerLb < primxFlow40ftTransportationCostPerLb ? primxFlow20ftTransportationCostPerLb : primxFlow40ftTransportationCostPerLb;

	// ⬇ PrimX Cpea:
	const cheapestPrimxCpeaTransportationCostPerLb = primxCpea20ftTransportationCostPerLb < primxCpea40ftTransportationCostPerLb ? primxCpea20ftTransportationCostPerLb : primxCpea40ftTransportationCostPerLb;
	//#endregion - Compare the Cost Per Lb of 20ft and 40ft containers, and choose the cheapest.



	//#region Step 5 - Calculate the transportation cost + material cost per material unit, for each product in the cheapest container:
	// ⬇ PrimX DC:
	// x1 + a = y1
	// x1 is... cheapestPrimXDcTransportationCostPerLb
	// a is... primxDcProductInfo.material_cost_per_unit
	// y1 is... a new variable, primxDcTransportationCostPlusMaterialCostPerUnit
	const primxDcTransportationCostPlusMaterialCostPerUnit = cheapestPrimXDcTransportationCostPerLb + parseFloat(primxDcProductInfo.product_self_cost);
	
	// ⬇ PrimX Steel Fibers:
	const primxSteelFiberTransportationCostPlusMaterialCostPerUnit = cheapestPrimxSteelFiberTransportationCostPerLb + parseFloat(primxSteelFiberProductInfo.product_self_cost);


	// ⬇ PrimX Flow:
	const primxFlowTransportationCostPlusMaterialCostPerUnit = cheapestPrimxFlowTransportationCostPerLb + parseFloat(primxFlowProductInfo.product_self_cost);

	// ⬇ PrimX Cpea:
	const primxCpeaTransportationCostPlusMaterialCostPerUnit = cheapestPrimxCpeaTransportationCostPerLb + parseFloat(primxCpeaProductInfo.product_self_cost);
	//#endregion - Calculate the transportation cost + material cost per material unit.



	//#region Step 6 - Calculate the self cost per unit for each product:
	// ⬇ PrimX DC:
	// w = y1 * q + y2 * r + y3 * s + y4 * t
	// y1 is ... primxDcTransportationCostPlusMaterialCostPerUnit
	// q is ... primxDcDosageRateInfo
	// y2 is ... primxSteelFiberTransportationCostPlusMaterialCostPerUnit
	// r is ... primx_steel_fiber_dosage_rate
	// y3 is ... primxFlowTransportationCostPlusMaterialCostPerUnit
	// s is ... primx_flow_dosage_rate
	// y4 is ... primxCpeaTransportationCostPlusMaterialCostPerUnit
	// t is ... primx_cpea_dosage_rate
	const dollarSelfCostPerUnit = (
		(primxDcTransportationCostPlusMaterialCostPerUnit * parseFloat(primxDcDosageRateInfo.dosage_rate)) +
		(primxSteelFiberTransportationCostPlusMaterialCostPerUnit * parseFloat(primxSteelFiberDosageRateInfo.dosage_rate)) +
		(primxFlowTransportationCostPlusMaterialCostPerUnit * parseFloat(primxFlowDosageRateInfo.dosage_rate)) +
		(primxCpeaTransportationCostPlusMaterialCostPerUnit * parseFloat(primxCpeaDosageRateInfo.dosage_rate))
	);

	//#endregion - Calculate the self cost per unit for each product.

	// ⬇ Calculate Sales Price (z) based on mark-up:
	// z = w * (1 + u)
	// z = w / (100% - u)




	// ⬇ Calculate the sales price per unit:
	const salesPricePerUnit = dollarSelfCostPerUnit / (1 - parseFloat(currentMarkup[0].margin_applied));


	// const formulaIndex = {
	// 	// ⬇ Material Self Cost:
	// 	primx_dc: a,
	// 	primx_flow: b,
	// 	primx_cpea: c,
	// 	primx_steel_fibers: d,
	// 	primx_ultracure_blankets: "",

	// 	// ⬇ Shipping Cost Per Container by Destination:
	// 	california_20ft: e,
	// 	california_40ft: f, // ! 

	// 	alberta_20ft: g,
	// 	alberta_40ft: h,

	// 	// ⬇ Information regarding Container Types:
	// 	primx_dc_20ft_max_pallets_per_container: i,
	// 	primx_dc_20ft_max_weight_of_container: j,
	// 	primx_dc_20ft_gross_weight_of_pallet: k,
	// 	primx_dc_20ft_net_weight_of_pallet: l,

	// 	primx_dc_40ft_max_pallets_per_container: m, // ! 
	// 	primx_dc_40ft_max_weight_of_container: n,
	// 	primx_dc_40ft_gross_weight_of_pallet: o,
	// 	primx_dc_40ft_net_weight_of_pallet: p, //!

	// 	// ⬇ Dosage Rates of PrimX Products:
	// 	primx_dc_dosage_rate: q,
	// 	primx_steel_fibers_dosage_rate: r,
	// 	primx_flow_dosage_rate: s,
	// 	primx_cpea_dosage_rate: t,

	// 	// ⬇ Margin Markup:
	// 	margin_applied: u,


	// }
	// let e = formulaIndex;



	// // TODO: Will have to figure out the states for the shipping destinations from the estimate ID. For now, I'm just going to hardcode it to California.

	// let x1 = (e.california_40ft / (e.primx_dc_40ft_net_weight_of_pallet * e.primx_dc_40ft_max_pallets_per_container));
	// let x2 = (e.california_20ft / (e.primx_dc_20ft_net_weight_of_pallet * e.primx_dc_20ft_max_pallets_per_container));
	// let x3 = Math.min(x1, x2);

	// // TODO: Do this for the rest of the products:
	// let y1 = (e.california_40ft / (e.primx_steel_fibers_40ft_net_weight_of_pallet * e.primx_steel_fibers_40ft_max_pallets_per_container));
	// let y2 = (e.california_20ft / (e.primx_steel_fibers_20ft_net_weight_of_pallet * e.primx_steel_fibers_20ft_max_pallets_per_container));
	// let x4 = Math.min(y1, y2);

	// let z1 = (e.california_40ft / (e.primx_flow_40ft_net_weight_of_pallet * e.primx_flow_40ft_max_pallets_per_container));
	// let z2 = (e.california_20ft / (e.primx_flow_20ft_net_weight_of_pallet * e.primx_flow_20ft_max_pallets_per_container));
	// let x5 = Math.min(z1, z2);

	// let w1 = (e.california_40ft / (e.primx_cpea_40ft_net_weight_of_pallet * e.primx_cpea_40ft_max_pallets_per_container));
	// let w2 = (e.california_20ft / (e.primx_cpea_20ft_net_weight_of_pallet * e.primx_cpea_20ft_max_pallets_per_container));
	// let x7 = Math.min(w1, w2);

	// // ⬇ Calculate transportation cost + material cost per material unit:

	// // x3 = 

	// // TODO: When I com eback, I'll have to setup a use effect to import this stuff to play with. 



}
