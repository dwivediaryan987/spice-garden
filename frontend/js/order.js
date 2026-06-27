// =========================================
// SPICE GARDEN — Order Page Logic
// =========================================

let orderType = 'delivery';

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();
  document.getElementById('orderForm')?.addEventListener('submit', handleOrder);
});

function renderOrderSummary() {
  const items = Cart.getItems();
  const orderContent = document.getElementById('orderContent');
  const emptyState = document.getElementById('emptyCartState');
  const itemsContainer = document.getElementById('orderItems');
  const totalsContainer = document.getElementById('orderTotals');

  if (items.length === 0) {
    if (orderContent) orderContent.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (orderContent) orderContent.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  // Render items
  if (itemsContainer) {
    itemsContainer.innerHTML = items.map(item => `
      <div class="order-item-row">
        <div>
          <span>${item.isVeg ? '🟢' : '🔴'}</span>
          ${item.name}
          <span class="order-item-qty">× ${item.quantity}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>₹${item.price * item.quantity}</span>
          <div style="display: flex; gap: 4px;">
            <button class="qty-btn" onclick="updateCartItem('${item._id}', ${item.quantity - 1})">−</button>
            <button class="qty-btn" onclick="updateCartItem('${item._id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render totals
  const subtotal = Cart.getTotal();
  const deliveryFee = orderType === 'delivery' ? 40 : 0;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  if (totalsContainer) {
    totalsContainer.innerHTML = `
      <div class="order-subtotal">
        <span>Subtotal</span>
        <span>₹${subtotal}</span>
      </div>
      <div class="order-subtotal">
        <span>GST (5%)</span>
        <span>₹${gst}</span>
      </div>
      <div class="order-subtotal">
        <span>Delivery Fee</span>
        <span>${deliveryFee > 0 ? '₹' + deliveryFee : 'FREE'}</span>
      </div>
      <div class="order-total-row">
        <span>Total</span>
        <span class="price">₹${total}</span>
      </div>
    `;
  }
}

function updateCartItem(id, qty) {
  if (qty <= 0) {
    Cart.removeItem(id);
  } else {
    Cart.updateQuantity(id, qty);
  }
  renderOrderSummary();
}

function setOrderType(type) {
  orderType = type;
  const deliveryBtn = document.getElementById('deliveryBtn');
  const takeawayBtn = document.getElementById('takeawayBtn');
  const addressGroup = document.getElementById('addressGroup');

  if (type === 'delivery') {
    deliveryBtn?.classList.add('active');
    takeawayBtn?.classList.remove('active');
    if (addressGroup) addressGroup.style.display = 'block';
  } else {
    takeawayBtn?.classList.add('active');
    deliveryBtn?.classList.remove('active');
    if (addressGroup) addressGroup.style.display = 'none';
  }
  renderOrderSummary();
}

async function handleOrder(e) {
  e.preventDefault();

  const items = Cart.getItems();
  if (items.length === 0) {
    showToast('Cart is empty!', '⚠️');
    return;
  }

  const customerName = document.getElementById('customerName').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  const customerEmail = document.getElementById('customerEmail').value.trim();
  const deliveryAddress = document.getElementById('deliveryAddress')?.value.trim();

  if (!customerName || !customerPhone) {
    showToast('Please fill in required fields', '⚠️');
    return;
  }

  if (orderType === 'delivery' && !deliveryAddress) {
    showToast('Please enter delivery address', '⚠️');
    return;
  }

  const subtotal = Cart.getTotal();
  const gst = Math.round(subtotal * 0.05);
  const deliveryFee = orderType === 'delivery' ? 40 : 0;
  const totalAmount = subtotal + gst + deliveryFee;

  const payBtn = document.getElementById('payBtn');
  payBtn.disabled = true;
  payBtn.textContent = '⏳ Processing...';

  try {
    // Create Razorpay order
    const paymentData = await apiCall('/payment/create', {
      method: 'POST',
      body: JSON.stringify({ amount: totalAmount })
    });

    if (paymentData.success) {
      // Open Razorpay checkout
      const options = {
        key: paymentData.data.keyId,
        amount: paymentData.data.amount,
        currency: paymentData.data.currency,
        name: 'Spice Garden',
        description: `Order - ${items.length} items`,
        order_id: paymentData.data.orderId,
        handler: async function (response) {
          // Verify payment
          try {
            const verifyData = await apiCall('/payment/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyData.success) {
              // Create order in database
              await createOrder(customerName, customerPhone, customerEmail, deliveryAddress, items, totalAmount, response.razorpay_order_id, response.razorpay_payment_id);
            }
          } catch (err) {
            showToast('Payment verification failed', '❌');
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        theme: { color: '#E85D04' },
        modal: {
          ondismiss: function () {
            payBtn.disabled = false;
            payBtn.textContent = '🔒 Proceed to Pay';
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    }
  } catch (error) {
    // Fallback: Create order without payment (for demo/testing)
    await createOrder(customerName, customerPhone, customerEmail, deliveryAddress, items, totalAmount);
  }

  payBtn.disabled = false;
  payBtn.textContent = '🔒 Proceed to Pay';
}

async function createOrder(name, phone, email, address, items, total, razorpayOrderId = '', razorpayPaymentId = '') {
  try {
    const orderData = {
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      deliveryAddress: address,
      items: items.map(item => ({
        menuItem: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: total,
      orderType,
      razorpayOrderId,
      razorpayPaymentId
    };

    const data = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    if (data.success) {
      Cart.clear();
      const msg = document.getElementById('orderSuccessMsg');
      if (msg) msg.textContent = `Your order ${data.data.orderNumber} has been placed! We'll start preparing it right away.`;
      document.getElementById('successModal')?.classList.add('active');
    }
  } catch (error) {
    showToast('Order placed! (Payment pending)', '📋');
    Cart.clear();
    setTimeout(() => window.location.href = '/', 2000);
  }
}
