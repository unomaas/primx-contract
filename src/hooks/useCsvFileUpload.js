import Papa from 'papaparse';

const useCsvFileUpload = (columns, rows, setRows, mapping) => {

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		parseCSV(file);
	};

	const parseCSV = (file) => {
		Papa.parse(file, {
			complete: updateData,
			header: true
		});
	};

	const validateData = (data) => {
		const expectedHeaders = columns.map(column => column.headerName);
		const headers = Object.keys(data[0]).filter(header =>
			!header.startsWith('_') && header.trim() !== ''
		);
		return JSON.stringify(headers) === JSON.stringify(expectedHeaders);
	};

	const cleanData = (data) => {
		let cleanedData = data.filter(row => row["Destination"].trim() !== "");
		cleanedData = cleanedData.map(row => {
			for (let key in row) {
				if (key === "" || key.startsWith("_")) {
					delete row[key];
				}
			}
			return row;
		});
		return cleanedData;
	};

	const parseCurrencyToFloat = (value) => {

		if (!value) return 0;

		// Remove any characters that aren't digits or decimals
		const cleanedValue = value.replace(/[^\d.]/g, '');
		return parseFloat(cleanedValue);
	};

	const updateRowsWithCSVData = (rows, csvData) => {

		for (let row of rows) {
			const csvEntry = csvData.find(entry => entry.Destination === row.destination_name);
			if (csvEntry) {
				for (let csvKey in mapping) {
					row[mapping[csvKey]] = parseCurrencyToFloat(csvEntry[csvKey]);
				}
			}
		}
		return rows;
	};

	const updateData = (result) => {
		const cleanedData = cleanData(result.data);
		if (validateData(cleanedData)) {
			const updatedRows = updateRowsWithCSVData(rows, cleanedData);
			setRows(prevRows => [...updatedRows]);
		} else {
			console.error("CSV format is incorrect");
		}
	};

	return { handleFileUpload };
};

export default useCsvFileUpload;
