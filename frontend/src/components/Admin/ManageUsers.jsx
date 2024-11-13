import React, { useState, useEffect } from 'react';
import { getUsers, removeUser } from '../../services/api';
import './manage-users.css';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleRemove = async (userId) => {
    try {
      await removeUser(userId);
      toast.success('User removed successfully');
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <ul className="user-list">
        {users.map(user => (
          <li key={user._id} className="user-item">
            <span className="user-info">
              {user.name} ({user.email})
            </span>
            <button 
              onClick={() => handleRemove(user._id)} 
              className="remove-button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
