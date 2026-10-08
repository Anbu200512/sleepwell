/**
 * SleepWell - Patient Dashboard Controller
 * Renders sidebar navigation, overview stats, appointments, sleep studies,
 * CPAP orders, billing receipts, notifications and profile editing.
 */

document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('patient');
  if (!session) { window.location.href = 'login.html'; return; }
  if (session.role === 'admin') { window.location.href = 'admin-dashboard.html'; return; }
  initPatientDashboard(session);
});

const DASH_PANELS = [
  { id: 'overview', label: 'Overview', icon: 'layout-grid' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar' },
  { id: 'results', label: 'Sleep Studies', icon: 'file-text' },
  { id: 'cpap', label: 'CPAP & Telemetry', icon: 'cpu' },
  { id: 'billing', label: 'Billing & Receipts', icon: 'receipt' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'profile', label: 'Profile', icon: 'user-round' }
];

let dashPatient = null;
let dashData = { appointments: [], studies: [], cpap: [], billing: [], notifs: [] };

const dashRead = key => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
};
const dashWrite = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const esc = value => String(value == null ? '' : value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function initPatientDashboard(session) {
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem('sleepwell_user') || 'null'); } catch (e) { stored = null; }
  dashPatient = Object.assign({}, stored || {}, session);

  renderDashboardShell();
  bindDashboardChrome();
  renderDashboardData();
  showPanel(activePanelId(), false);

  window.addEventListener('hashchange', () => showPanel(activePanelId(), false));
  window.renderDashboardData = renderDashboardData;
}

function activePanelId() {
  const id = (location.hash || '#overview').slice(1);
  return DASH_PANELS.some(p => p.id === id) ? id : 'overview';
}

function loadDashboardData() {
  const appointments = dashRead('sleepwell_appointments');
  const studies = dashRead('sleepwell_results');
  const billing = dashRead('sleepwell_billing');
  const notifs = dashRead('sleepwell_notifications');
  const mine = a => !a.patientId || a.patientId === dashPatient.id || a.patientEmail === dashPatient.email || a.patientName === dashPatient.name;

  dashData = {
    appointments: appointments.filter(mine),
    studies: studies.filter(s => !s.patientId || s.patientId === dashPatient.id),
    cpap: dashRead('sleepwell_cpap_orders'),
    billing,
    notifs: notifs.filter(n => !n.userId || n.userId === 'all' || n.userId === dashPatient.id)
  };
}

const unreadCount = () => dashData.notifs.filter(n => !n.read).length;

function renderDashboardData() {
  loadDashboardData();
  renderOverview();
  renderAppointments();
  renderStudies();
  renderCPAP();
  renderBilling();
  renderNotifications();
  renderProfile();
  renderUnreadBadges();
  if (window.lucide) window.lucide.createIcons();
}

