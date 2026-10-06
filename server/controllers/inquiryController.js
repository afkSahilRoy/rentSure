const Inquiry = require('../models/Inquiry');
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
};