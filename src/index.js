import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';

import api from './api';

import { configureStore } from './state';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App api={api} />
  </Provider>,
  document.getElementById('root')
);
