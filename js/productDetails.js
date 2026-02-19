// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const container = document.getElementById("product-details");

// If no ID
if (!productId) {
  container.innerHTML = "<p>Product not found.</p>";
} else {
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
      renderProduct(product);
    })
    .catch(() => {
      container.innerHTML = "<p>Error loading product.</p>";
    });
}

function renderProduct(product) {
  //   const availability =
  //     product.stock > 10
  //       ? "In Stock"
  //       : product.stock > 0
  //         ? "Low Stock"
  //         : "Out of Stock";

  const stockClass =
    product.stock > 10 ? "available" : product.stock > 0 ? "low" : "out";

  container.innerHTML = `
    <div class="image-section">
      <img id="main-image" src="${product.images[0]}" alt="${product.title}">
      <div class="thumbnail-row">
        ${product.images
          .map((img) => `<img src="${img}" class="thumb">`)
          .join("")}
      </div>
    </div>

    <div class="info-section">
      <h1>${product.title}</h1>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Rating:</strong> ${product.rating}</p>
      <p class="price">$${product.price}</p>
      <p class="stock ${stockClass}">
        <strong>Status:</strong> ${product.availabilityStatus}
      </p>
      <p><strong>Stock:</strong> ${product.stock}</p>

      <div class="btn-add"
           data-id="${product.id}"
           data-name="${product.title}"
           data-price="${product.price}"
           data-image="${product.thumbnail}"
           data-stock="${product.stock}">
           Add to Cart
      </div>
    </div>
  `;

  // Image slider logic
  const mainImage = document.getElementById("main-image");
  document.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
    });
  });

  // Add to cart logic
  const addBtn = document.querySelector(".btn-add");
  addBtn.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id == product.id);

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      } else {
        alert("Max stock reached");
        return;
      }
    } else {
      cart.push({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.thumbnail,
        quantity: 1,
        stock: product.stock,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  });
}
