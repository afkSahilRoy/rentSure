const express = require('express');
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
  .catch(err => console.error(err));