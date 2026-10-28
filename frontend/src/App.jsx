import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateListingPage from './pages/CreateListingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

export default function App() {
  return <AuthProvider><BrowserRouter><Routes><Route path="/" element={<HomePage />} /><Route path="/marketplace" element={<MarketplacePage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route element={<ProtectedRoute />}><Route path="/create-listing" element={<CreateListingPage />} /></Route></Routes></BrowserRouter></AuthProvider>;
}
