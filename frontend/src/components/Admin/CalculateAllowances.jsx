import React, { useState, useEffect } from 'react';
import { calculateAllowances, getUsers } from '../../services/api';
import './calculate-allowance.css';
import { toast } from 'react-toastify';


const CalculateAllowances = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
        
        if (data.length > 0) {
          setSelectedUserId(data[0]._id);
        }
      } catch (error) {
        toast.alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await calculateAllowances({ userId: selectedUserId, month, year });
      setResult(data);
    } catch (error) {
      alert('Failed to calculate allowances');
    }
  };

  return (
    <div className="calculate-allowance-container">
      <h2>Calculate Allowances</h2>
      <form onSubmit={handleSubmit} className="calculation-form">
        <div className="form-group">
          <label>
            User:
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select User</option>
              
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Month (1-12):
            <input
              type="number"
              placeholder="Month (1-12)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="form-input"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Year:
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="form-input"
            />
          </label>
        </div>
        <button type="submit" className="submit-button">Calculate</button>
      </form>
      {result && (
        <div className="result-container">
          <h3>Allowances</h3>
          <p>Total Shift Allowance: {result.totalShiftAllowance}</p>
          <p>Total Travel Allowance: {result.totalTravelAllowance}</p>
	  <p>Combined Allowance: {result.totalShiftAllowance + result.totalTravelAllowance}</p>
          <p>Work From Office Days: {result.workFromOfficeCount}</p>
          <p>Work From Home Days: {result.workFromHomeCount}</p>
        </div>
      )}
    </div>
  );
};

export default CalculateAllowances;
