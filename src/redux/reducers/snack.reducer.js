const snackReducer = (state = {
	open: false,
	message: '',
	severity: "success"
}, action) => {
	switch (action.type) {
		case 'SET_CLOSE':
			return {
				...state,
				open: false
			}
		case 'SET_SUCCESS_COMPANY':
			return {
				open: true,
				message: 'The new licensee has been added!',
				severity: "success",
				variant: 'filled'
			}
		case 'SET_SUCCESS_SHIPPING':
			return {
				open: true,
				message: 'The shipping details have been added!',
				severity: "success",
				variant: 'filled'
			}
		case 'SET_SUCCESS_FLOOR_TYPES':
			return {
				open: true,
				message: 'The new floor type has been added!',
				severity: "success",
				variant: 'filled'
			}
		case 'SET_SUCCESS_PLACEMENT_TYPES':
			return {
				open: true,
				message: 'The new placement type has been added!',
				severity: "success",
				variant: 'filled'
			}
		case 'SET_SUCCESS_REGISTER_ADMIN':
			return {
				open: true,
				message: 'The new administrator account has been added!',
				severity: "success",
				variant: 'filled'
			}
		case 'SET_SUCCESS_DELETE_ADMIN':
			return {
				open: true,
				message: 'That administrator account has been deleted!',
				severity: "success",
				variant: 'filled'
			}
		case 'SET_SUCCESS_ACTIVE':
			return {
				open: true,
				message: 'Successfully marked the licensee as active/inactive, which affects if they appear as options on the menu drop-downs across the site.',
				severity: "success",
				variant: 'filled'
			}
		case 'SET_ERROR_LEADTIME':
			return {
				open: true,
				message: 'Lead times of less than 8 weeks may not be possible. If needed sooner, please contact PrimX directly.',
				severity: "info",
				variant: "filled"
			}

		case 'SET_EMPTY_ERROR':
			return {
				open: true,
				message: 'Please complete all of the input fields to proceed.',
				severity: "info",
				variant: "filled"
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
		case 'GET_WASTE_FACTOR':
			return {
				open: true,
				message: `Please choose a percentage to calculate waste factor volume. The default is 5%, and the minimum is 3%.`,
				severity: 'info',
				variant: 'filled'
			}
		case 'GET_RECALCULATE_INFO':
			return {
				open: true,
				message: `The prices have been updated to be current with today's rates! You may now place your order.`,
				severity: 'info',
				variant: 'filled'
			}
		case 'SHIPPING_COSTS_EDIT_SUCCESS':
			return {
				open: true,
				message: `The edits to that destination have been saved!`,
				severity: 'success',
				variant: 'filled'
			}
		case 'SHIPPING_COSTS_EDIT_ERROR':
			return {
				open: true,
				message: `Sorry, something went wrong with that request.  Please try again later.`,
				severity: 'warning',
				variant: 'filled'
			}
		default:
			return state;
	}
};

// user will be on the redux state at:
// state.user
export default snackReducer;
