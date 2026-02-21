const db = window.appDb;

function sanitizeEmail(email) {
  return email.trim().toLowerCase();
}

function initializeRegisterPage() {
  const form = document.getElementById('register-form');
  const status = document.getElementById('register-status');

  if (!form || !status) {
    return;
  }

  form.addEventListener('submit', async (event) => {
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

    try {
      const existingUser = await db.findProfileByEmail(email);

      if (existingUser) {
        status.textContent = 'Email already exists. Please login.';
        status.className = 'auth-status error';
        return;
      }

      const createdUser = await db.registerProfile({
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      db.setCurrentUser(createdUser);
      status.textContent = 'Account created successfully. Redirecting...';
      status.className = 'auth-status success';

      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 700);
    } catch (error) {
      console.error(error);
      status.textContent =
        'Unable to create account right now. Please try again.';
      status.className = 'auth-status error';
    }
  });
}

function initializeLoginPage() {
  const form = document.getElementById('login-form');
  const status = document.getElementById('login-status');

  if (!form || !status) {
    return;
  }

  const loggedInUser = db.getCurrentUser();
  if (loggedInUser) {
    window.location.href = 'profile.html';
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = sanitizeEmail(document.getElementById('login-email').value);
    const password = document.getElementById('login-password').value;

    try {
      const matchedUser = await db.loginProfile(email, password);

      if (!matchedUser) {
        status.textContent = 'Invalid email or password.';
        status.className = 'auth-status error';
        return;
      }

      db.setCurrentUser(matchedUser);

      status.textContent = 'Login successful. Redirecting...';
      status.className = 'auth-status success';

      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 700);
    } catch (error) {
      console.error(error);
      status.textContent = 'Unable to login right now. Please try again.';
      status.className = 'auth-status error';
    }
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

  const currentUser = db.getCurrentUser();

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
    db.clearCurrentUser();
    window.location.href = 'login.html';
  });

  editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedName = editName.value.trim();

    if (!updatedName) {
      status.textContent = 'Name cannot be empty.';
      status.className = 'auth-status error mt-3';
      return;
    }

    try {
      const updatedUser = await db.updateProfileName(
        currentUser.id,
        updatedName
      );
      db.setCurrentUser(updatedUser);
      nameEl.textContent = updatedUser.name;
      status.textContent = 'Profile updated successfully.';
      status.className = 'auth-status success mt-3';
    } catch (error) {
      console.error(error);
      status.textContent = 'Unable to update profile right now.';
      status.className = 'auth-status error mt-3';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeRegisterPage();
  initializeLoginPage();
  initializeProfilePage();
});
