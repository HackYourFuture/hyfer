import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'mobx-react';
import stores from './mobx';

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
