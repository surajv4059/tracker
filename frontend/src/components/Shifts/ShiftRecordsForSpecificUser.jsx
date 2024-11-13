import React, { useState, useEffect } from 'react';
import { getShiftRecordsForUser, getUsers } from '../../services/api'; 
import './shift-records-specific.css';
import { toast } from 'react-toastify';

const AdminShiftRecords = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shiftRecords, setShiftRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const [workLocationCounts, setWorkLocationCounts] = useState({
    office: 0,
    home: 0,
    PL: 0,
    UPL: 0,
    CO: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
      } catch (error) {
        setError('Failed to fetch users.');
        toast.error(error.message);
      }
    };

    fetchUsers();
  }, []); 

  const handleFetchRecords = async () => {
    if (!startDate || !endDate || !selectedUser) {
      setError('Start date, end date, and user selection are required.');
      return;
    }

    try {
      const { data } = await getShiftRecordsForUser(startDate, endDate, selectedUser);
      setShiftRecords(data);
      
      // Calculate counts for work locations
      const counts = data.reduce((acc, record) => {
        if (record.workLocation === 'office') {
          acc.office += 1;
        } else if (record.workLocation === 'home') {
          acc.home += 1;
        } else if (record.workLocation === 'PL') {
          acc.PL += 1;
        } else if (record.workLocation === 'UPL') {
          acc.UPL += 1;
        } else if (record.workLocation === 'CO') {
          acc.CO += 1;
        }
        return acc;
      }, { office: 0, home: 0, PL: 0, UPL: 0 , CO: 0});
      
      setWorkLocationCounts(counts);
      
      if (data.length === 0) {
        toast.info("No records to fetch.");
      }
    } catch (error) {
      setError('Failed to fetch shift records.');
      toast.error(error.message);
    }
  };

  return (
    <div className="shift-records-specific-container">
      <h2>Fetch Shift Records for a User</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFetchRecords();
        }}
        className="fetch-form"
      >
        <div className="form-group">
          <label>
            User:
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} 
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="form-input"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="form-input"
            />
          </label>
        </div>
        <button type="submit" className="submit-button">Fetch Records</button>
      </form>
  
      {error && <p className="error-message">{error}</p>}
  
      {shiftRecords.length > 0 && (
        <>
          <div className="work-location-counts">
            <h3>Work Location Counts:</h3>
            <p>Office: {workLocationCounts.office}</p>
            <p>Home: {workLocationCounts.home}</p>
            <p>Planned Leave (PL): {workLocationCounts.PL}</p>
            <p>Unplanned Leave (UPL): {workLocationCounts.UPL}</p>
            <p>Compensatory off (CO): {workLocationCounts.CO}</p>
          </div>
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Shift Type</th>
                <th>Work Location</th>
                <th>Shift Allowance</th>
                <th>Travel Allowance</th>
              </tr>
            </thead>
            <tbody>
              {shiftRecords.map((record) => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.shiftType}</td>
                  <td>{record.workLocation}</td>
                  <td>{record.shiftAllowance}</td>
                  <td>{record.travelAllowance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminShiftRecords;
