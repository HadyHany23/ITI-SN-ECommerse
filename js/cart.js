// ================= GET CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart = cart.filter(
  (item) => item && item.id && item.name && item.price && item.image,
);

const container = document.getElementById("cart-container");
const totalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= TOAST =================
function showToast(message) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ================= RENDER CART =================
function renderCart() {
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "0";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    const stock = item.stock || 100;
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const div = document.createElement("div");
    div.className =
      "cart-item d-flex align-items-center justify-content-between mb-3";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width:80px">

      <div class="cart-info flex-grow-1 ms-3">
        <div class="cart-title fw-bold">${item.name}</div>
        <div class="cart-price">$${item.price}</div>

        <div class="d-flex align-items-center gap-2 mt-2">
          <button class="btn btn-outline-secondary btn-sm qty-decrease" data-index="${index}">-</button>

          <input type="number"
                 min="1"
                 max="${stock}"
                 value="${item.quantity}"
                 class="form-control text-center qty-input"
                 style="width:70px"
                 data-index="${index}">

          <button class="btn btn-outline-secondary btn-sm qty-increase" data-index="${index}">+</button>
        </div>

        <div class="mt-2">
          <span class="item-total">$${itemTotal.toFixed(2)}</span>
        </div>
      </div>

      <div class="cart-remove ms-3">
        <i class="fa-solid fa-trash remove-btn"
           data-index="${index}"
           style="cursor:pointer;color:#ff4d4f;"></i>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = totalPrice.toFixed(2);
}

// ================= EVENT DELEGATION =================
container.addEventListener("click", function (e) {
  const index = e.target.dataset.index;
  if (index === undefined) return;

  const stock = cart[index].stock || 100;

  // ➕ Increase
  if (e.target.classList.contains("qty-increase")) {
    if (cart[index].quantity < stock) {
      cart[index].quantity++;
      saveCart();
      renderCart();
    } else {
      showToast(`Max stock reached (${stock})`);
    }
  }

  // ➖ Decrease
  if (e.target.classList.contains("qty-decrease")) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      saveCart();
      renderCart();
    }
  }

  // 🗑 Remove
  if (e.target.classList.contains("remove-btn")) {
    showToast(`${cart[index].name} removed from cart`);
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
});

// ================= INPUT CHANGE =================
container.addEventListener("input", function (e) {
  if (!e.target.classList.contains("qty-input")) return;

  const index = e.target.dataset.index;
  let value = parseInt(e.target.value);
  const stock = cart[index].stock || 100;

  if (isNaN(value) || value < 1) value = 1;
  if (value > stock) {
    value = stock;
    showToast(`Max stock reached (${stock})`);
  }

  cart[index].quantity = value;
  saveCart();
  renderCart();
});

// ================= CHECKOUT =================
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    localStorage.setItem("checkout-cart", JSON.stringify(cart));
    window.location.href = "../pages/checkout.html";
  });
}

// ================= INITIAL RENDER =================
renderCart();
