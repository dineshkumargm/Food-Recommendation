import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    is_gym_person: false,
    is_in_diet: false,
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return setMessage('Username and password are required.');
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registered successfully!');
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f2027] to-[#2c5364] text-white relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-green-400 opacity-20 rounded-full blur-3xl animate-pulse -top-32 -left-32"></div>
      <div className="absolute w-[400px] h-[400px] bg-lime-500 opacity-30 rounded-full blur-2xl animate-spin-slow -bottom-20 -right-20"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/20"
      >
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-neon mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="w-full px-4 py-2 bg-black/40 text-white border border-lime-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 placeholder-gray-300 shadow-inner"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full px-4 py-2 bg-black/40 text-white border border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-300 shadow-inner"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_gym_person"
              checked={formData.is_gym_person}
              onChange={handleChange}
              className="h-5 w-5 accent-lime-500 focus:ring-2 focus:ring-lime-400"
            />
            <label className="text-gray-300">Are you a gym person?</label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_in_diet"
              checked={formData.is_in_diet}
              onChange={handleChange}
              className="h-5 w-5 accent-emerald-500 focus:ring-2 focus:ring-emerald-400"
            />
            <label className="text-gray-300">Are you on a diet?</label>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-green-400 via-lime-500 to-emerald-500 text-white py-2 rounded-lg font-semibold shadow-lg shadow-lime-400/50 transition-all hover:shadow-lime-300/70"
          >
            Register
          </motion.button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-lime-400 hover:underline">
            Login
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

export default Register;
