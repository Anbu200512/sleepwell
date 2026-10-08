/**
 * SleepWell - Shared Clinical Footer Component Controller
 * Renders the standardized, theme-aware footer (light background in light mode).
 */

document.addEventListener('DOMContentLoaded', () => {
  initFooter();
});

function initFooter() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;

  const currentPath = window.location.pathname.toLowerCase();

  const navLink = (href, label) => {
    const active = currentPath.endsWith(href.split('#')[0].toLowerCase());
    return `<li><a href="${href}" class="inline-block py-1 transition ${active ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'hover:text-teal-600 dark:hover:text-teal-400'}">${label}</a></li>`;
  };

  footer.className = 'bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200';

  footer.innerHTML = `
    <!-- Main Footer Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">

        <!-- Brand Column -->
        <div class="lg:col-span-4 space-y-5">
          <a href="index.html" class="flex items-center space-x-3 rtl:space-x-reverse group w-fit">
            <span class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </span>
            <span class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Sleep<span class="text-teal-600 dark:text-teal-400">Well</span>
            </span>
          </a>
          <p class="text-sm font-semibold text-teal-600 dark:text-teal-400">"Better Sleep. Better Health."</p>
          <p class="text-sm leading-relaxed max-w-sm text-slate-600 dark:text-slate-400">
            AASM-accredited sleep disorder centre providing gold-standard in-lab polysomnography, convenient home sleep testing, and long-term auto-CPAP adherence support.
          </p>

          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-bold">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> AASM Accredited
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-900 text-sky-700 dark:text-sky-300 text-[11px] font-bold">
              <i data-lucide="badge-check" class="w-3.5 h-3.5"></i> HIPAA Compliant
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
              <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i> RPSGT Technologists
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 pt-1">
            <a href="tel:+18005557533" aria-label="Call the clinic" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-teal-600 hover:text-white transition flex items-center justify-center"><i data-lucide="phone-call" class="w-4 h-4"></i></a>
            <a href="mailto:appointments@sleepwellclinic.com" aria-label="Email the clinic" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-teal-600 hover:text-white transition flex items-center justify-center"><i data-lucide="mail" class="w-4 h-4"></i></a>
            <button type="button" onclick="openAppointmentModal()" aria-label="Book an appointment" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-teal-600 hover:text-white transition flex items-center justify-center"><i data-lucide="calendar-plus" class="w-4 h-4"></i></button>
            <a href="index.html#contact" aria-label="Clinic location" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-teal-600 hover:text-white transition flex items-center justify-center"><i data-lucide="map-pin" class="w-4 h-4"></i></a>
            <a href="doctors.html" aria-label="Meet our doctors" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-teal-600 hover:text-white transition flex items-center justify-center"><i data-lucide="stethoscope" class="w-4 h-4"></i></a>
          </div>
        </div>

        <!-- Navigation Column -->
        <div class="lg:col-span-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Explore</h4>
          <ul class="space-y-2 text-sm">
            ${navLink('index.html', 'Home 1 (Clinical)')}
            ${navLink('home2.html', 'Home 2 (Diagnostic)')}
            ${navLink('about.html', 'About Clinic')}
            ${navLink('services.html', 'Services')}
            ${navLink('doctors.html', 'Doctors')}
            ${navLink('blog.html', 'Blog')}
            ${navLink('contact.html', 'Contact')}
          </ul>
        </div>

        <!-- Portals Column -->
        <div class="lg:col-span-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Patient Portals</h4>
          <ul class="space-y-2 text-sm">
            ${navLink('login.html', 'Patient Login')}
            ${navLink('signup.html', 'New Patient Registration')}
            ${navLink('dashboard.html', 'Patient Dashboard')}
            ${navLink('admin-dashboard.html', 'Clinical Admin Portal')}
            ${navLink('404.html', 'System Diagnostics')}
          </ul>
        </div>

        <!-- Clinic Contact Column -->
        <div class="lg:col-span-4 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Clinic &amp; Contact</h4>

          <div class="flex items-start space-x-3 rtl:space-x-reverse p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0"><i data-lucide="map-pin" class="w-4 h-4"></i></span>
            <div class="text-xs leading-relaxed">
              <strong class="block text-slate-900 dark:text-white text-sm">Main Clinical Center</strong>
              742 Evergreen Medical Pavilion, Suite 400,<br>Boston, MA 02115
            </div>
          </div>

          <div class="flex items-start space-x-3 rtl:space-x-reverse p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0"><i data-lucide="phone-call" class="w-4 h-4"></i></span>
            <div class="text-xs leading-relaxed">
              <strong class="block text-slate-900 dark:text-white text-sm">24/7 CPAP Emergency Line</strong>
              Toll-Free: <a href="tel:+18005557533" class="hover:text-teal-600 dark:hover:text-teal-400 transition">+1 (800) 555-SLEEP</a><br>
              Clinic: <a href="tel:+15553928471" class="hover:text-teal-600 dark:hover:text-teal-400 transition">+1 (555) 392-8471</a>
            </div>
          </div>

          <div class="flex items-start space-x-3 rtl:space-x-reverse p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0"><i data-lucide="clock" class="w-4 h-4"></i></span>
            <div class="text-xs leading-relaxed">
              <strong class="block text-slate-900 dark:text-white text-sm">Operating Hours</strong>
              Consultations: Mon - Fri (8:00 AM - 5:30 PM)<br>
              Sleep Lab: Daily (8:00 PM - 7:00 AM)
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
        <p class="text-slate-500 dark:text-slate-400 text-center lg:text-left">
          &copy; 2026 SleepWell Sleep Disorder &amp; CPAP Clinic. All rights reserved. Encrypted patient healthcare records.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-500 dark:text-slate-400">
          <a href="#" class="hover:text-teal-600 dark:hover:text-teal-400 transition">HIPAA Privacy Notice</a>
          <a href="#" class="hover:text-teal-600 dark:hover:text-teal-400 transition">Terms of Clinical Service</a>
          <a href="#" class="hover:text-teal-600 dark:hover:text-teal-400 transition">Medical Disclaimer</a>
          <button type="button" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-400 transition" aria-label="Back to top">
            <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
