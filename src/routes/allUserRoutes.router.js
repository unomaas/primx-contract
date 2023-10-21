
import AdminLandingPage from '../components/AdminLandingPage/AdminLandingPage';
import AdminUpdates from '../components/AdminUpdates/AdminUpdates';
import AdminOrders from '../components/AdminOrders/AdminOrders';
import AdminUpdateTypes from '../components/AdminUpdates/AdminUpdateTypes';
import AdminUpdateLicenses from '../components/AdminUpdates/AdminUpdateLicenses';
import AdminUpdateDestinations from '../pages/AdminUpdates/ShippingDestinations/index.jsx'
import LicenseeAccounts from '../components/AdminLicenseeAccounts/LicenseeAccounts';
import ProductContainers from '../pages/AdminUpdates/ProductContainers/index.jsx';
import DosageRates from '../pages/AdminUpdates/DosageRates/index.jsx';
import PricingLog from '../pages/PricingLog/index.jsx';
import UpdatePricing from '../pages/UpdatePricing/index.jsx';

export const adminRoutes = [
		// ! Ryan here. When I revisit this, the /admin page used to  be /user page.  Figure it out on if we want /admin to be the updates, or just push to admin/updates, etc. 
	{
		title: 'Admin Landing Page',
		path: '/admin',
		component: AdminLandingPage,
	},
	{
		title: 'Admin ',
		path: '/admin/update',
		component: AdminUpdates,
		appear_in_nav: false,
	},
	{
		title: 'Floor & Placement Types',
		path: '/admin/update/types',
		component: AdminUpdateTypes,
		in_admin_nav: true,
	},
	{
		title: 'Licensees by Company',
		path: '/admin/update/licenses',
		component: AdminUpdateLicenses,
		in_admin_nav: true,
	},
	{
		title: 'Licensee User Accounts',
		path: '/LicenseeAccounts',
		component: LicenseeAccounts,
		in_admin_nav: true,
	},
	{
		title: 'Shipping Destinations',
		path: '/admin/update/destinations',
		component: AdminUpdateDestinations,
		appear_in_nav: true,
	},
	{
		path: '/AdminOrders',
		component: AdminOrders,
	},
	{
		path: '/ProductContainers',
		component: ProductContainers,
	},
	{
		path: '/DosageRates',
		component: DosageRates,
	},
	{
		path: '/pricinglog',
		component: PricingLog,
	},
	{
		path: '/updatepricing',
		component: UpdatePricing,
	},
];