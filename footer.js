(function () {
  const footer = document.createElement('footer');
  footer.className = 'jdc-footer';
  footer.setAttribute('role', 'contentinfo');
  footer.innerHTML = `
    <div class="jdc-footer__body">
      <div class="jdc-footer__brand">
        <div class="jdc-footer__brand-wordmark" aria-label="JDCreations"><span aria-hidden="true">/</span>JDC</div>
        <div class="jdc-footer__brand-sub" aria-hidden="true">CREATIONS</div>
        <p class="jdc-footer__brand-tagline">Slim in structuur.<br>Gericht op resultaat.</p>
      </div>

      <nav class="jdc-footer__nav" aria-label="Footer navigatie">
        <p class="jdc-footer__nav-heading" aria-hidden="true">Navigatie</p>
        <a class="jdc-footer__nav-link" href="./index.html">
          <span class="jdc-footer__nav-num" aria-hidden="true">01</span>HOME
        </a>
        <a class="jdc-footer__nav-link" href="./over.html">
          <span class="jdc-footer__nav-num" aria-hidden="true">02</span>OVER JDC
        </a>
        <a class="jdc-footer__nav-link" href="./verschil.html">
          <span class="jdc-footer__nav-num" aria-hidden="true">03</span>VERSCHIL
        </a>
        <a class="jdc-footer__nav-link" href="./projects.html">
          <span class="jdc-footer__nav-num" aria-hidden="true">04</span>PROJECTS
        </a>
        <a class="jdc-footer__nav-link jdc-footer__nav-link--cta" href="./contact.html">
          <span class="jdc-footer__nav-num" aria-hidden="true">05</span>CONTACT
          <span class="jdc-footer__nav-arrow" aria-hidden="true">&#8594;</span>
        </a>
      </nav>

      <div class="jdc-footer__cta">
        <p class="jdc-footer__cta-heading" aria-hidden="true">Start uw project</p>
        <a class="jdc-footer__cta-btn" href="./contact.html">
          <span class="jdc-footer__cta-btn-inner">START AANVRAAG &#8594;</span>
        </a>
        <div class="jdc-footer__contact">
          <span class="jdc-footer__contact-label">Contact</span>
          <a class="jdc-footer__contact-link" href="mailto:hello@jdcreations.be">hello@jdcreations.be</a>
        </div>
        <div class="jdc-footer__social">
          <a class="jdc-footer__social-link" href="https://www.instagram.com/jdcreations_" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          <a class="jdc-footer__social-link" href="https://www.linkedin.com/in/jari-de-coen" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        </div>
      </div>
    </div>

    <div class="jdc-footer__bottom">
      <span class="jdc-footer__copy">&copy; 2026 JDCreations &mdash; Alle rechten voorbehouden</span>
      <span class="jdc-footer__status">
        <span class="jdc-footer__status-dot" aria-hidden="true"></span>BESCHIKBAAR VOOR NIEUWE PROJECTEN
      </span>
    </div>
  `;

  document.body.appendChild(footer);
})();
