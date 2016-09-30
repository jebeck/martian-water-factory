import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import api from './api';

ReactDOM.render(
  <App api={api} />,
  document.getElementById('root')
);
