const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('#nav-links');

/* Mobile navigation */
if (menu && links) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('#nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    links?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  });
});


/* Scroll reveal + staggered cards */
const revealTargets = document.querySelectorAll(
  '.reveal, .skill-card, .project-card, .education-card, .note-card-link, .credential-card, .method-grid > div'
);

revealTargets.forEach((element, index) => {
  if (!element.classList.contains('reveal')) {
    element.classList.add('reveal');
  }

  element.classList.add('stagger-item');
  element.style.setProperty('--delay', index % 8);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealTargets.forEach((element) => revealObserver.observe(element));


/* Dynamic year */
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}


/* Light / dark mode */
const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('navneet-theme');

if (savedTheme === 'light') {
  root.setAttribute('data-theme', 'light');
}

function syncThemeButton() {
  if (!themeToggle) return;

  const light = root.getAttribute('data-theme') === 'light';
  const icon = themeToggle.querySelector('.theme-icon');
  const label = themeToggle.querySelector('.theme-label');

  themeToggle.setAttribute('aria-pressed', String(light));
  themeToggle.setAttribute(
    'aria-label',
    light ? 'Switch to dark mode' : 'Switch to light mode'
  );

  if (icon) icon.textContent = light ? '☾' : '☼';
  if (label) label.textContent = light ? 'Dark' : 'Light';
}

syncThemeButton();

themeToggle?.addEventListener('click', () => {
  const light = root.getAttribute('data-theme') === 'light';

  if (light) {
    root.removeAttribute('data-theme');
    localStorage.setItem('navneet-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('navneet-theme', 'light');
  }

  syncThemeButton();
});


/* Scroll progress indicator */
const progress = document.querySelector('.scroll-progress');
const progressLabel = document.querySelector('.scroll-progress-label');

function updateScrollProgress() {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const current = window.scrollY;
  const percentage = documentHeight > 0
    ? Math.min(100, Math.max(0, (current / documentHeight) * 100))
    : 0;

  root.style.setProperty('--progress', percentage.toFixed(2));

  if (progressLabel) {
    const completed = Math.round(percentage);
    const remaining = Math.max(0, 100 - completed);
    progressLabel.innerHTML = `<b>${completed}%</b><small>${remaining}% left</small>`;
  }
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();


/* Highlight the section currently on screen */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('#nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          'nav-active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    });
  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  }
);

sections.forEach((section) => sectionObserver.observe(section));


/* Smooth anchor movement with header offset */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const id = anchor.getAttribute('href');
    const target = document.querySelector(id);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});


/* Interactive portfolio terminal */
const terminalForm = document.querySelector('#terminal-form');
const terminalInput = document.querySelector('#terminal-input');
const terminalOutput = document.querySelector('#terminal-output');

const terminalHistory = [];
let historyIndex = 0;

