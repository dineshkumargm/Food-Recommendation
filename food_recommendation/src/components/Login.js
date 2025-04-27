import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return setMessage('All fields are required.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Login successful!');
      navigate('/home');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f0c29] to-[#302b63] text-white relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse -top-32 -left-32"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-30 rounded-full blur-2xl animate-spin-slow -bottom-20 -right-20"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/20"
      >
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-neon mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 bg-black/40 text-white border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-300 shadow-inner"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-black/40 text-white border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300 shadow-inner"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold shadow-lg shadow-pink-500/50 transition-all hover:shadow-pink-400/70"
          >
            Log In
          </motion.button>
        </form>
        <p className="text-sm text-gray-300 mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-400 hover:underline">
            Register
          </Link>
        </p>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-red-400"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
