# ITI-SN-ECommerse

Client-side multi-page e-commerce project built with HTML, CSS, Bootstrap, and vanilla JavaScript.

The application implements a complete front-end shopping flow:

- Browse products by category
- Search products by name
- View product details
- Add/update/remove cart items
- Checkout and save orders
- Register, login, view, and edit profile

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Application Architecture](#application-architecture)
- [Pages and User Flows](#pages-and-user-flows)
- [Data Model (Local Storage)](#data-model-local-storage)
- [External Dependencies](#external-dependencies)
- [Setup and Run](#setup-and-run)
- [Configuration](#configuration)
- [Limitations](#limitations)
- [Troubleshooting](#troubleshooting)
- [Suggested Next Improvements](#suggested-next-improvements)

---

## Overview

This project is a static front-end storefront. It does not require a backend server to run locally.

The app relies on:

- **DummyJSON API** for products data
- **Browser localStorage** for cart, users, session, and order history

Because persistence and authentication are implemented in the browser, this project is suitable for learning/demo use, not production.

---

## Tech Stack

- HTML5
- CSS3
- Bootstrap 5.3.2 (CDN)
- Font Awesome 7 (CDN)
- Vanilla JavaScript (ES6)

---

## Project Structure

```text
.
├── index.html
├── README.md
├── assets/
│   └── images/
│       ├── categories/
│       ├── hero/
│       └── References/
├── components/
├── css/
│   └── styles.css
├── js/
│   ├── auth.js
│   ├── cart.js
│   ├── checkout.js
│   ├── components.js
│   ├── env.js
│   ├── orderHistory.js
│   ├── productDetails.js
│   └── products-page.js
└── pages/
    ├── about.html
    ├── cart.html
    ├── checkout.html
    ├── contact.html
    ├── login.html
    ├── orderHistory.html
    ├── productDetails.html
    ├── products.html
    ├── profile.html
    └── register.html
```

---

## Application Architecture

### 1) Multi-Page Structure

Each page is a separate HTML file under `pages/` (plus `index.html`).

### 2) Shared UI Injection

`js/components.js` injects navbar and footer into:

- `#navbar-placeholder`
- `#footer-placeholder`

It also resolves relative links differently for root (`index.html`) vs pages under `/pages`.

### 3) Feature-Based JavaScript Modules

- `js/products-page.js` → category listing, search, add-to-cart
- `js/productDetails.js` → single product details, gallery, add-to-cart
- `js/cart.js` → render cart, quantity controls, totals, remove item
- `js/checkout.js` → render checkout summary, place order
- `js/orderHistory.js` → render logged-in user orders
- `js/auth.js` → register/login/profile/logout and profile name update

### 4) State Management

All state is persisted in `localStorage` (no centralized state library).

---

## Pages and User Flows

### Home

- File: `index.html`
- Contains hero slider and category shortcuts.
- Category cards navigate to products with query parameter, e.g. `products.html?category=smartphones`.

### Products

- File: `pages/products.html`
- Script: `js/products-page.js`
- Fetches products by category from DummyJSON.
- Supports search by product title.
- Add-to-cart validates against stock.

### Product Details

- File: `pages/productDetails.html`
- Script: `js/productDetails.js`
- Reads product `id` from URL query.
- Fetches product details, renders image thumbnails, supports add-to-cart.

### Cart

- File: `pages/cart.html`
- Script: `js/cart.js`
- Renders cart list from localStorage.
- Supports:
  - Increase/decrease quantity
  - Direct quantity input with stock cap
  - Remove item
  - Live total calculation

### Checkout

- File: `pages/checkout.html`
- Script: `js/checkout.js`
- Renders cart summary.
- Collects customer information.
- Persists order into order history and clears cart.

### Authentication and Profile

- Files: `pages/register.html`, `pages/login.html`, `pages/profile.html`
- Script: `js/auth.js`
- Supports:
  - Register (name/email/password)
  - Login (email/password)
  - Logout
  - Profile display + name update

### Order History

- File: `pages/orderHistory.html`
- Scripts: `js/auth.js`, `js/orderHistory.js`
- Requires logged-in user.
- Displays only orders matching current user email.

---

## Data Model (Local Storage)

The app currently uses these keys:

- `cart`: array of cart items
- `orderhistory`: array of submitted orders
- `users`: array of registered users
- `currentUser`: current session user object

### `cart` item shape

```json
{
  "id": "string|number",
  "name": "string",
  "price": 0,
  "quantity": 1,
  "image": "string-url",
  "stock": 0
}
```

### `orderhistory` item shape

```json
{
  "id": "ORD-<timestamp>",
  "date": "ISO string",
  "customer": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "notes": "string"
  },
  "items": [],
  "total": 0,
  "totalItems": 0
}
```

### `users` item shape

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "createdAt": "ISO string"
}
```

---

## External Dependencies

- Bootstrap CSS/JS via CDN
- Font Awesome via CDN
- Product API:
  - Category listing: `https://dummyjson.com/products/category/{category}`
  - Product details: `https://dummyjson.com/products/{id}`

---

## Setup and Run

1. Clone the repository.
2. Open it in VS Code.
3. Run a static server (recommended: Live Server extension).
4. Open `index.html` through the local server URL.

> Recommended: use `http://localhost` rather than opening files directly with `file://`.
