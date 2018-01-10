import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { observe } from './components/Game';

observe(knightPosition => {
    console.log('change position');
    ReactDOM.render(
        <App knightPosition={knightPosition} />,
        document.getElementById('root')
    );
});
registerServiceWorker();
