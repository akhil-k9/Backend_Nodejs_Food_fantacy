const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  // Optional: name and phone
  name: {
    type: String
  },
  phone: {
    type: String
  },

  // 📍 Location info
  location: {
    type: String // e.g., "Hyderabad"
  },
  coordinates: {
    lat: { type: Number },
    lon: { type: Number }
  },

  // 🛒 Cart items
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
