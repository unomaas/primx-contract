import { all } from 'redux-saga/effects';
import companiesSaga from './companies.saga';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import adminEstimatesSaga from './adminEstimates.saga';
import floorTypesSaga from './floorTypes.saga';
import placementTypesSaga from './placementTypes.saga';
<<<<<<< HEAD
import liscenseeFormSaga from './liscenseeForm.saga';
=======
import productsSaga from './products.saga';
import shippingCostsSaga from './shippingCosts.saga';
>>>>>>> a46261ba0be41620edcb3702bf002c86af6706b3

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
<<<<<<< HEAD
    lisceneeFormSaga(),
=======
    productsSaga(),
    shippingCostsSaga(),
>>>>>>> a46261ba0be41620edcb3702bf002c86af6706b3
  ]);
}
