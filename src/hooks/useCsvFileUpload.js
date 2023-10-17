import Papa from 'papaparse';

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

const updateData = (result) => {
    console.log('Parsed Results:', result.data);
    // Here, you can set the state or dispatch an action to update your store
    // For instance: setRows(result.data);
};