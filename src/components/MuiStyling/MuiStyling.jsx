import { makeStyles, createTheme } from '@material-ui/core';


// ⬇ Material-ui Theme: 
const theme = createTheme({

}) // End theme

// ⬇ Material-ui Classes: 
const useStyles = makeStyles({
  // ⬇ Makes the Hamburger Icon White and Large:
  navBarIcon: {
    color: 'white',
    fontSize: '1.75em'
  },
  // ⬇ Makes the Data Grid Tables in a normal font: 
  LexendTeraFont: {
    fontFamily: 'Lexend Tera',
  },
  LexendTeraFont11: {
    fontFamily: 'Lexend Tera',
    fontSize: '12px',
  },
  OrdersHeaders: {
    fontFamily: 'Lexend Tera',
    marginBottom: '.3em',
  },

  SystemAdminGrid: {
    width: 472,
    margin: 'auto',
  },

  TypesGrid: {
    width: 400,
    margin: 'auto',
  },

  dataGridTables: {
    fontFamily: 'Times New Roman',
    fontSize: '1em',
  },

  shippingGrid: {
    width: 800,
    margin: 'auto',
  },

  productsGrid: {
    width: 475,
    margin: 'auto',
  },

  licenseeGrid: {
    width: 525,
    margin: 'auto',
  },
  AdminEstimatesGridwrapper: {
    width: '95%',
    margin: 'auto',
  },

  AddLicenseeInput: {
    margin: 10
  },
  AddTypesInput: {
    margin: 10
  },
  estimateNumberLookup: {
    fontSize: '15px',
    color: 'red'
  },
  header: {
    backgroundColor: '#C8C8C8',
  },
  ButtonToggle: {
    fontFamily: 'Lexend Tera',
    fontSize: '11px'
  },

}); // End useStyles


export { useStyles, theme };
