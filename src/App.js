import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Overview from './Overview/Overview';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Overview />} />
      </Routes>
    </div>
  );
}

export default App;
