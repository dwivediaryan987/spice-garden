const Reservation = require('../models/Reservation');

// @desc    Create a reservation
// @route   POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, date, time, guests, specialRequest } = req.body;

    const reservation = await Reservation.create({
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      guests,
      specialRequest
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
exports.getAllReservations = async (req, res) => {
  try {
    const { status, date } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const reservations = await Reservation.find(filter).sort({ date: 1, time: 1 });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reservation status (Admin)
// @route   PUT /api/reservations/:id
exports.updateReservation = async (req, res) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete reservation (Admin)
// @route   DELETE /api/reservations/:id
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ success: true, message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's reservation count
// @route   GET /api/reservations/stats/today
exports.getTodayCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await Reservation.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' }
    });

    const pending = await Reservation.countDocuments({
      status: 'pending'
    });

    res.json({ success: true, data: { todayCount: count, pendingCount: pending } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
