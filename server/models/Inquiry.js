const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  phone: String,
  email: String,
  reply: String,
  repliedAt: Date,
  status: { type: String, enum: ['pending','replied','closed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);