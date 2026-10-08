/**
 * SleepWell - Services Directory & Interactive Filter Controller
 * Covers all 7 clinical services with filtering, search, and detailed clinical procedure modal.
 */

const CLINICAL_SERVICES = [
  {
    id: 'srv-1',
    category: 'diagnostics',
    title: 'In-Lab Polysomnography (Sleep Study)',
    badge: 'Gold Standard Diagnostic',
    tagline: 'Comprehensive overnight physiological sleep architecture recording',
    duration: 'Overnight (8:30 PM - 6:30 AM)',
    price: '$480 (Covered by most PPO/Medicare plans)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Polysomnography_connections.jpg',
    description: 'Level 1 In-Lab Polysomnography is the definitive diagnostic gold standard for evaluating sleep disorders. In a private, soundproof clinical suite, certified technologists continuously monitor EEG brain waves, EOG eye movements, EMG muscle tone, ECG cardiac rhythm, thoracic-abdominal breathing effort, airflow, and arterial oxygen saturation.',
    whoItIsFor: 'Patients experiencing unexplained chronic fatigue, loud snoring accompanied by choking or gasping episodes, suspected central or complex sleep apnea, narcolepsy, nocturnal seizures, or unexplained parasomnias.',
    process: [
      'Evening Arrival & Orientation: Check-in at 8:30 PM into your private, climate-controlled clinical bedroom.',
      'Non-Invasive Sensor Application: Small surface gold-cup sensors and respiratory bands are gently affixed with water-soluble paste.',
      'Continuous Polysomnographic Monitoring: Sleep technologist monitors high-resolution telemetry in an adjacent control room all night.',
      'Morning Wake-up & Departure: Sensors removed painlessly at 6:00 AM; continental refreshments provided before discharge.',
      'Physician Scoring & Interpretation: Board-certified sleep specialist analyzes over 900 epochs of physiological data.'
    ],
    preparation: 'Wash hair thoroughly with non-oily shampoo; avoid caffeine after 12:00 PM; bring comfortable two-piece pajamas and your customary nighttime medications.',
    cptCode: 'CPT 95810'
  },
  {
    id: 'srv-2',
    category: 'diagnostics',
    title: 'Home Sleep Apnea Study (HSAT)',
    badge: 'Convenient Home Testing',
    tagline: 'Clinical-grade multi-channel respiratory monitoring in your own bed',
    duration: '1 to 3 Nights at Home',
    price: '$240 (Direct insurance billing supported)',
    image: 'https://images.pexels.com/photos/30428332/pexels-photo-30428332.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Home Sleep Apnea Testing (HSAT) utilizes an ultra-lightweight Type 3 diagnostic recorder worn comfortably in your own bed. It records nasal airflow pressure, snoring acoustics, respiratory effort, heart rate, and blood oxygen levels to confirm or rule out moderate to severe obstructive sleep apnea.',
    whoItIsFor: 'Adults with high pre-test probability of uncomplicated obstructive sleep apnea (OSA) who prefer the comfort and convenience of testing in their domestic bedroom environment.',
    process: [
      'Kit Handover or Courier Delivery: Receive your pre-calibrated SleepWell HSAT diagnostic sensor package.',
      'Self-Application in 3 Minutes: Slip on the comfortable chest belt, affix the soft nasal cannula, and place the fingertip sensor.',
      'Automatic Recording: Device awakens automatically upon breath detection and logs micro-respiratory events all night.',
      'Return & Rapid Telemetry Download: Return device via prepaid shipping box or clinical drop-box.',
      'Somnologist Review: Complete diagnostic report generated and reviewed with you within 48 to 72 hours.'
    ],
    preparation: 'No heavy meals or sedatives on the testing night. Follow the illustrated color quick-start card included in your kit.',
    cptCode: 'CPT 95806'
  },
  {
    id: 'srv-3',
    category: 'consultations',
    title: 'Sleep Disorder Clinical Consultation',
    badge: 'Physician Intake & Evaluation',
    tagline: 'In-depth diagnostic interview with a board-certified sleep physician',
    duration: '45 - 60 Minutes',
    price: '$150 (In-network copays apply)',
    image: 'https://images.pexels.com/photos/4266940/pexels-photo-4266940.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'A comprehensive medical consultation with a fellowship-trained sleep specialist to thoroughly investigate your sleep architecture, circadian rhythm alignment, medical history, airway anatomy, and day-to-day functional impairment.',
    whoItIsFor: 'Anyone suffering from unrefreshing sleep, chronic morning headaches, excessive daytime somnolence, shift work disorder, or patients seeking a definitive second opinion on existing sleep studies.',
    process: [
      'Biometric & History Intake: Detailed review of sleep logs, Epworth sleepiness score, and medical comorbidities.',
      'Targeted Airway Examination: Evaluation of the oropharynx, Mallampati airway classification, nasal septum, and uvula.',
      'Differential Diagnosis: Identifying whether symptoms stem from obstructive apnea, restless legs, circadian misalignment, or insomnia.',
      'Personalized Diagnostic Plan: Determining if an in-lab polysomnogram, home sleep test, or behavioral protocol is appropriate.'
    ],
    preparation: 'Please bring your current medication list, completed 7-day sleep diary, and any prior sleep study printouts.',
    cptCode: 'CPT 99204'
  },
  {
    id: 'srv-5',
    category: 'cpap',
    title: 'CPAP Equipment Support & Mask Fitting',
    badge: 'Comfort & Leak Elimination',
    tagline: '3D facial scanning and clinical mask trials for optimal seal and zero pressure marks',
    duration: '30 - 45 Minutes',
    price: '$75 (Complimentary with SleepWell Supply Membership)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/CPAP_mask_01.jpg/1280px-CPAP_mask_01.jpg',
    description: 'Mask comfort is the single most decisive factor in long-term CPAP therapy success. Our licensed respiratory therapists conduct personalized trials across full face, nasal cushion, and nasal pillow interfaces using 3D anthropometric facial mapping to eliminate leaks and bridge-of-nose ulcers.',
    whoItIsFor: 'New CPAP users experiencing mask discomfort, beard seal leaks, active mouth-breathing during sleep, claustrophobia, or strap pressure sores.',
    process: [
      'Facial Contour Assessment: Measurement of nasal bridge height, nostril spacing, and mandibular position.',
      'Interface Trial under Positive Pressure: Testing 3 top-tier masks connected to active therapeutic airflow in lying down positions.',
      'Headgear Adjustment: Fine-tuning magnetic quick-release clips and soft frame tensioning.',
      'Cleaning & Maintenance Coaching: Training on daily wipe-downs and ozone-free disinfection protocols.'
    ],
    preparation: 'Shave or groom facial hair to your typical everyday style prior to appointment.',
    cptCode: 'CPT 94660'
  },
  {
    id: 'srv-6',
    category: 'cpap',
    title: 'CPAP Follow-up & Compliance Monitoring',
    badge: 'Ongoing Telemetry Care',
    tagline: 'Cloud-synchronized therapy adherence, leak tracking, and pressure adjustments',
    duration: '30 Minutes Consultation + Cloud Monitoring',
    price: '$95 (Insurance compliance certified)',
    image: 'https://images.pexels.com/photos/7089296/pexels-photo-7089296.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Ongoing tele-monitoring ensuring your CPAP therapy remains highly effective and fully compliant with FAA, DOT, and medical insurance criteria (at least 4 hours/night for 70% of days). Our clinical team remotely reads cellular telemetry data to proactively identify leak surges and micro-awakenings.',
    whoItIsFor: 'All active CPAP patients at 30, 90, and 365-day treatment milestones, commercial drivers requiring DOT recertification, and patients experiencing renewed fatigue.',
    process: [
      'Cellular Telemetry Extraction: Automated download of nightly hours, mask leak velocity, and residual AHI.',
      'Algorithm Optimization: Remote adjustment of minimum/maximum auto-pressure ranges and humidifier moisture.',
      'Adherence Certification Letter: Issuance of official clinical documentation for insurance carriers and employers.',
      'Resupply Schedule Review: Verification of silicone cushion, tubing, and hypoallergenic filter rotation intervals.'
    ],
    preparation: 'Keep your CPAP device plugged into wall power so internal cellular modem transmits the latest 30-day data.',
    cptCode: 'CPT 99453 / 99457'
  },
  {
    id: 'srv-7',
    category: 'consultations',
    title: 'Sleep Health & Behavioral Consultation (CBT-I)',
    badge: 'Drug-Free Insomnia Therapy',
    tagline: 'Evidence-based cognitive restructuring and circadian entrainment protocols',
    duration: '50 Minutes per Session (4-6 Session Program)',
    price: '$135 per session',
    image: 'https://images.pexels.com/photos/6940368/pexels-photo-6940368.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Cognitive Behavioral Therapy for Insomnia (CBT-I) is recommended by the American College of Physicians as the premier first-line treatment for chronic insomnia. Led by certified behavioral sleep medicine psychologists, this program systematically resolves racing thoughts, sleep anxiety, and midnight awakenings.',
    whoItIsFor: 'Individuals suffering from persistent difficulty falling asleep or staying asleep (lasting > 3 months), daytime fatigue due to racing thoughts, or individuals wishing to taper off prescription sleeping pills safely.',
    process: [
      'Sleep Diary Sleep Efficiency Analysis: Calculating your exact baseline sleep efficiency percentage.',
      'Stimulus Control Therapy: Re-conditioning the brain to strongly associate the bed with rapid, restorative sleep.',
      'Sleep Restriction Therapy (SRT): Temporarily consolidating bedtime to dramatically amplify homeostatic sleep drive.',
      'Cognitive Restructuring: Deconstructing catastrophic beliefs regarding sleep loss and nighttime anxiety.'
    ],
    preparation: 'Keep an accurate sleep log for at least 7 consecutive nights preceding your first session.',
    cptCode: 'CPT 90834'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderServices(CLINICAL_SERVICES);
  setupServiceFilters();
  setupServiceModal();
});

