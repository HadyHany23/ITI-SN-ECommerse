const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function sanitizeEmail(email) {
  return email.trim().toLowerCase();
}

function initializeRegisterPage() {
  const form = document.getElementById('register-form');
  const status = document.getElementById('register-status');

  if (!form || !status) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = sanitizeEmail(
      document.getElementById('register-email').value
    );
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById(
      'register-confirm-password'
    ).value;

    if (!name || !email || !password || !confirmPassword) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'auth-status error';
      return;
    }

    if (password !== confirmPassword) {
      status.textContent = 'Passwords do not match.';
      status.className = 'auth-status error';
      return;
    }

    const users = getUsers();
    const alreadyExists = users.some((user) => user.email === email);

    if (alreadyExists) {
      status.textContent = 'Email already exists. Please login.';
      status.className = 'auth-status error';
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });

    status.textContent = 'Account created successfully. Redirecting...';
    status.className = 'auth-status success';

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 700);
  });
}

function initializeLoginPage() {
  const form = document.getElementById('login-form');
  const status = document.getElementById('login-status');

  if (!form || !status) {
    return;
  }

  const loggedInUser = getCurrentUser();
  if (loggedInUser) {
    window.location.href = 'profile.html';
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = sanitizeEmail(document.getElementById('login-email').value);
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      status.textContent = 'Invalid email or password.';
      status.className = 'auth-status error';
      return;
    }

    setCurrentUser({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      createdAt: matchedUser.createdAt,
    });

    status.textContent = 'Login successful. Redirecting...';
    status.className = 'auth-status success';

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 700);
  });
}

function initializeProfilePage() {
  const guestView = document.getElementById('profile-guest-view');
  const userView = document.getElementById('profile-user-view');
  const nameEl = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const joinedEl = document.getElementById('profile-joined');
  const logoutBtn = document.getElementById('logout-btn');
  const editForm = document.getElementById('profile-edit-form');
  const editName = document.getElementById('edit-name');
  const status = document.getElementById('profile-status');

  if (!guestView || !userView) {
    return;
  }

  const currentUser = getCurrentUser();

  if (!currentUser) {
    guestView.classList.remove('d-none');
    userView.classList.add('d-none');
    return;
  }

  guestView.classList.add('d-none');
  userView.classList.remove('d-none');

  nameEl.textContent = currentUser.name;
  emailEl.textContent = currentUser.email;
  joinedEl.textContent = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString()
    : '-';
  editName.value = currentUser.name;

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'login.html';
  });

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedName = editName.value.trim();

    if (!updatedName) {
      status.textContent = 'Name cannot be empty.';
      status.className = 'auth-status error mt-3';
      return;
    }

    const users = getUsers();
    const userIndex = users.findIndex((user) => user.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex].name = updatedName;
      saveUsers(users);
    }

    const updatedCurrentUser = { ...currentUser, name: updatedName };
    setCurrentUser(updatedCurrentUser);

    nameEl.textContent = updatedName;
    status.textContent = 'Profile updated successfully.';
    status.className = 'auth-status success mt-3';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeRegisterPage();
  initializeLoginPage();
  initializeProfilePage();
});
