import { all } from "redux-saga/effects";
import loginSaga from "./loginSaga";
import registrationSaga from "./registrationSaga";
import accountSaga from "./accountSaga";
import activeOrdersSaga from "./activeOrdersSaga";
import completeOrdersSaga from "./completeOrdersSaga"

export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    accountSaga(),
    activeOrdersSaga(),
    completeOrdersSaga(),
  ]);
}
