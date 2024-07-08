import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import TelegramConnection from "./telegramConnection";
import Refresh from "./Refresh-bot";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/telcon" element={<TelegramConnection />} />
            <Route path="/Refresh-bot" element={<Refresh />} />
        </Routes>
    </Router>
);
