import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Metrics from './pages/Metrics';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

import Workouts from './pages/Workouts';
import Diet from './pages/Diet';
import BMRCalculator from './pages/BMRCalculator';
import Coach from './pages/Coach';
import NutritionJournal from './pages/NutritionJournal';
import Layout from './components/Layout';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/bmr" element={<BMRCalculator />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/diet" element={<Diet />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/journal" element={<NutritionJournal />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
