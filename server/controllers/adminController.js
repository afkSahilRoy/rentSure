const User = require('../models/User');
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
};