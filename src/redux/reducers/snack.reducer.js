const snackReducer = (state = { open: false, message: '', severity: "success" }, action) => {
  switch (action.type) {
    case 'SET_SUCCESS_COMPANY':
      return {
        open: true,
        message: 'A Licensee Has Been Added!',
        severity: "success",
        variant: 'filled'
      }
    case 'SET_SUCCESS_SHIPPING':
      return {
        open: true,
        message: 'Shipping Details Have Been Added!',
        severity: "success",
        variant: 'filled'
      }
    case 'SET_SUCCESS_FLOOR_TYPES':
      return {
        open: true,
        message: 'Floor Type has Been Added!',
        severity: "success",
        variant: 'filled'
      }
    case 'SET_SUCCESS_PLACEMENT_TYPES':
      return {
        open: true,
        message: 'Placement Type has Been Added!',
        severity: "success",
        variant: 'filled'
      }
    case 'SET_SUCCESS_REGISTER_ADMIN':
      return {
        open: true,
        message: 'New Admin has Been Added!',
        severity: "success",
        variant: 'filled'
      }
    case 'SET_ERROR_LEADTIME':
      return {
        open: true,
        message: 'Please choose a date of first pour at least 8 weeks out. If needed sooner, please contact PrimX directly.',
        severity: "info",
        variant: "filled"
      }
    case 'SET_CLOSE':
      return { ...state, open: false }
    case 'SET_EMPTY_ERROR':
      return {
        open: true,
        message: 'Please fill out all of the input fields to proceed.',
        severity: "error"
      }
    case 'GET_LINEAL_INCHES':
      return {
        open: true,
        message: `If applicable, for slabs under 6in.  NOTE: For 'Slabs on Insulation', or if there are no thickened edges, enter "0" for both the perimeter & construction joint values.`,
        severity: 'info',
        variant: 'filled'
      }
    case 'GET_LINEAL_METERS':
      return {
        open: true,
        message: `If applicable, for slabs under 150mm.  NOTE: For 'Slabs on Insulation', or if there are no thickened edges, enter "0" for both the perimeter & construction joint values.`,
        severity: 'info',
        variant: 'filled'
      }
    case 'GET_PRIMX_FLOW_LTRS':
      return {
        open: true,
        message: `If you have been given a design from Primekss, enter the flow dosage here.  If not, use "3.00" as the default.`,
        severity: 'info',
        variant: 'filled'
      }
    case 'GET_PRIMX_STEEL_LBS':
      return {
        open: true,
        message: `If you have been given a design from Primekss, enter the fiber dosage here (usually 60lbs or 68lbs per cubic yard).`,
        severity: 'info',
        variant: 'filled'
      }
    case 'GET_PRIMX_STEEL_KGS':
      return {
        open: true,
        message: `If you have been given a design from Primekss, enter the fiber dosage here (usually 40kgs per cubic meter).`,
        severity: 'info',
        variant: 'filled'
      }
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default snackReducer;
