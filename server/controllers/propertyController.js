const Property = require('../models/Property');

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
};