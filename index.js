// const express = require("express");
// const dotEnv = require('dotenv');
// const mongoose = require('mongoose');
// const vendorRoutes = require('./routes/vendorRoutes');
// const bodyParser = require('body-parser');
// const firmRoutes = require('./routes/firmRoutes');
// const productRoutes = require('./routes/productRoutes');
// const cors = require('cors');
// const path = require('path');
// const userRoutes = require('./routes/userRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const locationRoutes = require('./routes/locationRoutes');

// const app = express()

// const PORT = process.env.PORT || 4000;

// dotEnv.config();
// app.use(cors())

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("MongoDB connected successfully!"))
//     .catch((error) => console.log(error))

// app.use(bodyParser.json());
// app.use('/vendor', vendorRoutes);
// app.use('/firm', firmRoutes)
// app.use('/product', productRoutes);
// app.use('/uploads', express.static('uploads'));

// app.use('/user',userRoutes);
// app.use('/cart', cartRoutes);
// app.use('/location',locationRoutes);

// app.listen(PORT, () => {
//     console.log(`server started and running at ${PORT}`);
// });

// app.get('/', (req, res) => {
//     res.send("<h1> Welcome to Food fantacy backend server <h1>");
// })


const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Routes
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();
dotEnv.config();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.log(error));

// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/location", locationRoutes);

// 💳 Razorpay APIs
app.post("/payment/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "order_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/payment/verify", (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const sign =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// Home
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Food Fantasy backend server</h1>");
});

// Server
app.listen(PORT, () => {
  console.log(`Server started and running on port ${PORT}`);
});
