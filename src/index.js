import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <App />
    </Provider>
);

export const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    '^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[@-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i' // validate fragment locator
  ); 
  return !!urlPattern.test(urlString);
}

export const hasWhiteSpace = (s) => {
  return (/\s/).test(s);
}