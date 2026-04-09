import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// creating authentication context to manage user authentication state
const AuthContext = createContext();

// custom hook to use authentication context in components 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 
export const AuthProvider = ({ children }) => {
  // state for user information and loading status during authentication processes
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios base URL 
  axios.defaults.baseURL = 'http://localhost:3000/api'; 

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } 
    else {
      setLoading(false);
    }
  }, []);
// fetch user profile information from backend and update user state, also handles errors and loading state
  const fetchProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      setUser(response.data);
    } 
    catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } 
    finally {
      setLoading(false);
    }
  };
// login function to authenticate user with email and password, stores token on success and updates user state, handles errors and returns success status
  const login = async (email, password) => {
    try {
      const response = await axios.post('/user/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } 
    catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };
  // registration function to create new user account with name, email, and password, returns success status and message, handles errors
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/user/register', { name, email, password });
      return { success: true, message: response.data.message };
    } 
    catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // logout function to clear user authentication data and reset user state
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // value object containing user information
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchProfile
  };

 
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};