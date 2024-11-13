import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updatePassword } from '../services/api';
import { toast } from 'react-toastify';
import './profile.css';

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    try {
      await updatePassword({ currentPassword, newPassword });
      toast.success("Password updated successfully")
      setCurrentPassword(''); 
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response.data.error)
      console.error('Error updating password:', error.response.data.error);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-header">User Profile</h1>
      {profile ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <button className="profile-button" onClick={logout}>Logout</button>
          {!showPasswordForm && (
            <button className="profile-button" onClick={() => setShowPasswordForm(true)}>
              Update Password
            </button>
          )}
          {showPasswordForm && (
            <>
              <h2>Update Password</h2>
              <form onSubmit={handleUpdatePassword} className="password-form">
                <div>
                  <label htmlFor="currentPassword">Current Password:</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword">New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="profile-button">Submit</button>
                <button 
                  type="button" 
                  className="profile-button" 
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default Profile;

