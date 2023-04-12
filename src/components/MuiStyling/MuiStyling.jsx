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
    width: 425,
    margin: 'auto',
  },

	LicenseeGrid: {
    width: 650,
    margin: 'auto',
  },

  TypesGrid: {
    width: 405,
    margin: 'auto',
  },

  dataGridTables: {
    fontFamily: 'Times New Roman',
    fontSize: '13px',
  },

	productContainersGrid: {
    width: 900,
    margin: 'auto',
  },

	pricingLogGrid: {
    maxWidth: '90%',
    margin: 'auto',
  },

  shippingGrid: {
    width: 925,
    margin: 'auto',
  },

	customsGrid: {
    width: 485,
    margin: 'auto',
  },

	customsDutiesHistoryGrid: {
    width: 800,
    margin: 'auto',
  },

	shippingCostHistoryGrid: {
    width: 1200,
    margin: 'auto',
  },

	pricePerUnitHistoryGrid: {
    margin: 'auto',
  },

	pricePerUnitToolbar: {
		display: "block",
		width: "1200px",
		position: "sticky",
		left: "0",
  },

	pricePerUnitHistoryPaper: {
    width: 1200,
    margin: 'auto',
		overflowX: 'scroll',
  },

	destinationGrid: {
    width: 685,
    margin: 'auto',
  },

  productsGrid: {
    width: 450,
    // margin: 'auto',
		marginRight: '20px',
  },

	markupGrid: {
    width: 500,
		height: 211,
    // margin: 'auto',
  },

  licenseeGrid: {
    width: 525,
    margin: 'auto',
  },

  AdminEstimatesGridwrapper: {
    width: '95%',
    margin: '0 auto',
  },

	LicenseeEstimatesGridWrapper: {
		// margin: '0 1em',
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