function renderDashboardShell() {
  const sidebar = document.getElementById('dash-sidebar');
  const main = document.getElementById('dash-main');
  if (!sidebar || !main) return;

  sidebar.className = 'flex flex-col min-h-screen p-4 gap-4';
  sidebar.innerHTML = `
      <a href="index.html" class="flex items-center gap-3 group">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-lg font-black tracking-tight text-slate-900 dark:text-white">Sleep<span class="text-teal-600 dark:text-teal-400">Well</span></span>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Patient Portal</span>
        </div>
      </a>

      <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5 flex items-center gap-3">
        <img src="${esc(dashPatient.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80')}" alt="Patient avatar" class="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700">
        <div class="min-w-0">
          <strong class="block text-xs font-bold text-slate-900 dark:text-white truncate">${esc(dashPatient.name)}</strong>
          <span class="block text-[10px] font-mono text-slate-400 truncate">${esc(dashPatient.id)}</span>
        </div>
      </div>

      <nav class="space-y-1">
        <div class="px-3.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">My Care</div>
        ${DASH_PANELS.map(panel => `
          <a href="#${panel.id}" data-panel="${panel.id}" class="dash-link flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition">
            <span class="flex items-center gap-2.5">
              <i data-lucide="${panel.icon}" class="w-4 h-4"></i>
              <span>${panel.label}</span>
            </span>
            ${panel.id === 'notifications' ? '<span id="sidebar-unread" class="hidden min-w-[18px] px-1.5 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold grid place-items-center">0</span>' : '<i data-lucide="chevron-right" class="w-3.5 h-3.5 opacity-60"></i>'}
          </a>
        `).join('')}
      </nav>

      <div class="lg:hidden grid grid-cols-2 gap-2">
        <button type="button" onclick="toggleDirection()" class="grid place-items-center py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Switch text direction" aria-label="Switch text direction">
          <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
        </button>
        <button type="button" onclick="toggleTheme()" class="grid place-items-center py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Toggle dark or light mode" aria-label="Toggle dark or light mode">
          <span class="theme-icon-sun hidden"><i data-lucide="sun" class="w-4 h-4 text-amber-400"></i></span>
          <span class="theme-icon-moon block"><i data-lucide="moon" class="w-4 h-4"></i></span>
        </button>
      </div>

      <button type="button" onclick="logoutUser()" class="mt-auto w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition">
        <i data-lucide="log-out" class="w-4 h-4"></i>
        <span>Log Out</span>
      </button>
  `;

  main.innerHTML = `
    <section id="panel-overview" class="dash-panel space-y-6"></section>
    <section id="panel-appointments" class="dash-panel hidden space-y-6"></section>
    <section id="panel-results" class="dash-panel hidden space-y-6"></section>
    <section id="panel-cpap" class="dash-panel hidden space-y-6"></section>
    <section id="panel-billing" class="dash-panel hidden space-y-6"></section>
    <section id="panel-notifications" class="dash-panel hidden space-y-6"></section>
    <section id="panel-profile" class="dash-panel hidden space-y-6"></section>
  `;
}

function bindDashboardChrome() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerBtn = document.getElementById('drawer-btn');
  const notifBtn = document.getElementById('header-notif-btn');

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    overlay && overlay.classList.add('hidden');
    drawerBtn && drawerBtn.setAttribute('aria-expanded', 'false');
  };

  if (!window.dashChromeBound) {
    window.dashChromeBound = true;

    drawerBtn && drawerBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      overlay && overlay.classList.toggle('hidden', !open);
      drawerBtn.setAttribute('aria-expanded', String(open));
    });
    overlay && overlay.addEventListener('click', closeDrawer);
    notifBtn && notifBtn.addEventListener('click', () => showPanel('notifications'));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  document.querySelectorAll('.dash-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPanel(link.getAttribute('data-panel'));
    });
  });

  window.dashCloseDrawer = closeDrawer;
}

function showPanel(panelId, updateHash = true) {
  const id = DASH_PANELS.some(p => p.id === panelId) ? panelId : 'overview';

  document.querySelectorAll('.dash-panel').forEach(p => p.classList.add('hidden'));
  const target = document.getElementById('panel-' + id);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.dash-link').forEach(link => {
    const active = link.getAttribute('data-panel') === id;
    link.classList.toggle('bg-teal-600', active);
    link.classList.toggle('text-white', active);
    link.classList.toggle('text-slate-600', !active);
    link.classList.toggle('dark:text-slate-400', !active);
    link.classList.toggle('hover:bg-slate-100', !active);
    link.classList.toggle('dark:hover:bg-slate-800', !active);
  });

  if (updateHash && location.hash !== '#' + id) location.hash = id;
  if (window.dashCloseDrawer) window.dashCloseDrawer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
}

