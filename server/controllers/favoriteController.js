const Favorite = require('../models/Favorite');
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
};