const terminalCommands = {
  help: () => ({
    html: `<span class="terminal-success">Available commands</span>\n  neofetch   system-style profile\n  whoami     current profile\n  about      short profile\n  skills     core technical skills\n  projects   featured projects\n  experience career timeline\n  education  academic background\n  status     current portfolio status\n  uptime     portfolio availability\n  date       current date/time\n  tree       portfolio structure\n  ls         portfolio files\n  cd         show CV.pdf\n  cv         open CV.pdf\n  pwd        show portfolio path\n  github     open GitHub\n  linkedin   open LinkedIn\n  medium     open Medium\n  phone      call Navneet\n  whatsapp   open WhatsApp\n  email      send email\n  contact    contact details\n  clear      clear terminal`
  }),

  neofetch: () => ({
    html: `<span class="terminal-accent">       _   _             NAVNEET KUMAR</span>\n<span class="terminal-muted">      | \| |             SYSTEM ENGINEER</span>\n<span class="terminal-muted">      |  \| |             ─────────────────</span>\n<span class="terminal-muted">      | |\  |             OS       : Windows / Linux</span>\n<span class="terminal-muted">      |_| \_|             Endpoint : Microsoft Intune</span>\n<span class="terminal-muted">                         Cloud    : Azure / Entra ID</span>\n<span class="terminal-muted">                         Shell    : PowerShell / Bash</span>\n<span class="terminal-muted">                         Exp      : 6+ years</span>`
  }),

  whoami: () => ({
    html: `<span class="terminal-success">navneet.kumar</span>\nSystem Engineer · Endpoint · Infrastructure · Automation`
  }),

  about: () => ({
    html: `<span class="terminal-success">Navneet Kumar</span>\nSystem Engineer focused on endpoint management, infrastructure, security and automation.`
  }),

  skills: () => ({
    html: `<span class="terminal-success">Core stack</span>\nIntune · Autopilot · Windows · Entra ID · Active Directory\nPowerShell · Python · Linux · Azure · Proxmox · Qualys VMDR`
  }),

  projects: () => ({
    html: `<span class="terminal-success">Featured projects</span>\nSoftwareLicense.fyi · Home Loan Calculator · Math Sprint · Astro Dash\nType <strong>github</strong> to open the repository profile.`
  }),

  experience: () => ({
    html: `<span class="terminal-success">Career</span>\n2024–Present  System Engineer · Clear-Trail Technologies\n2023–2024     Senior Engineer · GMG\n2022–2023     Infrastructure Admin · Publicis Groupe\n2021–2022     Service Desk Analyst · Total IT Consult\n2020–2021     IT Consultant · DCDC Kidney Care`
  }),

  education: () => ({
    html: `<span class="terminal-success">Education</span>\n2026–2028  MBA · Information Technology · Galgotias University\n2022–2025  Computer Science / Computer Applications · UPRTOU\n2020–2022  Information Technology · Annamalai University\n2016–2019  Digital Electronics · Ambedkar DSEU`
  }),

  status: () => ({
    html: `<span class="terminal-success">SYSTEM STATUS: ONLINE</span>\nEndpoint operations · Identity · Security · Infrastructure · Automation`
  }),

  uptime: () => ({
    html: `<span class="terminal-success">PORTFOLIO STATUS</span>\nGitHub Pages · HTTPS · Static deployment · ONLINE`
  }),

  date: () => ({
    html: `<span class="terminal-success">${new Date().toLocaleString()}</span>`
  }),

  tree: () => ({
    html: `<span class="terminal-muted">navneet.webline.cloud/</span>\n├── CV.pdf\n├── projects/\n├── experience/\n├── education/\n├── engineering-notes/\n└── contact/`
  }),

  ls: () => ({
    html: `CV.pdf\nprojects/\nexperience/\neducation/\nengineering-notes/\nREADME.md`
  }),

  cd: () => ({
    html: `CV.pdf  <a class="terminal-link" href="CV.pdf" target="_blank" rel="noopener">[open]</a>`
  }),

  cv: () => ({
    html: `Opening CV.pdf... <a class="terminal-link" href="CV.pdf" target="_blank" rel="noopener">[open CV]</a>`,
    open: 'CV.pdf'
  }),

  pwd: () => ({
    html: `<span class="terminal-success">https://navneet.webline.cloud/</span>`
  }),

  github: () => ({
    html: `<a class="terminal-link" href="https://github.com/navneet-20/navneet.kumar" target="_blank" rel="noopener">https://github.com/navneet-20/navneet.kumar</a>`,
    open: 'https://github.com/navneet-20/navneet.kumar'
  }),

  linkedin: () => ({
    html: `<a class="terminal-link" href="https://www.linkedin.com/in/navneet-pro/" target="_blank" rel="noopener">https://www.linkedin.com/in/navneet-pro/</a>`,
    open: 'https://www.linkedin.com/in/navneet-pro/'
  }),

  medium: () => ({
    html: `<a class="terminal-link" href="https://navneet-kumar.medium.com/" target="_blank" rel="noopener">https://navneet-kumar.medium.com/</a>`,
    open: 'https://navneet-kumar.medium.com/'
  }),

  phone: () => ({
    html: `<span class="terminal-success">+91 75330 02838</span>\n<a class="terminal-link" href="tel:+917533002838">[call now]</a>`
  }),

  whatsapp: () => ({
    html: `<a class="terminal-link" href="https://wa.me/917533002838?text=Hi%20Navneet%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noopener">https://wa.me/917533002838</a>\n[open WhatsApp]`
  }),

  email: () => ({
    html: `<span class="terminal-success">navneet7533@gmail.com</span>\n<a class="terminal-link" href="mailto:navneet7533@gmail.com">[send email]</a>`
  }),

  contact: () => ({
    html: `<span class="terminal-success">Contact</span>\nPhone: <a class="terminal-link" href="tel:+917533002838">+91 75330 02838</a>\nEmail: <a class="terminal-link" href="mailto:navneet7533@gmail.com">navneet7533@gmail.com</a>`
  })
};

