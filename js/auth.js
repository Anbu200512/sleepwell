/**
 * SleepWell - Authentication Controller
 * Handles Patient login, signup, demo autofills, session management, and role protection.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthPage();
});

function initAuthPage() {
  const loginForm = document.getElementById('patient-login-form');
  const signupForm = document.getElementById('patient-signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    setupDemoLogins();
  }

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
}

// Handle Patient / Admin Login
function handleLogin(e) {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier')?.value.trim();
  const password = document.getElementById('login-password')?.value;

  if (!identifier || !password) {
    if (window.showToast) window.showToast('Validation Error', 'Please enter your email/mobile and password.', 'error');
    return;
  }

  // Check if Admin Login
  if (identifier.toLowerCase() === 'admin@sleepwell.clinic' || identifier.toLowerCase() === 'admin') {
    const adminUser = {
      id: 'ADM-001',
      name: 'Clinical Administrator',
      email: 'admin@sleepwell.clinic',
      role: 'admin',
      token: 'mock-jwt-admin-' + Date.now()
    };
    localStorage.setItem('sleepwell_session', JSON.stringify(adminUser));
    if (window.showToast) window.showToast('Admin Authorized', 'Welcome to the SleepWell Clinical Admin Center.', 'success');
    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 700);
    return;
  }

  // Check Patient Login
  let existingUser = null;
  try {
    const raw = localStorage.getItem('sleepwell_user');
    if (raw) existingUser = JSON.parse(raw);
  } catch(err) {}

  if (!existingUser) {
    existingUser = {
      id: 'PT-10824',
      name: 'Sarah Jenkins',
      email: identifier,
      phone: '+1 (555) 392-8471',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    };
  }

  const patientSession = {
    ...existingUser,
    role: 'patient',
    token: 'mock-jwt-patient-' + Date.now()
  };

  localStorage.setItem('sleepwell_session', JSON.stringify(patientSession));
  localStorage.setItem('sleepwell_user', JSON.stringify(patientSession));

  if (window.showToast) {
    window.showToast('Login Successful', `Welcome back, ${patientSession.name}! Loading health portal...`, 'success');
  }

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 700);
}

// Quick Autofill for Demo Evaluation
function setupDemoLogins() {
  const patientDemoBtn = document.getElementById('btn-demo-patient');
  const adminDemoBtn = document.getElementById('btn-demo-admin');

  if (patientDemoBtn) {
    patientDemoBtn.addEventListener('click', () => {
      const emailField = document.getElementById('login-identifier');
      const passField = document.getElementById('login-password');
      if (emailField && passField) {
        emailField.value = 'sarah@sleepwell.clinic';
        passField.value = 'SleepWell2026!';
        if (window.showToast) window.showToast('Demo Credentials Loaded', 'Patient: Sarah Jenkins', 'info');
      }
    });
  }

  if (adminDemoBtn) {
    adminDemoBtn.addEventListener('click', () => {
      const emailField = document.getElementById('login-identifier');
      const passField = document.getElementById('login-password');
      if (emailField && passField) {
        emailField.value = 'admin@sleepwell.clinic';
        passField.value = 'ClinicalAdminPass99!';
        if (window.showToast) window.showToast('Demo Credentials Loaded', 'Admin: Clinical Director', 'info');
      }
    });
  }
}

// Handle Patient Registration
function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const phone = document.getElementById('signup-phone')?.value.trim();
  const dob = document.getElementById('signup-dob')?.value;
  const password = document.getElementById('signup-password')?.value;
  const confirmPassword = document.getElementById('signup-confirm-password')?.value;
  const concern = document.getElementById('signup-concern')?.value || 'Sleep Apnea Diagnostic';

  if (!name || !email || !phone || !password) {
    if (window.showToast) window.showToast('Missing Fields', 'Please complete all required fields.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    if (window.showToast) window.showToast('Password Mismatch', 'The passwords entered do not match.', 'error');
    return;
  }

  if (password.length < 6) {
    if (window.showToast) window.showToast('Weak Password', 'Password must be at least 6 characters.', 'error');
    return;
  }

  const newPatientId = 'PT-' + Math.floor(10000 + Math.random() * 90000);
  const newPatient = {
    id: newPatientId,
    name,
    email,
    phone,
    dob: dob || '1990-01-01',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: 'Patient Registered Online',
    insurance: 'Self-Pay / Pending Insurance Verification',
    primaryPhysician: 'SleepWell Clinical Intake Team',
    diagnosedConditions: [concern],
    activeCPAPDevice: 'Pending Specialist Assessment',
    token: 'mock-jwt-reg-' + Date.now()
  };

  // Save as current user
  localStorage.setItem('sleepwell_user', JSON.stringify(newPatient));
  localStorage.setItem('sleepwell_session', JSON.stringify(newPatient));

  // Add to admin patients list
  try {
    const rawList = localStorage.getItem('sleepwell_patients');
    const list = rawList ? JSON.parse(rawList) : [];
    list.unshift({
      id: newPatientId,
      name,
      email,
      phone,
      dob: dob || '1990-01-01',
      diagnosis: concern,
      cpapCompliance: 'New Patient',
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    localStorage.setItem('sleepwell_patients', JSON.stringify(list));
  } catch(err) {}

  // Create welcome notification
  try {
    const notifs = JSON.parse(localStorage.getItem('sleepwell_notifications') || '[]');
    notifs.unshift({
      id: 'notif-welcome',
      title: 'Welcome to SleepWell Health Portal',
      message: `Hello ${name}, your clinical record #${newPatientId} is active. You can now book sleep studies and manage CPAP therapy.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'system',
      link: 'dashboard.html'
    });
    localStorage.setItem('sleepwell_notifications', JSON.stringify(notifs));
  } catch(err) {}

  if (window.showToast) {
    window.showToast('Account Created!', `Registration complete. Logging into your portal...`, 'success');
  }

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 900);
}

// Social Provider Sign-In (Google, Apple, Facebook)
function socialLogin(provider) {
  let user = null;
  try {
    const raw = localStorage.getItem('sleepwell_user');
    if (raw) user = JSON.parse(raw);
  } catch(err) {}

  if (!user) {
    user = {
      id: 'PT-10824',
      name: 'Sarah Jenkins',
      email: 'sarah@sleepwell.clinic',
      phone: '+1 (555) 392-8471',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    };
  }

  const session = {
    ...user,
    role: 'patient',
    provider: provider,
    token: 'mock-jwt-' + provider.toLowerCase() + '-' + Date.now()
  };

  localStorage.setItem('sleepwell_session', JSON.stringify(session));
  localStorage.setItem('sleepwell_user', JSON.stringify(session));

  if (window.showToast) {
    window.showToast('Signed in with ' + provider, `Welcome back, ${session.name}! Loading your dashboard...`, 'success');
  }

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 700);
}

// Forgot Password Modal
function openForgotPasswordModal() {
  const email = prompt('Enter your registered patient email address to receive password reset instructions:');
  if (email) {
    if (window.showToast) {
      window.showToast('Reset Link Dispatched', `A secure reset token has been dispatched to ${email} (Demo simulated).`, 'info');
    }
  }
}

// Global Logout
function logoutUser() {
  localStorage.removeItem('sleepwell_session');
  if (window.showToast) {
    window.showToast('Logged Out', 'You have been securely logged out of your clinical portal.', 'info');
  }
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 500);
}

// Auth Guard for Protected Pages
function requireAuth(roleRequired = 'patient') {
  let session = null;
  try {
    const raw = localStorage.getItem('sleepwell_session');
    if (raw) session = JSON.parse(raw);
  } catch(e) {}

  // If no session exists, fallback to default demo patient or redirect
  if (!session) {
    // If accessing admin, require explicit admin login
    if (roleRequired === 'admin') {
      window.location.href = 'login.html';
      return false;
    }
    // For patient portal demo convenience, initialize Sarah Jenkins if no session
    const rawUser = localStorage.getItem('sleepwell_user');
    if (rawUser) {
      session = JSON.parse(rawUser);
      localStorage.setItem('sleepwell_session', rawUser);
    }
  }

  if (roleRequired === 'admin' && session && session.role !== 'admin') {
    alert('Access restricted. Clinical Administrator privileges required.');
    window.location.href = 'login.html';
    return false;
  }

  return session;
}

window.logoutUser = logoutUser;
window.requireAuth = requireAuth;
window.openForgotPasswordModal = openForgotPasswordModal;
window.socialLogin = socialLogin;
