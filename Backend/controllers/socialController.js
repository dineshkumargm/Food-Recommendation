const User = require('../models/User');
const Post = require('../models/Post');
const Recipe = require('../models/Recipe');

// Follow a user
exports.followUser = async (req, res) => {
  const userId = req.user.id;
  const { targetUserId } = req.body;

  if (userId === targetUserId) return res.status(400).json({ msg: "Can't follow yourself" });

  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetUserId);

    if (!target) return res.status(404).json({ msg: "User not found" });

    if (!user.following.includes(targetUserId)) {
      user.following.push(targetUserId);
      target.followers.push(userId);
    }

    await user.save();
    await target.save();
    res.json({ msg: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unfollow
exports.unfollowUser = async (req, res) => {
  const userId = req.user.id;
  const { targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } });
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } });

    res.json({ msg: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a post
exports.createPost = async (req, res) => {
  const userId = req.user.id;
  const { recipeId, caption } = req.body;

  try {
    const post = new Post({
      user: userId,
      recipe: recipeId,
      caption
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like/unlike post
exports.toggleLike = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const index = post.likes.indexOf(userId);
    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    await post.save();
    res.json({ msg: "Toggled like" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View feed (posts from followed users)
exports.getFeed = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const posts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate('recipe');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
