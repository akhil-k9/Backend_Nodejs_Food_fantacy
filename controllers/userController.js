// require('dotenv').config();
// const fast2sms = require('fast-two-sms');
// const { setOtp, getOtp, deleteOtp } = require('./otpStore');


// const sendOtp= async (req, res) => {
//   const { phone } = req.body;

//   if (!phone || !/^\d{10}$/.test(phone)) {
//     return res.status(400).json({ error: 'Invalid phone number' });
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
//   setOtp(phone, otp);

//   const message = `Your OTP for login is ${otp}`;

//   try {
//     const r = await fast2sms.sendMessage({
//       authorization: process.env.FAST2SMS_API,
//       message,
//       numbers: [phone],
//     });

//     console.log(r);

//     res.status(200).json({ message: 'OTP sent successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to send OTP' });
//   }
// }

// const verifyOtp = (req, res) => {
//   const { phone, otp } = req.body;
//   const record = getOtp(phone);

//   if (!record) return res.status(400).json({ error: 'No OTP sent to this number' });

//   const timeDiff = (Date.now() - record.createdAt) / 1000; // in seconds
//   if (timeDiff > 300) return res.status(400).json({ error: 'OTP expired' });

//   if (record.otp != otp) return res.status(400).json({ error: 'Invalid OTP' });

//   deleteOtp(phone); // clear OTP after success
//   res.status(200).json({ message: 'OTP verified successfully' });
// }

// module.exports = { sendOtp,verifyOtp}



// email authentication

require('dotenv').config();
const nodemailer = require('nodemailer');
const { setOtp, getOtp, deleteOtp } = require('./otpStore');
const User = require('../models/User');

// Email OTP Sender Function
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  setOtp(email, otp);

  // const message = `FOOD FANTASY  \n Your OTP for login is ${otp}`;
  const message = `🍽️ FOOD FANTASY\n\nYour One-Time Password (OTP) for login is: ${otp}\n\nPlease use this code within 5 minutes. Do not share it with anyone.`;


  // Setup Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // Your email address
      pass: process.env.EMAIL_PASS      // App password or Gmail password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    res.status(200).json({ message: 'OTP sent to email successfully' });
  } catch (err) {
    console.error("Email error: ", err);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = getOtp(email);

  if (!record) return res.status(400).json({ error: 'No OTP sent to this email' });

  const timeDiff = (Date.now() - record.createdAt) / 1000; // in seconds
  if (timeDiff > 300) return res.status(400).json({ error: 'OTP expired' });

  if (record.otp != otp) return res.status(400).json({ error: 'Invalid OTP' });

  deleteOtp(email); // clear OTP after success

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Signup flow
      user = new User({ email });
      await user.save();
      return res.status(200).json({ message: 'OTP verified. New user created.', user });
    }

    // Login flow
    res.status(200).json({ message: 'OTP verified. Existing user logged in.', user });

  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ error: 'Something went wrong while verifying user' });
  }
};


module.exports = { sendOtp, verifyOtp };
