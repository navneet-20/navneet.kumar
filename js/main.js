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
