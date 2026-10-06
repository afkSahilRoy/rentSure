const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'server');

const files = {
  'package.json': `{
  "name": "rentsure-server",
  "version": "1.0.0",
  "description": "EstateHub Real Estate API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.6.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`,
  '.env': `PORT=5000
MONGO_URI=mongodb://localhost:27017/realestate
JWT_SECRET=rentsure_super_secret_jwt_key_2024_change_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development`,
  'server.js': `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const favoriteRoutes = require('./routes/favorites');
const inquiryRoutes = require('./routes/inquiries');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => res.send('OK'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log('Server running on port ' + process.env.PORT));
  })
  .catch(err => console.error(err));`,
  'middleware/auth.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'User role not authorized' });
    }
    next();
  };
};`,
  'models/User.js': `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['buyer','owner','admin'], default: 'buyer' },
  phone: { type: String }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);`,
  'models/Property.js': `const mongoose = require('mongoose');

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

module.exports = mongoose.model('Property', propertySchema);`,
  'models/Favorite.js': `const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);`,
  'models/Inquiry.js': `const mongoose = require('mongoose');

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

module.exports = mongoose.model('Inquiry', inquirySchema);`,
  'controllers/authController.js': `const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role, phone });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone,
      token: generateToken(user._id)
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};`,
  'controllers/propertyController.js': `const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, type, city, minPrice, maxPrice, bedrooms, bathrooms, furnishing, search, featured } = req.query;
    
    let query = { status: 'approved' };
    if (category) query.category = category;
    if (type) query.type = type;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) query.bedrooms = bedrooms >= 5 ? { $gte: 5 } : bedrooms;
    if (bathrooms) query.bathrooms = bathrooms >= 5 ? { $gte: 5 } : bathrooms;
    if (furnishing) query.furnishing = furnishing;
    if (featured === 'true') query.featured = true;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const count = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
      
    res.json({ properties, total: count, page: Number(page), pages: Math.ceil(count / Number(limit)) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    property.views += 1;
    await property.save();
    res.json(property);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).populate('owner', 'name email phone').sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createProperty = async (req, res) => {
  try {
    const property = new Property({ ...req.body, owner: req.user._id, status: 'pending' });
    const created = await property.save();
    res.status(201).json(created);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};`,
  'controllers/favoriteController.js': `const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

exports.toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const exists = await Favorite.findOne({ user: req.user._id, property: propertyId });
    if (exists) {
      await exists.deleteOne();
      return res.json({ favorited: false });
    }
    await Favorite.create({ user: req.user._id, property: propertyId });
    res.json({ favorited: true });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate({
      path: 'property',
      populate: { path: 'owner', select: 'name' }
    });
    const properties = favorites.map(f => f.property).filter(p => p != null);
    res.json(properties);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.checkFavorite = async (req, res) => {
  try {
    const exists = await Favorite.findOne({ user: req.user._id, property: req.params.propertyId });
    res.json({ favorited: !!exists });
  } catch (error) { res.status(500).json({ message: error.message }); }
};`,
  'controllers/inquiryController.js': `const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, message, phone, email } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    const inquiry = await Inquiry.create({
      property: propertyId,
      buyer: req.user._id,
      owner: property.owner,
      message,
      phone,
      email
    });
    res.status(201).json(inquiry);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getInquiries = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'buyer') query.buyer = req.user._id;
    else if (req.user.role === 'owner') query.owner = req.user._id;
    
    const inquiries = await Inquiry.find(query)
      .populate('property', 'title location.city images price')
      .populate('buyer', 'name email phone')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.replyToInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    
    if (inquiry.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    inquiry.reply = req.body.reply;
    inquiry.repliedAt = Date.now();
    inquiry.status = 'replied';
    await inquiry.save();
    res.json(inquiry);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    
    if (inquiry.owner.toString() !== req.user._id.toString() && inquiry.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await inquiry.deleteOne();
    res.json({ message: 'Inquiry removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};`,
  'controllers/adminController.js': `const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const buyerCount = await User.countDocuments({ role: 'buyer' });
    const ownerCount = await User.countDocuments({ role: 'owner' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });
    
    const totalInquiries = await Inquiry.countDocuments();
    
    const recentProperties = await Property.find().populate('owner', 'name').sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    
    res.json({
      totalUsers, totalProperties, pendingProperties, approvedProperties, rejectedProperties, totalInquiries,
      buyerCount, ownerCount, adminCount, recentProperties, recentUsers
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getAdminProperties = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    
    const properties = await Property.find(query).populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updatePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) { res.status(500).json({ message: error.message }); }
};`,
  'routes/auth.js': `const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;`,
  'routes/properties.js': `const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, getMyListings, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/my-listings', protect, authorize('owner', 'admin'), getMyListings);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('owner', 'admin'), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;`,
  'routes/favorites.js': `const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFavorites);
router.post('/', protect, toggleFavorite);
router.get('/check/:propertyId', protect, checkFavorite);

module.exports = router;`,
  'routes/inquiries.js': `const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, replyToInquiry, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createInquiry);
router.get('/', protect, getInquiries);
router.put('/:id/reply', protect, replyToInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;`,
  'routes/admin.js': `const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUser, deleteUser, getAdminProperties, updatePropertyStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/properties', getAdminProperties);
router.put('/properties/:id/status', updatePropertyStatus);

module.exports = router;`,
  'routes/users.js': `const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/profile', protect, (req, res) => res.json(req.user));

module.exports = router;`,
  'seed.js': `const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');
const Favorite = require('./models/Favorite');
const Inquiry = require('./models/Inquiry');
const bcrypt = require('bcryptjs');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    await User.deleteMany();
    await Property.deleteMany();
    await Favorite.deleteMany();
    await Inquiry.deleteMany();
    
    const admin = await User.create({ name: 'Admin User', email: 'admin@demo.com', password: 'password123', role: 'admin' });
    const owner = await User.create({ name: 'Priya Sharma', email: 'owner@demo.com', password: 'password123', role: 'owner', phone: '+91-9876543210' });
    const buyer = await User.create({ name: 'Rahul Verma', email: 'buyer@demo.com', password: 'password123', role: 'buyer', phone: '+91-9123456789' });
    
    const properties = await Property.insertMany([
      {
        owner: owner._id, title: 'Luxury 3BHK in Bandra', description: 'Beautiful sea-facing apartment.', category: 'sale', type: 'apartment', price: 35000000,
        location: { address: 'Carter Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050', coordinates: { lat: 19.0664, lng: 72.8228 } },
        bedrooms: 3, bathrooms: 3, area: 1500, furnishing: 'fully-furnished', amenities: ['WiFi', 'Parking', 'Pool', 'Security', 'Balcony', 'Lift'],
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
        status: 'approved', featured: true, views: 120
      },
      {
        owner: owner._id, title: 'Modern Villa in Koregaon Park', description: 'Spacious independent house with a private garden.', category: 'sale', type: 'villa', price: 45000000,
        location: { address: 'Lane 7', city: 'Pune', state: 'Maharashtra', zipCode: '411001', coordinates: { lat: 18.5362, lng: 73.8967 } },
        bedrooms: 4, bathrooms: 5, area: 3200, furnishing: 'semi-furnished', amenities: ['Parking', 'Garden', 'Security', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
        status: 'approved', featured: true, views: 80
      },
      {
        owner: owner._id, title: 'Studio Apartment near Tech Park', description: 'Cozy studio for bachelor IT professionals.', category: 'rent', type: 'studio', price: 22000,
        location: { address: 'Whitefield', city: 'Bangalore', state: 'Karnataka', zipCode: '560066', coordinates: { lat: 12.9698, lng: 77.7499 } },
        bedrooms: 1, bathrooms: 1, area: 500, furnishing: 'fully-furnished', amenities: ['WiFi', 'Lift', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'],
        status: 'approved', featured: false, views: 200
      },
      {
        owner: owner._id, title: 'Commercial Office Space in Cyber City', description: 'Ready to move office space in prime location.', category: 'rent', type: 'commercial', price: 150000,
        location: { address: 'Cyber City', city: 'Delhi', state: 'Delhi', zipCode: '110001', coordinates: { lat: 28.6139, lng: 77.2090 } },
        bedrooms: 0, bathrooms: 2, area: 2000, furnishing: 'unfurnished', amenities: ['Parking', 'Lift', 'Power Backup', 'Security'],
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        status: 'approved', featured: false, views: 45
      },
      {
        owner: owner._id, title: '2BHK Flat in Banjara Hills', description: 'Affordable family apartment in a safe neighborhood.', category: 'rent', type: 'apartment', price: 35000,
        location: { address: 'Road No 12', city: 'Hyderabad', state: 'Telangana', zipCode: '500034', coordinates: { lat: 17.4156, lng: 78.4411 } },
        bedrooms: 2, bathrooms: 2, area: 1100, furnishing: 'semi-furnished', amenities: ['Parking', 'Lift', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
        status: 'approved', featured: false, views: 150
      },
      {
        owner: owner._id, title: 'Spacious Independent House in Anna Nagar', description: 'Traditional house with modern amenities.', category: 'sale', type: 'house', price: 28000000,
        location: { address: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600040', coordinates: { lat: 13.0850, lng: 80.2101 } },
        bedrooms: 3, bathrooms: 3, area: 2400, furnishing: 'unfurnished', amenities: ['Parking', 'Garden', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
        status: 'approved', featured: false, views: 60
      },
      {
        owner: owner._id, title: 'Penthouse with City View', description: 'Luxurious penthouse overlooking the skyline.', category: 'sale', type: 'apartment', price: 55000000,
        location: { address: 'Worli', city: 'Mumbai', state: 'Maharashtra', zipCode: '400018', coordinates: { lat: 19.0163, lng: 72.8164 } },
        bedrooms: 4, bathrooms: 5, area: 4000, furnishing: 'fully-furnished', amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Balcony', 'Lift'],
        images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
        status: 'approved', featured: true, views: 250
      },
      {
        owner: owner._id, title: 'Farmhouse in Lonavala', description: 'Perfect weekend getaway property.', category: 'sale', type: 'villa', price: 18000000,
        location: { address: 'Khandala Road', city: 'Pune', state: 'Maharashtra', zipCode: '410401', coordinates: { lat: 18.7515, lng: 73.4055 } },
        bedrooms: 3, bathrooms: 3, area: 5000, furnishing: 'fully-furnished', amenities: ['Pool', 'Garden', 'Parking'],
        images: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800'],
        status: 'pending', featured: false, views: 10
      },
      {
        owner: owner._id, title: 'Budget 1BHK in Viman Nagar', description: 'Compact flat close to airport.', category: 'rent', type: 'apartment', price: 18000,
        location: { address: 'Viman Nagar', city: 'Pune', state: 'Maharashtra', zipCode: '411014', coordinates: { lat: 18.5683, lng: 73.9138 } },
        bedrooms: 1, bathrooms: 1, area: 600, furnishing: 'semi-furnished', amenities: ['Lift', 'Security'],
        images: ['https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800'],
        status: 'pending', featured: false, views: 5
      },
      {
        owner: owner._id, title: 'Corner Plot for Sale', description: 'Excellent plot for building your dream home.', category: 'sale', type: 'plot', price: 8000000,
        location: { address: 'Navi Mumbai', city: 'Mumbai', state: 'Maharashtra', zipCode: '400703', coordinates: { lat: 19.0330, lng: 73.0297 } },
        bedrooms: 0, bathrooms: 0, area: 1500, furnishing: 'unfurnished', amenities: [],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
        status: 'rejected', featured: false, views: 2
      }
    ]);
    
    await Favorite.create([
      { user: buyer._id, property: properties[0]._id },
      { user: buyer._id, property: properties[1]._id }
    ]);
    
    await Inquiry.create([
      { property: properties[0]._id, buyer: buyer._id, owner: owner._id, message: 'I am interested in this property. Can we schedule a visit?', phone: '+91-9123456789', email: 'buyer@demo.com', status: 'pending' },
      { property: properties[1]._id, buyer: buyer._id, owner: owner._id, message: 'Is the price negotiable?', phone: '+91-9123456789', email: 'buyer@demo.com', reply: 'Yes, slightly negotiable.', repliedAt: new Date(), status: 'replied' }
    ]);
    
    console.log('Seeded data successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seed();`
};

for (const [p, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Backend files created.');
