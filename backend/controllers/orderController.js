const Order = require('../models/Order');

// @desc    Place a new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, deliveryAddress, items, totalAmount, orderType, razorpayOrderId, razorpayPaymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items,
      totalAmount,
      orderType,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus: razorpayPaymentId ? 'paid' : 'pending'
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, payment, date } = req.query;
    let filter = {};

    if (status) filter.orderStatus = status;
    if (payment) filter.paymentStatus = payment;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(filter)
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updateData = {};

    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order stats (Admin)
// @route   GET /api/orders/stats/summary
exports.getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalOrders, todayOrders, totalRevenue, todayRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['received', 'confirmed', 'preparing'] }
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
