import { all, fork } from 'redux-saga/effects';
import photosSaga from './photosSaga';

// Register all your watchers
export default function* rootSaga() {
  if (process.browser) {
    yield all([fork(photosSaga)]);
  }
}
