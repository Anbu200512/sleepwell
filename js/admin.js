/**
 * SleepWell - Admin Clinical Dashboard Controller
 * Provides administrative oversight: Patients, Appointments, Sleep Studies, CPAP Orders, Billing, Doctors, Enquiries.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupAdminTabs();
  renderAdminAll();
  setupAdminModals();
});

function setupAdminTabs() {
  const tabLinks = document.querySelectorAll('.admin-tab-link');
  const tabPanels = document.querySelectorAll('.admin-panel');
  const sidebarToggle = document.getElementById('admin-sidebar-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.add('hidden');
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
  };

  function switchAdminTab(targetTabId, updateHash = true) {
    tabPanels.forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(targetTabId);
    if (target) target.classList.remove('hidden');

    tabLinks.forEach(link => {
      if (link.getAttribute('data-tab') === targetTabId) {
        link.classList.add('bg-teal-600', 'text-white');
        link.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      } else {
        link.classList.remove('bg-teal-600', 'text-white');
        link.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      }
    });

    const activeLink = Array.from(tabLinks).find(l => l.getAttribute('data-tab') === targetTabId);
    if (updateHash && activeLink) {
      const hash = activeLink.getAttribute('href');
      if (hash && location.hash !== hash) location.hash = hash;
    }

    closeDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) window.lucide.createIcons();
  }

  const panelIdFromHash = () => {
    const match = Array.from(tabLinks).find(l => l.getAttribute('href') === location.hash);
    return match ? match.getAttribute('data-tab') : null;
  };

  tabLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchAdminTab(link.getAttribute('data-tab'));
    });
  });

  if (sidebarToggle && drawer) {
    sidebarToggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      if (overlay) overlay.classList.toggle('hidden', !open);
      sidebarToggle.setAttribute('aria-expanded', String(open));
    });
  }
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  window.addEventListener('hashchange', () => {
    const panelId = panelIdFromHash();
    if (panelId) switchAdminTab(panelId, false);
  });

  switchAdminTab(panelIdFromHash() || 'admin-panel-overview', false);
}

function renderAdminAll() {
  const patients = JSON.parse(localStorage.getItem('sleepwell_patients') || '[]');
  const appointments = JSON.parse(localStorage.getItem('sleepwell_appointments') || '[]');
  const studies = JSON.parse(localStorage.getItem('sleepwell_results') || '[]');
  const cpapOrders = JSON.parse(localStorage.getItem('sleepwell_cpap_orders') || '[]');
  const billing = JSON.parse(localStorage.getItem('sleepwell_billing') || '[]');
  const doctors = JSON.parse(localStorage.getItem('sleepwell_doctors') || '[]');
  const enquiries = JSON.parse(localStorage.getItem('sleepwell_enquiries') || '[]');

  renderAdminOverview(patients, appointments, studies, cpapOrders, billing);
  renderAdminPatients(patients);
  renderAdminAppointments(appointments);
  renderAdminStudies(studies);
  renderAdminCPAP(cpapOrders);
  renderAdminBilling(billing);
  renderAdminDoctors(doctors);
  renderAdminEnquiries(enquiries);

  if (window.lucide) window.lucide.createIcons();
}

// 1. Overview Tab
function renderAdminOverview(patients, appointments, studies, cpapOrders, billing) {
  const statPatients = document.getElementById('stat-patients-count');
  const statAppointments = document.getElementById('stat-appointments-count');
  const statStudies = document.getElementById('stat-studies-count');
  const statCPAP = document.getElementById('stat-cpap-count');
  const statRevenue = document.getElementById('stat-revenue-count');

  if (statPatients) statPatients.textContent = patients.length + 1480;
  if (statAppointments) statAppointments.textContent = appointments.length;
  if (statStudies) statStudies.textContent = studies.length + 5;
  if (statCPAP) statCPAP.textContent = cpapOrders.length + 42;

  const totalOutstanding = billing
    .filter(b => b.status === 'Outstanding')
    .reduce((sum, b) => sum + b.amount, 0);
  if (statRevenue) statRevenue.textContent = '$' + (totalOutstanding + 4200).toLocaleString();

  // Recent Appointments table in overview
  const recentTable = document.getElementById('admin-overview-appointments');
  if (recentTable) {
    const recentRows = appointments.slice(0, 5);
    recentTable.innerHTML = recentRows.length === 0
      ? `<tr><td colspan="5" class="px-4 py-10 text-center text-slate-400">No scheduled appointments yet.</td></tr>`
      : recentRows.map(apt => `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
        <td class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">${apt.patientName}</td>
        <td class="px-4 py-3 text-slate-600 dark:text-slate-400">${apt.serviceName}</td>
        <td class="px-4 py-3 text-slate-500">${apt.date} (${apt.time})</td>
        <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${apt.doctorName}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
            apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
            apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
            'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
          }">
            ${apt.status}
          </span>
        </td>
      </tr>
    `).join('');
  }
}

// 2. Patients Tab
function renderAdminPatients(patients) {
  const container = document.getElementById('admin-patients-tbody');
  if (!container) return;

  if (patients.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="px-4 py-10 text-center text-slate-400">No patient records registered yet.</td></tr>`;
    return;
  }

  container.innerHTML = patients.map(p => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
      <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">${p.id}</td>
      <td class="px-4 py-3.5 font-bold text-slate-900 dark:text-white">${p.name}</td>
      <td class="px-4 py-3.5 text-slate-500 dark:text-slate-400">${p.phone}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-300">${p.diagnosis}</td>
      <td class="px-4 py-3.5 font-semibold text-teal-600 dark:text-teal-400">${p.cpapCompliance}</td>
      <td class="px-4 py-3.5 text-slate-500">${p.lastVisit}</td>
      <td class="px-4 py-3.5">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          ${p.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// 3. Appointments Management Tab
function renderAdminAppointments(appointments) {
  const container = document.getElementById('admin-appointments-tbody');
  if (!container) return;

  if (appointments.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="px-4 py-10 text-center text-slate-400">No appointments scheduled yet.</td></tr>`;
    return;
  }

  container.innerHTML = appointments.map(apt => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
      <td class="px-4 py-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">#${apt.id}</td>
      <td class="px-4 py-3.5">
        <strong class="text-slate-900 dark:text-white block">${apt.patientName}</strong>
        <span class="text-slate-400 text-[10px]">${apt.patientPhone}</span>
      </td>
      <td class="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">${apt.serviceName}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">${apt.doctorName}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">${apt.date} • ${apt.time}</td>
      <td class="px-4 py-3.5">
        <select onchange="updateAppointmentStatus('${apt.id}', this.value)" class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
          <option value="Confirmed" ${apt.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Completed" ${apt.status === 'Completed' ? 'selected' : ''}>Completed</option>
          <option value="Scheduled" ${apt.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
          <option value="Rescheduled" ${apt.status === 'Rescheduled' ? 'selected' : ''}>Rescheduled</option>
          <option value="Cancelled" ${apt.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td class="px-4 py-3.5 text-right rtl:text-left">
        <button onclick="deleteAppointment('${apt.id}')" class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition" title="Delete Appointment">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function updateAppointmentStatus(aptId, newStatus) {
  const appointments = JSON.parse(localStorage.getItem('sleepwell_appointments') || '[]');
  const apt = appointments.find(a => a.id === aptId);
  if (apt) {
    apt.status = newStatus;
    localStorage.setItem('sleepwell_appointments', JSON.stringify(appointments));
    if (window.showToast) window.showToast('Status Updated', `Appointment #${aptId} set to ${newStatus}.`, 'success');
  }
}

function deleteAppointment(aptId) {
  if (confirm(`Permanently remove appointment #${aptId}?`)) {
    let appointments = JSON.parse(localStorage.getItem('sleepwell_appointments') || '[]');
    appointments = appointments.filter(a => a.id !== aptId);
    localStorage.setItem('sleepwell_appointments', JSON.stringify(appointments));
    renderAdminAll();
    if (window.showToast) window.showToast('Appointment Removed', `Record #${aptId} deleted.`, 'info');
  }
}

// 4. Sleep Studies Tab
function renderAdminStudies(studies) {
  const container = document.getElementById('admin-studies-tbody');
  if (!container) return;

  if (studies.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="px-4 py-10 text-center text-slate-400">No sleep study records found.</td></tr>`;
    return;
  }

  container.innerHTML = studies.map(s => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
      <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">${s.id}</td>
      <td class="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">${s.studyType}</td>
      <td class="px-4 py-3.5 text-slate-500">${s.testDate}</td>
      <td class="px-4 py-3.5 font-bold text-rose-600 dark:text-rose-400">${s.ahiScore}</td>
      <td class="px-4 py-3.5 text-teal-600 font-semibold">${s.sleepEfficiency}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">${s.reportingDoctor}</td>
      <td class="px-4 py-3.5">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
          ${s.reportStatus}
        </span>
      </td>
    </tr>
  `).join('');
}

// 5. CPAP Orders Tab
function renderAdminCPAP(orders) {
  const container = document.getElementById('admin-cpap-tbody');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="px-4 py-10 text-center text-slate-400">No CPAP orders in the system.</td></tr>`;
    return;
  }

  container.innerHTML = orders.map(ord => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
      <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">${ord.id}</td>
      <td class="px-4 py-3.5 font-bold text-slate-900 dark:text-white">${ord.equipmentName}</td>
      <td class="px-4 py-3.5 text-slate-500">${ord.orderDate}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-mono">${ord.serialNumber}</td>
      <td class="px-4 py-3.5">
        <select onchange="updateCPAPStatus('${ord.id}', this.value)" class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
          <option value="Active & In-Use" ${ord.status.includes('Active') ? 'selected' : ''}>Active & In-Use</option>
          <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Awaiting Telemetry" ${ord.status === 'Awaiting Telemetry' ? 'selected' : ''}>Awaiting Telemetry</option>
        </select>
      </td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-300">${ord.deliveryStatus}</td>
    </tr>
  `).join('');
}

function updateCPAPStatus(ordId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('sleepwell_cpap_orders') || '[]');
  const ord = orders.find(o => o.id === ordId);
  if (ord) {
    ord.status = newStatus;
    localStorage.setItem('sleepwell_cpap_orders', JSON.stringify(orders));
    if (window.showToast) window.showToast('CPAP Order Updated', `${ordId} updated to ${newStatus}.`, 'success');
  }
}

// 6. Billing Tab
function renderAdminBilling(billing) {
  const container = document.getElementById('admin-billing-tbody');
  if (!container) return;

  if (billing.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="px-4 py-10 text-center text-slate-400">No billing records generated yet.</td></tr>`;
    return;
  }

  container.innerHTML = billing.map(inv => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
      <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">${inv.id}</td>
      <td class="px-4 py-3.5 text-slate-500">${inv.date}</td>
      <td class="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">${inv.service}</td>
      <td class="px-4 py-3.5 font-bold text-slate-900 dark:text-white">$${inv.amount.toFixed(2)}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">$${inv.insuranceCovered.toFixed(2)}</td>
      <td class="px-4 py-3.5">
        <select onchange="updateBillingStatus('${inv.id}', this.value)" class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
          <option value="Paid" ${inv.status === 'Paid' ? 'selected' : ''}>Paid</option>
          <option value="Outstanding" ${inv.status === 'Outstanding' ? 'selected' : ''}>Outstanding</option>
          <option value="Insurance Pending" ${inv.status === 'Insurance Pending' ? 'selected' : ''}>Insurance Pending</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function updateBillingStatus(invId, newStatus) {
  const billing = JSON.parse(localStorage.getItem('sleepwell_billing') || '[]');
  const inv = billing.find(b => b.id === invId);
  if (inv) {
    inv.status = newStatus;
    localStorage.setItem('sleepwell_billing', JSON.stringify(billing));
    if (window.showToast) window.showToast('Billing Status Updated', `Invoice #${invId} set to ${newStatus}.`, 'success');
  }
}

// 7. Doctors Tab
function renderAdminDoctors(doctors) {
  const container = document.getElementById('admin-doctors-tbody');
  if (!container) return;

  const visible = doctors.filter(doc => !String(doc.name).includes('Elena Rostova'));

  if (visible.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="px-4 py-10 text-center text-slate-400">No medical staff records found.</td></tr>`;
    return;
  }

  container.innerHTML = visible.map(doc => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
      <td class="px-4 py-3.5">
        <div class="flex items-center gap-3 min-w-0">
          <img src="${doc.image}" class="w-9 h-9 rounded-xl object-cover object-top border border-slate-200 dark:border-slate-700 shrink-0" alt="Doctor">
          <div class="min-w-0">
            <strong class="text-slate-900 dark:text-white block truncate">${doc.name}</strong>
            <span class="text-teal-600 dark:text-teal-400 text-[10px] block truncate">${doc.title}</span>
          </div>
        </div>
      </td>
      <td class="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">${doc.specialty}</td>
      <td class="px-4 py-3.5 text-slate-500">${doc.experience}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-400">${doc.availability}</td>
      <td class="px-4 py-3.5 font-bold text-slate-900 dark:text-white">$${doc.consultationFee}</td>
      <td class="px-4 py-3.5">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          On-Duty
        </span>
      </td>
    </tr>
  `).join('');
}

// 8. Enquiries Tab
function renderAdminEnquiries(enquiries) {
  const container = document.getElementById('admin-enquiries-tbody');
  if (!container) return;

  if (enquiries.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">No contact enquiries received yet.</td></tr>`;
    return;
  }

  container.innerHTML = enquiries.map(enq => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
      <td class="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">${enq.id}</td>
      <td class="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">${enq.name}</td>
      <td class="px-4 py-3.5 text-slate-500">${enq.email}<br><span class="text-[10px]">${enq.phone}</span></td>
      <td class="px-4 py-3.5 text-teal-600 dark:text-teal-400 font-medium">${enq.service}</td>
      <td class="px-4 py-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate" title="${enq.message}">
        "${enq.message}"
      </td>
      <td class="px-4 py-3.5">
        <select onchange="updateEnquiryStatus('${enq.id}', this.value)" class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
          <option value="Pending" ${enq.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Contacted" ${enq.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="Resolved" ${enq.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function updateEnquiryStatus(enqId, newStatus) {
  const enquiries = JSON.parse(localStorage.getItem('sleepwell_enquiries') || '[]');
  const enq = enquiries.find(e => e.id === enqId);
  if (enq) {
    enq.status = newStatus;
    localStorage.setItem('sleepwell_enquiries', JSON.stringify(enquiries));
    if (window.showToast) window.showToast('Enquiry Updated', `Inquiry #${enqId} marked as ${newStatus}.`, 'success');
  }
}

// Admin Modals & Creation Triggers
function setupAdminModals() {
  // Add Patient Modal
  const addPatientBtn = document.getElementById('btn-add-patient');
  if (addPatientBtn) {
    addPatientBtn.addEventListener('click', () => {
      const name = prompt('Enter Patient Full Name:');
      if (!name) return;
      const phone = prompt('Enter Patient Phone Number:', '+1 (555) ');
      const diagnosis = prompt('Primary Diagnosis:', 'Suspected Obstructive Sleep Apnea');

      const patients = JSON.parse(localStorage.getItem('sleepwell_patients') || '[]');
      patients.unshift({
        id: 'PT-' + Math.floor(10000 + Math.random() * 90000),
        name,
        email: name.toLowerCase().replace(/ /g, '.') + '@example.com',
        phone: phone || '+1 (555) 000-0000',
        dob: '1985-05-15',
        diagnosis: diagnosis || 'General Sleep Complaint',
        cpapCompliance: 'In-Evaluation',
        lastVisit: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
      localStorage.setItem('sleepwell_patients', JSON.stringify(patients));
      renderAdminAll();
      if (window.showToast) window.showToast('Patient Registered', `Clinical file created for ${name}.`, 'success');
    });
  }

  // Add Appointment Modal trigger
  const addAptBtn = document.getElementById('btn-add-admin-apt');
  if (addAptBtn) {
    addAptBtn.addEventListener('click', () => {
      if (window.openAppointmentModal) {
        window.openAppointmentModal();
      }
    });
  }

  // Clinic Settings Save Listener
  const settingsForm = document.getElementById('admin-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clinicName = document.getElementById('setting-clinic-name')?.value;
      const emergencyPhone = document.getElementById('setting-emergency-phone')?.value;
      const prefs = {
        clinicName,
        emergencyPhone,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('sleepwell_preferences', JSON.stringify(prefs));
      if (window.showToast) window.showToast('Settings Saved', 'Clinic configuration updated.', 'success');
    });
  }
}

window.updateAppointmentStatus = updateAppointmentStatus;
window.deleteAppointment = deleteAppointment;
window.updateCPAPStatus = updateCPAPStatus;
window.updateBillingStatus = updateBillingStatus;
window.updateEnquiryStatus = updateEnquiryStatus;
