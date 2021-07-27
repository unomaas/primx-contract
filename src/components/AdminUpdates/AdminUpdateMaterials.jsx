import React, { useState } from 'react'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import { useDispatch, useSelector } from 'react-redux';
import AdminUpdates from './AdminUpdates';
import AdminUpdates from './AdminUpdates';

export default function AdminUpdateMaterials() {
  // establish usedispatch as dispatch
  const dispatch = useDispatch();

  // establish products and prices with a use selector from the companies reducer
  const products = useSelector(store => store.products);

  // establish add product and product price input state with use state
  let [productInput, setProductInput] = useState('');
  let [productPriceInput, setProductPriceInput] = useState('');

  //establish rows with products array for datagrid
  let rows = products;

  //estabish columns for datagrid
  const columns = [
    { field: 'product_name', headerName: 'Product', width: 300, editable: true },
    { field: 'product_price', headerName: 'Price', width: 175, editable: true },
    { field: 'on_hand', headerName: 'On Hand', width: 200, editable: true },
  ];

  const handleEditSubmit = ({ id, field, props }) => {
    console.log('in handle edit submit for id, field, props', id, field, props);
    // id argument is the db id of the row being edited and props.value is the new value after submitting the edit
    dispatch({
      type: 'UPDATE_PRODUCT', payload: {
        id: id,
        dbColumn: field,
        newValue: props.value
      }
    })

  }

  return (
    <div>
      <AdminUpdates />
      <h2>Update Material Costs and Inventory</h2>
      <input onChange={handleProductInputChange} type='text'></input>
      <input onChange={handlePriceInputChange} type='text'></input>
      <Button onClick={handleAddProduct}><AddCircleOutlineRoundedIcon /></Button>
      <div style={{ height: 350, width: '95%' }}
        className="AdminEstimatesGrid-wrapper">
        <DataGrid
          style={{ fontFamily: 'Times New Roman', fontSize: '1em' }}
          rows={rows}
          columns={columns}
          pageSize={10}
          onEditCellChangeCommitted={handleEditSubmit}
        />
      </div>
    </div>
  )
}
