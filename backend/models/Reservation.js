const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  date: {
    type: Date,
    required: [true, 'Reservation date is required']
  },
  time: {
    type: String,
    required: [true, 'Reservation time is required']
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: 1,
    max: 20
  },
  specialRequest: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
