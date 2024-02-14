// src/utils/dateUtils.js
import dayjs from 'dayjs';
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

/**
 * Get the date after adding a specified number of months to a given date.
 * 
 * @param {string} date - The initial date in 'YYYY-MM-DD' format.
 * @param {number} [months=6] - The number of months to add. Defaults to 6.
 * @returns {string} - The resulting date in 'YYYY-MM-DD' format.
 * @throws Will throw an error if the date format is invalid.
 */
export function getXMonthGuaranteeDate(date, months = 6) {
	try {
		const parsedDate = dayjs(date);
		if (!parsedDate.isValid()) {
			throw new Error('Invalid date format. Expected format is YYYY-MM-DD.');
		}
		let newDate = parsedDate.add(months, 'month');
		const daysInResultingMonth = newDate.daysInMonth();
		if (newDate.date() > daysInResultingMonth) {
			newDate = newDate.date(daysInResultingMonth);
		}
		return newDate.format('YYYY-MM-DD');
	} catch (error) {
		console.error(error);
		return date;
	}
}



/**
 * Calculates the difference between two dates in various units.
 *
 * @param {string} pastDate - The older date in 'YYYY-MM-DD' format.
 * @param {string} [recentDate=dayjs().format('YYYY-MM-DD')] - The newer date in 'YYYY-MM-DD' format. Defaults to today's date.
 * @returns {Object} - An object containing the total difference in years, months, weeks, days, hours, and minutes.
 * @throws Will throw an error if the date format is invalid or if the past date is after the recent date.
 */
export function differenceBetweenDates(pastDate, recentDate = dayjs().format('YYYY-MM-DD')) {
	try {
		const olderDate = dayjs(pastDate);
		const newerDate = dayjs(recentDate);

		if (!olderDate.isValid() || !newerDate.isValid()) {
			throw new Error('Invalid date format. Expected format is YYYY-MM-DD.');
		}

		let totalMonths = Math.round(newerDate.diff(olderDate, 'month', true));
		const olderDateNextMonth = olderDate.add(totalMonths, 'month');
		// Check if the newerDate has surpassed the olderDate's day in the 6th month
		if (newerDate.isBefore(olderDateNextMonth)) {
			totalMonths -= 1;  // Decrease totalMonths by 1 if it hasn't
		}

		const totalYears = Math.floor(totalMonths / 12);
		totalMonths %= 12;
		const totalWeeks = newerDate.diff(olderDate, 'week');
		const totalDays = newerDate.diff(olderDate, 'day');
		const totalHours = newerDate.diff(olderDate, 'hour');
		const totalMinutes = newerDate.diff(olderDate, 'minute');

		const result = {
			total_years: totalYears,
			total_months: totalMonths,
			total_weeks: totalWeeks,
			total_days: totalDays,
			total_hours: totalHours,
			total_minutes: totalMinutes,
		};

		return result;
	} catch (error) {
		console.error(error);

		return {
			total_years: 0,
			total_months: 0,
			total_weeks: 0,
			total_days: 0,
			total_hours: 0,
			total_minutes: 0,
		};
	}; // End try/catch
}; // End differenceBetweenDates()



/**
 * Checks if the given date is within a specified number of months from the current date.
 * 
 * @param {string} date - The date to check, formatted as 'YYYY-MM-DD'.
 * @param {number} months - The number of months to check against.
 * @returns {boolean} - Returns true if the date is within the specified number of months from the current date; false otherwise.
 * @throws Will throw an error if the date format is invalid.
 */
export function isWithinXMonths(date, months) {
	try {
		const olderDate = dayjs(date);
		const newerDate = dayjs();  // current date
		const thresholdDate = olderDate.add(months, 'month');

		// Check if the newerDate is on or before the thresholdDate
		return newerDate.isBefore(thresholdDate, 'day') || newerDate.isSame(thresholdDate, 'day');
	} catch (error) {
		console.error(error);
		return false;
	}; // End try/catch
}; // End isWithinXMonths()


