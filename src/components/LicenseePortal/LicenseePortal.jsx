import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ButtonToggle from '../ButtonToggle/ButtonToggle';
import { MenuItem, Select, Button } from '@material-ui/core';
import LicenseeTables from './LicenseeTables';
import LicenseeSelect from './LicenseeSelect';


export default function LicenseePortal() {

	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const pageData = useSelector(store => store.licenseePortalReducer.pageData);
	const history = useHistory();
	const companies = useSelector(store => store.companies);
	const [selectedLicenseeId, setSelectedLicenseeId] = useState(user.permission_level == 3 ? user.licensee_id : undefined);
	const [company, setCompany] = useState(0);


	useEffect(() => {
		dispatch({ type: 'SET_BUTTON_STATE', payload: 'SavedEstimates' });

		if (user.permission_level <= 2 && companies.length == 0) {
			dispatch({ type: 'FETCH_ALL_COMPANIES' });
		}
	}, []);

	useEffect(() => {
		if (selectedLicenseeId) {
			dispatch({ type: 'INITIAL_LOAD_LICENSEE_PORTAL', payload: selectedLicenseeId });
			// dispatch({ type: 'SET_BUTTON_STATE', payload: 'SavedEstimates' });
		}
	}, [selectedLicenseeId]);



	return (
		<div className="EstimateCreate-wrapper">

			<ButtonToggle />

			<br />

			{user?.permission_level <= 2 &&
				<LicenseeSelect companies={companies} setSelectedLicenseeId={setSelectedLicenseeId} />

			}

			<br />
			<br />

			<div>
				{/* Conditional rendering to only show the table once the data is loaded: */}
				{Object.keys(pageData).length != 0 &&
					<LicenseeTables pageData={pageData} />
				}

			</div>

		</div>
	);
}

// export default LicenseePortal;
