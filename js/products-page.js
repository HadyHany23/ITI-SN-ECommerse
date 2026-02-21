// Get selected category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get('category') || 'smartphones';

// Update breadcrumb
document.getElementById('breadcrumb-category').textContent =
  category.charAt(0).toUpperCase() + category.slice(1);

// Container for products
const container = document.getElementById('products-container');
const db = window.appDb || createProductsDbFallback();

function createProductsDbFallback() {
  const sdk = window.supabase || window.supabaseJs;
  const env = window.__ENV__;

  if (
    !sdk?.createClient ||
    !env?.SUPABASE_URL ||
    !env?.SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabaseClientFallback = sdk.createClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY
  );

  return {
    getCurrentUser() {
      return JSON.parse(localStorage.getItem('currentUser'));
    },
    async getProductsByCategory(selectedCategory) {
      const { data, error } = await supabaseClientFallback
        .from('products')
        .select('id, title, price, stock, thumbnail, category')
        .eq('category', selectedCategory)
        .order('id', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    async addOrIncrementCartItem(userId, product) {
      const { data: existing, error: existingError } =
        await supabaseClientFallback
          .from('cart_items')
          .select('id, quantity, stock')
          .eq('user_id', userId)
          .eq('product_id', product.id)
          .maybeSingle();

      if (existingError) throw existingError;

      if (existing) {
        if (existing.quantity >= existing.stock) {
          return { added: false, reason: 'stock_limit' };
        }

        const { error: updateError } = await supabaseClientFallback
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);

        if (updateError) throw updateError;
        return { added: true };
      }

      const { error: insertError } = await supabaseClientFallback
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          stock: product.stock,
        });

      if (insertError) throw insertError;
      return { added: true };
    },
  };
}

if (!db || typeof db.getProductsByCategory !== 'function') {
  container.innerHTML =
    "<h4 class='text-center mt-4'>Supabase is not initialized. Please regenerate env and refresh.</h4>";
  throw new Error('Supabase client not initialized on products page');
}

// Notification message
function showToast(message) {
  const containerToast = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.classList.add('toast'); // this is for css
  toast.textContent = message;

  containerToast.appendChild(toast);

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

// Store products globally for search
let products = [];

// Render products function
function renderProducts(productsArray) {
  container.innerHTML = '';

  if (productsArray.length === 0) {
    container.innerHTML = "<h4 class='text-center mt-4'>Item not found</h4>";
    return;
  }

  productsArray.forEach((product) => {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-6';

    col.innerHTML = `
      <div class="product-card">
        <a href="../pages/productDetails.html?id=${product.id}">
          <img src="${product.thumbnail}" alt="${product.title}">
        </a>
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

  // Add event listeners for Add to Cart buttons
  document.querySelectorAll('.btn-add').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const currentUser = db.getCurrentUser();
      if (!currentUser) {
        alert('Please login to add items to your cart.');
        window.location.href = '../pages/login.html';
        return;
      }

      const productId = button.getAttribute('data-id');
      const productName = button.getAttribute('data-name');
      const productPrice = parseFloat(button.getAttribute('data-price'));
      const productImage = button.getAttribute('data-image');
      const productStock = parseInt(button.getAttribute('data-stock'));

      if (
        !productId ||
        !productName ||
        isNaN(productPrice) ||
        !productImage ||
        isNaN(productStock)
      ) {
        console.error('Invalid product data, skipping add to cart');
        return;
      }

      try {
        const result = await db.addOrIncrementCartItem(currentUser.id, {
          id: Number(productId),
          name: productName,
          price: productPrice,
          image: productImage,
          stock: productStock,
        });

        if (!result.added && result.reason === 'stock_limit') {
          alert(
            `Cannot add more than stock (${productStock}) for ${productName}`
          );
          return;
        }

        showToast(`${productName} has been added to your cart.`);
      } catch (error) {
        console.error(error);
        alert('Unable to add item to cart right now.');
      }
    });
  });
}

// Fetch products from Supabase
db.getProductsByCategory(category)
  .then((data) => {
    products = data || [];
    renderProducts(products);
  })
  .catch((err) => {
    console.error(err);
    container.innerHTML =
      "<h4 class='text-center mt-4'>Unable to load products right now.</h4>";
  });

// search on product by name
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchValue = searchInput.value.trim().toLowerCase();

  if (searchValue === '') {
    renderProducts(products); // show all if empty
    return;
  }

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchValue)
  );

  renderProducts(filteredProducts);
});
