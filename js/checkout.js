document.addEventListener('DOMContentLoaded', async function () {
  const db = window.appDb;
  const currentUser = db.getCurrentUser();
  const orderDetailsContainer = document.getElementById('orderDetails');
  const orderTotalElement = document.getElementById('orderTotal');
  const checkoutForm = document.getElementById('checkoutForm');

  if (!currentUser) {
    window.location.href = '../pages/login.html';
    return;
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2500);
  }

  let cart = [];
  try {
    cart = await db.getCartItems(currentUser.id);
  } catch (error) {
    console.error(error);
    orderDetailsContainer.innerHTML = '<p>Unable to load checkout details.</p>';
    return;
  }

  if (cart.length === 0) {
    orderDetailsContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let total = 0;
  let totalItems = 0;

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    totalItems += item.quantity;

    orderDetailsContainer.innerHTML += `
      <div class="d-flex justify-content-between mb-2">
        <div>
          <strong>${item.name}</strong><br>
          ${item.quantity} × ${item.price} EGP
        </div>
        <div>
          ${subtotal.toFixed(2)} EGP
        </div>
      </div>
      <hr>
    `;
  });

  orderTotalElement.textContent = total.toFixed(2);

  checkoutForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const customer = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      notes: document.getElementById('notes').value,
    };

    try {
      await db.createOrder({
        userId: currentUser.id,
        customer,
        items: cart,
        total,
        totalItems,
      });

      showToast(`${customer.name}, your order has been placed successfully.`);

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2500);
    } catch (error) {
      console.error(error);
      alert('Unable to place your order right now. Please try again.');
    }
  });
});
