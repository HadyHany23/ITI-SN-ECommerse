# ITI-SN-ECommerse

A multi-page e-commerce front-end project built with HTML, CSS, Bootstrap, and vanilla JavaScript.

The app provides a complete client-side shopping flow: browse products, view details, add to cart, checkout, and basic user auth pages (register/login/profile) using browser storage.

## Features

- Reusable navbar and footer across pages via `js/components.js`
- Home page with hero slider and category shortcuts
- Products page with:
  - category filtering through query params
  - product search by name
  - add-to-cart with stock validation
- Product details page with image thumbnails and cart integration
- Cart page with:
  - quantity update
  - remove item action
  - live total price
- Checkout page with:
  - order summary from cart
  - customer information form
  - order history saved to localStorage
- Auth pages:
  - register
  - login
  - profile display/edit name
  - logout

## Tech Stack

- HTML5
- CSS3
- Bootstrap 5
- Font Awesome
- Vanilla JavaScript (ES6)
- Browser Local Storage for persistence
- DummyJSON API for products (`https://dummyjson.com`)

## Project Structure

```text
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── cart.js
│   ├── checkout.js
│   ├── components.js
│   ├── main.js
│   ├── productDetails.js
│   └── products-page.js
├── pages/
│   ├── about.html
│   ├── cart.html
│   ├── checkout.html
│   ├── contact.html
│   ├── login.html
│   ├── productDetails.html
│   ├── products.html
│   ├── profile.html
│   └── register.html
└── assets/
		└── images/
```

## How to Run

Because this is a front-end static project, you can run it with any local static server:

1. Open the project in VS Code.
2. Start a local server (recommended: VS Code Live Server).
3. Open `index.html` through that server URL.

> Note: some browser features and API calls are more reliable over `http://localhost` than opening files directly with `file://`.

## Data Persistence (Local Storage)

The app currently stores state in browser localStorage:

- `cart`: current cart items
- `checkout-cart`: cart snapshot before checkout
- `orderhistory`: submitted orders
- `users`: registered users
- `currentUser`: currently logged-in user

You can inspect these keys from browser DevTools:
`Application` → `Local Storage`.

## Important Security Note

This project is a front-end training/demo app. Authentication is fully client-side and not suitable for production security.

For production usage, move auth and orders to a backend with:

- server-side validation
- secure password hashing (e.g., bcrypt)
- database storage
- token/session management

## Future Improvements

- Connect auth/cart/orders to a backend API
- Add route guards for authenticated pages
- Add pagination and sorting on products page
- Improve form validation and error handling
- Add automated tests
