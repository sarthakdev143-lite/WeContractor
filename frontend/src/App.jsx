import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Buy from './components/Buy';
import Sell from './components/Sell';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Router>
      <Navbar />
      <main className="flex justify-center h-full px-4 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <div className="language-selector fixed bottom-5 right-5 shadow-xl cursor-pointer">
          <select
            onChange={changeLanguage}
            defaultValue={i18n.language}
            className="border rounded-md p-2 text-lg cursor-pointer"
          >
            <option value="en" className='cursor-pointer'>English</option>
            <option value="hi" className='cursor-pointer'>हिन्दी</option>
          </select>
        </div>
      </main>
    </Router>
  );
};

export default App;
