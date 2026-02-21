// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const db = window.appDb;

const container = document.getElementById('product-details');

// If no ID
if (!productId) {
  container.innerHTML = '<p>Product not found.</p>';
} else {
  db.getProductById(Number(productId))
    .then((product) => {
      if (!product) {
        container.innerHTML = '<p>Product not found.</p>';
        return;
      }
      renderProduct(product);
    })
    .catch(() => {
      container.innerHTML = '<p>Error loading product.</p>';
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
    product.stock > 10 ? 'available' : product.stock > 0 ? 'low' : 'out';
  const images = Array.isArray(product.images) ? product.images : [];
  const displayImages = images.length > 0 ? images : [product.thumbnail];
  const availabilityLabel =
    product.stock > 10
      ? 'In Stock'
      : product.stock > 0
      ? 'Low Stock'
      : 'Out of Stock';

  container.innerHTML = `
    <div class="image-section">
      <img id="main-image" src="${displayImages[0]}" alt="${product.title}">
      <div class="thumbnail-row">
        ${displayImages
          .map((img) => `<img src="${img}" class="thumb">`)
          .join('')}
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
        <strong>Status:</strong> ${availabilityLabel}
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
  const mainImage = document.getElementById('main-image');
  document.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      mainImage.src = thumb.src;
    });
  });

  // Add to cart logic
  const addBtn = document.querySelector('.btn-add');
  addBtn.addEventListener('click', async () => {
    const currentUser = db.getCurrentUser();
    if (!currentUser) {
      alert('Please login to add items to your cart.');
      window.location.href = '../pages/login.html';
      return;
    }

    try {
      const result = await db.addOrIncrementCartItem(currentUser.id, {
        id: Number(product.id),
        name: product.title,
        price: Number(product.price),
        image: product.thumbnail,
        stock: Number(product.stock),
      });

      if (!result.added && result.reason === 'stock_limit') {
        alert('Max stock reached');
        return;
      }

      alert('This item has been added to your cart successfully.');
    } catch (error) {
      console.error(error);
      alert('Unable to add item to cart right now.');
    }
  });
}
