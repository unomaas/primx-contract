import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AdminUpdates from './AdminUpdates';

//material ui imports
import { useStyles } from '../MuiStyling/MuiStyling';
import { DataGrid } from '@material-ui/data-grid';


export default function AdminUpdateMaterials() {

   //defining classes for MUI
   const classes = useStyles();

  // establish usedispatch as dispatch
  const dispatch = useDispatch();

  // establish products and prices with a use selector from the companies reducer
  const products = useSelector(store => store.products.productsArray);

  // establish add product and product price input state with use state
  let [productInput, setProductInput] = useState('');
  let [productPriceInput, setProductPriceInput] = useState('');

  let productInfo = {
    product_name: productInput,
    product_price: productPriceInput,
    on_hand: 0
  }
 
  //establish rows with products array for datagrid
  let rows = products;

  //estabish columns for datagrid
  const columns = [
    { field: 'product_name', 
      headerName: 'Product', 
      width: 300, 
      editable: false,
      headerClassName: classes.header },

    { field: 'product_price', 
    headerName: 'Price', 
    width: 175, 
    editable: true,
    headerClassName: classes.header },
    // { field: 'on_hand', headerName: 'On Hand', width: 200, editable: true }, 
  ];

  const handleEditSubmit = ({ id, field, value }) => {
    // id argument is the db id of the row being edited and value is the new value after submitting the edit
    dispatch({
      type: 'UPDATE_PRODUCT', payload: {
        id: id,
        dbColumn: field,
        newValue: value
      }
    })
  }

  const handleProductInputChange = (event) => {
    setProductInput(event.target.value)
  }

  const handlePriceInputChange = (event) => {
    setProductPriceInput(event.target.value)
  }

  // //handles add company button click that sends payload of company name input to saga for posting to database
  // const handleAddProduct = (event) => {
  //   if(productInput == '' || productPriceInput == '') {
  //     swal("Error", "You need to input the product name and product price to add", "error");
  //   } else {
  //     dispatch({type: 'ADD_PRODUCT', payload: productInfo});
  //     setProductPriceInput('');
  //     setProductInput('');
  //     swal("Success!", "New Product Added", "success", {
  //       button: "OK",
  //     });
  //   }

  // }

  useEffect(() => {
    // GET products and prices
    dispatch({ type: 'FETCH_PRODUCTS_ARRAY' });
  }, [])

  return (
    <div>
      <AdminUpdates />
      <h2>Update Material Costs and Inventory</h2>
      {/* Commenting out the add New Material and Price.  If future developers want this functionality, just comment this code back in.  We commented it out due to the math generator looking for specific values from our table, and adding new content could break that. */}
      {/* <TextField id="outlined-basic" label="Add New Material" variant="outlined" value={productInput} onChange={handleProductInputChange}/>
      <TextField id="outlined-basic" label="Add New Price" variant="outlined" value={productPriceInput} onChange={handlePriceInputChange}/>
      <Fab className={classes.root} onClick={handleAddProduct} color="primary" aria-label="add">
              <AddIcon />
            </Fab> */}
      <div className={classes.productsGrid}>
        <DataGrid
          className={classes.dataGridTables}
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={10}
          onCellEditCommit={handleEditSubmit}
        />
      </div>
    </div>
  )
}
