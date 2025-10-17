// This script automatically loads the menu.html file into the <div id="menu"> element
document.addEventListener("DOMContentLoaded", function() {
  const placeholder = document.getElementById('menu');
  if (!placeholder) return;

  fetch('menu.html')
    .then(res => {
      if (!res.ok) throw new Error('Status ' + res.status);
      return res.text();
    })
    .then(html => {
      placeholder.innerHTML = html;

      // mark active link based on current page
      const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      document.querySelectorAll('#menu-bar a').forEach(a => {
        const hrefFile = (a.getAttribute('href') || '').split('#')[0].split('/').pop().toLowerCase();
        if (hrefFile === current) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }
      });
    })
    .catch(err => {
      console.error('Menu load failed:', err);
      // minimal fallback so site is still usable
      placeholder.innerHTML = '<nav id="menu-bar"><a href="index.html">Home</a><a href="about.html">About</a></nav>';
    });
});

document.addEventListener('DOMContentLoaded', loadMenu);

async function loadMenu() {
  const placeholder = document.getElementById('menu');
  if (!placeholder) return;

  try {
    const res = await fetch('menu.html');
    if (!res.ok) throw new Error('Status ' + res.status);
    const text = await res.text();

    // If menu.html is a full document, parse and extract the menu fragment
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const menuEl = doc.querySelector('#menu-bar') || doc.querySelector('nav') || doc.body;
    placeholder.innerHTML = menuEl ? menuEl.outerHTML : text;

  } catch (err) {
    console.error('Menu load failed:', err);
    // graceful, minimal fallback
    placeholder.innerHTML = '<nav id="menu-bar" role="navigation" aria-label="Main menu"><a href="index.html">Home</a><a href="index.html#top-movies">Top Movies</a><a href="about.html">About</a></nav>';
  }

  setActiveLink();
}

function setActiveLink() {
  const links = document.querySelectorAll('#menu-bar a');
  if (!links.length) return;

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefFile = (href.split('#')[0].split('/').pop() || '').toLowerCase();
    const isIndexEmpty = (hrefFile === '' && currentFile === 'index.html');
    const isActive = isIndexEmpty || (hrefFile === currentFile);
    a.classList.toggle('active', isActive);
    if (isActive) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}