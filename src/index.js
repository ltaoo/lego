import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
