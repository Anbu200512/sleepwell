/**
 * SleepWell - Core Application JavaScript
 * Handles initial data seeding, theme toggle, RTL toggle, toast notifications,
 * global appointment modal, and Lucide icons.
 */

// Initialize immediately before DOMContentLoaded to sync theme & direction
(function initPreferences() {
  const savedTheme = localStorage.getItem('sleepwell_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const savedDir = localStorage.getItem('sleepwell_direction') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
})();

// Seed Sample Clinical Data into localStorage if not already present
function seedInitialData() {
  if (!localStorage.getItem('sleepwell_initialized')) {
    // Current Active Patient
    const defaultPatient = {
      id: 'PT-10824',
      name: 'Sarah Jenkins',
      email: 'sarah@sleepwell.clinic',
      phone: '+1 (555) 392-8471',
      dob: '1987-04-22',
      gender: 'Female',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      address: '742 Evergreen Terrace, Suite 3B, Boston, MA',
      insurance: 'BlueCross BlueShield Premier #BC-89412',
      primaryPhysician: 'Dr. Marcus Vance, MD',
      diagnosedConditions: ['Obstructive Sleep Apnea (Moderate)', 'Sleep Fragmentation'],
      activeCPAPDevice: 'ResMed AirSense 11 AutoSet'
    };
    localStorage.setItem('sleepwell_user', JSON.stringify(defaultPatient));

    // Doctors Data
    const doctors = [
      {
        id: 'doc-1',
        name: 'Dr. Marcus Vance, MD',
        title: 'Lead Somnologist & Pulmonologist',
        specialty: 'Somnology',
        qualifications: 'MD, FCCP, Board Certified in Sleep Medicine',
        experience: '16+ Years Experience',
        rating: 4.9,
        reviewsCount: 142,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        hospital: 'Massachusetts General Hospital & SleepWell Clinical Institute',
        bio: 'Dr. Marcus Vance specializes in obstructive sleep apnea, complex sleep architecture diagnostics, and personalized CPAP positive airway pressure titration protocols.',
        expertise: ['Sleep Apnea (OSA/CSA)', 'In-Lab Polysomnography', 'CPAP/BiPAP Titration', 'Cardiopulmonary Interactions'],
        availability: 'Mon, Wed, Fri (9:00 AM - 4:30 PM)',
        consultationFee: 150
      },
      {
        id: 'doc-2',
        name: 'Dr. Elena Rostova, MD, PhD',
        title: 'Sleep Neurologist & Circadian Specialist',
        specialty: 'Neurology',
        qualifications: 'MD, PhD in Neurobiology, AASM Fellow',
        experience: '14+ Years Experience',
        rating: 4.9,
        reviewsCount: 118,
        image: 'https://images.pexels.com/photos/7446991/pexels-photo-7446991.jpeg?auto=compress&cs=tinysrgb&w=600',
        hospital: 'Boston Brain & Sleep Institute',
        bio: 'Dr. Rostova investigates central sleep anomalies, narcolepsy, REM behavior disorders, and restless legs syndrome, delivering neuro-protective sleep care.',
        expertise: ['Central Sleep Apnea', 'Narcolepsy & Hypersomnia', 'Restless Legs Syndrome', 'Circadian Phase Shifts'],
        availability: 'Tue, Thu, Sat (10:00 AM - 5:00 PM)',
        consultationFee: 165
      },
      {
        id: 'doc-3',
        name: 'Dr. David Chen, MD',
        title: 'Clinical Sleep Physician & Airway Specialist',
        specialty: 'Pulmonology',
        qualifications: 'MD, ABMS Certified in Sleep & Pulmonary Care',
        experience: '12+ Years Experience',
        rating: 4.8,
        reviewsCount: 95,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
        hospital: 'SleepWell Regional Diagnostic Center',
        bio: 'Dr. Chen is dedicated to upper airway physiology, anatomic airway resistance, home sleep testing evaluation, and custom non-invasive ventilation management.',
        expertise: ['Home Sleep Studies (HSAT)', 'Anatomic Airway Resistance', 'Mandibular Advancement Review', 'CPAP Adherence'],
        availability: 'Mon through Thu (8:30 AM - 3:30 PM)',
        consultationFee: 140
      },
      {
        id: 'doc-4',
        name: 'Dr. Anita Patel, PhD, CBSM',
        title: 'Behavioral Sleep Psychologist',
        specialty: 'Behavioral Sleep Medicine',
        qualifications: 'PhD, Diplomate in Behavioral Sleep Medicine (DBSM)',
        experience: '11+ Years Experience',
        rating: 5.0,
        reviewsCount: 160,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        hospital: 'Center for Behavioral Sleep Interventions',
        bio: 'Dr. Patel leads evidence-based Cognitive Behavioral Therapy for Insomnia (CBT-I), sleep anxiety desensitization, and CPAP claustrophobia therapy.',
        expertise: ['Chronic Insomnia (CBT-I)', 'CPAP Claustrophobia Desensitization', 'Nighttime Hyperarousal', 'Sleep Hygiene Coaching'],
        availability: 'Mon, Tue, Fri (11:00 AM - 6:00 PM)',
        consultationFee: 135
      },
      {
        id: 'doc-5',
        name: 'Dr. Robert Hayes, MD, RPSGT',
        title: 'Director of Polysomnography & Titration',
        specialty: 'Somnology',
        qualifications: 'MD, Registered Polysomnographic Technologist',
        experience: '18+ Years Experience',
        rating: 4.9,
        reviewsCount: 184,
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
        hospital: 'SleepWell Comprehensive Diagnostic Lab',
        bio: 'Dr. Hayes has overseen more than 10,000 comprehensive polysomnograms. He oversees diagnostic electrode telemetry, oxygen titration, and automated CPAP synchronization.',
        expertise: ['Level 1 In-Lab PSG', 'Split-Night Studies', 'BiPAP ST / ASV Titration', 'Oxygen Saturation Profiling'],
        availability: 'Wed, Thu, Fri, Sat (8:00 AM - 4:00 PM)',
        consultationFee: 155
      },
      {
        id: 'doc-6',
        name: 'Dr. Melissa Torres, MD',
        title: 'Pediatric & Adolescent Sleep Consultant',
        specialty: 'Pediatric Sleep',
        qualifications: 'MD, FAAP, Certified in Pediatric Somnology',
        experience: '10+ Years Experience',
        rating: 4.9,
        reviewsCount: 88,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        hospital: 'Children\'s Sleep Health Collaborative',
        bio: 'Dr. Torres specializes in pediatric sleep disorders, sleep-disordered breathing in growing adolescents, nocturnal parasomnias, and gentle pediatric sleep coaching.',
        expertise: ['Pediatric Sleep Apnea', 'Parasomnias & Night Terrors', 'Sleep Schedule Restructuring', 'Enlarged Tonsil Airway Evaluation'],
        availability: 'Mon, Wed, Thu (9:30 AM - 3:30 PM)',
        consultationFee: 145
      }
    ];
    localStorage.setItem('sleepwell_doctors', JSON.stringify(doctors));

    // Sample Appointments
    const appointments = [
      {
        id: 'APT-9241',
        patientName: 'Sarah Jenkins',
        patientEmail: 'sarah@sleepwell.clinic',
        patientPhone: '+1 (555) 392-8471',
        doctorName: 'Dr. Marcus Vance, MD',
        doctorId: 'doc-1',
        serviceName: 'Level 1 In-Lab Polysomnography (Diagnostic Sleep Study)',
        date: '2026-10-18',
        time: '08:30 PM',
        type: 'In-Lab Study',
        location: 'SleepWell Clinical Suite 4A - Overnight Suite',
        status: 'Confirmed',
        notes: 'Pre-study intake completed. Patient advised to avoid caffeine 12 hours prior.',
        price: 480
      },
      {
        id: 'APT-8710',
        patientName: 'Sarah Jenkins',
        patientEmail: 'sarah@sleepwell.clinic',
        patientPhone: '+1 (555) 392-8471',
        doctorName: 'Dr. Marcus Vance, MD',
        doctorId: 'doc-1',
        serviceName: 'CPAP Telemetry & Pressure Optimization Follow-up',
        date: '2026-10-28',
        time: '10:30 AM',
        type: 'Clinical Review',
        location: 'Consultation Room 2',
        status: 'Scheduled',
        notes: 'Review 30-day AirSense 11 cellular telemetry report.',
        price: 120
      },
      {
        id: 'APT-7412',
        patientName: 'Sarah Jenkins',
        patientEmail: 'sarah@sleepwell.clinic',
        patientPhone: '+1 (555) 392-8471',
        doctorName: 'Dr. Anita Patel, PhD, CBSM',
        doctorId: 'doc-4',
        serviceName: 'Sleep Health & Behavioral Consultation (CBT-I)',
        date: '2026-09-12',
        time: '02:00 PM',
        type: 'Behavioral Session',
        location: 'Behavioral Suite B',
        status: 'Completed',
        notes: 'Sleep diary reviewed. Prescribed stimulus control therapy and relaxation protocol.',
        price: 135
      },
      {
        id: 'APT-6981',
        patientName: 'Sarah Jenkins',
        patientEmail: 'sarah@sleepwell.clinic',
        patientPhone: '+1 (555) 392-8471',
        doctorName: 'Dr. David Chen, MD',
        doctorId: 'doc-3',
        serviceName: 'Home Sleep Apnea Testing (HSAT) Kit Handover',
        date: '2026-08-20',
        time: '11:00 AM',
        type: 'Diagnostic Kit',
        location: 'Reception Clinic Bay',
        status: 'Completed',
        notes: 'Handed 3-night sensor package with pulse oximeter and nasal cannula.',
        price: 240
      }
    ];
    localStorage.setItem('sleepwell_appointments', JSON.stringify(appointments));

    // Sample Sleep Study Results
    const results = [
      {
        id: 'RES-4029',
        patientId: 'PT-10824',
        studyType: 'Level 1 In-Lab Diagnostic Polysomnography (Overnight)',
        testDate: '2026-08-28',
        reportingDoctor: 'Dr. Marcus Vance, MD',
        recordingHours: '7.8 hours',
        totalSleepTime: '6.5 hours',
        sleepEfficiency: '83.3%',
        ahiScore: '18.4 events/hour',
        ahiSeverity: 'Moderate Obstructive Sleep Apnea',
        oxygenNadir: '86% SpO2',
        baselineSpO2: '96%',
        snoringEpisodes: '214 acoustic spikes',
        summaryFindings: 'Patient demonstrated recurrent hypopneas associated with oxyhemoglobin desaturations during REM sleep. Significant reduction in slow-wave sleep. Auto-titrated CPAP therapy strongly indicated.',
        reportStatus: 'Official Report Ready',
        downloadUrl: '#mock-report-download'
      },
      {
        id: 'RES-3814',
        patientId: 'PT-10824',
        studyType: '3-Night Home Sleep Apnea Study (HSAT)',
        testDate: '2026-08-15',
        reportingDoctor: 'Dr. David Chen, MD',
        recordingHours: '21.2 hours (total 3 nights)',
        totalSleepTime: '19.4 hours',
        sleepEfficiency: '87.1%',
        ahiScore: '16.8 events/hour',
        ahiSeverity: 'Moderate OSA Indicator',
        oxygenNadir: '88% SpO2',
        baselineSpO2: '97%',
        snoringEpisodes: 'Frequent bilateral flow limitation',
        summaryFindings: 'Home biometric monitoring showed periodic airflow cessation. In-lab follow-up titration protocol confirmed positive pressure efficacy.',
        reportStatus: 'Official Report Ready',
        downloadUrl: '#mock-report-download'
      }
    ];
    localStorage.setItem('sleepwell_results', JSON.stringify(results));

    // CPAP Equipment & Orders
    const cpapOrders = [
      {
        id: 'CPAP-8842',
        equipmentName: 'ResMed AirSense 11 AutoSet System',
        equipmentType: 'Auto-Titrating CPAP Unit',
        orderDate: '2026-09-02',
        status: 'Active & In-Use',
        deliveryStatus: 'Delivered',
        serialNumber: 'SN-AIR11-89304-2026',
        cellularTelemetry: 'Active (Nightly Cloud Sync)',
        complianceStatus: '97% Compliant (Average 6.8 hrs/night)',
        currentPressureSetting: '8.0 - 13.5 cmH2O (Auto)',
        maskType: 'ResMed AirFit F30i Full Face (Size M)',
        nextFilterChange: 'In 12 Days (Due Oct 17, 2026)',
        nextSupplyShipment: 'Scheduled Nov 1, 2026'
      },
      {
        id: 'CPAP-9104',
        equipmentName: 'AirFit F30i Full Face Replacement Cushion (Size M)',
        equipmentType: 'Mask Cushion Replacements',
        orderDate: '2026-09-24',
        status: 'Delivered',
        deliveryStatus: 'Delivered on Sep 27, 2026',
        serialNumber: 'CUSH-F30-092',
        cellularTelemetry: 'N/A (Accessory)',
        complianceStatus: 'Active',
        currentPressureSetting: 'N/A',
        maskType: 'Full Face',
        nextFilterChange: 'N/A',
        nextSupplyShipment: 'N/A'
      },
      {
        id: 'CPAP-9419',
        equipmentName: 'ClimateLineAir Heated Tubing & Hypoallergenic Filters (Pack of 6)',
        equipmentType: 'Tubing & Filtration Kit',
        orderDate: '2026-10-02',
        status: 'Processing',
        deliveryStatus: 'Dispatched via MedExpress (Track #ME-778912)',
        serialNumber: 'FILT-PACK-2026-10',
        cellularTelemetry: 'N/A (Accessory)',
        complianceStatus: 'In-Transit',
        currentPressureSetting: 'N/A',
        maskType: 'N/A',
        nextFilterChange: 'Included in order',
        nextSupplyShipment: 'N/A'
      }
    ];
    localStorage.setItem('sleepwell_cpap_orders', JSON.stringify(cpapOrders));

    // Billing & Invoices
    const billing = [
      {
        id: 'INV-2026-081',
        date: '2026-09-18',
        service: 'Level 1 In-Lab Polysomnography Diagnostic Test',
        grossAmount: 480.00,
        insuranceCovered: 400.00,
        amount: 80.00,
        status: 'Paid',
        paymentMethod: 'Visa ending in •••• 4291',
        transactionId: 'TXN-99814-SLP',
        billingDoctor: 'Dr. Marcus Vance, MD'
      },
      {
        id: 'INV-2026-104',
        date: '2026-09-25',
        service: 'ResMed AirSense 11 AutoSet System & Complete Mask Kit',
        grossAmount: 980.00,
        insuranceCovered: 830.00,
        amount: 150.00,
        status: 'Paid',
        paymentMethod: 'Health Savings Account (HSA) •••• 1084',
        transactionId: 'TXN-99882-MED',
        billingDoctor: 'Dr. Robert Hayes, MD'
      },
      {
        id: 'INV-2026-129',
        date: '2026-10-02',
        service: 'CPAP Telemetry & Remote Compliance Diagnostic Report',
        grossAmount: 140.00,
        insuranceCovered: 95.00,
        amount: 45.00,
        status: 'Outstanding',
        paymentMethod: 'Pending Payment',
        transactionId: 'TXN-PENDING-129',
        billingDoctor: 'Dr. Marcus Vance, MD'
      },
      {
        id: 'INV-2026-140',
        date: '2026-10-04',
        service: 'ClimateLineAir Heated Tubing & Filtration Replacements',
        grossAmount: 58.00,
        insuranceCovered: 0.00,
        amount: 58.00,
        status: 'Paid',
        paymentMethod: 'Mastercard ending in •••• 8820',
        transactionId: 'TXN-99933-SUP',
        billingDoctor: 'SleepWell Medical Supply'
      }
    ];
    localStorage.setItem('sleepwell_billing', JSON.stringify(billing));

    // Notifications
    const notifications = [
      {
        id: 'notif-1',
        title: 'Sleep Study Preparation Reminder',
        message: 'Your In-Lab Polysomnography is scheduled for Oct 18, 2026 at 08:30 PM. Please avoid caffeine and hair gels.',
        date: '2026-10-05',
        read: false,
        type: 'appointment',
        link: 'dashboard.html#appointments'
      },
      {
        id: 'notif-2',
        title: 'CPAP Nightly Compliance Milestone',
        message: 'Congratulations! You maintained 100% CPAP therapy adherence for 14 consecutive nights. Average usage: 6.8 hrs/night.',
        date: '2026-10-04',
        read: false,
        type: 'cpap',
        link: 'dashboard.html#cpap'
      },
      {
        id: 'notif-3',
        title: 'New Diagnostic Sleep Report Ready',
        message: 'Dr. Marcus Vance has finalized your Level 1 In-Lab Polysomnography clinical report. You may view or download your report summary.',
        date: '2026-09-01',
        read: true,
        type: 'result',
        link: 'dashboard.html#results'
      },
      {
        id: 'notif-4',
        title: 'Hypoallergenic Air Filter Replacement Due',
        message: 'Your AirSense 11 filter is due for rotation in 12 days. Your replacement filter supply package has dispatched.',
        date: '2026-10-02',
        read: true,
        type: 'equipment',
        link: 'dashboard.html#cpap'
      }
    ];
    localStorage.setItem('sleepwell_notifications', JSON.stringify(notifications));

    // Sample Enquiries
    const enquiries = [
      {
        id: 'ENQ-501',
        name: 'James Thornton',
        email: 'james.t@example.com',
        phone: '+1 (555) 438-9901',
        service: 'In-Lab Polysomnography',
        message: 'My partner reports loud gasping during sleep. How soon can I schedule an in-lab diagnostic test?',
        date: '2026-10-03',
        status: 'Pending'
      },
      {
        id: 'ENQ-502',
        name: 'Rebecca Miller',
        email: 'rebecca.m@example.com',
        phone: '+1 (555) 781-3204',
        service: 'CPAP Equipment Support',
        message: 'I am experiencing bridge-of-nose pressure with my current CPAP mask. Need a nasal cushion fitting appointment.',
        date: '2026-10-04',
        status: 'Contacted'
      }
    ];
    localStorage.setItem('sleepwell_enquiries', JSON.stringify(enquiries));

    // Admin Account Data
    const adminUser = {
      id: 'ADM-001',
      name: 'Clinical Admin Portal',
      email: 'admin@sleepwell.clinic',
      role: 'admin'
    };
    localStorage.setItem('sleepwell_admin', JSON.stringify(adminUser));

    // Patients Database for Admin
    const patientsList = [
      {
        id: 'PT-10824',
        name: 'Sarah Jenkins',
        email: 'sarah@sleepwell.clinic',
        phone: '+1 (555) 392-8471',
        dob: '1987-04-22',
        diagnosis: 'Moderate OSA (AHI 18.4)',
        cpapCompliance: '97%',
        lastVisit: '2026-09-12',
        status: 'Active'
      },
      {
        id: 'PT-10825',
        name: 'Michael Chang',
        email: 'm.chang@example.com',
        phone: '+1 (555) 609-2231',
        dob: '1979-11-05',
        diagnosis: 'Severe OSA (AHI 34.2)',
        cpapCompliance: '88%',
        lastVisit: '2026-09-28',
        status: 'Active'
      },
      {
        id: 'PT-10826',
        name: 'Eleanor Roosevelt-Bennett',
        email: 'e.bennett@example.com',
        phone: '+1 (555) 914-7720',
        dob: '1965-02-14',
        diagnosis: 'Central Sleep Apnea (CSA)',
        cpapCompliance: '92%',
        lastVisit: '2026-10-01',
        status: 'Active'
      },
      {
        id: 'PT-10827',
        name: 'Daniel Kovacs',
        email: 'd.kovacs@example.com',
        phone: '+1 (555) 321-9988',
        dob: '1992-08-30',
        diagnosis: 'Chronic Insomnia / Delayed Phase',
        cpapCompliance: 'N/A',
        lastVisit: '2026-10-03',
        status: 'In Consultation'
      }
    ];
    localStorage.setItem('sleepwell_patients', JSON.stringify(patientsList));

    localStorage.setItem('sleepwell_initialized', 'true');
  }

  // Migrate stale Dr. Elena Rostova profile image stored in localStorage
  try {
    const storedDoctors = localStorage.getItem('sleepwell_doctors');
    if (storedDoctors && storedDoctors.indexOf('photo-1623854767648-e7bb8009f0db') !== -1) {
      const migrated = JSON.parse(storedDoctors);
      migrated.forEach(doc => {
        if (doc && typeof doc.image === 'string' && doc.image.indexOf('photo-1623854767648-e7bb8009f0db') !== -1) {
          doc.image = 'https://images.pexels.com/photos/7446991/pexels-photo-7446991.jpeg?auto=compress&cs=tinysrgb&w=600';
        }
      });
      localStorage.setItem('sleepwell_doctors', JSON.stringify(migrated));
    }
  } catch (e) {}
}

// Global Toast Notification Helper
function showToast(title, message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item flex items-start p-4 rounded-xl shadow-xl border transition-all ${
    type === 'success' 
      ? 'bg-white dark:bg-slate-800 border-teal-500/30 text-slate-800 dark:text-slate-100' 
      : type === 'error'
      ? 'bg-white dark:bg-slate-800 border-rose-500/30 text-slate-800 dark:text-slate-100'
      : 'bg-white dark:bg-slate-800 border-sky-500/30 text-slate-800 dark:text-slate-100'
  }`;

  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';
  const iconColor = type === 'success' ? 'text-teal-500' : type === 'error' ? 'text-rose-500' : 'text-sky-500';

  toast.innerHTML = `
    <div class="mr-3 rtl:mr-0 rtl:ml-3 mt-0.5 ${iconColor}">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1 pr-2 rtl:pr-0 rtl:pl-2">
      <h4 class="text-sm font-semibold">${title}</h4>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${message}</p>
    </div>
    <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm ml-2 rtl:ml-0 rtl:mr-2" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) {
    window.lucide.createIcons();
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

// Global Theme Toggle
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('sleepwell_theme', isDark ? 'dark' : 'light');
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('.theme-icon-sun').forEach(el => {
    el.style.display = isDark ? 'block' : 'none';
  });
  document.querySelectorAll('.theme-icon-moon').forEach(el => {
    el.style.display = isDark ? 'none' : 'block';
  });
}

// Global RTL / LTR Direction Toggle
function toggleDirection() {
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', newDir);
  localStorage.setItem('sleepwell_direction', newDir);
}

// Open Global Appointment Booking Modal
function openAppointmentModal(preselectedService = '', preselectedDoctor = '') {
  let modal = document.getElementById('global-appointment-modal');
  if (!modal) {
    createAppointmentModalDOM();
    modal = document.getElementById('global-appointment-modal');
  }

  // Populate doctor select options
  const doctorSelect = document.getElementById('modal-doctor-select');
  if (doctorSelect) {
    const rawDoctors = localStorage.getItem('sleepwell_doctors');
    const doctors = rawDoctors ? JSON.parse(rawDoctors) : [];
    doctorSelect.innerHTML = `<option value="">Any Available Specialist</option>` +
      doctors.map(d => `<option value="${d.name}" ${preselectedDoctor && d.name.includes(preselectedDoctor) ? 'selected' : ''}>${d.name} (${d.specialty})</option>`).join('');
  }

  // Preselect service if given
  const serviceSelect = document.getElementById('modal-service-select');
  if (serviceSelect && preselectedService) {
    for (let opt of serviceSelect.options) {
      if (opt.value.toLowerCase().includes(preselectedService.toLowerCase()) || opt.text.toLowerCase().includes(preselectedService.toLowerCase())) {
        opt.selected = true;
        break;
      }
    }
  }

  // Pre-fill user data if available
  const rawUser = localStorage.getItem('sleepwell_user');
  if (rawUser) {
    try {
      const user = JSON.parse(rawUser);
      const nameInput = document.getElementById('modal-patient-name');
      const emailInput = document.getElementById('modal-patient-email');
      const phoneInput = document.getElementById('modal-patient-phone');
      if (nameInput && !nameInput.value) nameInput.value = user.name || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
    } catch(e) {}
  }

  // Set default minimum date to tomorrow
  const dateInput = document.getElementById('modal-appointment-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    if (!dateInput.value) {
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) window.lucide.createIcons();
}

function closeAppointmentModal() {
  const modal = document.getElementById('global-appointment-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Generate the Appointment Modal in DOM
function createAppointmentModalDOM() {
  const modalDiv = document.createElement('div');
  modalDiv.id = 'global-appointment-modal';
  modalDiv.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto';
  modalDiv.innerHTML = `
    <div class="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-sky-50 to-teal-50/50 dark:from-slate-900 dark:to-slate-800/80">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
            <i data-lucide="calendar" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Book Sleep Consultation</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Accredited diagnostic & CPAP therapy scheduling</p>
          </div>
        </div>
        <button onclick="closeAppointmentModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Form Body -->
      <form id="global-appointment-form" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Select Service</label>
            <select id="modal-service-select" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none">
              <option value="In-Lab Polysomnography (Sleep Study)">In-Lab Polysomnography (Sleep Study)</option>
              <option value="Home Sleep Apnea Study (HSAT)">Home Sleep Apnea Study (HSAT)</option>
              <option value="Sleep Disorder Initial Consultation">Sleep Disorder Initial Consultation</option>
 <option value="CPAP Equipment Support & Mask Fitting">CPAP Equipment Support & Mask Fitting</option>
              <option value="CPAP Telemetry Follow-up">CPAP Telemetry Follow-up</option>
              <option value="Cognitive Behavioral Therapy for Insomnia (CBT-I)">Cognitive Behavioral Therapy for Insomnia (CBT-I)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Sleep Specialist</label>
            <select id="modal-doctor-select" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none">
              <option value="">Any Available Specialist</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Appointment Date</label>
            <input type="date" id="modal-appointment-date" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Preferred Time Window</label>
            <select id="modal-appointment-time" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none">
              <option value="09:00 AM">Morning: 09:00 AM - 10:00 AM</option>
              <option value="11:30 AM">Midday: 11:30 AM - 12:30 PM</option>
              <option value="02:30 PM">Afternoon: 02:30 PM - 03:30 PM</option>
              <option value="04:30 PM">Late Afternoon: 04:30 PM - 05:30 PM</option>
              <option value="08:30 PM">Overnight Sleep Study Intake: 08:30 PM</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
            <input type="text" id="modal-patient-name" required placeholder="Patient full name" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input type="tel" id="modal-patient-phone" required placeholder="+1 (555) 000-0000" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
          <input type="email" id="modal-patient-email" required placeholder="patient@example.com" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Clinical Symptoms or Specific Request (Optional)</label>
          <textarea id="modal-patient-notes" rows="2" placeholder="e.g., Loud snoring, morning exhaustion, mask air leaks, insomnia..." class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"></textarea>
        </div>

        <!-- Clinical Disclaimer Notice -->
        <div class="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300 flex items-start space-x-2.5 rtl:space-x-reverse">
          <i data-lucide="shield-alert" class="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-600 dark:text-sky-400"></i>
          <span>Sleep studies and CPAP therapy require clinical pre-assessment. Our clinical intake coordinator will confirm pre-study preparation guidelines via SMS & email.</span>
        </div>

        <!-- Submit & Actions -->
        <div class="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
          <button type="button" onclick="closeAppointmentModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition">
            Cancel
          </button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center space-x-2 rtl:space-x-reverse">
            <span>Confirm Booking</span>
            <i data-lucide="check" class="w-4 h-4"></i>
          </button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modalDiv);

  // Form submit handler
  document.getElementById('global-appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const serviceName = document.getElementById('modal-service-select').value;
    const doctorName = document.getElementById('modal-doctor-select').value || 'Dr. Marcus Vance, MD';
    const date = document.getElementById('modal-appointment-date').value;
    const time = document.getElementById('modal-appointment-time').value;
    const patientName = document.getElementById('modal-patient-name').value;
    const patientEmail = document.getElementById('modal-patient-email').value;
    const patientPhone = document.getElementById('modal-patient-phone').value;
    const notes = document.getElementById('modal-patient-notes').value;

    const newApt = {
      id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
      patientName,
      patientEmail,
      patientPhone,
      doctorName,
      serviceName,
      date,
      time,
      type: serviceName.includes('Study') ? 'Diagnostic Study' : 'Clinical Consultation',
      location: serviceName.includes('In-Lab') ? 'SleepWell Suite 4A - Overnight Lab' : 'SleepWell Clinical Room 2',
      status: 'Confirmed',
      notes: notes || 'Booked via SleepWell online patient portal',
      price: serviceName.includes('In-Lab') ? 480 : 150
    };

    // Store in appointments
    const existing = JSON.parse(localStorage.getItem('sleepwell_appointments') || '[]');
    existing.unshift(newApt);
    localStorage.setItem('sleepwell_appointments', JSON.stringify(existing));

    // Add to notifications
    const existingNotifs = JSON.parse(localStorage.getItem('sleepwell_notifications') || '[]');
    existingNotifs.unshift({
      id: 'notif-' + Date.now(),
      title: 'Appointment Confirmed: ' + serviceName,
      message: `Your appointment with ${doctorName} on ${date} at ${time} has been registered.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'appointment',
      link: 'dashboard.html#appointments'
    });
    localStorage.setItem('sleepwell_notifications', JSON.stringify(existingNotifs));

    closeAppointmentModal();
    showToast(
      'Appointment Booked Successfully!',
      `Scheduled for ${date} at ${time} with ${doctorName}. Check your dashboard for details.`,
      'success'
    );

    // If on dashboard, reload appointments list
    if (window.location.pathname.includes('dashboard.html') && typeof window.renderDashboardData === 'function') {
      window.renderDashboardData();
    }
  });
}

