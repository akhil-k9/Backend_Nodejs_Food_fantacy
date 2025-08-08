// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Product = require('../models/Product');
// const Cart = require('../models/Cart');

// // ✅ Helper to sanitize email
// const sanitizeEmail = (email) => email.trim().toLowerCase();

// // ✅ Add item to cart
// router.post('/add', async (req, res) => {
//   const { email, productId, quantity } = req.body;
//   if (!email || !productId) {
//     return res.status(400).json({ message: 'Email and Product ID are required' });
//   }

//   const sanitizedEmail = sanitizeEmail(email);
//   const qty = parseInt(quantity) || 1;
//   if (qty < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

//   try {
//     const productExists = await Product.findById(productId);
//     if (!productExists) return res.status(404).json({ message: 'Product not found' });

//     let user = await User.findOne({ email: sanitizedEmail });
//     if (!user) user = await User.create({ email: sanitizedEmail });

//     let cart = await Cart.findOne({ user: user._id });
//     if (!cart) cart = new Cart({ user: user._id, items: [] });

//     const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity += qty;
//     } else {
//       cart.items.push({ product: productId, quantity: qty });
//     }

//     await cart.save();
//     const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
//     res.status(200).json({ message: 'Item added to cart', cart, cartCount });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Get user's cart
// router.get('/:email', async (req, res) => {
//   const sanitizedEmail = sanitizeEmail(req.params.email);

//   try {
//     const user = await User.findOne({ email: sanitizedEmail });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const cart = await Cart.findOne({ user: user._id }).populate('items.product');
//     res.status(200).json(cart || { items: [] });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Clear entire cart
// router.delete('/:email', async (req, res) => {
//   const sanitizedEmail = sanitizeEmail(req.params.email);

//   try {
//     const user = await User.findOne({ email: sanitizedEmail });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     await Cart.findOneAndDelete({ user: user._id });
//     res.status(200).json({ message: 'Cart cleared' });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Delete selected item from cart (BODY version)
// router.delete('/item', async (req, res) => {
//   const { email, productId } = req.body; // ✅ Now reading from body
//   if (!email || !productId) {
//     return res.status(400).json({ message: 'Email and Product ID are required' });
//   }

//   const sanitizedEmail = sanitizeEmail(email);

//   try {
//     const user = await User.findOne({ email: sanitizedEmail });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const cart = await Cart.findOne({ user: user._id });
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     const beforeCount = cart.items.length;
//     cart.items = cart.items.filter(item => item.product.toString() !== productId);

//     if (cart.items.length === beforeCount) {
//       return res.status(404).json({ message: 'Item not found in cart' });
//     }

//     await cart.save();

//     const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
//     res.status(200).json({ message: 'Item removed from cart', cart, cartCount });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// ✅ Helper to sanitize email
const sanitizeEmail = (email) => email.trim().toLowerCase();

// ✅ Add item to cart
router.post('/add', async (req, res) => {
  const { email, productId, quantity } = req.body;
  if (!email || !productId) {
    return res.status(400).json({ message: 'Email and Product ID are required' });
  }

  const sanitizedEmail = sanitizeEmail(email);
  const qty = parseInt(quantity) || 1;
  if (qty < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

  try {
    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(404).json({ message: 'Product not found' });

    let user = await User.findOne({ email: sanitizedEmail });
    if (!user) user = await User.create({ email: sanitizedEmail });

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) cart = new Cart({ user: user._id, items: [] });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    res.status(200).json({ message: 'Item added to cart', cart, cartCount });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get user's cart
router.get('/:email', async (req, res) => {
  const sanitizedEmail = sanitizeEmail(req.params.email);

  try {
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cart = await Cart.findOne({ user: user._id }).populate('items.product');
    res.status(200).json(cart || { items: [] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Clear entire cart
router.delete('/:email', async (req, res) => {
  const sanitizedEmail = sanitizeEmail(req.params.email);

  try {
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Cart.findOneAndDelete({ user: user._id });
    res.status(200).json({ message: 'Cart cleared' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete selected item from cart (BODY version)
router.delete('/item', async (req, res) => {
  const { email, productId } = req.body;
  if (!email || !productId) {
    return res.status(400).json({ message: 'Email and Product ID are required' });
  }

  const sanitizedEmail = sanitizeEmail(email);

  try {
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cart = await Cart.findOne({ user: user._id }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const beforeCount = cart.items.length;
    cart.items = cart.items.filter(item => item.product._id.toString() !== productId);

    if (cart.items.length === beforeCount) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();

    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    res.status(200).json({ message: 'Item removed from cart', cart, cartCount });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
