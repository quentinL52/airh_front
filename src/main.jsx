import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './page/Landing.jsx';
import HomePage from './page/HomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { authService } from './services/authService';
import AuthCallback from './page/AuthCallback.jsx'; // Ajouté
import '@fortawesome/fontawesome-free/css/all.min.css';

authService.initialize();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/callback" element={<AuthCallback />} /> // Ajouté
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);