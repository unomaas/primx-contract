const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();


const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const estimatesRouter = require('./routes/estimates.router');
const floorTypesRouter = require('./routes/floorTypes.router');
const placementTypesRouter = require('./routes/placementTypes.router');
const productsRouter = require('./routes/products.router');
const shippingCostsRouter = require('./routes/shippingCosts.router');
const customsDutiesRouter = require('./routes/customsDuties.router');
const productContainerRouter = require('./routes/productContainer.router');
const shippingDestinationsRouter = require('./routes/shippingDestinations.router');
const companiesRouter = require('./routes/companies.router');
const userInfoRouter = require('./routes/userInfo.router');
const licenseePortalRouter = require('./routes/licenseePortal.router')
const dosageRatesRouter = require('./routes/dosageRates.router')


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/floortypes', floorTypesRouter);
app.use('/api/placementtypes', placementTypesRouter);
app.use('/api/products', productsRouter);
app.use('/api/shippingcosts', shippingCostsRouter);
app.use('/api/customsduties', customsDutiesRouter);
app.use('/api/shippingdestinations', shippingDestinationsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/userinfo', userInfoRouter);
app.use('/api/licenseePortal', licenseePortalRouter);
app.use('/api/productContainer', productContainerRouter);
app.use('/api/dosageRates', dosageRatesRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.error(`Listening on port: ${PORT}`);
});
