const inPages = window.location.pathname.includes('/pages/');

const base = inPages ? '../' : '';

const pagesPath = inPages ? '' : 'pages/';

const navbarHTML = `
  <nav class="navbar navbar-expand-lg navbar-light shadow-sm fixed-top">
    <div class="container">

      <!-- Logo -->
      <a class="navbar-brand fw-bold" href="${base}index.html">
        <span class="logo-text">NiloTronics</span>
      </a>

      <!-- Mobile Toggle Button -->
      <button class="navbar-toggler" type="button"
        data-bs-toggle="collapse" data-bs-target="#mainNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Links -->
      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="${base}index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="${pagesPath}products.html">Products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="${pagesPath}about.html">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="${pagesPath}contact.html">Contact</a>
          </li>
        </ul>

        <!-- Right Side Icons -->
        <div class="d-flex align-items-center gap-3">
          <a href="${pagesPath}cart.html" class="nav-icon">
            <i class="fa-solid fa-cart-shopping"></i>
          </a>
          <a href="${pagesPath}profile.html" class="btn">
            <i class="fa-regular fa-circle-user"></i>
          </a>
        </div>
      </div>

    </div>
  </nav>
`;

const footerHTML = `
  <footer class="footer mt-5">
    <div class="container">
      <div class="row gy-4">

        <!-- Column 1: Brand -->
        <div class="col-md-4">
          <h5 class="footer-logo">NiloTronics</h5>
          <p class="footer-text">
            Premium minimal shopping experience with clean design and modern UI.
          </p>
        </div>

        <!-- Column 2: Quick Links -->
        <div class="col-md-4">
          <h6 class="footer-title">Quick Links</h6>
          <ul class="footer-links">
            <li><a href="${base}index.html">Home</a></li>
            <li><a href="${pagesPath}products.html">Products</a></li>
            <li><a href="${pagesPath}cart.html">Cart</a></li>
            <li><a href="${pagesPath}profile.html">Profile</a></li>
          </ul>
        </div>

        <!-- Column 3: Contact -->
        <div class="col-md-4">
          <h6 class="footer-title">Contact</h6>
          <p>Email: support@nilotronics.com</p>
          <p>Phone: +20 123 456 789</p>
          <div class="social-icons mt-3">
            <i class="fa-brands fa-facebook-f"></i>
            <i class="fa-brands fa-instagram"></i>
            <i class="fa-brands fa-twitter"></i>
          </div>
        </div>

      </div>

      <hr />

      <div class="text-center pb-3">
        <small>&copy; 2026 NiloTronics. All rights reserved.</small>
      </div>
    </div>
  </footer>
`;

document.getElementById('navbar-placeholder').innerHTML = navbarHTML;
document.getElementById('footer-placeholder').innerHTML = footerHTML;
