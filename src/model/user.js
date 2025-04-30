const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: "" },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHERS', 'UNKNOWN'], default: 'UNKNOWN' },
  profile: { type: String }, // Assume this is a URL or base64 string
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  userType: { type: String, enum: ['STUDENT', 'INSTITUTE', 'FACULTY', 'ADMIN'], required: true },
  password: { type: String },
  otp:{
    code: {type:Number, default: 0},
    otpExpiry: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
}, {timestamps: true});

module.exports = mongoose.model('master user', userSchema);
