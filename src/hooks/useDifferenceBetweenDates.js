// ⬇ Write a JS Doc comment to describe the below function:
/**
 * @function useDifferenceBetweenDates
 * @param {Date} pastDate
 * @param {Date} recentDate Optional, defaults to new Date().
 * @returns {Object} Object containing the difference in months between the two dates.
 * @description This function takes two dates and returns the difference between them in an object containing a variety of units.
 * @example useDifferenceBetweenDates('2021-01-01', '2021-02-01')
 * return {
 * "total_months": Math.round(months_passed),
 * "total_days": Math.round(total_days),
 * "total_weeks": Math.round(total_weeks),
 * "total_hours": Math.round(total_hours),
 * "total_minutes": Math.round(total_mins),
 * "total_seconds": Math.round(total_secs),
 * "result": result.trim()
 * }
 */
export default function useDifferenceBetweenDates(pastDate, recentDate = new Date()) {

	//new date instance
	let dt_date1 = new Date(pastDate);
	let dt_date2 = new Date(recentDate);

	//Get the Timestamp
	const date1_time_stamp = dt_date1.getTime();
	const date2_time_stamp = dt_date2.getTime();

	let calc;

	//Check which timestamp is greater
	if (date1_time_stamp > date2_time_stamp) {
		calc = new Date(date1_time_stamp - date2_time_stamp);
	} else {
		calc = new Date(date2_time_stamp - date1_time_stamp);
	}
	//Retrieve the date, month and year
	const calcFormatTmp = calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
	//Convert to an array and store
	const calcFormat = calcFormatTmp.split("-");
	//Subtract each member of our array from the default date
	const days_passed = Number(Math.abs(calcFormat[0]) - 1);
	const months_passed = Number(Math.abs(calcFormat[1]) - 1);
	const years_passed = Number(Math.abs(calcFormat[2]) - 1970);

	//Set up custom text
	const yrsTxt = ["year", "years"];
	const mnthsTxt = ["month", "months"];
	const daysTxt = ["day", "days"];

	//Convert to days and sum together
	const total_days = (years_passed * 365) + (months_passed * 30.417) + days_passed;
	const total_secs = total_days * 24 * 60 * 60;
	const total_mins = total_days * 24 * 60;
	const total_hours = total_days * 24;
	const total_weeks = (total_days >= 7) ? total_days / 7 : 0;

	//display result with custom text
	const result = ((years_passed == 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ? years_passed + ' ' + yrsTxt[1] + ' ' : '') + ((months_passed == 1) ? months_passed + ' ' + mnthsTxt[0] : (months_passed > 1) ? months_passed + ' ' + mnthsTxt[1] + ' ' : '') + ((days_passed == 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ? days_passed + ' ' + daysTxt[1] : '');

	// ⬇ Validation to stop the result from being negative:
	let return_total_months = 0;
	if (Math.round(total_days) > 1) return_total_months = Math.floor(total_days / 30.417);

	//return the result
	return {
		"result": result.trim(),
		"total_months": return_total_months,
		"total_weeks": Math.round(total_weeks),
		"total_days": Math.round(total_days),
		"total_hours": Math.round(total_hours),
		"total_minutes": Math.round(total_mins),
		"total_seconds": Math.round(total_secs),
	}
}

