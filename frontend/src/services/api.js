import axios from 'axios';

const API = axios.create({ baseURL: 'http://10.19.20.135:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (userData) => API.post('/auth/register-user', userData);
export const loginUser = (credentials) => API.post('/auth/login-user', credentials);
export const updatePassword = (passwordData) => API.put('/auth/update-password', passwordData);
export const getProfile = () => API.get('/auth/get-profile');

export const createOrUpdateShiftRecord = (shiftData) => API.post('/shift/create-or-update-shift-record', shiftData);
export const getShiftRecords = (startDate, endDate) => API.get(`/shift/get-shift-records?startDate=${startDate}&endDate=${endDate}`);
export const getShiftTypes = () => API.get('/shift/get-shift-types');
export const deleteShiftRecord = (date) => API.delete('/shift/delete-shift-record', { data: { date } });

export const addShiftType = (shiftTypeData) => API.post('/admin/add-shift-type', shiftTypeData);
export const updateShiftType = (shiftTypeId, shiftTypeData) => API.put(`/admin/update-shift-type?shiftTypeId=${shiftTypeId}`, shiftTypeData);
export const deleteShiftType = (shiftTypeId) => API.delete(`/admin/delete-shift-type/${shiftTypeId}`);
export const getUsers = () => API.get('/admin/get-all-users');
export const removeUser = (userId) => API.delete(`/admin/remove-user/${userId}`);
export const modifyShiftRecord = (recordId, shiftData) => API.put(`/admin/modify-shift-record/${recordId}`, shiftData);
export const calculateAllowances = (allowanceData) => API.post('/admin/calculate-allowances', allowanceData);
export const getShiftRecordsForUser = (startDate, endDate, userId) => API.get(`/admin/get-shift-records-for-user?startDate=${startDate}&endDate=${endDate}&userId=${userId}`);
