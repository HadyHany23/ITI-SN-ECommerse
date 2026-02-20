document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderDetailsContainer = document.getElementById("orderDetails");
  const orderTotalElement = document.getElementById("orderTotal");
  const checkoutForm = document.getElementById("checkoutForm");

  if (cart.length === 0) {
    orderDetailsContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

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
          ${subtotal} EGP
        </div>
      </div>
      <hr>
    `;
  });

  orderTotalElement.textContent = total.toFixed(2);

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const order = {
      id: "ORD-" + Date.now(),
      date: new Date().toISOString(),
      customer: {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        notes: document.getElementById("notes").value,
      },
      items: cart,
      total: total,
      totalItems: totalItems,
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orderhistory")) || [];
    existingOrders.push(order);

    localStorage.setItem("orderhistory", JSON.stringify(existingOrders));

    localStorage.removeItem("cart");

    showToast(`${order.customer.name} your order is placed successfully`);
    // alert("Order placed successfully!");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);
  });
});
