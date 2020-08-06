import axios from 'axios';
import { takeLatest } from 'redux-saga/effects';

function* submitCheckIn(action) {
  console.log('action.payload', action.payload);
  try {
    yield axios.post('/api/order', action.payload);
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* accountSaga() {
  yield takeLatest('SUBMIT_ORDER', submitCheckIn);
}

export default accountSaga;
