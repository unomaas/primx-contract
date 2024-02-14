import Papa from 'papaparse';

const useCsvFileUpload = (
	columns,
	rows,
	setRows,
	mapping,
) => {

	if (
		!columns || !rows || !setRows || !mapping ||
		!Array.isArray(columns) || !Array.isArray(rows) || typeof setRows !== 'function' || typeof mapping !== 'object'
	) {
		console.error("Invalid input types for useCsvFileUpload");
		alert("Error processing CSV file. Please check the file format and try again.");
		return;
	};

	const headerName = columns[0].headerName;
	const field = columns[0].field;
	const region = columns.find(column => column.field == "destination_country");

	const csvOptions = {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
		encoding: "UTF-8"
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		parseCSV(file, csvOptions, updateData);
	};

	const parseCSV = (file, options, onParseComplete) => {
		Papa.parse(file, {
			...options,
			complete: onParseComplete
		});
	};

	const hasUniqueValues = (array, keys) => {
		const valueSet = new Set();
		for (const item of array) {
			const keyValue = keys.map(key => item[key]).join('|');
			if (valueSet.has(keyValue)) {
				return false; // Duplicate found
			};
			valueSet.add(keyValue);
		};
		return true; // No duplicates
	};

	const validateData = (data) => {
		const expectedHeaders = columns.map(column => column.headerName);
		const headers = Object.keys(data[0]).filter(header =>
			!header.startsWith('_') && header.trim() !== ''
		);

		return JSON.stringify(headers) === JSON.stringify(expectedHeaders);
	};

	const cleanData = (data) => {
		return data.reduce((acc, row) => {
			const cleanRow = Object.keys(row)
				.filter(key => key !== "" && !key.startsWith("_"))
				.reduce((obj, key) => {
					obj[key] = row[key].trim();
					return obj;
				}, {});

			if (cleanRow[headerName]) {
				acc.push(cleanRow);
			}
			return acc;
		}, []);
	};

	const parseValue = (value) => {
		if (typeof value !== 'string') return value;

		// Check if the value is a percentage
		if (value.includes('%')) {
			// Remove the percentage sign and parse the number
			const percentageValue = parseFloat(value.replace(/%/g, ''));
			return {
				duty_percentage: percentageValue / 100, // Decimal format for database (e.g., 0.3)
				duty_percentage_label: percentageValue, // As it appears in the CSV (e.g., 30)
			};
		}

		// Handle as currency (or regular number)
		const cleanedValue = value.replace(/[^\d.]/g, '');
		return parseFloat(cleanedValue);
	};


	const updateRowsWithCSVData = (currentRows, csvData) => {

		const isUniqueByHeaderName = hasUniqueValues(csvData, [headerName]);
		const isUniqueByHeaderNameAndRegion = !isUniqueByHeaderName && region && hasUniqueValues(csvData, [headerName, region.headerName]);

		for (let row of currentRows) {
			let csvEntry;
			if (isUniqueByHeaderName) {
				csvEntry = csvData.find(entry => entry[headerName] === row[field]);
			} else if (isUniqueByHeaderNameAndRegion) {
				csvEntry = csvData.find(entry =>
					entry[headerName] === row[field] &&
					entry[region.headerName] === row[region.field]
				);
			}

			if (csvEntry) {
				for (let csvKey in mapping) {
					const parsedValue = parseValue(csvEntry[csvKey]);

					if (typeof parsedValue === 'object' && parsedValue !== null) {
						// Handle percentage values
						row['duty_percentage'] = parsedValue.duty_percentage;
						row['duty_percentage_label'] = parsedValue.duty_percentage_label;
					} else {
						// Handle currency and regular numbers
						row[mapping[csvKey]] = parsedValue;
					}
				}
			}
		}

		return currentRows;
	};


	const updateData = (result) => {
		try {
			const cleanedData = cleanData(result.data);
			if (validateData(cleanedData)) {
				const updatedRows = updateRowsWithCSVData(rows, cleanedData);
				setRows(prevRows => [...updatedRows]);
			} else {
				console.error("CSV format is incorrect. Please check the column headers.");
				alert("CSV format is incorrect. Please check the column headers.");
			}
		} catch (error) {
			console.error("Error processing CSV file:", error);
			alert("Error processing CSV file. Please check the file format and try again.");
		}
	};

	return { handleFileUpload };
};

export default useCsvFileUpload;