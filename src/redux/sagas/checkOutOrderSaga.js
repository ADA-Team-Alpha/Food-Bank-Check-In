import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

// Handles wait time and refreshing the complete orders.
// Will be fired on "ORDER_CHECKOUT" actions.
function* checkOutOrder(action) {
  const id = action.payload.id;
  const waitTimeMinutes = action.payload.waitTimeMinutes;
  try {
    // Add a checkout time of now (on the server) for the input order.
    yield axios.put(`/api/order/checkout/${id}`, { wait_time_minutes: waitTimeMinutes });
    // Get the active and complete orders again because we just changed one.
    yield put({ type: 'FETCH_ACTIVE_ORDERS' });
    yield put({ type: 'FETCH_COMPLETE_ORDERS' });
  } catch (error) {
    yield put({ type: 'FAILED_REQUEST' });
    console.log('Update checkout time failed', error);
  }
}

function* checkOutOrderSaga() {
  yield takeEvery('ORDER_CHECKOUT', checkOutOrder);
}

export default checkOutOrderSaga;
