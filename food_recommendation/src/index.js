import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'; // 👈 import Provider
import store from './redux/store';      // 👈 import your Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* 👈 wrap App in Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
