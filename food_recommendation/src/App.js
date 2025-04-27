import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Inventory from './components/Inventory';
import './index.css';
import Chatbot from './components/Chatbot';
import RecipesPage from './components/RecipePage';
import PostRecipe from './components/PostRecipe';
import SearchUsersPage from './components/SearchUsersPage';
import About from './components/about';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/post" element={<PostRecipe />} />
        <Route path="/search-users" element={<SearchUsersPage />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
};

export default App;
