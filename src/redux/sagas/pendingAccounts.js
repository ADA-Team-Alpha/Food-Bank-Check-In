import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* fetchPendingAccounts() {
  try {
    yield put({ type: 'CLEAR_UNABLE_TO_GET_PENDING_ACCOUNTS_ERROR' });
    const result = yield axios.get('/api/account/pending/approval');
    yield put({ type: 'SET_PENDING_ACCOUNTS', payload: result.data });
  } catch (error) {
    yield put({ type: 'SET_UNABLE_TO_GET_PENDING_ACCOUNTS_ERROR' });
    yield put({ type: 'CLEAR_PENDING_ACCOUNTS' });
    console.log('Fetch pending accounts failed', error);
  }
}

function* updatePendingAccounts(action) {
  try {
    yield axios.put(`/api/account/update-approved/${action.payload.id}`, { approved: action.payload.approved });
    yield put({ type: 'FETCH_PENDING_ACCOUNTS' });
  } catch (error) {
    yield put({ type: 'FAILED_REQUEST' });
    console.log(`Updating the pending account "${action.payload}" failed`, error);
  }
}

function* pendingAccountSaga() {
  yield takeEvery('FETCH_PENDING_ACCOUNTS', fetchPendingAccounts);
  yield takeEvery('UPDATE_PENDING_ACCOUNT', updatePendingAccounts);
}

export default pendingAccountSaga;
