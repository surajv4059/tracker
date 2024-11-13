import React, { useState } from 'react';
import { getShiftRecords, deleteShiftRecord } from '../../services/api'; // Import deleteShiftRecord
import './shift-records.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShiftRecords = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shiftRecords, setShiftRecords] = useState([]);
  const [error, setError] = useState('');
  const [locationCounts, setLocationCounts] = useState({
    office: 0,
    home: 0,
    PL: 0,
    UPL: 0,
    CO: 0
  });

  const handleFetchRecords = async () => {
    if (!startDate || !endDate) {
      setError('Start date and end date are required.');
      return;
    }
 
    try {
      const { data } = await getShiftRecords(startDate, endDate);
      setShiftRecords(data);
      if (data.length === 0) {
        toast.info('No Records to Display');
      }
      
      // Calculate counts from workLocation
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
      }, { office: 0, home: 0, PL: 0, UPL: 0, CO: 0 });
      
      setLocationCounts(counts);
      setError('');
    } catch (error) {
      setError('Failed to fetch shift records.');
      console.error(error);
    }
  };

  const handleDeleteRecord = async (date) => {
    try {
      await deleteShiftRecord(date);
      toast.success('Shift record deleted successfully.');
      handleFetchRecords(); // Re-fetch records after deletion
    } catch (error) {
      toast.error('Failed to delete shift record.');
      console.error(error);
    }
  };

  return (
    <div className="shift-records-container">
      <h2>Shift Records</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFetchRecords();
        }}
      >
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Fetch Records</button>
      </form>
      
      {error && <p className="error-message">{error}</p>}
      
      {shiftRecords.length > 0 && (
        <>
          <div className="work-location-counts">
            <h3>Work Location Counts:</h3>
            <p>Office: {locationCounts.office}</p>
            <p>Home: {locationCounts.home}</p>
            <p>Planned Leave (PL): {locationCounts.PL}</p>
            <p>Unplanned Leave (UPL): {locationCounts.UPL}</p>
            <p>Compensatory off (CO): {locationCounts.CO}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Shift Type</th>
                <th>Work Location</th>
                <th>Shift Allowance</th>
                <th>Travel Allowance</th>
                <th>Actions</th> {/* Add Actions column */}
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
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteRecord(record.date)} // Pass the date to delete
                    >
                      Delete
                    </button>
                  </td> {/* Add Delete button */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ShiftRecords;

