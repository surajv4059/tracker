
import React, { useState, useEffect } from 'react';
import { createOrUpdateShiftRecord, getShiftTypes } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './shift-form.css';

const ShiftForm = () => {
  const [shiftType, setShiftType] = useState('');
  const [workLocation, setWorkLocation] = useState('office');
  const [date, setDate] = useState('');
  const [shiftTypes, setShiftTypes] = useState([]);

  useEffect(() => {
    const fetchShiftTypes = async () => {
      const { data } = await getShiftTypes(); 
      setShiftTypes(data);
    };
    fetchShiftTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrUpdateShiftRecord({ date, shiftType, workLocation });
      toast.success('Shift record updated successfully');
    } catch (error) {
      toast.error('Failed to update shift record');
    }
  };
  return (
    <form className="shift-form-container" onSubmit={handleSubmit}>
      <h2>Update Shift Record</h2>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        Shift Type:
        <select value={shiftType} onChange={(e) => setShiftType(e.target.value)} required>
          <option value="">Select Shift Type</option>
          {shiftTypes.map((type) => (
            <option key={type._id} value={type.name}>{type.name}</option>
          ))}
        </select>
      </label>
      <label>
        Work Location:
        <select value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} required>
          <option value="office">Office</option>
          <option value="home">Home</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ShiftForm;
