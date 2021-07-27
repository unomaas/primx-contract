
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';


// Material-UI components
import { DataGrid } from '@material-ui/data-grid';

// component that renders a Material UI Data Grid, needs an array of shipping costs as props.
export default function UpdateShippingCostsGrid() {

    const dispatch = useDispatch();

 
    const shippingCosts = useSelector(store => store.shippingCosts);

    // columns for Data Grid
    const columns = [

        {field: 'ship_to_state_province', headerName: 'Ship To', width: 300}, // Editable + validation?
        {field: 'dc_price', headerName: 'DC', width: 300}, // Editable + validation?
        {field: 'flow_cpea_price', headerName: 'Flow/CPEA', width: 300}, // Editable + validation?
        {field: 'fibers_price', headerName: 'Fibers', width: 300} // Editable + validation?

    ]

    let rows = shippingCosts

    console.log('shipping costs in grid component -->', shippingCosts);

    useEffect(() => {
        // GET shipping cost data on page load
        dispatch({type: 'FETCH_SHIPPING_COSTS'});
      }, [])

    return (
        <div
          style={{ height: 650, width: '50%'}}
          className="AdminEstimatesGrid-wrapper"
        >
            <DataGrid 
                // className={classes.dataGridTables}
                style={{fontFamily: 'Times New Roman', fontSize: '1em'}}
                rows={rows}
                columns={columns}
                pageSize={10}
            />
        </div>
    )
}