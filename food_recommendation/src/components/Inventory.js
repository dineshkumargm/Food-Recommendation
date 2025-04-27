import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: '',
    expirationDate: ''
  });
  const [editingItem, setEditingItem] = useState(null);
  const [updatedIngredient, setUpdatedIngredient] = useState({
    name: '',
    quantity: '',
    unit: '',
    expirationDate: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/${userId}`); 
        console.log(response.data)
        setIngredients(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    
    fetchInventory();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/inventory', {
        userId,
        name: newIngredient.name,
        quantity: newIngredient.quantity,
        unit: newIngredient.unit,
        expiry: newIngredient.expirationDate,  // Match the backend field
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`http://localhost:5000/api/inventory/${userId}`, {  // Also corrected this GET
        headers: { Authorization: `Bearer ${token}` },
      });
      setIngredients(res.data);
      setNewIngredient({ name: '', quantity: '', unit: '', expirationDate: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding ingredient:', err);
    }
  };
  

  const handleEdit = (item) => {
    setEditingItem(item);
    setUpdatedIngredient({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expirationDate: item.expirationDate || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/inventory/${editingItem._id}`, updatedIngredient, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedIngredients = ingredients.map((item) =>
        item._id === res.data._id ? res.data : item
      );
      setIngredients(updatedIngredients);
      setEditingItem(null);
      setUpdatedIngredient({ name: '', quantity: '', unit: '', expirationDate: '' });
    } catch (err) {
      console.error('Error updating ingredient:', err);
    }
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-10">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-cyan-400 neon-text">🍳 Your Inventory</h1>

      {/* Search Bar and Add Button */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Search Ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {showAddForm ? "Close Form" : "➕ Add Ingredient"}
        </button>
      </div>

      {/* Add New Ingredient Form (Animated) */}
      {showAddForm && (
        <div className="mb-8 animate-fade-in-down">
          <h2 className="text-2xl font-bold text-white mb-4">Add New Ingredient</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={newIngredient.name}
              onChange={handleInputChange}
              placeholder="Ingredient Name"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="quantity"
              value={newIngredient.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="unit"
              value={newIngredient.unit}
              onChange={handleInputChange}
              placeholder="Unit (e.g., grams, liters)"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="date"
              name="expirationDate"
              value={newIngredient.expirationDate}
              onChange={handleInputChange}
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <button
              type="submit"
              className="w-full p-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              Save Ingredient
            </button>
          </form>
        </div>
      )}

      {/* Edit Ingredient Form */}
      {editingItem && (
        <div className="mb-8 animate-fade-in-down">
          <h2 className="text-2xl font-bold text-white mb-4">Edit Ingredient</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              name="name"
              value={updatedIngredient.name}
              onChange={(e) => setUpdatedIngredient({ ...updatedIngredient, name: e.target.value })}
              placeholder="Ingredient Name"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="quantity"
              value={updatedIngredient.quantity}
              onChange={(e) => setUpdatedIngredient({ ...updatedIngredient, quantity: e.target.value })}
              placeholder="Quantity"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="unit"
              value={updatedIngredient.unit}
              onChange={(e) => setUpdatedIngredient({ ...updatedIngredient, unit: e.target.value })}
              placeholder="Unit (e.g., grams, liters)"
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="date"
              name="expirationDate"
              value={updatedIngredient.expirationDate}
              onChange={(e) => setUpdatedIngredient({ ...updatedIngredient, expirationDate: e.target.value })}
              className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <button
              type="submit"
              className="w-full p-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              Update Ingredient
            </button>
          </form>
        </div>
      )}

      {/* Display Inventory Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredIngredients.map((item) => (
          <div
            key={item._id}
            className="bg-black/40 border border-cyan-400 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300 animate-fade-in"
          >
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">{item.name}</h2>
            <p className="text-xl text-white mb-2">Quantity: <span className="font-bold">{item.quantity}</span></p>
            {item.expirationDate && (
              <p className="text-sm text-gray-400">
                Expires: {new Date(item.expirationDate).toLocaleDateString()}
              </p>
            )}
            <button
              onClick={() => handleEdit(item)}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;



