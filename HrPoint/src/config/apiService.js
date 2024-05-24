/* eslint-disable prettier/prettier */
// apiService.js
import axios from 'axios';
import { getToken, clearToken } from './asyncStorage';

const baseURL = 'http://192.168.1.19:8086'; // Replace with your backend URL

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseURL}/api/auth/signin`, credentials, { timeout: 5000 });
    return response; // Instead of returning just the token, return the entire response
  } catch (error) {
    throw new Error('Login failed'); // You can handle errors more specifically if needed
  }
};

axios.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Function to fetch user profile
export const fetchEmployeeById = async (id, token) => {
  try {
    console.log(`Fetching employee with ID: ${id} using token: ${token}`);
    const response = await axios.get(`${baseURL}/employee/getone/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Ensure the token is passed correctly
      }
    });
    console.log('Fetch successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee:', error.response ? error.response.data : error);
    throw error;
  }
};

// Function to fetch adminprofile
export const fetchAdminById = async (id, token) => {
  try {
    console.log(`Fetching admin with ID: ${id} using token: ${token}`);
    const response = await axios.get(`${baseURL}/administrateur/getone/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Ensure the token is passed correctly
      }
    });
    console.log('Fetch successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee:', error.response ? error.response.data : error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = await getToken();
    if (token) {
      await axios.post(`${baseURL}/api/auth/signout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await clearToken(); // Use the clearToken function
    }
  } catch (error) {
    console.error('Logout failed:', error.response ? error.response.data : error);
    throw error;
  }
};



// export const api = axios.create({
//   baseURL: baseUrl,
//   headers: {
//     'Content-Type': 'application/json',
//     // Add any other custom headers as needed
//   },
// });
