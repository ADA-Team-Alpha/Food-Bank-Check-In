import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// This will grab all of the active orders --> all the clients that have checked in.
// These orders are displayed on the Dashboard.  Will be fired on
// "FETCH_ACTIVE_ORDERS" actions.
function* fetchActiveOrders() {
  try {
    const response = yield axios.get('/api/order/active');
    yield put({ type: 'SET_ACTIVE_ORDERS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FAILED_REQUEST' });
    console.log('Order get request failed', error);
  }
}

function* activeOrdersSaga() {
  yield takeLatest('FETCH_ACTIVE_ORDERS', fetchActiveOrders);
}

export default activeOrdersSaga;
