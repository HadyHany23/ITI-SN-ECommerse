// Get cart from localStorage and filter invalid items
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.filter(
  (item) => item && item.id && item.name && item.price && item.image
);

const container = document.getElementById('cart-container');
const totalEl = document.getElementById('cart-total');

// Render cart items
function renderCart() {
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '0';
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <div class="cart-title">${item.name}</div>
        <div class="cart-price">$${item.price}</div>
        <label>Qty: <input type="number" min="1" value="${
          item.quantity
        }" data-index="${index}"></label>
        <span class="item-total">$${itemTotal.toFixed(2)}</span>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = totalPrice.toFixed(2);

  // Event listener for quantity input
  document
    .querySelectorAll('.cart-info input[type="number"]')
    .forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = e.target.getAttribute('data-index');
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        cart[idx].quantity = val;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
}

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
  localStorage.setItem('checkout-cart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
});

// Initial render
renderCart();
