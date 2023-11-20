const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const User = mongoose.model('User', {
  name: String,
  email: String,
  phoneNumber: String,
  address: String,
  district: String,
  otp: String,
  isVerified: { type: Boolean, default: false },
});

const transporter = nodemailer.createTransport({
  service: 'your_email_service',
  auth: {
    user: 'your_email_address',
    pass: 'your_email_password',
  },
});

router.post('/register', async (req, res) => {
  try {
    // Generate OTP
    const otp = randomstring.generate(6);

    // Save user data and OTP to the database
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      district: req.body.district,
      otp: otp,
    });
    await user.save();

    // Send OTP to user's email
    const mailOptions = {
      from: 'your_email_address',
      to: req.body.email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).send('OTP sent to your email. Please verify.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/verify', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (user.isVerified) {
      return res.status(400).send('User already verified.');
    }

    if (user.otp !== req.body.otp) {
      return res.status(400).send('Invalid OTP.');
    }

    // Update user status to verified
    user.isVerified = true;
    await user.save();

    res.status(200).send('User registration successful.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
