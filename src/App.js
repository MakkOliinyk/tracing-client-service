import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import './index.css';
import './normalize.css';

const App = () => {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<div>HELLO!</div>} />
        </Routes>
      </Router>
  );
};

export default App;
