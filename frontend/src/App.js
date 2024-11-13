
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute'; 
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<ProtectedRoute component={AdminPanel} />} />
        
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