// Global Enquiry Form Handler
function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.querySelector('[name="name"]')?.value || 'Guest';
  const email = form.querySelector('[name="email"]')?.value || '';
  const phone = form.querySelector('[name="phone"]')?.value || '';
  const service = form.querySelector('[name="service"]')?.value || 'General Inquiry';
  const message = form.querySelector('[name="message"]')?.value || '';

  const newEnquiry = {
    id: 'ENQ-' + Math.floor(100 + Math.random() * 900),
    name,
    email,
    phone,
    service,
    message,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };

  const enquiries = JSON.parse(localStorage.getItem('sleepwell_enquiries') || '[]');
  enquiries.unshift(newEnquiry);
  localStorage.setItem('sleepwell_enquiries', JSON.stringify(enquiries));

  form.reset();
  showToast(
    'Inquiry Received',
    'Thank you! A clinical coordinator will contact you within 24 business hours.',
    'success'
  );
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  seedInitialData();
  updateThemeIcons();

  // Attach button triggers for booking
  document.querySelectorAll('[data-book-appointment]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      const doctor = btn.getAttribute('data-doctor') || '';
      openAppointmentModal(service, doctor);
    });
  });

  // Attach theme toggles
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Attach direction toggles
  document.querySelectorAll('.dir-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleDirection);
  });

  // Attach contact forms
  document.querySelectorAll('.clinical-contact-form').forEach(form => {
    form.addEventListener('submit', handleContactSubmit);
  });

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Explicitly attach globals to window
window.showToast = showToast;
window.toggleTheme = toggleTheme;
window.updateThemeIcons = updateThemeIcons;
window.toggleDirection = toggleDirection;
window.openAppointmentModal = openAppointmentModal;
window.closeAppointmentModal = closeAppointmentModal;
window.handleContactSubmit = handleContactSubmit;
