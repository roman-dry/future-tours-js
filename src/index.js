import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { App } from './components/app/App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
      </Router>
    </Provider>
    
  </React.StrictMode>
);
