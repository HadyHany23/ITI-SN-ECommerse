// Get selected category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "smartphones";

// Update breadcrumb
document.getElementById("breadcrumb-category").textContent =
  category.charAt(0).toUpperCase() + category.slice(1);

// Container for products
const container = document.getElementById("products-container");

// Fetch products from DummyJSON
fetch(`https://dummyjson.com/products/category/${category}`)
  .then((res) => res.json())
  .then((data) => {
    const products = data.products;

    products.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-lg-3 col-md-4 col-6";

      col.innerHTML = `
        <div class="product-card">
          <img src="${product.thumbnail}" alt="${product.title}">
          <div class="product-info">
            <div>
              <div class="product-name">${product.title}</div>
              <div class="product-price">$${product.price}</div>
            </div>
            <a href="#" class="btn-add" 
               data-id="${product.id}"
               data-name="${product.title}"
               data-price="${product.price}"
               data-image="${product.thumbnail}"
               data-stock="${product.stock}">Add to Cart</a>
          </div>
        </div>
      `;

      container.appendChild(col);
    });

    // Add event listeners for Add to Cart
    document.querySelectorAll(".btn-add").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        const productId = button.getAttribute("data-id");
        const productName = button.getAttribute("data-name");
        const productPrice = parseFloat(button.getAttribute("data-price"));
        const productImage = button.getAttribute("data-image");
        const productStock = parseInt(button.getAttribute("data-stock"));

        if (
          !productId ||
          !productName ||
          isNaN(productPrice) ||
          !productImage ||
          isNaN(productStock)
        ) {
          console.error("Invalid product data, skipping add to cart");
          return;
        }

        // Get existing cart
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(
          (item) => item && item.id && item.name && item.price && item.image,
        );

        const existing = cart.find((item) => item.id == productId);
        if (existing) {
          if (existing.quantity + 1 > productStock) {
            console.warn(
              `Cannot add more than stock (${productStock}) for ${productName}`,
            );
            return; // prevent exceeding stock
          }
          existing.quantity += 1;
        } else {
          cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            image: productImage,
            stock: productStock,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(`${productName} added to cart`, cart);
      });
    });
  })
  .catch((err) => console.error(err));
