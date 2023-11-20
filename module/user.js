const mongoose = require('mongoose');


const User = mongoose.model('User', {
    name: String,
    email: String,
    phoneNumber: String,
    address: String,
    district: String,
    otp: String,
    isVerified: { type: Boolean, default: false },
  });