const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['rent','sale'], required: true },
  type: { type: String, enum: ['apartment','house','villa','studio','commercial','plot'], required: true },
  price: { type: Number, required: true, min: 0 },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zipCode: String,
    coordinates: { lat: Number, lng: Number }
  },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number, min: 0 },
  furnishing: { type: String, enum: ['fully-furnished','semi-furnished','unfurnished'] },
  amenities: [String],
  images: [String],
  floorPlan: String,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);