import { all } from "redux-saga/effects";
import loginSaga from "./loginSaga";
import registrationSaga from "./registrationSaga";
import forgotPasswordSaga from "./forgotPasswordSaga";
import accountSaga from "./accountSaga";
import activeOrdersSaga from "./activeOrdersSaga";
import completeOrdersSaga from "./completeOrdersSaga"
import checkOutOrderSaga from './checkOutOrderSaga';
import orderSaga from './orderSaga';
import locationsSaga from './locationsSaga';
import pendingAccountsSage from './pendingAccounts';

export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    forgotPasswordSaga(),
    accountSaga(),
    activeOrdersSaga(),
    completeOrdersSaga(),
    checkOutOrderSaga(),
    orderSaga(),
    locationsSaga(),
    pendingAccountsSage()
  ]);
}
