import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// This grabs the complete orders so we can set the parking location
// that the user selected.
function* fetchCompleteOrders() {
  try {
    const response = yield axios.get('/api/location');
    yield put({ type: 'SET_PARKING_LOCATIONS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FAILED_REQUEST' });
    console.log('Location get request failed', error);
  }
}

function* activeOrdersSaga() {
  yield takeLatest('FETCH_ALL_LOCATIONS', fetchCompleteOrders);
}

export default activeOrdersSaga;
