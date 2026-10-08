/**
 * SleepWell - Doctors Directory & Specialist Profile Controller
 * Filters doctors by specialty and provides rich clinical background modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  const doctors = getStoredDoctors();
  renderDoctors(doctors);
  setupDoctorFilters();
  setupDoctorModal();
});

function getStoredDoctors() {
  const raw = localStorage.getItem('sleepwell_doctors');
  if (raw) {
    try {
      const list = JSON.parse(raw);
      let changed = false;
      list.forEach(doc => {
        if (doc && typeof doc.image === 'string' && doc.image.indexOf('photo-1623854767648-e7bb8009f0db') !== -1) {
          doc.image = 'https://images.pexels.com/photos/7446991/pexels-photo-7446991.jpeg?auto=compress&cs=tinysrgb&w=600';
          changed = true;
        }
      });
      if (changed) localStorage.setItem('sleepwell_doctors', JSON.stringify(list));
      return list;
    } catch(e) {}
  }
  return [];
}

function renderDoctors(doctorsToRender) {
  const container = document.getElementById('doctors-grid-container');
  if (!container) return;

  if (doctorsToRender.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <i data-lucide="user-x" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">No Specialists Found</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Please select another specialty category.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = doctorsToRender.map(doc => `
    <div class="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm card-hover overflow-hidden flex flex-col transition-all duration-300">
      
      <!-- Doctor Headshot & Badges -->
      <div class="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src="${doc.image}" 
          alt="${doc.name}" 
          onerror="this.onerror=null;this.src='https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=600'"
          class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        <!-- Rating Pill -->
        <div class="absolute top-4 right-4 rtl:right-auto rtl:left-4">
          <span class="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/90 text-amber-500 shadow-sm backdrop-blur-md">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
            <span>${doc.rating}</span>
            <span class="text-slate-400 font-normal">(${doc.reviewsCount})</span>
          </span>
        </div>

        <!-- Specialty Tag -->
        <div class="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 text-white">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-teal-600/90 backdrop-blur-md text-white">
            ${doc.specialty}
          </span>
        </div>
      </div>

      <!-- Doctor Info -->
      <div class="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            ${doc.name}
          </h3>
          <p class="text-xs font-medium text-teal-600 dark:text-teal-400 mt-0.5">
            ${doc.title}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            ${doc.qualifications} • ${doc.experience}
          </p>

          <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-3 leading-relaxed">
            ${doc.bio}
          </p>

          <!-- Expertise Tags -->
          <div class="mt-4">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">Areas of Expertise</span>
            <div class="flex flex-wrap gap-1.5">
              ${doc.expertise.slice(0, 3).map(exp => `
                <span class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  ${exp}
                </span>
              `).join('')}
              ${doc.expertise.length > 3 ? `<span class="px-2 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500">+${doc.expertise.length - 3}</span>` : ''}
            </div>
          </div>

          <!-- Availability -->
          <div class="mt-4 p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-2 rtl:space-x-reverse">
            <i data-lucide="calendar" class="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0"></i>
            <span class="truncate">Clinic Hours: <strong class="text-slate-800 dark:text-slate-100">${doc.availability}</strong></span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button 
            type="button" 
            onclick="openDoctorDetailsModal('${doc.id}')"
            class="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition"
          >
            Profile & Bio
          </button>

          <button 
            type="button" 
            onclick="openAppointmentModal('', '${doc.name}')"
            class="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm hover:shadow transition flex items-center space-x-1.5 rtl:space-x-reverse"
          >
            <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i>
            <span>Book Consultation</span>
          </button>
        </div>

      </div>

    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function setupDoctorFilters() {
  const filterBtns = document.querySelectorAll('.doctor-filter-btn');
  const allDocs = getStoredDoctors();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-teal-600', 'text-white');
        b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      });
      btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      btn.classList.add('bg-teal-600', 'text-white');

      const specialty = btn.getAttribute('data-specialty');
      if (specialty === 'all') {
        renderDoctors(allDocs);
      } else {
        renderDoctors(allDocs.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase()));
      }
    });
  });
}

function setupDoctorModal() {
  let modal = document.getElementById('doctor-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'doctor-detail-modal';
    modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        <div id="doctor-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

function openDoctorDetailsModal(docId) {
  const doctors = getStoredDoctors();
  const doc = doctors.find(d => d.id === docId);
  if (!doc) return;

  const modal = document.getElementById('doctor-detail-modal');
  const content = document.getElementById('doctor-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <!-- Modal Header -->
    <div class="p-6 sm:p-8 bg-gradient-to-r from-sky-50 to-teal-50 dark:from-slate-900 dark:to-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
      
      <button onclick="closeDoctorDetailsModal()" class="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <img src="${doc.image}" alt="${doc.name}" onerror="this.onerror=null;this.src='https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=600'" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top shadow-md border-2 border-white dark:border-slate-700">

      <div class="text-center sm:text-left rtl:sm:text-right">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-teal-600 text-white">
          ${doc.specialty}
        </span>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-2">${doc.name}</h2>
        <p class="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">${doc.title}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${doc.qualifications}</p>
        
        <div class="flex items-center justify-center sm:justify-start rtl:sm:justify-end space-x-3 rtl:space-x-reverse mt-3">
          <span class="flex items-center space-x-1 rtl:space-x-reverse text-xs font-bold text-amber-500">
            <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
            <span>${doc.rating} / 5.0</span>
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="text-xs text-slate-600 dark:text-slate-300 font-medium">${doc.experience}</span>
        </div>
      </div>
    </div>

    <!-- Modal Body -->
    <div class="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto text-xs sm:text-sm">
      
      <!-- Hospital Affiliations -->
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Clinical Affiliation</span>
        <p class="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2 rtl:space-x-reverse">
          <i data-lucide="building-2" class="w-4 h-4 text-teal-500"></i>
          <span>${doc.hospital}</span>
        </p>
      </div>

      <!-- Biography -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">Physician Biography</h4>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${doc.bio}</p>
      </div>

      <!-- Clinical Areas of Expertise -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">Diagnostic & Treatment Specialties</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${doc.expertise.map(exp => `
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-700 dark:text-slate-300">
              <i data-lucide="check-circle" class="w-3.5 h-3.5 text-teal-500 flex-shrink-0"></i>
              <span>${exp}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Consultation Terms -->
      <div class="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50">
        <div>
          <span class="text-[10px] text-teal-800 dark:text-teal-300 uppercase tracking-wider font-semibold block">Office Hours</span>
          <span class="font-bold text-slate-800 dark:text-slate-200 text-xs">${doc.availability}</span>
        </div>
        <div>
          <span class="text-[10px] text-teal-800 dark:text-teal-300 uppercase tracking-wider font-semibold block">Initial Consultation Fee</span>
          <span class="font-bold text-teal-700 dark:text-teal-400 text-xs">$${doc.consultationFee} (Covered by insurance)</span>
        </div>
      </div>

    </div>

    <!-- Modal Footer -->
    <div class="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3 rtl:space-x-reverse bg-slate-50 dark:bg-slate-900/60">
      <button type="button" onclick="closeDoctorDetailsModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold transition">
        Cancel
      </button>
      <button 
        type="button" 
        onclick="closeDoctorDetailsModal(); openAppointmentModal('', '${doc.name}')"
        class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition flex items-center space-x-2 rtl:space-x-reverse"
      >
        <span>Book with ${doc.name.split(',')[0]}</span>
        <i data-lucide="calendar" class="w-4 h-4"></i>
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) window.lucide.createIcons();
}

function closeDoctorDetailsModal() {
  const modal = document.getElementById('doctor-detail-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

window.openDoctorDetailsModal = openDoctorDetailsModal;
window.closeDoctorDetailsModal = closeDoctorDetailsModal;
