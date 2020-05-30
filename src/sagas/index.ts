import { all, fork } from 'redux-saga/effects';
import photosSaga from './photosSaga';

// Register all your watchers
export default function* rootSaga() {
  yield all([fork(photosSaga)]);
}
