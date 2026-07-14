document.addEventListener('DOMContentLoaded', () => {

  // ⚠️ Set this to your own email — see the FORMSUBMIT SETUP note near the
  // bottom of this file for the one-time activation step required.
  const CONTACT_EMAIL = 'evosrifai1@gmail.com';

  // Boot screen: let people skip it with a click/tap
  const boot = document.getElementById('bootScreen');
  if (boot){
    boot.addEventListener('click', () => {
      boot.style.animation = 'none';
      boot.style.opacity = '0';
      boot.style.visibility = 'hidden';
      boot.style.pointerEvents = 'none';
    });
  }

  // Live system clock in the nav
  const clockEl = document.getElementById('sysClock');
  if (clockEl){
    const tick = () => {
      clockEl.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
    };
    tick();
    setInterval(tick, 1000);
  }

  // Click-to-copy node id
  const nodeId = document.getElementById('nodeId');
  if (nodeId){
    nodeId.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(nodeId.textContent.trim());
        nodeId.classList.add('copied');
        setTimeout(() => nodeId.classList.remove('copied'), 1600);
      } catch (err) {
        /* clipboard unavailable — fail silently */
      }
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  const tabs = document.querySelectorAll('.nav__tab');
  const sections = Array.from(tabs).map(tab => document.querySelector(tab.getAttribute('href')));

  function updateActiveTab(){
    const scrollPos = window.scrollY + 140;
    let currentIndex = 0;
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= scrollPos) currentIndex = i;
    });
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === currentIndex));
  }
  window.addEventListener('scroll', updateActiveTab, { passive: true });
  updateActiveTab();

  const burger = document.getElementById('navBurger');
  const navTabsEl = document.querySelector('.nav__tabs');
  if (burger && navTabsEl){
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      navTabsEl.style.display = expanded ? 'none' : 'flex';
      navTabsEl.style.position = 'absolute';
      navTabsEl.style.top = '58px';
      navTabsEl.style.left = '0';
      navTabsEl.style.right = '0';
      navTabsEl.style.flexDirection = 'column';
      navTabsEl.style.background = 'rgba(6,9,10,.98)';
      navTabsEl.style.padding = '10px 24px 18px';
      navTabsEl.style.borderBottom = '1px solid #1E2B26';
    });
  }

  // ---- Contact form -------------------------------------------------
  // Static hosting has no server, so validation now happens entirely in
  // the browser (mirrors the old Flask rules), and the message is handed
  // off to FormSubmit instead of a Flask /contact route.
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function validate(data){
    const errors = {};
    if (!data.name || data.name.length < 2){
      errors.name = 'Enter a name with at least 2 characters.';
    }
    if (!data.email || !EMAIL_RE.test(data.email)){
      errors.email = 'Enter a valid email address.';
    }
    if (!data.message || data.message.length < 10){
      errors.message = 'Message must be at least 10 characters.';
    }
    return errors;
  }

  function fakeReceiptHash(){
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const receipt = document.getElementById('receipt');
  const receiptHash = document.getElementById('receiptHash');
  const resetBtn = document.getElementById('resetForm');

  if (form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid'));

      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };

      const errors = validate(data);
      if (Object.keys(errors).length){
        Object.entries(errors).forEach(([field, msg]) => {
          const errEl = form.querySelector(`[data-error="${field}"]`);
          const inputEl = form.querySelector(`[name="${field}"]`);
          if (errEl) errEl.textContent = msg;
          if (inputEl) inputEl.classList.add('invalid');
        });
        return;
      }

      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;

      try {
        const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
            _subject: `New portfolio message from ${data.name}`,
          }),
        });

        if (!res.ok){
          throw new Error('FormSubmit request failed');
        }

        receiptHash.textContent = fakeReceiptHash();
        form.hidden = true;
        receipt.hidden = false;
      } catch (err){
        const errEl = form.querySelector('[data-error="message"]');
        if (errEl) errEl.textContent = 'Network error — please try again.';
      } finally {
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
      }
    });
  }

  if (resetBtn){
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.hidden = false;
      receipt.hidden = true;
    });
  }

  /* ------------------------------------------------------------------
     FORMSUBMIT SETUP (one-time, required before the form works live):
     1. Deploy this site to your domain.
     2. Submit the contact form once yourself.
     3. FormSubmit emails CONTACT_EMAIL an "activate your form" link —
        click it. Every submission after that lands straight in your inbox.
     No account, API key, or backend needed. If you'd rather use a
     different provider (e.g. Web3Forms), swap the fetch() URL/body above.
  ------------------------------------------------------------------ */
});
