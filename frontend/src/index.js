import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';               // Your main Assessment
import Dashboard from './Dashboard';   // Your new Dashboard

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Regular users go here (The Assessment) */}
        <Route path="/" element={<App />} />

        {/* HR/Admins go here directly via URL (The Dashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);