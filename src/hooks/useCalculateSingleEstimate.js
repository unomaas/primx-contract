import useValueFormatter from "./useValueFormatter";
import useArrayToObjectConverter from "./useArrayToObjectConverter.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";

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
		) {
		return;
	}


	const productsObject = useArrayToObjectConverter(products, 'product_id');
	const shippingDestinationsObject = useArrayToObjectConverter(shippingDestinations, 'destination_id');
	const currentMarkupObject = useArrayToObjectConverter(currentMarkup, 'markup_id');
	const shippingCostsObject = useArrayToObjectConverter(shippingCosts, 'shipping_cost_id');
	const productContainersObject = useArrayToObjectConverter(productContainers, 'product_container_id');
	const dosageRatesObject = useArrayToObjectConverter(dosageRates, 'dosage_rate_id');
	const customsDutiesObject = useArrayToObjectConverter(customsDuties, 'custom_duty_id');
	//#endregion - Dummy data to test with.

	const estimate = {
		"estimate_id": 1,
		"project_name": "Test Project",
		"destination_id": 4,
		"destination_name": "California",
		"destination_country": "USA",
		"measurement_units": "imperial",
	}

	// ⬇ Step #1: Calculate transportation costs per each material uit for both container sizes, acoording to user destination input (example for Material A - PrimX DC, but the approach for all materials,  based on net pallet weight):

	// ! Ryan Here, array setup is getting clunky.  Switching to objects. 
	// const selectedDestination = shippingDestinations.find(destination => destination.destination_id === estimate.destination_id);
	// // ⬇ Reduce the shippingCosts array to only the selected destination:
	// const selectedShippingCosts = shippingCosts.filter(cost => cost.destination_id === estimate.destination_id);

	let primxDcProductInfo, primxSteelFiberProductInfo, primxFlowProductInfo, primxUltraCureProductInfo, primxCpeaProductInfo = null;

	// ⬇ Determine whether we're using imperial or metric units for the products: 
	if (estimate.measurement_units == 'imperial') {
		primxDcProductInfo = products.find(product => product.product_id === 1);
		primxSteelFiberProductInfo = products.find(product => product.product_id === 4);
		primxUltraCureProductInfo = products.find(product => product.product_id === 6);
	} else if (estimate.measurement_units == 'metric') {
		primxDcProductInfo = products.find(product => product.product_id === 2);
		primxSteelFiberProductInfo = products.find(product => product.product_id === 5);
		primxUltraCureProductInfo = products.find(product => product.product_id === 7);
	};
	primxFlowProductInfo = products.find(product => product.product_id === 3);
	primxCpeaProductInfo = products.find(product => product.product_id === 8);

	const selectedDestination = shippingDestinationsObject[estimate.destination_id];


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

	let primxDc20ftCostInfo = shippingCosts.find(cost => cost.product_id == primxDcProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 20);
	let primxDc20ftContainerInfo = productContainers.find(container => container.product_container_id == primxDc20ftCostInfo.product_container_id);

	let primxDc40ftCostInfo = shippingCosts.find(cost => cost.product_id == primxDcProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 40);
	let primxDc40ftContainerInfo = productContainers.find(container => container.product_container_id == primxDc40ftCostInfo.product_container_id);

	let primxSteelFiber20ftCostInfo = shippingCosts.find(cost => cost.product_id == primxSteelFiberProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 20);
	let primxSteelFiber20ftContainerInfo = productContainers.find(container => container.product_container_id == primxSteelFiber20ftCostInfo.product_container_id);

	let primxSteelFiber40ftCostInfo = shippingCosts.find(cost => cost.product_id == primxSteelFiberProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 40);
	let primxSteelFiber40ftContainerInfo = productContainers.find(container => container.product_container_id == primxSteelFiber40ftCostInfo.product_container_id);

	let primxFlow20ftCostInfo = shippingCosts.find(cost => cost.product_id == primxFlowProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 20);
	let primxFlow20ftContainerInfo = productContainers.find(container => container.product_container_id == primxFlow20ftCostInfo.product_container_id);

	let primxFlow40ftCostInfo = shippingCosts.find(cost => cost.product_id == primxFlowProductInfo.product_id && cost.destination_id == estimate.destination_id && cost.container_length_ft == 40);
	let primxFlow40ftContainerInfo = productContainers.find(container => container.product_container_id == primxFlow40ftCostInfo.product_container_id);

	// let x1 = f / ( p * m )
	console.log(`Ryan Here: `, 
	'\n primxDcProductInfo.product_cost', primxDc20ftCostInfo.shipping_cost, 
	'\n primxDcProductInfo.product_cost parse float', parseFloat(primxDc20ftCostInfo.shipping_cost),
	'\n primxDc20ftContainerInfo.net_weight_of_pallet', primxDc20ftContainerInfo.net_weight_of_pallet,
	'\n primxDc20ftContainerInfo.max_pallets_per_container', primxDc20ftContainerInfo.max_pallets_per_container,
	);
	let primxDc20ftCostPerLb = parseFloat(primxDc20ftCostInfo.shipping_cost) / (primxDc20ftContainerInfo.net_weight_of_pallet * primxDc20ftContainerInfo.max_pallets_per_container)
	// TODO: When you come back, keep this going:

		
	// let primx_dc_20ft_container_costs = primx Dc cost for 40 ft container / (primx_dc_40ft_net_weight_of_pallet * primx_dc_40ft_max_pallets_per_container)



	// let primx_dc_20ft_container_costs = primx Dc cost for 40 ft container / (primx dc cost per unit * lbs)
	// let primx_dc_40ft_container_costs = (selectedShippingCosts.find())

	// let x1 = selectedShippingCosts.

	// let primx_dc_40ft_transportation_cost = 




	console.log(`Ryan Here: End of useCalculateSingleEstimate \n \n `,

		'Static Data: ',
		{
			estimate,

			Arrays: {
				shippingDestinations,
				shippingCosts,
				products,
				productContainers,
				dosageRates,
				customsDuties,
			},
			Objects: {
				productsObject,
				shippingDestinationsObject,
				currentMarkupObject,
				shippingCostsObject,
				productContainersObject,
				dosageRatesObject,
				customsDutiesObject,
			},
		},

		'\n \n Calculated Data: ',
		{
			selectedDestination,
			selectedShippingCosts,
			selectedShippingCostsObject,

			"*** selectedCostInfo": {
				primxDc20ftCostInfo,
				primxDc20ftContainerInfo,

				primxDc40ftCostInfo,
				primxDc40ftContainerInfo,

				primxSteelFiber20ftCostInfo,
				primxSteelFiber20ftContainerInfo,

				primxSteelFiber40ftCostInfo,
				primxSteelFiber40ftContainerInfo,

				primxFlow20ftCostInfo,
				primxFlow20ftContainerInfo,

				primxFlow40ftCostInfo,
				primxFlow40ftContainerInfo,
			},

			'*** Calculated Price Info: ': {
				primxDc20ftCostPerLb,
			},
		},
		'\n \n'
	);


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

	// 	primx_dc_40ft_max_pallets_per_container: m,
	// 	primx_dc_40ft_max_weight_of_container: n,
	// 	primx_dc_40ft_gross_weight_of_pallet: o,
	// 	primx_dc_40ft_net_weight_of_pallet: p,

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
