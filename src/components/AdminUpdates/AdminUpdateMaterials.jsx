import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AdminUpdates from './AdminUpdates';

//material ui imports
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid } from '@material-ui/data-grid';

export default function AdminUpdateMaterials() {
  // establish usedispatch as dispatch
  const dispatch = useDispatch();

  // establish products and prices with a use selector from the companies reducer
  const products = useSelector(store => store.products);

  // establish add product and product price input state with use state
  let [productInput, setProductInput] = useState('');
  let [productPriceInput, setProductPriceInput] = useState('');

  let productInfo = {
    product_name: productInput,
    product_price: productPriceInput,
    on_hand: 0
  }

       //styles for MUI
       const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            margin: theme.spacing(1),
          },
        },
      }));
      //defining classes for MUI
      const classes = useStyles();
  

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

  const handleProductInputChange = (event) => {
    setProductInput(event.target.value)
  }

  const handlePriceInputChange = (event) => {
    setProductPriceInput(event.target.value)
  }

  //handles add company button click that sends payload of company name input to saga for posting to database
  const handleAddProduct = (event) => {
    if(productInput == '' || productPriceInput == '') {
      swal("Error", "You need to input the product name and product price to add", "error");
    } else {
      dispatch({type: 'ADD_PRODUCT', payload: productInfo});
      setProductPriceInput('');
      setProductInput('');
    }

  }

  useEffect(() => {
    // GET products and prices
    dispatch({type: 'FETCH_PRODUCTS'});
  }, [])

  return (
    <div>
      <AdminUpdates />
      <h2>Update Material Costs and Inventory</h2>
      <TextField id="outlined-basic" label="Add New Material" variant="outlined" value={productInput} onChange={handleProductInputChange}/>
      <TextField id="outlined-basic" label="Add New Price" variant="outlined" value={productPriceInput} onChange={handlePriceInputChange}/>
      <Fab className={classes.root} onClick={handleAddProduct} color="primary" aria-label="add">
              <AddIcon />
            </Fab>
      <div style={{ height: 350, width: '65%' }}
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
