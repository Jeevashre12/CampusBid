import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import './App.css';

export default function App() {
  return <BrowserRouter><Routes><Route path="/" element={<HomePage />} /><Route path="/marketplace" element={<MarketplacePage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<LoginPage />} /></Routes></BrowserRouter>;
}

