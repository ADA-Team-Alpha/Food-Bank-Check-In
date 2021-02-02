import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

// worker Saga: will be fired on "RESET_PASSWORD_EMAIL" actions
function* resetPasswordEmail(action) {
  try {
    yield put( {type: "CLEAR_PASSWORD_RESET_ERROR_MESSAGE" }); 

    // passes the and password from the payload to the server
    yield axios.post("/api/account/forgot", action.payload);

  } catch (error) {
    console.log("Error with password reset:", error);
    yield put({ type: "SET_FAILED_PASSWORD_RESET" })
    yield put({ type: "DISPLAY_FAILED_PASSWORD_RESET_MESSAGE" });
  }
}

function* validateToken(action) {
  try {
    yield put({type: "CLEAR_PASSWORD_RESET_ERROR_MESSAGE"});
    const response = yield axios.post("/api/account/validate_token", action.payload);
    if (response.data.valid) {
      yield put({type: "SET_TOKEN_VALID"});
    } else {
      yield put({type: "SET_TOKEN_INVALID"});
    }
  } catch (error) {
    console.log("Error with token validation:", error);
    yield put({type: "SET_TOKEN_INVALID"});
    yield put({ type: "DISPLAY_FAILED_PASSWORD_RESET_MESSAGE" });
  }
}

function* resetPassword(action) {
  try {
    yield put({type: "CLEAR_PASSWORD_RESET_ERROR_MESSAGE"});

    yield axios.post("/api/account/change_password/", action.payload);

    //Switches to Login Page
    yield put({ type: "DISPLAY_SUCCESSFUL_PASSWORD_RESET_MESSAGE" });
    yield put({ type: "SET_SUCCESSFUL_PASSWORD_RESET" });
  } catch (error) {
    console.log("Error with password reset:", error);
    yield put({ type: "SET_FAILED_PASSWORD_RESET" });
    yield put({ type: "DISPLAY_FAILED_PASSWORD_RESET_MESSAGE" });
  }
}

function* forgotPasswordSaga() {
  yield takeLatest("RESET_PASSWORD_EMAIL", resetPasswordEmail);
  yield takeLatest("VALIDATE_PASSWORD_RESET_TOKEN", validateToken);
  yield takeLatest("RESET_PASSWORD", resetPassword);
}

export default forgotPasswordSaga;