function renderUnreadBadges() {
  const count = unreadCount();
  ['sidebar-unread', 'header-unread'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
}

function statusChip(status) {
  const map = {
    Confirmed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    Completed: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    Scheduled: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    Rescheduled: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    Cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    Paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    Outstanding: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    'Insurance Pending': 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    Processing: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    Delivered: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
  };
  return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${map[status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}">${esc(status)}</span>`;
}

function panelCard(title, subtitle, body, action = '') {
  return `
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">${title}</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${subtitle}</p>
        </div>
        ${action}
      </div>
      ${body}
    </div>
  `;
}

function renderOverview() {
  const container = document.getElementById('panel-overview');
  if (!container) return;

  const today = new Date().toISOString().split('T')[0];
  const upcoming = dashData.appointments.filter(a => a.status !== 'Cancelled' && a.status !== 'Completed' && a.date >= today);
  const nextApt = [...upcoming].sort((a, b) => a.date.localeCompare(b.date))[0];
  const outstanding = dashData.billing.filter(b => b.status === 'Outstanding').reduce((sum, b) => sum + (b.amount || 0), 0);
  const activeDevice = dashData.cpap.find(o => String(o.status).includes('Active')) || dashData.cpap[0];
  const recentNotifs = dashData.notifs.slice(0, 4);

  const stats = [
    { label: 'Upcoming Visits', value: upcoming.length, hint: nextApt ? `Next: ${nextApt.date}` : 'No visit booked', tone: 'text-teal-600 dark:text-teal-400', icon: 'calendar-check' },
    { label: 'Unread Alerts', value: unreadCount(), hint: 'Notifications centre', tone: 'text-amber-500', icon: 'bell-ring' },
    { label: 'Outstanding Balance', value: '$' + outstanding.toLocaleString(), hint: outstanding ? 'Payment pending' : 'All invoices settled', tone: 'text-slate-900 dark:text-white', icon: 'wallet' },
    { label: 'CPAP Adherence', value: activeDevice ? activeDevice.complianceStatus : 'N/A', hint: activeDevice ? activeDevice.equipmentName : 'No device on file', tone: 'text-sky-600 dark:text-sky-400', icon: 'activity' }
  ];

  container.innerHTML = `
    <div class="rounded-3xl bg-gradient-to-r from-teal-600 to-sky-600 text-white p-6 sm:p-8 shadow-lg shadow-teal-600/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-white/70">Welcome back</p>
        <h1 class="text-2xl font-black mt-1">${esc(dashPatient.name)}</h1>
        <p class="text-sm text-white/80 mt-1">Record ${esc(dashPatient.id)} · ${esc(dashPatient.primaryPhysician || 'SleepWell Clinical Intake Team')}</p>
      </div>
      <button type="button" onclick="openAppointmentModal()" class="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-teal-700 text-sm font-bold hover:bg-teal-50 transition shadow">
        <i data-lucide="calendar-plus" class="w-4 h-4"></i>
        <span>Book Appointment</span>
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${stats.map(s => `
        <div class="h-full flex flex-col justify-between gap-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>${s.label}
          </span>
          <h3 class="text-xl font-black ${s.tone} break-words">${esc(s.value)}</h3>
          <span class="text-[10px] text-slate-400 truncate">${esc(s.hint)}</span>
        </div>
      `).join('')}
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        ${panelCard('Next Appointment', 'Your closest scheduled consultation or study.', upcoming.length === 0
          ? emptyState('calendar-x', 'No upcoming appointments.', 'Book a sleep consultation to get started.')
          : `
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <strong class="text-sm font-bold text-slate-900 dark:text-white">${esc(nextApt.serviceName)}</strong>
                ${statusChip(nextApt.status)}
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">${esc(nextApt.doctorName)} · ${esc(nextApt.location)}</p>
              <p class="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">${esc(nextApt.date)} at ${esc(nextApt.time)}</p>
            </div>
            <button type="button" onclick="showPanel('appointments')" class="shrink-0 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              View All
            </button>
          </div>
        `,
        `<button type="button" onclick="openAppointmentModal()" class="text-xs font-bold text-teal-600 hover:underline">New Booking →</button>`)}
      </div>

      <div>
        ${panelCard('Recent Alerts', 'Latest updates from the clinic.',
          recentNotifs.length === 0
            ? emptyState('bell-off', 'Nothing new.', 'You are all caught up.')
            : `<ul class="space-y-3">${recentNotifs.map(n => `
              <li class="flex gap-3 items-start">
                <span class="w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.read ? 'bg-slate-300 dark:bg-slate-700' : 'bg-teal-500'}"></span>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${esc(n.title)}</p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">${esc(n.message)}</p>
                  <span class="text-[10px] text-slate-400">${esc(n.date)}</span>
                </div>
              </li>
            `).join('')}</ul>`,
          `<button type="button" onclick="showPanel('notifications')" class="text-xs font-bold text-teal-600 hover:underline">All →</button>`)}
      </div>
    </div>
  `;
}

function renderAppointments() {
  const container = document.getElementById('panel-appointments');
  if (!container) return;

  const rows = [...dashData.appointments].sort((a, b) => b.date.localeCompare(a.date));
  const body = rows.length === 0
    ? emptyState('calendar-x', 'No appointments yet.', 'Book your first sleep consultation above.')
    : `
    <div class="overflow-x-auto -mx-1 px-1">
      <table class="w-full text-left rtl:text-right text-xs">
        <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-semibold">
          <tr>
            <th class="px-4 py-3 whitespace-nowrap">Ref</th>
            <th class="px-4 py-3 whitespace-nowrap">Service</th>
            <th class="px-4 py-3 whitespace-nowrap">Specialist</th>
            <th class="px-4 py-3 whitespace-nowrap">Schedule</th>
            <th class="px-4 py-3 whitespace-nowrap">Status</th>
            <th class="px-4 py-3 text-right rtl:text-left whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${rows.map(a => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
              <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">#${esc(a.id)}</td>
              <td class="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">${esc(a.serviceName)}</td>
              <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">${esc(a.doctorName)}</td>
              <td class="px-4 py-3.5 text-slate-500">${esc(a.date)} · ${esc(a.time)}</td>
              <td class="px-4 py-3.5">${statusChip(a.status)}</td>
              <td class="px-4 py-3.5 text-right rtl:text-left">
                ${a.status === 'Cancelled' || a.status === 'Completed' ? '<span class="text-slate-400">—</span>' : `
                  <button type="button" onclick="cancelAppointment('${esc(a.id)}')" class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
                    Cancel
                  </button>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;

  container.innerHTML = panelCard(
    'Appointments',
    'Every consultation, study and follow-up on your calendar.',
    body,
    `<button type="button" onclick="openAppointmentModal()" class="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition">
      <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i><span>Book Appointment</span>
    </button>`
  );
}

function renderStudies() {
  const container = document.getElementById('panel-results');
  if (!container) return;

  const body = dashData.studies.length === 0
    ? emptyState('file-x', 'No sleep study reports yet.', 'Polysomnography results appear here once scored.')
    : `
    <div class="overflow-x-auto -mx-1 px-1">
      <table class="w-full text-left rtl:text-right text-xs">
        <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-semibold">
          <tr>
            <th class="px-4 py-3 whitespace-nowrap">Study ID</th>
            <th class="px-4 py-3 whitespace-nowrap">Study Type</th>
            <th class="px-4 py-3 whitespace-nowrap">Test Date</th>
            <th class="px-4 py-3 whitespace-nowrap">AHI Score</th>
            <th class="px-4 py-3 whitespace-nowrap">Efficiency</th>
            <th class="px-4 py-3 whitespace-nowrap">Physician</th>
            <th class="px-4 py-3 whitespace-nowrap">Status</th>
            <th class="px-4 py-3 text-right rtl:text-left whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${dashData.studies.map(s => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
              <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">${esc(s.id)}</td>
              <td class="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">${esc(s.studyType)}</td>
              <td class="px-4 py-3.5 text-slate-500">${esc(s.testDate)}</td>
              <td class="px-4 py-3.5 font-bold text-rose-600 dark:text-rose-400">${esc(s.ahiScore)}</td>
              <td class="px-4 py-3.5 font-semibold text-teal-600 dark:text-teal-400">${esc(s.sleepEfficiency)}</td>
              <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">${esc(s.reportingDoctor)}</td>
              <td class="px-4 py-3.5">${statusChip('Completed')}<span class="ml-1 text-[10px] text-slate-400">${esc(s.reportStatus)}</span></td>
              <td class="px-4 py-3.5 text-right rtl:text-left">
                <button type="button" onclick="openStudyReport('${esc(s.id)}')" class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition">
                  View Report
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;

  container.innerHTML = panelCard('Sleep Studies & Results', 'Polysomnography reports, AHI scoring and physician findings.', body);
}

function renderCPAP() {
  const container = document.getElementById('panel-cpap');
  if (!container) return;

  const body = dashData.cpap.length === 0
    ? emptyState('cpu', 'No CPAP equipment on file.', 'Devices and supplies appear here after dispatch.')
    : `<div class="grid sm:grid-cols-2 gap-4">
      ${dashData.cpap.map(o => `
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <strong class="block text-sm font-bold text-slate-900 dark:text-white">${esc(o.equipmentName)}</strong>
              <span class="text-[11px] text-slate-400">${esc(o.equipmentType)} · ${esc(o.id)}</span>
            </div>
            ${statusChip(String(o.status).includes('Active') ? 'Active' : o.status)}
          </div>
          <dl class="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
            <div><dt class="text-slate-400 font-semibold">Serial</dt><dd class="font-mono text-slate-700 dark:text-slate-300 truncate">${esc(o.serialNumber)}</dd></div>
            <div><dt class="text-slate-400 font-semibold">Ordered</dt><dd class="text-slate-700 dark:text-slate-300">${esc(o.orderDate)}</dd></div>
            <div><dt class="text-slate-400 font-semibold">Pressure</dt><dd class="text-slate-700 dark:text-slate-300 truncate">${esc(o.currentPressureSetting)}</dd></div>
            <div><dt class="text-slate-400 font-semibold">Mask</dt><dd class="text-slate-700 dark:text-slate-300 truncate">${esc(o.maskType)}</dd></div>
            <div class="col-span-2"><dt class="text-slate-400 font-semibold">Adherence</dt><dd class="font-semibold text-teal-600 dark:text-teal-400">${esc(o.complianceStatus)}</dd></div>
            <div class="col-span-2"><dt class="text-slate-400 font-semibold">Telemetry</dt><dd class="text-slate-700 dark:text-slate-300">${esc(o.cellularTelemetry)}</dd></div>
            <div class="col-span-2"><dt class="text-slate-400 font-semibold">Logistics</dt><dd class="text-slate-700 dark:text-slate-300">${esc(o.deliveryStatus)}</dd></div>
            <div class="col-span-2"><dt class="text-slate-400 font-semibold">Next Filter</dt><dd class="text-slate-700 dark:text-slate-300">${esc(o.nextFilterChange)} · Supplies: ${esc(o.nextSupplyShipment)}</dd></div>
          </dl>
        </div>
      `).join('')}
    </div>`;

  container.innerHTML = panelCard('CPAP Orders & Telemetry', 'Your devices, mask supplies and nightly adherence tracking.', body);
}

function renderBilling() {
  const container = document.getElementById('panel-billing');
  if (!container) return;

  const outstanding = dashData.billing.filter(b => b.status === 'Outstanding').reduce((sum, b) => sum + (b.amount || 0), 0);
  const body = dashData.billing.length === 0
    ? emptyState('receipt', 'No invoices yet.', 'Copay receipts appear here after a visit.')
    : `
    <div class="overflow-x-auto -mx-1 px-1">
      <table class="w-full text-left rtl:text-right text-xs">
        <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-semibold">
          <tr>
            <th class="px-4 py-3 whitespace-nowrap">Invoice</th>
            <th class="px-4 py-3 whitespace-nowrap">Date</th>
            <th class="px-4 py-3 whitespace-nowrap">Service</th>
            <th class="px-4 py-3 whitespace-nowrap">Your Copay</th>
            <th class="px-4 py-3 whitespace-nowrap">Insurance</th>
            <th class="px-4 py-3 whitespace-nowrap">Status</th>
            <th class="px-4 py-3 text-right rtl:text-left whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${dashData.billing.map(inv => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
              <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">${esc(inv.id)}</td>
              <td class="px-4 py-3.5 text-slate-500">${esc(inv.date)}</td>
              <td class="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">${esc(inv.service)}</td>
              <td class="px-4 py-3.5 font-bold text-slate-900 dark:text-white">$${Number(inv.amount || 0).toFixed(2)}</td>
              <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">$${Number(inv.insuranceCovered || 0).toFixed(2)}</td>
              <td class="px-4 py-3.5">${statusChip(inv.status)}</td>
              <td class="px-4 py-3.5 text-right rtl:text-left">
                <button type="button" onclick="openReceipt('${esc(inv.id)}')" class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition">
                  Receipt
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;

  container.innerHTML = panelCard(
    'Billing & Receipts',
    `Insurance claims and copay history. Outstanding balance: <strong class="text-teal-600 dark:text-teal-400">$${outstanding.toFixed(2)}</strong>`,
    body
  );
}

function renderNotifications() {
  const container = document.getElementById('panel-notifications');
  if (!container) return;

  const body = dashData.notifs.length === 0
    ? emptyState('bell-off', 'No notifications.', 'Clinic updates will show up here.')
    : `<ul class="divide-y divide-slate-100 dark:divide-slate-800">
      ${dashData.notifs.map(n => `
        <li class="py-4 flex gap-4 items-start ${n.read ? 'opacity-70' : ''}">
          <span class="w-9 h-9 shrink-0 rounded-xl ${n.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400'} grid place-items-center">
            <i data-lucide="${notifIcon(n.type)}" class="w-4 h-4"></i>
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <strong class="text-sm font-bold text-slate-900 dark:text-white">${esc(n.title)}</strong>
              ${n.read ? '' : '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">NEW</span>'}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${esc(n.message)}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-[10px] text-slate-400">${esc(n.date)}</span>
              ${n.read ? '' : `<button type="button" onclick="markNotificationRead('${esc(n.id)}')" class="text-[10px] font-bold text-teal-600 hover:underline">Mark as read</button>`}
              ${n.link ? `<button type="button" onclick="openNotificationLink('${esc(n.link)}')" class="text-[10px] font-bold text-teal-600 hover:underline">Open</button>` : ''}
            </div>
          </div>
        </li>
      `).join('')}
    </ul>`;

  container.innerHTML = panelCard(
    'Notifications',
    'Appointment reminders, report releases and supply alerts.',
    body,
    dashData.notifs.some(n => !n.read)
      ? `<button type="button" onclick="markAllNotificationsRead()" class="shrink-0 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Mark all read</button>`
      : ''
  );
}

function renderProfile() {
  const container = document.getElementById('panel-profile');
  if (!container) return;

  const conditions = Array.isArray(dashPatient.diagnosedConditions) ? dashPatient.diagnosedConditions.join(', ') : (dashPatient.diagnosedConditions || 'Not recorded');

  container.innerHTML = panelCard('Profile & Medical Record', 'Keep your contact details and care information current.', `
    <form id="profile-form" class="grid sm:grid-cols-2 gap-4 max-w-3xl text-xs">
      ${profileField('Full Name', 'profile-name', dashPatient.name, 'text')}
      ${profileField('Email Address', 'profile-email', dashPatient.email, 'email', true)}
      ${profileField('Phone Number', 'profile-phone', dashPatient.phone, 'tel')}
      ${profileField('Date of Birth', 'profile-dob', dashPatient.dob, 'date')}
      ${profileField('Insurance Plan', 'profile-insurance', dashPatient.insurance, 'text', false, 'sm:col-span-2')}
      ${profileField('Home Address', 'profile-address', dashPatient.address, 'text', false, 'sm:col-span-2')}
      <div class="sm:col-span-2">
        <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Diagnosed Conditions</label>
        <input type="text" id="profile-conditions" value="${esc(conditions)}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold">
      </div>
      <div class="sm:col-span-2 flex items-center gap-3 pt-1">
        <button type="submit" class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow">Save Changes</button>
        <button type="button" onclick="logoutUser()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Log Out</button>
      </div>
    </form>
  `);

  const form = document.getElementById('profile-form');
  form && form.addEventListener('submit', saveProfile);
}

function profileField(label, id, value, type = 'text', readonly = false, span = '') {
  return `
    <div class="${span}">
      <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">${label}</label>
      <input type="${type}" id="${id}" value="${esc(value || '')}" ${readonly ? 'readonly' : ''} class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold disabled:text-slate-400">
    </div>
  `;
}

function saveProfile(e) {
  e.preventDefault();
  const updated = Object.assign({}, dashPatient, {
    name: document.getElementById('profile-name').value.trim(),
    email: document.getElementById('profile-email').value.trim(),
    phone: document.getElementById('profile-phone').value.trim(),
    dob: document.getElementById('profile-dob').value,
    insurance: document.getElementById('profile-insurance').value.trim(),
    address: document.getElementById('profile-address').value.trim(),
    diagnosedConditions: document.getElementById('profile-conditions').value.split(',').map(s => s.trim()).filter(Boolean)
  });

  const sessionRaw = localStorage.getItem('sleepwell_session');
  if (sessionRaw) localStorage.setItem('sleepwell_session', JSON.stringify(Object.assign({}, JSON.parse(sessionRaw), updated)));
  localStorage.setItem('sleepwell_user', JSON.stringify(updated));

  const patients = dashRead('sleepwell_patients');
  const record = patients.find(p => p.id === updated.id);
  if (record) {
    record.name = updated.name;
    record.phone = updated.phone;
    record.dob = updated.dob;
    dashWrite('sleepwell_patients', patients);
  }

  dashPatient = updated;
  renderDashboardShell();
  bindDashboardChrome();
  renderDashboardData();
  showPanel('profile', false);

  if (window.showToast) window.showToast('Profile Updated', 'Your medical record details were saved.', 'success');
}

function cancelAppointment(id) {
  if (!confirm(`Cancel appointment #${id}?`)) return;
  const appointments = dashRead('sleepwell_appointments');
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;
  apt.status = 'Cancelled';
  dashWrite('sleepwell_appointments', appointments);
  renderDashboardData();
  if (window.showToast) window.showToast('Appointment Cancelled', `#${id} has been cancelled.`, 'info');
}

function markNotificationRead(id) {
  const notifs = dashRead('sleepwell_notifications');
  const notif = notifs.find(n => n.id === id);
  if (!notif) return;
  notif.read = true;
  dashWrite('sleepwell_notifications', notifs);
  renderDashboardData();
}

function markAllNotificationsRead() {
  const notifs = dashRead('sleepwell_notifications').map(n => ({ ...n, read: true }));
  dashWrite('sleepwell_notifications', notifs);
  renderDashboardData();
  if (window.showToast) window.showToast('All Caught Up', 'Notifications marked as read.', 'success');
}

function openNotificationLink(link) {
  const hash = String(link).includes('#') ? String(link).split('#')[1] : '';
  if (hash && DASH_PANELS.some(p => p.id === hash)) showPanel(hash);
  else location.href = link;
}

function notifIcon(type) {
  return ({ appointment: 'calendar', cpap: 'cpu', result: 'file-text', equipment: 'package', system: 'info' })[type] || 'bell';
}

function emptyState(icon, title, text) {
  return `
    <div class="py-14 text-center">
      <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-400">
        <i data-lucide="${icon}" class="w-6 h-6"></i>
      </div>
      <p class="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">${title}</p>
      <p class="text-xs text-slate-400 mt-1">${text}</p>
    </div>
  `;
}

function openDetailModal(html) {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;
  modal.querySelector('.modal-panel').innerHTML = html;
  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeDetailModal() {
  const modal = document.getElementById('detail-modal');
  if (modal) modal.classList.add('hidden');
}

function openReceipt(id) {
  const inv = dashData.billing.find(b => b.id === id);
  if (!inv) return;
  openDetailModal(`
    <div class="p-6 sm:p-8">
      <div id="printable-content" class="text-xs text-slate-700 dark:text-slate-300 space-y-4">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <p class="text-lg font-black text-slate-900 dark:text-white">SleepWell Clinic</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Sleep Disorder & CPAP Therapy Institute</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">+1 (800) 555-SLEEP · billing@sleepwell.clinic</p>
          </div>
          <div class="text-right">
            <p class="font-mono font-bold text-slate-900 dark:text-white">${esc(inv.id)}</p>
            <p class="text-[11px] text-slate-500">${esc(inv.date)}</p>
            ${statusChip(inv.status)}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-[10px] uppercase font-bold text-slate-400">Billed To</p><p class="font-semibold">${esc(dashPatient.name)}</p><p class="text-[11px] text-slate-500">Record ${esc(dashPatient.id)}</p></div>
          <div><p class="text-[10px] uppercase font-bold text-slate-400">Rendering Provider</p><p class="font-semibold">${esc(inv.billingDoctor || 'SleepWell Clinical')}</p><p class="text-[11px] text-slate-500">${esc(inv.paymentMethod || '')}</p></div>
        </div>

        <div class="border-t border-slate-200 dark:border-slate-700 pt-3">
          <p class="font-bold text-slate-900 dark:text-white">${esc(inv.service)}</p>
        </div>

        <table class="w-full text-left rtl:text-right">
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr><td class="py-2">Gross Amount</td><td class="py-2 text-right font-semibold">$${Number(inv.grossAmount || 0).toFixed(2)}</td></tr>
            <tr><td class="py-2">Insurance Covered</td><td class="py-2 text-right font-semibold">-$${Number(inv.insuranceCovered || 0).toFixed(2)}</td></tr>
            <tr><td class="py-2 font-bold text-slate-900 dark:text-white">Patient Copay</td><td class="py-2 text-right font-black text-teal-600 dark:text-teal-400">$${Number(inv.amount || 0).toFixed(2)}</td></tr>
          </tbody>
        </table>

        <p class="text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
          Transaction: ${esc(inv.transactionId || 'N/A')} · Keep this receipt for insurance reimbursement.
        </p>
      </div>

      <div class="flex justify-end gap-3 pt-5 no-print">
        <button type="button" onclick="closeDetailModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Close</button>
        <button type="button" onclick="window.print()" class="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition inline-flex items-center gap-2">
          <i data-lucide="printer" class="w-4 h-4"></i><span>Print Receipt</span>
        </button>
      </div>
    </div>
  `);
}

function openStudyReport(id) {
  const study = dashData.studies.find(s => s.id === id);
  if (!study) return;
  const rows = [
    ['Study Type', study.studyType], ['Test Date', study.testDate], ['Reporting Physician', study.reportingDoctor],
    ['Recording Hours', study.recordingHours], ['Total Sleep Time', study.totalSleepTime], ['Sleep Efficiency', study.sleepEfficiency],
    ['AHI Score', study.ahiScore], ['AHI Severity', study.ahiSeverity], ['Oxygen Nadir', study.oxygenNadir],
    ['Baseline SpO2', study.baselineSpO2], ['Snoring Episodes', study.snoringEpisodes], ['Report Status', study.reportStatus]
  ];
  openDetailModal(`
    <div class="p-6 sm:p-8">
      <div id="printable-content" class="text-xs text-slate-700 dark:text-slate-300 space-y-4">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <p class="text-lg font-black text-slate-900 dark:text-white">Sleep Study Report</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">${esc(dashPatient.name)} · Record ${esc(dashPatient.id)}</p>
          </div>
          <p class="font-mono font-bold text-slate-900 dark:text-white">${esc(study.id)}</p>
        </div>

        <dl class="grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
          ${rows.map(([label, value]) => `
            <div class="flex justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <dt class="text-slate-400 font-semibold">${label}</dt>
              <dd class="font-semibold text-right">${esc(value)}</dd>
            </div>
          `).join('')}
        </dl>

        <div class="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5">
          <p class="text-[10px] uppercase font-bold text-slate-400 mb-1">Clinical Summary</p>
          <p class="leading-relaxed">${esc(study.summaryFindings)}</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-5 no-print">
        <button type="button" onclick="closeDetailModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Close</button>
        <button type="button" onclick="window.print()" class="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition inline-flex items-center gap-2">
          <i data-lucide="printer" class="w-4 h-4"></i><span>Print Report</span>
        </button>
      </div>
    </div>
  `);
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal) closeDetailModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetailModal(); });
});

window.showPanel = showPanel;
window.cancelAppointment = cancelAppointment;
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
window.openNotificationLink = openNotificationLink;
window.openReceipt = openReceipt;
window.openStudyReport = openStudyReport;
window.closeDetailModal = closeDetailModal;
