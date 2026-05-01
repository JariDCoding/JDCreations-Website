(function () {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const current = path === '' ? 'index.html' : path;

  const LINKS = [
    { label: 'HOME',     href: './index.html', match: ['index.html'] },
    { label: 'OVER JDC', href: './over.html',  match: ['over.html'] },
    { label: 'PROJECTS', href: './projects.html', match: ['projects.html'] },
    { label: 'CONTACT',  href: '#contact',     match: [] },
  ];

  const isActive = (l) => l.match.includes(current);

  const navLink = (l) =>
    `<a class="jdc-header__link${isActive(l) ? ' is-active' : ''}" href="${l.href}">${l.label}</a>`;

  const drawerLink = (l, i) => `
    <a class="jdc-header__drawer-row${isActive(l) ? ' is-active' : ''}" href="${l.href}">
      <span class="jdc-header__drawer-row-num">0${i + 1}</span>
      <span class="jdc-header__drawer-row-label">${l.label}</span>
    </a>`;

  const header = document.createElement('header');
  header.className = 'jdc-header';
  header.setAttribute('role', 'banner');
  header.innerHTML = `
    <a class="jdc-header__brand" href="./index.html" aria-label="JDCreations home">
      <span class="jdc-header__logo">JD<span class="jdc-header__logo-dot" aria-hidden="true"></span></span>
      <span class="jdc-header__meta" aria-hidden="true">
        <span class="jdc-header__meta-line-1">/ STUDIO · 2026</span>
        <span class="jdc-header__meta-line-2"><span class="jdc-header__meta-led"></span>ONLINE &nbsp;·&nbsp; v1.0.0</span>
      </span>
    </a>

    <nav class="jdc-header__nav" aria-label="Primary">
      ${LINKS.map(navLink).join('')}
    </nav>

    <a class="jdc-header__cta" href="/aanvraag">
      <span class="jdc-header__cta-dot" aria-hidden="true"></span>
      <span>START&nbsp;NU</span>
      <span class="jdc-header__cta-arrow" aria-hidden="true">&rarr;</span>
    </a>

    <button class="jdc-header__toggle" type="button" aria-label="Menu openen" aria-expanded="false" aria-controls="jdc-header-drawer">
      <span class="jdc-header__toggle-bars" aria-hidden="true"></span>
    </button>

    <div class="jdc-header__drawer" id="jdc-header-drawer" role="dialog" aria-modal="true" aria-label="Mobiele navigatie">
      ${LINKS.map(drawerLink).join('')}
      <div class="jdc-header__drawer-foot" aria-hidden="true">
        <span class="jdc-header__drawer-arrow">&darr;</span>
        <span class="jdc-header__drawer-tagline">SLIM&nbsp;IN&nbsp;STRUCTUUR.<br>GERICHT&nbsp;OP&nbsp;RESULTAAT.</span>
      </div>
    </div>
  `;

  document.body.insertBefore(header, document.body.firstChild);

  const toggle = header.querySelector('.jdc-header__toggle');
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('jdc-menu-open', open);
  };

  toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));

  header.querySelector('.jdc-header__drawer').addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false);
  });

  const desktopMQ = window.matchMedia('(min-width: 961px)');
  desktopMQ.addEventListener('change', (e) => { if (e.matches) setOpen(false); });

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Width pin — the host page applies `html { zoom: X }` at several
  // breakpoints. Under zoom, innerWidth/clientWidth report the viewport
  // in CSS pixels (pre-zoom), so we divide by the active zoom factor to
  // recover the layout-space width that renders at full viewport.
  let pinRAF = 0;
  let lastW = 0;
  const drawer = header.querySelector('.jdc-header__drawer');
  const pinHeader = () => {
    if (pinRAF) return;
    pinRAF = requestAnimationFrame(() => {
      pinRAF = 0;
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom);
      const factor = (isFinite(zoom) && zoom > 0) ? zoom : 1;
      const w = vw / factor;
      if (w === lastW) return;
      lastW = w;

      const px = w + 'px';
      header.style.setProperty('width',  px,     'important');
      header.style.setProperty('left',   '0',    'important');
      header.style.setProperty('right',  'auto', 'important');
      header.style.setProperty('margin', '0',    'important');
      if (drawer) {
        drawer.style.setProperty('width', px,  'important');
        drawer.style.setProperty('left',  '0', 'important');
      }
    });
  };
  pinHeader();
  window.addEventListener('resize', pinHeader, { passive: true });
  window.addEventListener('orientationchange', pinHeader, { passive: true });
})();