function renderServices(servicesToRender) {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  if (servicesToRender.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <i data-lucide="search-x" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">No Clinical Services Found</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Try clearing your search terms or selecting another category.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = servicesToRender.map(service => `
    <div class="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm card-hover overflow-hidden cursor-pointer transition-all duration-300"
         onclick="openServiceDetailsModal('${service.id}')" role="button" tabindex="0"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openServiceDetailsModal('${service.id}')}"
    >
      
      <!-- Service Image with Service Name -->
      <div class="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src="${service.image}" 
          alt="${service.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

        <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3 class="text-lg sm:text-xl font-bold text-white leading-snug">
            ${service.title}
          </h3>
        </div>
      </div>

    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function setupServiceFilters() {
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const searchInput = document.getElementById('service-search-input');

  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    let filtered = CLINICAL_SERVICES;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(s => s.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.whoItIsFor.toLowerCase().includes(term)
      );
    }

    renderServices(filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-teal-600', 'text-white');
        b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      });
      btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      btn.classList.add('bg-teal-600', 'text-white');

      activeCategory = btn.getAttribute('data-category');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      applyFilters();
    });
  }
}

function setupServiceModal() {
  let modal = document.getElementById('service-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'service-detail-modal';
    modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        <div id="service-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

function openServiceDetailsModal(serviceId) {
  const service = CLINICAL_SERVICES.find(s => s.id === serviceId);
  if (!service) return;

  const modal = document.getElementById('service-detail-modal');
  const content = document.getElementById('service-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <!-- Modal Header Image -->
    <div class="relative h-60 w-full overflow-hidden bg-slate-900">
      <img src="${service.image}" alt="${service.title}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      
      <button onclick="closeServiceDetailsModal()" class="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-800 transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="absolute bottom-4 left-6 right-6 text-white">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/90 text-white">
          ${service.badge}
        </span>
        <h2 class="text-2xl font-bold mt-2 leading-tight">${service.title}</h2>
        <p class="text-xs text-slate-300 mt-1">${service.tagline}</p>
      </div>
    </div>

    <!-- Modal Body -->
    <div class="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
      
      <!-- Key Clinical Specs -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <span class="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Duration</span>
          <span class="font-bold text-slate-800 dark:text-slate-100">${service.duration}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Clinical Code</span>
          <span class="font-bold text-teal-600 dark:text-teal-400 font-mono">${service.cptCode}</span>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <span class="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Estimated Fee</span>
          <span class="font-bold text-slate-800 dark:text-slate-100">${service.price}</span>
        </div>
      </div>

      <!-- Detailed Description -->
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center space-x-2 rtl:space-x-reverse">
          <i data-lucide="file-text" class="w-4 h-4 text-teal-500"></i>
          <span>Clinical Overview</span>
        </h4>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${service.description}</p>
      </div>

      <!-- Who It Is For -->
      <div class="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50">
        <h4 class="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200 mb-1.5 flex items-center space-x-2 rtl:space-x-reverse">
          <i data-lucide="target" class="w-4 h-4 text-teal-600 dark:text-teal-400"></i>
          <span>Patient Indication & Who It Is For</span>
        </h4>
        <p class="text-xs text-teal-800 dark:text-teal-300 leading-relaxed">${service.whoItIsFor}</p>
      </div>

      <!-- Clinical Procedure Steps -->
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center space-x-2 rtl:space-x-reverse">
          <i data-lucide="list-ordered" class="w-4 h-4 text-teal-500"></i>
          <span>Step-by-Step Clinical Protocol</span>
        </h4>
        <div class="space-y-2.5">
          ${service.process.map((step, idx) => `
            <div class="flex items-start space-x-3 rtl:space-x-reverse text-xs text-slate-600 dark:text-slate-300">
              <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                ${idx + 1}
              </span>
              <p class="flex-1 leading-relaxed">${step}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Preparation Instructions -->
      <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <h4 class="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1 flex items-center space-x-2 rtl:space-x-reverse">
          <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600"></i>
          <span>Preparation Guidelines</span>
        </h4>
        <p class="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">${service.preparation}</p>
      </div>

    </div>

    <!-- Modal Footer -->
    <div class="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3 rtl:space-x-reverse bg-slate-50 dark:bg-slate-900/60">
      <button type="button" onclick="closeServiceDetailsModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold transition">
        Close
      </button>
      <button 
        type="button" 
        onclick="closeServiceDetailsModal(); openAppointmentModal('${service.title}')"
        class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition flex items-center space-x-2 rtl:space-x-reverse"
      >
        <span>Schedule This Procedure</span>
        <i data-lucide="calendar-plus" class="w-4 h-4"></i>
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) window.lucide.createIcons();
}

function closeServiceDetailsModal() {
  const modal = document.getElementById('service-detail-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

window.openServiceDetailsModal = openServiceDetailsModal;
window.closeServiceDetailsModal = closeServiceDetailsModal;
