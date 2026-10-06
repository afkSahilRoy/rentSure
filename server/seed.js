const mongoose = require('mongoose');
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
        owner: owner._id,
        title: 'Luxury 3BHK in Bandra',
        description: 'Exquisite sea-facing architectural apartment overlooking Carter Road. Features natural oak herringbone flooring, floor-to-ceiling acoustic glazing, bespoke Italian kitchen joinery, and private elevator vestibule.',
        category: 'sale',
        type: 'apartment',
        price: 35000000,
        location: { address: 'Carter Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050', coordinates: { lat: 19.0664, lng: 72.8228 } },
        bedrooms: 3,
        bathrooms: 3,
        area: 1500,
        furnishing: 'fully-furnished',
        amenities: ['WiFi', 'Parking', 'Pool', 'Security', 'Balcony', 'Lift'],
        images: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: true,
        views: 140
      },
      {
        owner: owner._id,
        title: 'Modern Villa in Koregaon Park',
        description: 'Understated modernist estate in Pune’s coveted Lane 7. Characterized by board-formed concrete, warm timber screens, private landscaped lap pool, double-height living salon, and lush garden terraces.',
        category: 'sale',
        type: 'villa',
        price: 45000000,
        location: { address: 'Lane 7, Koregaon Park', city: 'Pune', state: 'Maharashtra', zipCode: '411001', coordinates: { lat: 18.5362, lng: 73.8967 } },
        bedrooms: 4,
        bathrooms: 5,
        area: 3200,
        furnishing: 'semi-furnished',
        amenities: ['Parking', 'Garden', 'Pool', 'Security', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: true,
        views: 95
      },
      {
        owner: owner._id,
        title: 'Studio Residence near Tech Park',
        description: 'Thoughtfully designed minimalist studio apartment in Whitefield. Seamless custom cabinetry, integrated workspace, polished concrete finishes, and floor-to-ceiling windows with green canopy views.',
        category: 'rent',
        type: 'studio',
        price: 28000,
        location: { address: 'ECC Road, Whitefield', city: 'Bangalore', state: 'Karnataka', zipCode: '560066', coordinates: { lat: 12.9698, lng: 77.7499 } },
        bedrooms: 1,
        bathrooms: 1,
        area: 550,
        furnishing: 'fully-furnished',
        amenities: ['WiFi', 'Lift', 'Power Backup', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: false,
        views: 210
      },
      {
        owner: owner._id,
        title: 'Architectural Workspace in Cyber City',
        description: 'High-concept creative studio and commercial floorplate. Features exposed industrial ceilings, warm oak collaborative tables, acoustic felt panelling, conference facilities, and reception salon.',
        category: 'rent',
        type: 'commercial',
        price: 165000,
        location: { address: 'DLF Phase 2, Cyber City', city: 'Delhi', state: 'Delhi', zipCode: '110001', coordinates: { lat: 28.4907, lng: 77.0898 } },
        bedrooms: 0,
        bathrooms: 2,
        area: 2200,
        furnishing: 'unfurnished',
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: false,
        views: 60
      },
      {
        owner: owner._id,
        title: '2BHK Residence in Banjara Hills',
        description: 'Serene mid-century influenced apartment in Hyderabad’s prime hills enclave. Natural travertine stone flooring, linen drapes, generous covered balcony, and unobstructed city views.',
        category: 'rent',
        type: 'apartment',
        price: 42000,
        location: { address: 'Road No 12, Banjara Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500034', coordinates: { lat: 17.4156, lng: 78.4411 } },
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        furnishing: 'semi-furnished',
        amenities: ['Parking', 'Lift', 'Balcony', 'Security', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: false,
        views: 165
      },
      {
        owner: owner._id,
        title: 'Heritage Courtyard House in Anna Nagar',
        description: 'Sensitively modernized coastal courtyard residence. Features central rain-court lightwell, reclaimed Burma teak pillars, handmade terracotta tiles, and fragrant private perimeter gardens.',
        category: 'sale',
        type: 'house',
        price: 31000000,
        location: { address: '2nd Avenue, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600040', coordinates: { lat: 13.0850, lng: 80.2101 } },
        bedrooms: 3,
        bathrooms: 3,
        area: 2600,
        furnishing: 'semi-furnished',
        amenities: ['Parking', 'Garden', 'Power Backup', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: false,
        views: 75
      },
      {
        owner: owner._id,
        title: 'Skyline Penthouse in Worli',
        description: 'Commanding double-height penthouse facing the Arabian Sea. Features bespoke fluted marble walls, cantilevered glass terrace, private plunge pool, and panoramic sunset skyline vistas.',
        category: 'sale',
        type: 'apartment',
        price: 62000000,
        location: { address: 'Worli Sea Face', city: 'Mumbai', state: 'Maharashtra', zipCode: '400018', coordinates: { lat: 19.0163, lng: 72.8164 } },
        bedrooms: 4,
        bathrooms: 5,
        area: 4200,
        furnishing: 'fully-furnished',
        amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Balcony', 'Lift'],
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: true,
        views: 280
      },
      {
        owner: owner._id,
        title: 'Minimalist Hillside Villa in Alibaug',
        description: 'Monolithic coastal retreat crafted from local basalt stone and warm teakwood. Complete with 20m lap pool, open-concept pavilions, landscaped courtyard gardens, and serene coastal privacy.',
        category: 'sale',
        type: 'villa',
        price: 58000000,
        location: { address: 'Awas Coast Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '402201', coordinates: { lat: 18.7845, lng: 72.8682 } },
        bedrooms: 4,
        bathrooms: 4,
        area: 3800,
        furnishing: 'fully-furnished',
        amenities: ['Pool', 'Garden', 'Security', 'Parking', 'Power Backup', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: true,
        views: 110
      },
      {
        owner: owner._id,
        title: 'Garden Residence in Indiranagar',
        description: 'Architect-designed apartment in leafy East Bangalore. Features expansive teakwood louvered balconies, custom terrazzo floors, integrated brass detailing, and verdant canopy outlooks.',
        category: 'rent',
        type: 'apartment',
        price: 75000,
        location: { address: '12th Main, 100 Feet Road', city: 'Bangalore', state: 'Karnataka', zipCode: '560038', coordinates: { lat: 12.9784, lng: 77.6408 } },
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        furnishing: 'semi-furnished',
        amenities: ['Balcony', 'Lift', 'Parking', 'Security', 'Power Backup', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'approved',
        featured: true,
        views: 145
      },
      {
        owner: owner._id,
        title: 'Farmhouse Retreat in Lonavala',
        description: 'Serene weekend getaway surrounded by Sahyadri mist. Expansive verandah, natural stone masonry, organic orchard, and infinity plunge pool.',
        category: 'sale',
        type: 'villa',
        price: 18000000,
        location: { address: 'Khandala Road', city: 'Pune', state: 'Maharashtra', zipCode: '410401', coordinates: { lat: 18.7515, lng: 73.4055 } },
        bedrooms: 3,
        bathrooms: 3,
        area: 5000,
        furnishing: 'fully-furnished',
        amenities: ['Pool', 'Garden', 'Parking', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'pending',
        featured: false,
        views: 10
      },
      {
        owner: owner._id,
        title: 'Terrace 1BHK in Viman Nagar',
        description: 'Modern top-floor terrace apartment close to Pune International Airport. Private rooftop garden patio and smart home automation.',
        category: 'rent',
        type: 'apartment',
        price: 24000,
        location: { address: 'Viman Nagar Central', city: 'Pune', state: 'Maharashtra', zipCode: '411014', coordinates: { lat: 18.5683, lng: 73.9138 } },
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        furnishing: 'semi-furnished',
        amenities: ['Lift', 'Security', 'Balcony', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2400&q=85',
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'pending',
        featured: false,
        views: 15
      },
      {
        owner: owner._id,
        title: 'Corner Villa Plot in Navi Mumbai',
        description: 'Prime residential corner parcel in Palm Beach sector with clear title and panoramic mangroves backdrop.',
        category: 'sale',
        type: 'plot',
        price: 9500000,
        location: { address: 'Palm Beach Road, Sanpada', city: 'Mumbai', state: 'Maharashtra', zipCode: '400705', coordinates: { lat: 19.0530, lng: 73.0197 } },
        bedrooms: 0,
        bathrooms: 0,
        area: 2000,
        furnishing: 'unfurnished',
        amenities: ['Security'],
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=85'
        ],
        status: 'rejected',
        featured: false,
        views: 5
      }
    ]);
    
    await Favorite.create([
      { user: buyer._id, property: properties[0]._id },
      { user: buyer._id, property: properties[1]._id }
    ]);
    
    await Inquiry.create([
      { property: properties[0]._id, buyer: buyer._id, owner: owner._id, message: 'I am interested in this residence. Can we schedule a private architectural viewing?', phone: '+91-9123456789', email: 'buyer@demo.com', status: 'pending' },
      { property: properties[1]._id, buyer: buyer._id, owner: owner._id, message: 'Is there flexibility on the possession date and terms?', phone: '+91-9123456789', email: 'buyer@demo.com', reply: 'Yes, flexible terms are available for immediate closing.', repliedAt: new Date(), status: 'replied' }
    ]);
    
    console.log('Seeded data successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seed();