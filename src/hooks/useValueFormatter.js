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
		property.includes('_cost_per_sq') ||
		(property.includes('price_per_unit') && property.includes('_display')) ||
		(property.includes('total_project_cost') && property.includes('_display'))
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
