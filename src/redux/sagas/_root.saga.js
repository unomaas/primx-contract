import { all } from 'redux-saga/effects';
import companiesSaga from './companies.saga';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import adminEstimatesSaga from './adminEstimates.saga';
import floorTypesSaga from './floorTypes.saga';
import placementTypesSaga from './placementTypes.saga';
import productsSaga from './products.saga';
import shippingCostsSaga from './shippingCosts.saga';
import shippingDestinationsSaga from './shippingDestinations.saga';
import licenseeFormSaga from './licenseeForm.saga';
import userInfoSaga from './userInfo.saga';
import fieldSelectSaga from './fieldSelect.saga'
import combineEstimatesSaga from './combineEstimates.saga';
import licenseePortalSaga from './licenseePortal.saga';
import customsDutiesSaga from './customsDuties.saga';
import productContainersSaga from './productContainers.saga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    companiesSaga(),
    adminEstimatesSaga(),
    floorTypesSaga(),
    placementTypesSaga(),
    productsSaga(),
    shippingCostsSaga(),
    licenseeFormSaga(),
    userInfoSaga(),
    fieldSelectSaga(),
    combineEstimatesSaga(),
		licenseePortalSaga(),
		shippingDestinationsSaga(),
		customsDutiesSaga(),
		productContainersSaga(),
  ]);
}
