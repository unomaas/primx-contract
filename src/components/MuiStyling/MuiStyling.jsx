import { makeStyles, createMuiTheme, withStyles, TableCell, TableRow } from '@material-ui/core';


// ⬇ Material-ui Theme: 
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Lexend Tera',
    fontSize: 11
  },
}) // End theme


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  }
}))(TableCell);


const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


// ⬇ Material-ui Classes: 
const useStyles = makeStyles({

}); // End useStyles


export { useStyles, theme, StyledTableCell, StyledTableRow };
