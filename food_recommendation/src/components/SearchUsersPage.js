import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SearchUsersPage = () => {
  const userId = useSelector((state) => state.auth.user?.id); 
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const navigate = useNavigate();

  const handleUserSearch = async () => {
    if (!userSearchQuery.trim()) return;
  
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/user/${userSearchQuery}`);
      console.log(response.data);
      setFoundUser(response.data);
      
      // Check if the current user is following the searched user
      if (response.data.followers.includes(userId)) {
        // User is already following, set followedUsers to include this user
        setFollowedUsers([response.data.id]);
      } else {
        // User is not following, so clear followedUsers state
        setFollowedUsers([]);
      }
  
    } catch (err) {
      console.error('User not found:', err);
      setFoundUser(null);
      setFollowedUsers([]);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      console.log('Follow request body:', { currentUserId: userId, targetUserId });

      await axios.post('http://localhost:5000/api/social/follow', {
        currentUserId: userId,
        targetUserId,
      });

      setFollowedUsers((prev) => [...prev, targetUserId]); // ✅ toggle follow
      alert('Followed successfully!');
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      console.log('Unfollow request body:', {
        userId: userId,  // 👈 change to userId instead of currentUserId
        targetUserId,
      });
  
      const response = await axios.post('http://localhost:5000/api/social/unfollow', {
        userId: userId,  // 👈 change to userId
        targetUserId,
      });
  
      console.log(response.data);
      setFollowedUsers((prev) => prev.filter((id) => id !== targetUserId));
      alert('Unfollowed successfully!');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="mb-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-bold tracking-wide transition-all duration-200"
        >
          ← Back to Dashboard
        </button>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            className="flex-1 p-3 text-lg bg-gray-800 border border-pink-500 rounded-lg placeholder-pink-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Search username..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
          <button
            onClick={handleUserSearch}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-bold tracking-wide transition-all duration-200"
          >
            Search
          </button>
        </div>

        {foundUser && (
      <div className="bg-gray-800 p-6 rounded-2xl border border-pink-600 shadow-lg flex justify-between items-center">
        <p className="text-lg">
          Username: <span className="font-bold text-pink-400">{foundUser.username}</span>
        </p>
        {followedUsers.includes(foundUser.id) ? (
          <button
            onClick={() => handleUnfollow(foundUser.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() => handleFollow(foundUser.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            Follow
          </button>
        )}
  </div>
)}

      </div>
    </div>
  );
};

export default SearchUsersPage;
