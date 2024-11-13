import React, { useState, useEffect } from 'react';
import { addShiftType, updateShiftType, deleteShiftType, getShiftTypes } from '../../services/api';
import './manage-shift-types.css';
import { toast } from 'react-toastify';

const ManageShiftTypes = () => {
  const [shiftTypes, setShiftTypes] = useState([]);
  const [name, setName] = useState('');
  const [allowance, setAllowance] = useState(0);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchShiftTypes = async () => {
      const { data } = await getShiftTypes();
      setShiftTypes(data);
    };
    fetchShiftTypes();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addShiftType({ name, allowance });
      toast.success('Added shift successfully');
      setName('');
      setAllowance(0);
      const { data } = await getShiftTypes();
      setShiftTypes(data);
    } catch (error) {
      toast.error('Failed to add shift type');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateShiftType(editId, { name, allowance });
      toast.success('Shift type updated successfully');
      setEditId(null);
      setName('');
      setAllowance(0);
      const { data } = await getShiftTypes();
      setShiftTypes(data);
    } catch (error) {
      toast.error('Failed to update shift type');
    }
  };

  const handleDelete = async (shiftTypeId) => {
    try {
      await deleteShiftType(shiftTypeId);
      toast.success('Shift type deleted successfully');
      const { data } = await getShiftTypes();
      setShiftTypes(data);
    } catch (error) {
      toast.error('Failed to delete shift type');
    }
  };

  return (
    <div className="manage-shift-types-container">
      <h2>Manage Shift Types</h2>
      <form onSubmit={editId ? handleUpdate : handleAdd} className="shift-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Shift Type Name"
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Allowance"
            value={allowance}
            onChange={(e) => setAllowance(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          {editId ? 'Update' : 'Add'} Shift Type
        </button>
      </form>
      <ul className="shift-list">
        {shiftTypes.map((type) => (
          <li key={type._id} className="shift-item">
            <span className="shift-details">{type.name} - {type.allowance}</span>
            <div className="shift-actions">
              <button
                onClick={() => {
                  setName(type.name);
                  setAllowance(type.allowance);
                  setEditId(type._id);
                }}
                className="edit-button"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(type._id)} className="delete-button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageShiftTypes;
