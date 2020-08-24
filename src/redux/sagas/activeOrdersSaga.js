import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// This will grab all of the active orders --> all the clients that have checked in.
// These orders are displayed on the Dashboard.  Will be fired on
// "FETCH_ACTIVE_ORDERS" actions.
function* fetchActiveOrders() {
  try {
    yield put({ type: 'CLEAR_UNABLE_TO_GET_ACTIVE_ORDERS_ERROR' });
    const response = yield axios.get('/api/order/active');
    yield put({ type: 'SET_ACTIVE_ORDERS', payload: response.data });
  } catch (error) {
    yield put({ type: 'SET_UNABLE_TO_GET_ACTIVE_ORDERS_ERROR' });
    yield put({ type: 'CLEAR_COMPLETE_ORDERS' });
    yield put({ type: 'CLEAR_ACTIVE_ORDERS' });
    console.log('Order get request failed', error);
  }
}

function* activeOrdersSaga() {
  yield takeLatest('FETCH_ACTIVE_ORDERS', fetchActiveOrders);
}

export default activeOrdersSaga;
