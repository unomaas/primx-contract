/** ⬇ useCalculateCostPerMeasurement:
 * Will calculate the total cost by square measurement and return a pretty USD amount. 
 */
export default function useCalculateCostPerMeasurement(cost, quantity) {
	if (cost && quantity) {
		// ⬇ Removes the commas and strings from our dollar amount string: 
		let costWithoutDollars = cost.replace("$", "");
		let costWithoutCommas = costWithoutDollars.replace(",", "");
		// ⬇ Divides appropriately: 
		let costPerMeasurement = costWithoutCommas / quantity;
		// ⬇ Reformats as a USD string: 
		let dollarUS = Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}); // End dollarUS
		let prettyCostPerMeasurement = dollarUS.format(costPerMeasurement);
		return prettyCostPerMeasurement;
	} // End if cost && quantity
} // End useCalculateCostPerMeasurement
