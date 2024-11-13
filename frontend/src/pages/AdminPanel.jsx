
import React from 'react';
import ManageShiftTypes from '../components/Admin/ManageShiftTypes';
import ManageUsers from '../components/Admin/ManageUsers';
import CalculateAllowances from '../components/Admin/CalculateAllowances';
import AdminShiftRecords from '../components/Shifts/ShiftRecordsForSpecificUser';
import { Link } from 'react-router-dom';
import './admin-panel.css';
import GenerateReports from '../components/Admin/GenerateReports';


const AdminPanel = () => {
  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>
      <ul className="admin-panel-list">
        <li className="admin-panel-item"><AdminShiftRecords /></li>
        <li className="admin-panel-item"><CalculateAllowances /></li>
        <li className='admin-panel-item'><GenerateReports /></li>
        <li className="admin-panel-item"><ManageShiftTypes /></li>
        <li className="admin-panel-item"><ManageUsers /></li>
      </ul>
      <div className="component-wrapper">
              <Link to="/" className="admin-link">Go To Home</Link>
      </div>
    </div>
  );
}

export default AdminPanel;
