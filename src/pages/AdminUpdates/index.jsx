
import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Material-UI components
import { useClasses } from '../../../src/components/MuiStyling/MuiStyling';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, useGridSlotComponentProps } from '@material-ui/data-grid';
import { Button, Fade, MenuItem, Menu, TextField, TablePagination, Modal, Backdrop, InputAdornment, Divider, Tooltip, Paper } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import HelpIcon from '@material-ui/icons/Help';

export default function index() {


	
	return (
		<Paper id="AdminManagementPortalWrapper">
			<div id="AdminManagementPortalToolbar">
				<div id="AdminManagementPortalHeader">
					Administrator Management Portal
				</div>

			</div>


		</Paper>
	)
}
