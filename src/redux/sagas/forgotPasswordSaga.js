import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

// worker Saga: will be fired on "RESET_PASSWORD_EMAIL" actions
function* resetPasswordEmail(action) {
  try {
    // clear any existing error on the registration page
    yield put({ type: "CLEAR_RESET_ERROR" });

    // passes the and password from the payload to the server
    yield axios.post("/api/account/forgot", action.payload);

    // Set this message so the registration page knows to redirect but it isn't actually shown currently.
    yield put({ type: "DISPLAY_SUCCESSFUL_RESET_MESSAGE" });
  } catch (error) {
    console.log("Error with password reset:", error);
    yield put({ type: "RESET_FAILED" });
  }
}

function* forgotPasswordSaga() {
  yield takeLatest("RESET_PASSWORD_EMAIL", resetPasswordEmail);
}

export default forgotPasswordSaga;
