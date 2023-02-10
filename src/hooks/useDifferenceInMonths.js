// ⬇ Write a JS Doc comment to describe the below function:
/**
 * Calculates the difference in months between two dates, returning the total month count as an integer.
 * @param {Date} recentDate
 * @param {Date} pastDate
 * @returns {number} The difference in months between the two dates.
 * @example
 * const recentDate = new Date('2022-12-10');
 * const pastDate = new Date('2021-12-10');
 * const difference = useDifferenceInMonths(recentDate, pastDate);
 * console.log(difference); // 12
 **/
export default function useDifferenceInMonths(recentDate, pastDate) {
	const monthDiff = recentDate.getMonth() - pastDate.getMonth();
	const yearDiff = recentDate.getYear() - pastDate.getYear();
	return monthDiff + yearDiff * 12;
}

// function differenceInMonths(date1, date2) {
// 	const monthDiff = date1.getMonth() - date2.getMonth();
// 	const yearDiff = date1.getYear() - date2.getYear();

// 	return monthDiff + yearDiff * 12;
// }

// // June 5, 2022
// const past = new Date('2022-11-05');

// // March 17, 2021
// const today = new Date();

// const difference = differenceInMonths(today,past);

// console.log(`Ryan Here: estimateCreateTable\n`,
// 	`\n past:  `, past,
// 	`\n today: `, today,
// 	`\n difference: `, difference,
// );
