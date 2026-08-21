const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('#nav-links');

if (menu) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');

    menu.setAttribute(
      'aria-expanded',
      String(open)
    );
  });
}


document.querySelectorAll('#nav-links a').forEach((a) => {

  a.addEventListener('click', () => {

    links.classList.remove('open');

    menu?.setAttribute(
      'aria-expanded',
      'false'
    );

  });

});


/* Scroll reveal */

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }

    });

  },
  {
    threshold:0.12
  }
);


document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});


/* Dynamic year */

const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}


/* Light / Dark mode */

const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('navneet-theme');

if (savedTheme) {
  root.setAttribute(
    'data-theme',
    savedTheme
  );
}


function syncThemeButton() {

  if (!themeToggle) {
    return;
  }

  const light =
    root.getAttribute('data-theme') === 'light';

  themeToggle.setAttribute(
    'aria-pressed',
    String(light)
  );

  themeToggle.setAttribute(
    'aria-label',
    light
      ? 'Switch to dark mode'
      : 'Switch to light mode'
  );

  themeToggle.querySelector(
    '.theme-icon'
  ).textContent = light ? '☾' : '☼';

  themeToggle.querySelector(
    '.theme-label'
  ).textContent = light ? 'Dark' : 'Light';
}


syncThemeButton();


themeToggle?.addEventListener('click', () => {

  const light =
    root.getAttribute('data-theme') === 'light';

  if (light) {

    root.removeAttribute('data-theme');

    localStorage.setItem(
      'navneet-theme',
      'dark'
    );

  } else {

    root.setAttribute(
      'data-theme',
      'light'
    );

    localStorage.setItem(
      'navneet-theme',
      'light'
    );

  }

  syncThemeButton();

});
