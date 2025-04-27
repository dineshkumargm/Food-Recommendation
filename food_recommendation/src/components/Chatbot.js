import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, resetChat, getRecipeRecommendations } from '../redux/chatSlice';

const Chatbot = () => {
  const dispatch = useDispatch();
  const { messages, recipes, status, step } = useSelector((state) => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, recipes]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    dispatch(addMessage({ sender: 'user', text: input }));
    setInput('');

    if (step === 'health') {
      const mood = messages.find((msg, idx) => msg.sender === 'user' && messages[idx - 1]?.text.includes('feeling'))?.text || 'neutral';
      const ingredients = messages.find((msg, idx) => msg.sender === 'user' && messages[idx - 1]?.text.includes('ingredients'))?.text || '';
      const health = input;

      dispatch(getRecipeRecommendations({ mood, ingredients, health }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-4 py-3 rounded-2xl shadow-md ${msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none neon-border'
                : 'bg-white text-white rounded-bl-none border border-cyan-400 bg-opacity-10 neon-border'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {status === 'loading' && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-3 rounded-2xl bg-white text-white shadow neon-border">
              Thinking...
            </div>
          </div>
        )}

        {recipes.length > 0 && (
          <div className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold text-cyan-400 neon-text">🍽️ Recommended Recipes:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe, index) => (
                <div
                  key={index}
                  className="bg-black/40 border border-cyan-400 rounded-2xl p-4 shadow-lg neon-border flex flex-col items-center"
                >
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                  <div className="text-sm">
                    <p className="font-semibold text-cyan-200 mb-1">Ingredients:</p>
                    <ul className="list-disc list-inside text-white mb-2">
                      {recipe.ingredients.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <p className="font-semibold text-cyan-200 mb-1">Steps:</p>
                    <ol className="list-decimal list-inside text-white">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black bg-opacity-50 backdrop-blur border-t border-cyan-800">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            placeholder="Type your message..."
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg shadow-lg transition disabled:bg-gray-500"
            disabled={status === 'loading'}
          >
            Send
          </button>
        </form>
        <button
          onClick={() => dispatch(resetChat())}
          className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition"
        >
          Reset Chat
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
