
import React, { useState } from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';
import { useStyles } from '../MuiStyling/MuiStyling';

// component that renders a Material UI Data Grid, needs an array of floor types and placement types as props.
export default function UpdateFloorTypesGrid({ floorTypes }) {
	//Material UI classes for data grid
	const classes = useStyles();
	const [pageSize, setPageSize] = useState(10);


	// columns for Data Grid
	const floorColumns = [

		{
			field: 'floor_type_label',
			headerName: 'Floor Type',
			width: 400,
			headerClassName: classes.header
		} // Editable + validation?
	]

	//rows are the info from the floor types reducer
	let floorRows = floorTypes

	return (
		<div
			className={classes.TypesGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				autoHeight
				rows={floorRows}
				getRowId={(row) => row.floor_type_id}
				columns={floorColumns}
				// pageSize={10}
				rowsPerPageOptions={[10, 25, 50, 100]}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				pagination
			/>
		</div>
	)
}