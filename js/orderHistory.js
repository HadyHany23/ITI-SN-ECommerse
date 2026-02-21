document.addEventListener("DOMContentLoaded", function () {
  const ordersContainer = document.getElementById("ordersContainer");

  const currentUser = getCurrentUser();

  if (!currentUser) {
    ordersContainer.innerHTML = `
      <div class="alert alert-info">
        login first to display your orders.
      </div>
    `;
    setTimeout(() => {
      window.location.href = "login.html";
    }, 5000);
    return;
  }

  const allOrders = JSON.parse(localStorage.getItem("orderhistory")) || [];

  const userOrders = allOrders.filter(
    (order) => order.customer.email === currentUser.email,
  );

  if (userOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="alert alert-info">
        You have no orders yet.
      </div>
    `;
    return;
  }

  userOrders.forEach((order) => {
    let itemsHTML = "";

    order.items.forEach((item) => {
      itemsHTML += `
        <li class="list-group-item d-flex justify-content-between">
          ${item.name} (${item.quantity})
          <span>${item.price * item.quantity} EGP</span>
        </li>
      `;
    });

    ordersContainer.innerHTML += `
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between">
          <div>
            <strong>Order ID:</strong> ${order.id}
          </div>
          <div>
            ${new Date(order.date).toLocaleString()}
          </div>
        </div>

        <div class="card-body">
          <ul class="list-group mb-3">
            ${itemsHTML}
          </ul>

          <h5>Total: ${order.total} EGP</h5>
        </div>
      </div>
    `;
  });
});
