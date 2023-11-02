import dayjs from 'dayjs';

export default function useDifferenceBetweenDates(pastDate, recentDate = dayjs().format('YYYY-MM-DD')) {
	try {

		if (typeof pastDate !== 'string' || typeof recentDate !== 'string') {
			throw new Error('Both dates must be strings');
		}; // End if

		// Ensure the dates are in day.js objects
		const olderDate = dayjs(pastDate);
		const newerDate = dayjs(recentDate);

		if (!olderDate.isValid() || !newerDate.isValid()) {
			throw new Error('Invalid date format. Expected format is YYYY-MM-DD.');
		}

		// if (newerDate.isBefore(olderDate)) {
		// 	throw new Error('The recent date must be later than the past date');
		// }

		// Calculate the differences
		const totalYears = newerDate.diff(olderDate, 'year');
		const totalMonths = newerDate.diff(olderDate, 'month');
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
	};

}
