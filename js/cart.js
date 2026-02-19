// Get cart from localStorage and filter invalid items
let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart = cart.filter(
  (item) => item && item.id && item.name && item.price && item.image,
); // This line removes any broken product.

const container = document.getElementById("cart-container");
const totalEl = document.getElementById("cart-total");

// Notification message
function showToast(message) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast"); // this is for css
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 2500);
}

// Render cart items
function renderCart() {
  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "0";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item justify-content-between";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info flex-grow-1">
        <div class="cart-title">${item.name}</div>
        <div class="cart-price">$${item.price}</div>
        <label>Qty: <input type="number" min="1" value="${item.quantity}" data-index="${index}"></label>
        <span class="item-total">$${itemTotal.toFixed(2)}</span>
      </div>
      <div class="cart-remove">
        <i class="fa-solid fa-trash remove-btn" data-index="${index}" style="cursor:pointer;color:#ff4d4f;"></i>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = totalPrice.toFixed(2);

  // Event listener for quantity input
  document
    .querySelectorAll('.cart-info input[type="number"]')
    .forEach((input) => {
      input.addEventListener("input", (e) => {
        const idx = e.target.getAttribute("data-index");
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

        cart[idx].quantity = val;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

  // Event listener for remove button
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = btn.getAttribute("data-index");
      showToast(`${cart[idx].name} removed from cart`);
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

// Checkout button
document.getElementById("checkout-btn").addEventListener("click", () => {
  localStorage.setItem("checkout-cart", JSON.stringify(cart));
  window.location.href = "../pages/checkout.html";
});

// Initial render
renderCart();
