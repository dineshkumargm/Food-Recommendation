import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SearchUsersPage = () => {
  const userId = useSelector((state) => state.auth.user?.id); // Check if userId is available
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }

    const fetchUsers = async () => {
      if (!userSearchQuery.trim()) {
        setFoundUsers([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/auth/search-users?query=${userSearchQuery}`);
        setFoundUsers(response.data);
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setFoundUsers([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 400); // debounce by 400ms

    return () => clearTimeout(delayDebounce);
  }, [userSearchQuery, userId]); // Re-run when userId changes

  const handleFollow = async (targetUserId) => {
    console.log('Logged-in user ID:', userId); // Debug log
    console.log('Target user ID:', targetUserId); // Debug log

    if (!userId) {
      console.error('Cannot follow user, user ID is missing.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/social/follow', {
        currentUserId: userId,
        targetUserId,
      });
      setFollowedUsers((prev) => [...prev, targetUserId]);
      alert('Followed successfully!');
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    console.log('Logged-in user ID:', userId); // Debug log
    console.log('Target user ID:', targetUserId); // Debug log

    if (!userId) {
      console.error('Cannot unfollow user, user ID is missing.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/social/unfollow', {
        userId, // The logged-in user's ID
        targetUserId, // The user to unfollow
      });
      setFollowedUsers((prev) => prev.filter((id) => id !== targetUserId));
      alert('Unfollowed successfully!');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 p-8 text-white">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="mb-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-bold tracking-wide transition-all duration-200"
        >
          ← Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-1 p-3 text-lg bg-gray-800 border border-pink-500 rounded-lg placeholder-pink-300 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Search username..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
        </div>

        {foundUsers.length > 0 && (
          <div className="space-y-4">
            {foundUsers.map((user) => (
              <div
                key={user._id}
                className="bg-gray-800 p-6 rounded-2xl border border-pink-600 shadow-lg flex flex-col sm:flex-row justify-between items-center"
              >
                <p className="text-lg">
                  Username: <span className="font-bold text-pink-400">{user.username}</span>
                </p>
                {followedUsers.includes(user._id) || user.followers.includes(userId) ? (
                  <button
                    onClick={() => handleUnfollow(user._id)} // Pass correct targetUserId
                    className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(user._id)} // Pass correct targetUserId
                    className="mt-4 sm:mt-0 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Follow
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsersPage;
