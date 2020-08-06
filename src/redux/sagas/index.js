<<<<<<< HEAD
import { all } from "redux-saga/effects";
import loginSaga from "./loginSaga";
import registrationSaga from "./registrationSaga";
import accountSaga from "./accountSaga";
import activeOrdersSaga from "./activeOrdersSaga";
import completeOrdersSaga from "./completeOrdersSaga"
=======
import { all } from 'redux-saga/effects';
import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import accountSaga from './accountSaga';
import orderSaga from './orderSaga';
>>>>>>> 8243099fa8de3bde8b76dd55a8b58f0e4d57814f

export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    accountSaga(),
<<<<<<< HEAD
    activeOrdersSaga(),
    completeOrdersSaga(),
=======
    orderSaga()
>>>>>>> 8243099fa8de3bde8b76dd55a8b58f0e4d57814f
  ]);
}
