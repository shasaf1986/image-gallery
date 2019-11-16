import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import createStore from './store';
import CachedPhotos from './services/cachedPhotos/cachedPhotos';
import { setPreviousQueries } from './store/photos/actions';

const initialQueries = CachedPhotos.instance.getCachedQueries();
const store = createStore();

store.dispatch(setPreviousQueries({
  previousQueries: initialQueries,
}));

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
