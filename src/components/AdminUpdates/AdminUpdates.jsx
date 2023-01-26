import { React, useState, useEffect } from 'react'
import Select from '@material-ui/core/Select'
import { MenuItem } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export default function AdminUpdates() {
	// defines usehistory
	const history = useHistory();
	//holds value of selection to for page render conditionals
	const user = useSelector((store) => store.user);

	const menuItems = [
		{
			text: 'Licensees by Company',
			url: '/AdminUpdateLicenses',
		},
		{
			text: 'Floor & Placement Types',
			url: '/AdminUpdateTypes',
		},
		{
			text: 'Shipping Destinations',
			url: '/AdminUpdateDestinations',
		},
		{
			text: 'Shipping Costs by Destination',
			url: '/AdminUpdateShipping',
		},
		{
			text: 'Material Costs & Markup',
			url: '/AdminUpdateMaterials',
		},
		{
			text: 'Licensee Accounts',
			url: '/LicenseeAccounts',
		},
		{
			text: 'Customs Duties',
			url: '/AdminUpdateCustoms',
		},
		{
			text: 'Product Containers',
			url: '/ProductContainers',
		},
		{
			text: 'Dosage Rates',
			url: '/DosageRates',
		},
	];

	menuItems.sort((a, b) => a.text.localeCompare(b.text));

	menuItems.unshift({
		text: 'Please Select a Category Here',
		url: '0',
	});

	if (user?.permission_level === 1) {
		menuItems.push({
			text: 'System Admin',
			url: '/SystemAdmin',
		})
	}

	return (
		<div>
			<h2>Administrator Update Fields</h2>
			<Select
				defaultValue={0}
				onChange={event => {
					if (event.target.value != 0) {
						history.push(event.target.value)
					}
				}}
			>
				{menuItems.map((item, index) => {
					return (
						<MenuItem key={index} value={item.url}>
							{item.text}
						</MenuItem>
					);
				})}
			</Select>
			<br />       <br />      <br />
		</div>
	)
}
