const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User'); 

router.post('/register', register);
router.post('/login', login);

// Route to search for a user by username
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    console.error('Error searching for user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// server-side route
router.get('/search-users', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ message: 'No query provided.' });

    const users = await User.find({
      username: { $regex: query, $options: 'i' }, // Case insensitive
    }).select('-password'); // Don't send password

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});
  

module.exports = router;
