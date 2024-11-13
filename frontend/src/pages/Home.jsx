
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Profile from '../components/Profile';
import ShiftForm from '../components/Shifts/ShiftForm';
import ShiftRecords from '../components/Shifts/ShiftRecords';
import './home.css';


const Home = () => {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true); 
  const toggleAuth = () => {
    setShowLogin((prev) => !prev);
  };
 
  return (
    <div className="home-container">
      <h1 className="welcome-header">Welcome to the Attendence Management App</h1>
      {user ? (
        <div className="user-section">
          <div className="component-wrapper">
            <Profile />
          </div>
          <div className="component-wrapper">
            <ShiftForm />
          </div>
          <div className="component-wrapper">
            <ShiftRecords />
          </div>
          {user.role === 'admin' && (
            <div className="component-wrapper">
              <Link to="/admin" className="admin-link">Go To Admin Dashboard</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-section">
          <div className="component-wrapper">
            {showLogin ? <Login /> : <Register />}
          </div>
          <div className="component-wrapper">
            <button className="auth-button" onClick={toggleAuth}>
              {showLogin ? 'Not Registered? Click here!' : 'Already Registered? Click here!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Home;
