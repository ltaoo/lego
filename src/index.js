import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { observe } from './components/Game';

observe(components => {
    console.log('add component');
    ReactDOM.render(
        <App components={components} />,
        document.getElementById('root')
    );
});
registerServiceWorker();
