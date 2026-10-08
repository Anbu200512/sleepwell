/**
 * SleepWell - Navigation & Header Component Controller
 * Controls desktop dropdowns, mobile menu drawer, active state, and navbar effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
});

function initNavbar() {
  const navContainer = document.getElementById('main-navbar');
  if (!navContainer) return;

  // Render standardized SleepWell Navbar into navContainer
  const currentPath = window.location.pathname.toLowerCase();
  const isHome1 = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('sleepwell') || currentPath.endsWith('sleepwell/');
  const isHome2 = currentPath.endsWith('home2.html');
  const isServices = currentPath.endsWith('services.html');
  const isAbout = currentPath.endsWith('about.html');
  const isBlog = currentPath.endsWith('blog.html');
  const isDoctors = currentPath.endsWith('doctors.html');
 const isContact = currentPath.endsWith('contact.html');
  const isPatientDash = currentPath.endsWith('dashboard.html');
  const isAdminDash = currentPath.endsWith('admin-dashboard.html');
  const isLogin = currentPath.endsWith('login.html');
  const isSignup = currentPath.endsWith('signup.html');

  // Check login state
  let currentUser = null;
  try {
    const rawUser = localStorage.getItem('sleepwell_user');
    if (rawUser) currentUser = JSON.parse(rawUser);
  } catch(e) {}

  navContainer.innerHTML = `
    <nav class="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 glass-nav border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <a href="index.html" class="flex items-center space-x-3 rtl:space-x-reverse group">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </div>
              <div class="flex flex-col">
                <span class="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  Sleep<span class="text-teal-600 dark:text-teal-400">Well</span>
                  <span class="w-2 h-2 rounded-full bg-teal-500 ml-1.5 rtl:ml-0 rtl:mr-1.5 animate-pulse"></span>
                </span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden lg:flex items-center space-x-1 xl:space-x-2 rtl:space-x-reverse">
            
            <!-- Home Dropdown -->
            <div class="relative dropdown-parent">
              <button class="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isHome1 || isHome2 ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
                <span>Home</span>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform group-hover:rotate-180"></i>
              </button>
              <div class="dropdown-menu absolute left-0 rtl:left-auto rtl:right-0 top-full pt-2 w-52">
                <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 space-y-1">
                  <a href="index.html" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${isHome1 ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">
                    <span>Home 1</span>
                    ${isHome1 ? '<span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>' : ''}
                  </a>
                  <a href="home2.html" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${isHome2 ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">
                    <span>Home 2</span>
                    ${isHome2 ? '<span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>' : ''}
                  </a>
                </div>
              </div>
            </div>

            <!-- About Link -->
            <a href="about.html" class="px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isAbout ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
              About
            </a>

            <!-- Blog Link -->
            <a href="blog.html" class="px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isBlog ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
              Blog
            </a>

            <!-- Services Link -->
            <a href="services.html" class="px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isServices ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
              Services
            </a>

            <!-- Doctors Link -->
            <a href="doctors.html" class="px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isDoctors ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
              Doctors
            </a>

            <!-- Contact Link -->
            <a href="contact.html" class="px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isContact ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
              Contact
            </a>

            <!-- Dashboard Dropdown (Required) -->
            <div class="relative dropdown-parent">
              <button class="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl text-sm font-semibold transition ${isPatientDash || isAdminDash ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40' : 'text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
                <span>Dashboard</span>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform group-hover:rotate-180"></i>
              </button>
              <div class="dropdown-menu absolute left-0 rtl:left-auto rtl:right-0 top-full pt-2 w-56">
                <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 space-y-1">
                  <a href="dashboard.html" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${isPatientDash ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">
                    <span>Patient Dashboard</span>
                    ${isPatientDash ? '<span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>' : ''}
                  </a>
                  <a href="admin-dashboard.html" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${isAdminDash ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">
                    <span>Admin Dashboard</span>
                    ${isAdminDash ? '<span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>' : ''}
                  </a>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Action Bar -->
          <div class="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            
            <!-- RTL / LTR Direction Toggle -->
            <button type="button" onclick="toggleDirection()" class="hidden lg:grid place-items-center dir-toggle-btn p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 transition" title="Toggle RTL / LTR Direction">
              <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
            </button>

            <!-- Dark / Light Theme Toggle -->
            <button type="button" onclick="toggleTheme()" class="hidden lg:grid place-items-center theme-toggle-btn p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 transition" title="Toggle Dark/Light Mode">
              <span class="theme-icon-sun hidden"><i data-lucide="sun" class="w-4 h-4 text-amber-400"></i></span>
              <span class="theme-icon-moon block"><i data-lucide="moon" class="w-4 h-4 text-slate-600 dark:text-slate-300"></i></span>
            </button>

            <!-- Login Button -->
            <a href="login.html" class="hidden lg:inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 hover:shadow-lg transition">
              <i data-lucide="log-in" class="w-4 h-4"></i>
              <span>Login</span>
            </a>

            <!-- Mobile Hamburger Button -->
            <button type="button" id="mobile-menu-btn" class="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Toggle Navigation">
              <i data-lucide="menu" class="w-6 h-6"></i>
            </button>

          </div>
        </div>
      </div>

      <!-- Mobile Slide-out Menu Drawer -->
      <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto space-y-3">
        
        <!-- Mobile Home Accordion -->
        <div class="border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <button type="button" onclick="toggleMobileSubmenu('mobile-home-submenu')" class="flex items-center justify-between w-full py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            <span class="flex items-center space-x-2 rtl:space-x-reverse">
              <span>Home</span>
            </span>
            <i data-lucide="chevron-down" id="mobile-home-submenu-icon" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </button>
          <div id="mobile-home-submenu" class="hidden pl-6 rtl:pl-0 rtl:pr-6 space-y-1 mt-1">
            <a href="index.html" class="block py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Home 1</a>
            <a href="home2.html" class="block py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Home 2</a>
          </div>
        </div>

        <a href="about.html" class="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          <span>About Clinic</span>
        </a>

        <a href="blog.html" class="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          <span>Blog</span>
        </a>

        <a href="services.html" class="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          <span>Services</span>
        </a>

        <a href="doctors.html" class="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          <span>Doctors & Specialists</span>
        </a>

        <a href="contact.html" class="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          <span>Contact Clinic</span>
        </a>

        <!-- Mobile Dashboard Accordion -->
        <div class="border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <button type="button" onclick="toggleMobileSubmenu('mobile-dash-submenu')" class="flex items-center justify-between w-full py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            <span class="flex items-center space-x-2 rtl:space-x-reverse">
              <span>Dashboards</span>
            </span>
            <i data-lucide="chevron-down" id="mobile-dash-submenu-icon" class="w-4 h-4 text-slate-400 transition-transform"></i>
          </button>
          <div id="mobile-dash-submenu" class="hidden pl-6 rtl:pl-0 rtl:pr-6 space-y-1 mt-1">
            <a href="dashboard.html" class="block py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Patient Dashboard</a>
            <a href="admin-dashboard.html" class="block py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Admin Clinical Portal</a>
          </div>
        </div>

        <!-- Mobile Display Controls -->
        <div class="grid grid-cols-2 gap-2">
          <button type="button" onclick="toggleDirection()" class="grid place-items-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Toggle RTL / LTR Direction" aria-label="Toggle RTL / LTR Direction">
            <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
          </button>
          <button type="button" onclick="toggleTheme()" class="grid place-items-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Toggle Dark/Light Mode" aria-label="Toggle Dark/Light Mode">
            <span class="theme-icon-sun hidden"><i data-lucide="sun" class="w-4 h-4 text-amber-400"></i></span>
            <span class="theme-icon-moon block"><i data-lucide="moon" class="w-4 h-4"></i></span>
          </button>
        </div>

        <div class="pt-2 flex flex-col gap-2.5">
          <a href="login.html" class="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm">
            <i data-lucide="log-in" class="w-4 h-4"></i>
            <span>Login</span>
          </a>
        </div>

      </div>
    </nav>
  `;

  // Attach mobile menu hamburger toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Desktop Dropdown click support for touch & accessibility
  document.querySelectorAll('.dropdown-parent').forEach(parent => {
    const btn = parent.querySelector('button');
    const menu = parent.querySelector('.dropdown-menu');
    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('active');
        document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
        if (!isOpen) {
          menu.classList.add('active');
        }
      });
    }
  });

  // Close desktop dropdowns on click outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
  });

  // Update icons and theme states
  if (window.updateThemeIcons) window.updateThemeIcons();
  if (window.lucide) window.lucide.createIcons();
}

function toggleMobileSubmenu(submenuId) {
  const submenu = document.getElementById(submenuId);
  const icon = document.getElementById(submenuId + '-icon');
  if (submenu) {
    submenu.classList.toggle('hidden');
    if (icon) {
      icon.style.transform = submenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  }
}
