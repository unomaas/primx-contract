import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';
import removeTimestamps from '../../hooks/removeTimestamps';
import createProductPriceObject from '../../hooks/createProductPriceObject';
import swal from 'sweetalert';

// Saga Worker to create a GET request for Estimate DB at estimate number & licensee ID
function* fetchEstimateQuery(action) {
  const estimateNumber = action.payload.estimate_number
  const licenseeId = action.payload.licensee_id

  console.log('IN SAGA -->Estimate Order For Lookup:', estimateNumber, ' Licensee ID:', licenseeId);

  try {
    const response = yield axios.get('/api/estimates/lookup/:estimates',
      {
        params: {
          estimateNumber: estimateNumber,
          licenseeId: licenseeId
        }
      })

    // run the timestamp removal function on the returned array of estimates
    const estimateWithoutTimestamps = removeTimestamps(response.data);

    // if a response came back successfully, there is one estimate object in an array. Run the estimate calculations function on it
    // before sending it to the reducer
    const calculatedResponse = yield useEstimateCalculations(estimateWithoutTimestamps[0]);

    //take response from DB and insert into Admin Reducer
    yield put({ type: 'SET_ESTIMATE_QUERY_RESULT', payload: calculatedResponse });
  }

  catch (error) {
    console.log('User get request failed', error);
  }
}

// Saga Worker to add estimate into table
function* AddEstimate(action) {
  try {
    console.log('got to add estimate');
    
    const response = yield axios.post('/api/estimates', action.payload);

    // action. payload contains the history object from useHistory
    const history = action.payload.history

        // need to send the user to the search estimates results page using the newly created estimate number
        // response.data is currently a newly created estimate_number and the licensee_id that was selected for the post
        yield history.push(`/lookup/${response.data.licensee_id}/${response.data.estimate_number}`);
        
         // ⬇ Sweet Alert to let them know to save the Estimate #:
        swal({
            title: "Estimate saved! Please print this page!",
            text: "Please print or save your estimate number! You will need it to look up this estimate again, and submit the order for processing.",
            icon: "info",
            buttons: "I understand.",
          }).then(() => {
            window.print();
          }); // End swal
    }

  catch (error) {
    console.log('User POST request failed', error);
  }
}

// Worker saga to take in an estimate from the estimate lookup view, create a new estimate using updated shipping data, bring the user
// to the new estimate page for their new calculation data, and allow them to click the Submit Order button
function* recalculateEstimate(action) {
  const currentEstimate = action.payload;
  console.log('current estimate:', currentEstimate);

  try {
    // get updated shipping and product pricing data from the DB
    const shippingCosts = yield axios.get('/api/shippingcosts');
    const productCosts = yield axios.get('/api/products');
    console.log('Shipping costs, Product costs,', shippingCosts.data, productCosts.data);

    // Loop through shippingCosts, find the matching id, and update the shipping costs of the current estimate with the current shipping costs
    shippingCosts.data.forEach(shippingState => {
      if (shippingState.id == currentEstimate.shipping_costs_id) {
        console.log('Shipping state:', shippingState);
        Object.assign(currentEstimate, {
          primx_dc_shipping_estimate: shippingState.dc_price,
          primx_flow_shipping_estimate: shippingState.flow_cpea_price,
          primx_steel_fibers_shipping_estimate: shippingState.fibers_price,
          primx_cpea_shipping_estimate: shippingState.flow_cpea_price
        })
      }
    }) // end forEach
    // run the createProductPriceObject on the returned product costs to create the pricing object
    const productObject = createProductPriceObject(productCosts.data);


    // Update product costs with whatever is current in the products DB table
    // Start with values shared between imperial and metric
    Object.assign(currentEstimate, {
      primx_flow_unit_price: productObject.flow_liters,
      primx_cpea_unit_price: productObject.cpea_liters,
    }) // add in the imperial specific costs
    if (currentEstimate.measurement_units == 'imperial') {
      Object.assign(currentEstimate, {
        primx_dc_unit_price: productObject.dc_lbs,
        primx_steel_fibers_unit_price: productObject.steel_fibers_lbs,
        primx_ultracure_blankets_unit_price: productObject.blankets_sqft,
      }) // or add in the metric specific costs
    } else if (currentEstimate.measurement_units == 'metric') {
      Object.assign(currentEstimate, {
        primx_dc_unit_price: productObject.dc_kgs,
        primx_steel_fibers_unit_price: productObject.steel_fibers_kgs,
        primx_ultracure_blankets_unit_price: productObject.blankets_sqmeters,
      })
    }

    // Now that the current estimate has updated pricing data, send an action to the estimates reducer that will set a recalculated boolean
    // from false to true, allowing the user to click the place order button on the estimate lookup view
    yield put({ type: 'SET_RECALCULATED_TRUE' })
    // make a new POST request using the updated data
    yield put({ type: 'ADD_ESTIMATE', payload: currentEstimate })

  }
  catch (error) {
    console.log('recalculate estimate failed', error)
  }
}

// Worker saga that is supplied an estimate id number and a user-created P.O. number that marks an estimate as ordered in the database to then
// be processed by an admin user
function* markEstimateAsOrdered(action) {
    try {
        yield axios.put(`/api/estimates/order/${action.payload.id}`, action.payload);
        // fetch updated estimate data for the search view to allow for proper conditional rendering once the licensee has placed an order
        yield put({type: 'FETCH_ESTIMATE_QUERY', payload: action.payload});
        // set the recalculated boolean in the estimates reducer to false so the place order button gets disabled for other estimates
        yield put({type: 'SET_RECALCULATE_FALSE'});
    }
    catch (error) {
        console.log('markEstimateAsOrdered failed', error)
    }
}


// companies saga to fetch companies
function* licenseeFormSaga() {
  // Makes a POST request for a new estimate
  yield takeLatest('ADD_ESTIMATE', AddEstimate);
  // Makes a GET request to get a single estimate from the DB after being searched in the estimate lookup view
  yield takeLatest('FETCH_ESTIMATE_QUERY', fetchEstimateQuery);
  // Runs a number of functions to recalculate an old estimate with updated pricing data before creating a new estimate in the DB
  yield takeLatest('RECALCULATE_ESTIMATE', recalculateEstimate);
  // Marks an estimate as ordered in the DB and attaches a supplied P.O. number to it
  yield takeLatest('EDIT_PLACE_ORDER', markEstimateAsOrdered);
}

export default licenseeFormSaga;