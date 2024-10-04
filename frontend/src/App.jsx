import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Buy from './components/Buy';
import Sell from './components/Sell';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="flex justify-center h-full px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