function appendTerminalLine(command, result) {
  const line = document.createElement('div');
  line.className = 'terminal-line-output';
  line.innerHTML = `<span class="terminal-prompt-output">root@navneet:~$</span> <span class="terminal-command"></span>\n${result.html}`;
  line.querySelector('.terminal-command').textContent = command;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runTerminalCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();

  if (!command) return;

  if (command === 'clear' || command === 'cls') {
    terminalOutput.innerHTML = '';
    return;
  }

  if (command === 'optimize' || command === './optimize') {
    appendTerminalLine(command, {
      html: `<span class="terminal-success">Enterprise optimization pipeline ready.</span>\nIntune · identity · security · infrastructure · automation`
    });
    return;
  }

  const handler = terminalCommands[command];

  if (!handler) {
    appendTerminalLine(command, {
      html: `<span class="terminal-muted">command not found:</span> ${command}\nType <strong>help</strong> for available commands.`
    });
    return;
  }

  const result = handler();
  appendTerminalLine(command, result);
}

if (terminalForm && terminalInput && terminalOutput) {
  terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const command = terminalInput.value.trim();

    if (!command) return;

    terminalHistory.push(command);
    historyIndex = terminalHistory.length;

    runTerminalCommand(command);
    terminalInput.value = '';
  });

  terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!terminalHistory.length) return;

      historyIndex = Math.max(0, historyIndex - 1);
      terminalInput.value = terminalHistory[historyIndex] || '';
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!terminalHistory.length) return;

      historyIndex = Math.min(terminalHistory.length, historyIndex + 1);
      terminalInput.value = terminalHistory[historyIndex] || '';
    }

    if (event.key === 'Tab') {
      event.preventDefault();

      const current = terminalInput.value.trim().toLowerCase();
      if (!current) return;

      const match = Object.keys(terminalCommands).find((command) =>
        command.startsWith(current)
      );

      if (match) terminalInput.value = match;
    }
  });
}

const recruiterModal = document.querySelector('#recruiter-modal');
const recruiterOpen = document.querySelector('#recruiter-open');
const recruiterClose = document.querySelector('#recruiter-close');

function setRecruiterMode(open) {
  if (!recruiterModal) return;
  recruiterModal.classList.toggle('open', open);
  recruiterModal.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) recruiterClose?.focus();
}

recruiterOpen?.addEventListener('click', () => setRecruiterMode(true));
const recruiterNavOpen = document.querySelector('#recruiter-nav-open');
recruiterNavOpen?.addEventListener('click', () => setRecruiterMode(true));
recruiterClose?.addEventListener('click', () => setRecruiterMode(false));
recruiterModal?.addEventListener('click', (event) => {
  if (event.target.matches('[data-recruiter-close]')) setRecruiterMode(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && recruiterModal?.classList.contains('open')) setRecruiterMode(false);
});
