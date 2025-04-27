import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-10 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-cyan-400 mb-8 neon-text animate-fade-in-down">About NutriGlow 🍽️</h1>
      
      <div className="max-w-4xl bg-black/40 border border-cyan-400 rounded-2xl p-8 shadow-lg animate-fade-in">
        <p className="text-lg mb-6">
          <span className="text-cyan-300 font-bold">NutriGlow</span> is your smart kitchen companion that helps you manage your pantry, discover personalized recipes, and connect with fellow food lovers.
        </p>

        <h2 className="text-2xl font-semibold text-cyan-300 mb-4">✨ What We Offer</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li><span className="text-white font-semibold">Inventory Tracking:</span> Keep track of your ingredients with smart reminders before they expire.</li>
          <li><span className="text-white font-semibold">AI Recipe Suggestions:</span> Get recipe ideas based on what’s already in your pantry and your diet preferences.</li>
          <li><span className="text-white font-semibold">Social Features:</span> Share your favorite recipes, follow friends, and explore trending dishes!</li>
          <li><span className="text-white font-semibold">Smart Meal Planning:</span> Weekly plans tailored to your health goals and mood.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-cyan-300 mb-4">💡 Our Mission</h2>
        <p className="mb-6">
          We believe that cooking should be <span className="text-cyan-400 font-semibold">fun</span>, <span className="text-cyan-400 font-semibold">easy</span>, and <span className="text-cyan-400 font-semibold">zero-waste</span>. 
          Our goal is to empower everyone — from beginners to chefs — to eat better, waste less, and feel inspired every day.
        </p>

        <h2 className="text-2xl font-semibold text-cyan-300 mb-4">🚀 Built With</h2>
        <p className="mb-4">
          React, Node.js, Express, MongoDB, Tailwind CSS, and a sprinkle of AI magic ✨
        </p>
      </div>
    </div>
  );
};

export default About;
