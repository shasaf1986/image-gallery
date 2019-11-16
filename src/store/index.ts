import { createStore as createReduxStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import photosReducer from "./photos/reducer";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "../sagas";

const rootReducer = combineReducers({
  photos: photosReducer,
});


export type AppState = ReturnType<typeof rootReducer>;

export default function createStore() {
  const sagaMiddleware = createSagaMiddleware();
  const loggerMiddleware = createLogger();
  const middlewares = [loggerMiddleware, sagaMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);
  const store = createReduxStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
