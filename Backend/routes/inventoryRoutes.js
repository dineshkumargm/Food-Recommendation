const express = require('express');
const Inventory = require('../models/inventoryModel');
const router = express.Router();

// GET inventory for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const inventoryItems = await Inventory.find({ userId });
    res.json(inventoryItems);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ message: 'Server error fetching inventory' });
  }
});


// Add a new inventory item
router.post('/', async (req, res) => {
  const { userId, name, quantity, unit, expiry } = req.body;
  
  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  console.log('Received POST data:', req.body);  // Debug log to check received data

  if (!name || !quantity || !unit || !expiry) {
    console.error('Missing fields in the request:', req.body);  // Debug log
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Ensure quantity is a number
  if (isNaN(quantity)) {
    console.error('Invalid quantity, must be a number:', quantity);  // Debug log
    return res.status(400).json({ message: 'Quantity must be a number.' });
  }

  const newInventory = new Inventory({
    userId,
    name,
    quantity,
    unit,
    expirationDate: expiry
  });

  try {
    const savedInventory = await newInventory.save();
    console.log('Saved inventory item:', savedInventory);  // Debug log
    res.status(201).json(savedInventory);
  } catch (error) {
    console.error('Error saving inventory item:', error.message);  // Debug log
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body, // Update all fields that are provided in the body
      { new: true } // Return the updated inventory item
    );

    if (!updatedInventory) {
      console.error('Inventory item not found for update:', req.params.id);  // Debug log
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    console.log('Updated inventory item:', updatedInventory);  // Debug log
    res.json(updatedInventory); // Respond with the updated item
  } catch (error) {
    console.error('Error updating inventory item:', error.message);  // Debug log
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory item
// DELETE an inventory item by ID
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    await Inventory.findByIdAndDelete(itemId);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting inventory item:', err);
    res.status(500).json({ message: 'Server error deleting item' });
  }
});


module.exports = router;
