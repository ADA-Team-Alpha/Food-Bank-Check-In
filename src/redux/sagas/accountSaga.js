import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { dispatches } from '../../VariableTitles/VariableTitles';
const requests = dispatches.requests;

// This will get info about the current user and the parking locations.
// Will be fired on "FETCH_INFO" actions.
function* fetchInfo() {
  try {
    yield put({ type: 'SET_SERVER_LOADING' });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/account', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data });

    const locationsResponse = yield axios.get('/api/location');
    yield put({ type: 'SET_PARKING_LOCATIONS', payload: locationsResponse.data });
  } catch (error) {
    console.log('User get request failed', error);
    // TODO Have an error message specific to not getting user info while the user is signed out.
    // yield put({ type: 'FAILED_REQUEST' });
  } finally {
    yield put({ type: 'CLEAR_SERVER_LOADING' });
  }
}

function* staffSearchForClient(action) {
  try {
    yield put({ type: dispatches.loading.setStaffGetClientIsLoading });
    const name = action.payload.name || 'A';
    const householdID = action.payload.householdID || '0';
    const clientResult = yield axios.get(`api/account/search/${name}/${householdID}`);
    console.log(clientResult);
  } catch (error) {
    console.log('Client search request failed', error);
    yield put({ type: 'FAILED_REQUEST' });
  } finally {
    yield put({ type: dispatches.loading.clearStaffGetClientIsLoading });
  }
}

function* accountSaga() {
  yield takeLatest('FETCH_INFO', fetchInfo);
  yield takeLatest(requests.staffSearchForClientInfo, staffSearchForClient);
}

export default accountSaga;
