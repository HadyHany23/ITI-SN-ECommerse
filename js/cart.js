const db = window.appDb;
let cart = [];
const currentUser = db.getCurrentUser();

const container = document.getElementById('cart-container');
const totalEl = document.getElementById('cart-total');

// Notification message
function showToast(message) {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.classList.add('toast'); // this is for css
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

// Render cart items
async function renderCart() {
  if (!currentUser) {
    container.innerHTML = '<p>Please login to view your cart.</p>';
    totalEl.textContent = '0';
    return;
  }

  try {
    cart = await db.getCartItems(currentUser.id);
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Unable to load cart right now.</p>';
    totalEl.textContent = '0';
    return;
  }

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
    div.className = 'cart-item justify-content-between';

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info flex-grow-1">
        <div class="cart-title">${item.name}</div>
        <div class="cart-price">$${item.price}</div>
        <label>Qty: <input type="number" min="1" value="${
          item.quantity
        }" data-index="${index}"></label>
        <span class="item-total">$${itemTotal.toFixed(2)}</span>
      </div>
      <div class="cart-remove">
        <i class="fa-solid fa-trash remove-btn" data-index="${index}"></i>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = totalPrice.toFixed(2);

  // Event listener for quantity input
  document
    .querySelectorAll('.cart-info input[type="number"]')
    .forEach((input) => {
      input.addEventListener('input', async (e) => {
        const idx = e.target.getAttribute('data-index');
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;

        // Respect stock limit
        const stock = cart[idx].stock || 100;
        if (val > stock) {
          console.warn(`Max stock reached (${stock}) for ${cart[idx].name}`);
          alert(`Max stock reached (${stock}) for ${cart[idx].name}`);
          val = stock;
          e.target.value = stock;
        }

        try {
          await db.updateCartQuantity(currentUser.id, cart[idx].id, val);
          await renderCart();
        } catch (error) {
          console.error(error);
          alert('Unable to update quantity right now.');
        }
      });
    });

  // Event listener for remove button
  document.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const idx = btn.getAttribute('data-index');
      try {
        const itemName = cart[idx].name;
        await db.removeCartItem(currentUser.id, cart[idx].id);
        showToast(`${itemName} removed from cart`);
        await renderCart();
      } catch (error) {
        console.error(error);
        alert('Unable to remove item right now.');
      }
    });
  });
}

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (!currentUser) {
    alert('Please login to continue to checkout.');
    window.location.href = '../pages/login.html';
    return;
  }

  window.location.href = '../pages/checkout.html';
});

// Initial render
renderCart();
