import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

// worker Saga: will be fired on "RESET_PASSWORD_EMAIL" actions
function* resetPasswordEmail(action) {
  try {
    yield put({ type: "CLEAR_RESET_ERROR" });

    // passes the and password from the payload to the server
    yield axios.post("/api/account/forgot", action.payload);

    // Set this message so the registration page knows to redirect but it isn't actually shown currently.
    yield put({ type: "DISPLAY_SUCCESSFUL_RESET_MESSAGE" });
  } catch (error) {
    console.log("Error with password reset:", error);
  }
}

function* validateToken(action) {
  try {
    const response = yield axios.post("/api/account/test", action.payload);
    if (response.data.valid) {
      yield put({type: "SET_TOKEN_VALID"});
    } else {
      yield put({type: "SET_TOKEN_INVALID"});
    }
  } catch (error) {
    yield put({type: "SET_TOKEN_INVALID"});
    console.log("Error with token validation:", error);
  }
}

function* forgotPasswordSaga() {
  yield takeLatest("RESET_PASSWORD_EMAIL", resetPasswordEmail);
  yield takeLatest("VALIDATE_PASSWORD_RESET_TOKEN", validateToken);
}

export default forgotPasswordSaga;
