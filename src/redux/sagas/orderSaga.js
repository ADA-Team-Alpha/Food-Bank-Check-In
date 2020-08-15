import axios from 'axios';
import { takeLatest, put, delay } from 'redux-saga/effects';

function* submitCheckIn(action) {
  try {
    yield axios.post('/api/order', action.payload);
  } catch (error) {
    yield put({ type: 'SET_ORDER_PLACEMENT_ERROR' });
    console.log('User get request failed', error);
  }
}

function* fetchWaitTime() {
  try {
    // This is the string of the wait minutes to return. Since the return value from the
    // get request isn't saved outside of the while loop change this value by setting it here first.
    let returnStr = '';
    // Boolean to prevent from infinitely requesting.
    let processing = true;
    // Loop a get request for the estimated wait minutes until the minutes have been
    // specified by a volunteer/admin because the user was checked in.
    while (processing === true) {
      const response = yield axios.get('/api/order/client-order-status');
      yield delay(5000);
      // If this is a user's first order they won't have any order results so keep looping
      // to give the order a moment to go through.ß
      if (response.data[0]) {
        // If the estimated wait time minutes have been specified break the loop and return that value.
        if (response.data[0].wait_time_minutes !== null) {
          returnStr = response.data[0].wait_time_minutes;
          processing = false;
        }
      }
    }
    yield put({ type: 'SET_WAIT_TIME', payload: returnStr });
  } catch (error) {
    yield put({ type: 'SET_RETRIEVE_ACTIVE_ORDER_ERROR' });
    console.log('User order get request failed', error);
  }
}

function* accountSaga() {
  yield takeLatest('SUBMIT_ORDER', submitCheckIn);
  yield takeLatest('FETCH_WAIT_TIME', fetchWaitTime);
}

export default accountSaga;
