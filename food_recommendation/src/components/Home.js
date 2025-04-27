import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // For popup modal
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followType, setFollowType] = useState(''); // 'followers' or 'following'
  const [followUsers, setFollowUsers] = useState([]);



  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/dashboard/${userId}`);
          setUserData(res.data);
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          setError('Failed to load user data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      const fetchUserPosts = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/recipes/user/${userId}`);
          setUserPosts(res.data);
          console.log(res.data);
        } catch (err) {
          console.error('Failed to fetch user posts:', err);
        }
      };

      fetchUserData();
      fetchUserPosts();
    }
  }, [userId, navigate]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleShowFollow = async (type) => {
    setFollowType(type);
    setShowFollowModal(true);
  
    const ids = type === 'followers' ? followers : following;
  
    try {
      const res = await axios.post('http://localhost:5000/api/auth/get-users-by-ids', { ids });
      setFollowUsers(res.data); // assuming res.data is an array of { _id, username }
    } catch (err) {
      console.error('Failed to fetch users by IDs:', err);
      setFollowUsers([]); // fallback
    }
  };
  
  
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${postId}`);
      setUserPosts(userPosts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete the recipe. Please try again.');
    }
  };

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  const { username, following, followers } = userData.user || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-5 bg-black/30 md:bg-black bg-opacity-60 backdrop-blur-md border-b border-gray-700 shadow-lg">
        <h1 className="text-3xl font-bold text-cyan-400 neon-text">🍽️ NutriGlow</h1>
        <button
          className="block md:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate('/inventory')} className="neon-button p-2">🧂 Inventory</button>
          <button onClick={() => navigate('/chatbot')} className="neon-button p-2">🤖 Chat with AI</button>
          <button onClick={() => navigate('/recipes')} className="neon-button p-2">🍽️ Recipes</button>
          <button onClick={() => navigate('/about')} className="neon-button p-2">ℹ️ About</button>
          <button onClick={handleLogout} className="neon-button text-red-400 border-red-400 hover:text-white p-2">🚪 Logout</button>
          
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-black/90 via-gray-900/90 to-slate-900/90 shadow-2xl z-50 p-6 flex flex-col gap-6">
            <button className="self-end text-white text-2xl" onClick={() => setMenuOpen(false)}>✕</button>
            <button onClick={() => { navigate('/inventory'); setMenuOpen(false); }} className="neon-button">🧂 Inventory</button>
            <button onClick={() => { navigate('/chatbot'); setMenuOpen(false); }} className="neon-button">🤖 Chat with AI</button>
            <button onClick={() => { navigate('/recipes'); setMenuOpen(false); }} className="neon-button">🍽️ Recipes</button>
            <button onClick={() => { navigate('/about'); setMenuOpen(false); }} className="neon-button">ℹ️ About</button>
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="neon-button text-red-400 border-red-400 hover:text-white">🚪 Logout</button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="px-4 py-10 max-w-7xl mx-auto flex flex-col gap-12">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.2)] flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-cyan-300 neon-text">Welcome, {username} 👋</h2>
          </div>
          <div className="text-center md:text-right flex flex-col gap-2">
          <p
            className="text-gray-300 cursor-pointer hover:underline"
            onClick={() => handleShowFollow('followers')}
          >
            <span className="font-bold text-cyan-400">{followers.length}</span> Followers
          </p>
          <p
            className="text-gray-300 cursor-pointer hover:underline"
            onClick={() => handleShowFollow('following')}
          >
            <span className="font-bold text-cyan-400">{following.length}</span> Following
          </p>


            <button
              onClick={() => navigate('/post')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-bold hover:scale-105 transition"
            >
              ➕ Post New Recipe
            </button>
            <button onClick={() => navigate('/search-users')} className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold mb-6">Find Users to Follow</button>

          </div>
        </motion.section>

        {/* My Recipes Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h3 className="text-3xl font-bold text-pink-400 neon-text text-center mb-10">🍳 My Recipes</h3>

          {userPosts.length === 0 ? (
            <p className="text-center text-gray-400">You have not posted any recipes yet.</p>
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {userPosts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedPost(post)}
                  className="cursor-pointer flex flex-col justify-between p-6 bg-black/40 border border-pink-400 rounded-2xl hover:shadow-[0_0_20px_rgba(255,105,180,0.5)] transition-all hover:scale-105"
                >
                  <h4 className="text-2xl text-pink-300 font-bold mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-400">{post.description || 'No description provided.'}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {showFollowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 via-black to-slate-900 p-8 rounded-3xl border border-cyan-400 shadow-2xl w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-cyan-400">
                {followType === 'followers' ? 'Followers' : 'Following'}
              </h2>
              <button
                onClick={() => setShowFollowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Show list */}
            <ul className="space-y-4">
              {followUsers.map((user) => (
                <li key={user._id} className="bg-white/10 rounded-xl p-4 text-gray-300">
                  {user.username}
                </li>
              ))}
            </ul>

            {/* If no followers/following */}
            {(followType === 'followers' && followers.length === 0) && (
              <p className="text-center text-gray-400">No followers yet.</p>
            )}
            {(followType === 'following' && following.length === 0) && (
              <p className="text-center text-gray-400">You are not following anyone yet.</p>
            )}
          </div>
        </div>
      )}


      {/* Popup Modal for Recipe Details */}
      {selectedPost && (
  <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
    <div className="bg-gradient-to-br from-gray-900 via-black to-slate-900 p-8 rounded-3xl border border-pink-400 shadow-2xl w-full sm:w-11/12 md:w-1/2 lg:w-2/3 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-400">{selectedPost.title}</h2>
        <button
          onClick={() => setSelectedPost(null)}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>
      </div>
      <p className="text-gray-300 mb-6">{selectedPost.description || 'No description provided.'}</p>
      
      {selectedPost.ingredients && selectedPost.ingredients.length > 0 ? (
        <ul className="list-disc list-inside text-gray-300 mb-6">
          {selectedPost.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300 mb-6">No ingredients provided.</p>
      )}

      {selectedPost.steps && selectedPost.steps.length > 0 ? (
        <ol className="list-decimal list-inside text-gray-300 mb-6">
          {selectedPost.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-300 mb-6">No steps provided.</p>
      )}
      
      <button
        onClick={() => {
          handleDeletePost(selectedPost._id);
          setSelectedPost(null);
        }}
        className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-2xl hover:scale-105 transition"
      >
        🗑️ Delete Recipe
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
