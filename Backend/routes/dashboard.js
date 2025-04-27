const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Get user dashboard with user info and recipes from following
router.get('/:userId', async (req, res) => {
  try {
    // Fetch user and populate 'followers' and 'following' fields
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username')  // populate followers with usernames
      .populate('following', 'username'); // populate following with usernames
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the dashboard data including user info (without filtering recipes)
    res.json({
      user: {
        username: user.username,
        followingCount: user.following.length,
        followersCount: user.followers.length,
      },
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Error loading user info' });
  }
});

module.exports = router;
