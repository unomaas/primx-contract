export default function useValueFormatter(property, estimate) {

	// ⬇ Saving for easier ref: 
	let value = estimate[property];

	// Create our number formatter to format our money quantities back into standard looking currency values.
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',

		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});


	if (
		// ⬇ Properties we want rounded up, below. Cubic volumes and total amounts of physical materials are always rounded up if they're decimals after being calculated:
		property.includes('cubic_yards') ||
		property.includes('cubic_meters') ||
		property.includes('project_amount') ||
		property.includes('order_amount')
	) {
		estimate[property] = Math.ceil(value).toLocaleString('en-US');
	} else if (
		// ⬇ Properties we want two decimal places on, below: 
		property.includes('additional_thickness')
	) {
		estimate[property] = Number(value).toFixed(2);
	} else if (
		// ⬇ Properties we want formatted as money, below: 
		property.includes('_price') ||
		property.includes('_estimate') ||
		property.includes('_cost_per_sq')
	) {
		estimate[property] = formatter.format(value);
	} else if (
		// ⬇ Properties we want formatted with commas, below: 
		property.includes('packages_needed') ||
		property.includes('_containers') ||
		property.includes('thickness_') ||
		// property.includes('on_hand_') ||
		property.includes('dosage_') ||
		property.includes('_display')
	) {
		// ⬇ Some values will be null, so we need the optional chain for string formatting: 
		estimate[property] = value?.toLocaleString('en-US');
	} // End if/else

}

// TODO WHEN I COME BACK: Update the Lookup tables to handle these new values (aka take out all of the toLocaleStrings and resolve the NaN's.)  Then test the edits with these new inputs.  Then setup the Combine Estimates to null anything when POST'ing. 

// TODO: When I come back, we need to make sure the PUT route works with editing the new values.  Then we need to update the Lookup Estimate to handle the new values.  Then we need to update the Combine Estimate to be the same as Lookup, and make sure that we wipe anything on hand when combining.  Then I think we're done? Oh and update all the tables to be right aligned.  Also make sure the Admin and Licensee Data Grid Tables have these new columns to display.  

// TODO: Test metric combine and make sure the tallies are working.  Then figure out how to setup Materials on Hand with a combined estimate.  Then figure out why the Edit estimate isn't working for singles.  