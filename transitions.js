/* =========================================================================
   JDCreations — transitions
   - Skips the full loader on any page after the first-visit loader has
     already completed in this browser session.
   - Replaces loader with a fast page-transition overlay when navigating
     between pages (curtain close → navigate → curtain open).
   ======================================================================= */

(function () {
  const LOADER_KEY = 'jdc.loader.shown';

  // Run as early as possible so the loader is hidden before paint.
  try {
    if (sessionStorage.getItem(LOADER_KEY) === '1') {
      document.documentElement.classList.add('jdc-skip-loader');
      // scroll-locked is added by the inline head script because it
      // normally waits for the loader to release it. Skipping the loader
      // means nothing will release it — drop it on next tick.
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('scroll-locked');
      });
    }
  } catch (_) {}

  const isInternal = (a) => {
    if (!a || a.target === '_blank') return false;
    const href = a.getAttribute('href') || '';
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    try {
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin) return false;
      // Same page, different hash only → let browser handle natively.
      if (u.pathname === location.pathname && u.search === location.search) return false;
      return true;
    } catch (_) { return false; }
  };

  // Overlay is created lazily — only when entering from a page transition
  // or when the user clicks an internal link. Fresh visitors never touch
  // the DOM for it.
  let overlayCache = null;
  const getOverlay = () => {
    if (overlayCache) return overlayCache;
    const el = document.createElement('div');
    el.className = 'jdc-pt';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <span class="jdc-pt__panel jdc-pt__panel--l"></span>
      <span class="jdc-pt__panel jdc-pt__panel--r"></span>
      <span class="jdc-pt__scan" aria-hidden="true"></span>
      <div class="jdc-pt__mark" aria-hidden="true">
        <div class="jdc-pt__brand"><span>/</span>JDC</div>
        <div class="jdc-pt__label"><span class="jdc-pt__dot"></span>LOADING NEXT PAGE</div>
      </div>
      <div class="jdc-pt__bar" aria-hidden="true"><div class="jdc-pt__bar-fill"></div></div>
    `;
    document.body.appendChild(el);
    overlayCache = el;
    return el;
  };

  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  };

  onReady(() => {
    // Mark session so subsequent navigations skip the home loader.
    const markVisited = () => {
      try { sessionStorage.setItem(LOADER_KEY, '1'); } catch (_) {}
    };

    const skipped = document.documentElement.classList.contains('jdc-skip-loader');
    const loader = document.getElementById('loader');

    // When the loader is skipped (or this page has none) the home page's
    // reveal CSS still keys off `body.loader-gone` for wordmark, divider
    // lines, etc. Apply it immediately so the hero renders correctly.
    // Also kick off the hero decrypt animation + flush the blur gate,
    // because `prepDecrypt` blanks the tagline text at script parse
    // (so without the decrypt call the home page shows empty lines).
    if (!loader || skipped) {
      document.documentElement.classList.remove('scroll-locked');
      document.body.classList.add('loader-gone');
      if (loader) loader.style.display = 'none';
      const kickDecrypt = () => {
        if (typeof window.__startHeroDecrypt === 'function') {
          window.__startHeroDecrypt();
        }
        if (typeof window.__flushBlurGate === 'function') {
          //   index.html:  hero, over-ons, previous-projects, werkwijze
          //   over.html:   over-jdc, skills, cta-footer
          const gates = [
            'hero', 'over-ons', 'previous-projects', 'werkwijze',
            'over-jdc', 'skills', 'cta-footer',
            'projects-hero', 'project-one',
          ];
          gates.forEach(window.__flushBlurGate);
        }
      };
      // One RAF so the decrypt scripts above us have finished defining
      // their globals (they live in the same parse-time IIFE that runs
      // right before transitions.js's onReady).
      requestAnimationFrame(kickDecrypt);
    }
    if (loader && !skipped) {
      // The home loader adds .hide when it fades out.
      const obs = new MutationObserver(() => {
        if (loader.classList.contains('hide') || loader.style.display === 'none') {
          markVisited();
          obs.disconnect();
        }
      });
      obs.observe(loader, { attributes: true, attributeFilter: ['class', 'style'] });
    } else {
      // No loader on this page — still count it as visited.
      markVisited();
    }

    // Entering animation: if we navigated here via a page transition, the
    // curtains are painted closed by default. Drop them on first frame.
    if (sessionStorage.getItem('jdc.pt.incoming') === '1') {
      sessionStorage.removeItem('jdc.pt.incoming');
      const overlay = getOverlay();
      overlay.classList.add('is-entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add('is-revealing'));
      });
      setTimeout(() => {
        overlay.classList.remove('is-entering', 'is-revealing');
      }, 1000);
    }

    // Intercept internal link clicks → play leaving curtains → navigate.
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      const a = e.target.closest('a');
      if (!isInternal(a)) return;

      // Let the header drawer links close the drawer first. They also
      // fall through to this handler, so the navigation still animates.
      e.preventDefault();
      try { sessionStorage.setItem('jdc.pt.incoming', '1'); } catch (_) {}
      getOverlay().classList.add('is-leaving');
      const target = a.href;
      setTimeout(() => { location.href = target; }, 700);
    });

    // Some browsers cache pages in bfcache. When restored, reset overlay
    // if it was created.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted && overlayCache) {
        overlayCache.classList.remove('is-leaving', 'is-entering', 'is-revealing');
      }
    });
  });
})();
