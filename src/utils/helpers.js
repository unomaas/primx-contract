export function isEmpty(value) {
	if (value == null) return true;  // checks for both null and undefined
	if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
	if (typeof value === 'object') return Object.keys(value).length === 0;
	return false;
}

/**
 * Checks if the estimate is allowed to be placed for Purchase Order.  Currently USA and CAN estimates are disallowed.
 * @param {Object} estimate - The estimate to check.
 * @returns {boolean} - Returns true if the estimate is allowed to be placed for Purchase Order; false otherwise.
 */
export function allowedToPlaceForPO(estimate) {
	if (estimate.destination_country != 'USA' && estimate.destination_country != 'CAN') return true;
	return false;
}; // End allowedToPlaceForPO()