import React from 'react';
import ReactDOM from 'react-dom';

import store from './store';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

store.subscribe(function () {
    const state = store.getState();
    ReactDOM.render(
        <App {...state} />,
        document.getElementById('root')
    );
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
registerServiceWorker();
