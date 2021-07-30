const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();


const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const adminRouter = require('./routes/admin.router');
const estimatesRouter = require('./routes/estimates.router');
const floorTypesRouter = require('./routes/floorTypes.router');
const placementTypesRouter = require('./routes/placementTypes.router');
const productsRouter = require('./routes/products.router');

const shippingCostsRouter = require('./routes/shippingCosts.router');
const companiesRouter = require('./routes/companies.router');
const userInfoRouter = require('./routes/userInfo.router');


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
app.use('/api/admin', adminRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/floortypes', floorTypesRouter);
app.use('/api/placementtypes', placementTypesRouter);
app.use('/api/products', productsRouter);
app.use('/api/shippingcosts', shippingCostsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/userinfo', userInfoRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
