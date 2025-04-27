const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route    POST /api/social/follow
// @desc     Follow a user
// @access   Protected (or Public if testing)
router.post('/follow', async (req, res) => {
  const { currentUserId, targetUserId } = req.body;

  if (!currentUserId || !targetUserId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      await currentUser.save();
    }

    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      await targetUser.save();
    }

    res.json({ message: "User followed successfully" });
  } catch (err) {
    console.error('Error following user:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route    POST /api/social/unfollow
// @desc     Unfollow a user
// @access   Protected (or Public if testing)
router.post('/unfollow', async (req, res) => {
  console.log('Unfollow request received:', req.body);
  const { userId, targetUserId } = req.body;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    targetUser.followers = targetUser.followers.filter(
      (followerId) => followerId.toString() !== userId
    );

    user.following = user.following.filter(
      (followingId) => followingId.toString() !== targetUserId
    );

    await targetUser.save();
    await user.save();
    
    res.json({ msg: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
