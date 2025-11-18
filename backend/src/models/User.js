const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'business', 'admin'],
    default: 'user'
  },
  businessStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: null
  },
  points: {
    type: Number,
    default: 0
  },
  coupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 비밀번호 해싱
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 비밀번호 확인
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
