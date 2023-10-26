
import React from 'react';
// Material-UI components
import { DataGrid } from '@material-ui/data-grid';
import { useClasses } from '../MuiStyling/MuiStyling';



// component that renders a Material UI Data Grid, needs an array of flor types and placement types as props.
export default function UpdatePlacementTypesGrid({ placementTypes }) {
	// material ui classes for data grid
	const classes = useClasses();

	// columns for Data Grid
	const placementColumns = [

		{
			field: 'placement_type_label',
			headerName: 'Placement Type',
			width: 400,
			headerClassName: classes.header
		} // Editable + validation?
	]
	//rows are the info from the placement type reducer
	let placementRows = placementTypes

	return (
		<div

			className={classes.TypesGrid}
		>
			<DataGrid
				className={classes.dataGridTables}
				autoHeight
				rows={placementRows}
				getRowId={(row) => row.placement_type_id}
				columns={placementColumns}
				pageSize={10}
				rowsPerPageOptions={[10, 25, 50, 100]}
			/>
		</div>
	)
}