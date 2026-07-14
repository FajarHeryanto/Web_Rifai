document.addEventListener('DOMContentLoaded', () => {

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

      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;

      try {
        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        if (!res.ok || !result.ok){
          const errors = result.errors || {};
          Object.entries(errors).forEach(([field, msg]) => {
            const errEl = form.querySelector(`[data-error="${field}"]`);
            const inputEl = form.querySelector(`[name="${field}"]`);
            if (errEl) errEl.textContent = msg;
            if (inputEl) inputEl.classList.add('invalid');
          });
          return;
        }

        receiptHash.textContent = result.tx_hash;
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

});
