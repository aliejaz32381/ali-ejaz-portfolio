// ============ Shared site behavior ============

document.addEventListener('DOMContentLoaded', () => {

  /* --- scroll reveal --- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* --- animated counters --- */
  const counters = document.querySelectorAll('[data-count]');
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => countIo.observe(el));

  /* --- testimonial rotation (highlights active card) --- */
  const testiCards = document.querySelectorAll('.testi-card');
  if (testiCards.length){
    let active = 0;
    setInterval(() => {
      testiCards[active].style.borderColor = '';
      active = (active + 1) % testiCards.length;
      testiCards[active].style.borderColor = 'var(--orange)';
    }, 3200);
  }

  /* --- about page: expertise bar fill on scroll --- */
  const expertiseCards = document.querySelectorAll('.expertise-card');
  if (expertiseCards.length){
    const expIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          expIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    expertiseCards.forEach(el => expIo.observe(el));
  }

  /* --- portfolio: category filtering --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length && projectCards.length){
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hide', !match);
          if (match){
            card.classList.remove('show');
            requestAnimationFrame(() => card.classList.add('show'));
          }
        });
      });
    });
  }

  /* --- portfolio: lightbox --- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox){
    const lbCategory = lightbox.querySelector('[data-lb="category"]');
    const lbTitle    = lightbox.querySelector('[data-lb="title"]');
    const lbPlatform = lightbox.querySelector('[data-lb="platform"]');
    const lbRole     = lightbox.querySelector('[data-lb="role"]');
    const lbDesc     = lightbox.querySelector('[data-lb="description"]');
    const lbApproach = lightbox.querySelector('[data-lb="approach"]');
    const lbSolution = lightbox.querySelector('[data-lb="solution"]');
    const lbResult   = lightbox.querySelector('[data-lb="result"]');
const lbVisual = lightbox.querySelector('.lightbox-visual');
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        lbCategory.textContent = card.dataset.category_label || '';
        lbTitle.textContent    = card.dataset.title || '';
        lbPlatform.textContent = card.dataset.platform || '';
        lbRole.textContent     = card.dataset.role || '';
        lbDesc.textContent     = card.dataset.description || '';
        lbApproach.textContent = card.dataset.approach || '';
        lbSolution.textContent = card.dataset.solution || '';
        const resultSection = lbResult.closest('.lightbox-section');
const resultText = card.dataset.result || '';

if (!resultText || resultText.startsWith('Placeholder')) {
  resultSection.style.display = 'none';
} else {
  resultSection.style.display = '';
  lbResult.textContent = resultText;
}

const image = card.dataset.image || '';
lbVisual.innerHTML = image
  ? `<img src="${image}" alt="${card.dataset.title || ''}">`
  : '';

lightbox.classList.add('open');
document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* --- contact page: form validation + submit states --- */
  const form = document.querySelector('#project-form');
  if (form){
    const nameField = form.querySelector('#field-name');
    const emailField = form.querySelector('#field-email');
    const messageField = form.querySelector('#field-message');
    const statusBox = form.querySelector('.form-status');
    const submitBtn = form.querySelector('.form-submit');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setInvalid(row, isInvalid){
      row.classList.toggle('invalid', isInvalid);
    }

    function validate(){
      let valid = true;
      const nameRow = nameField.closest('.form-row');
      const emailRow = emailField.closest('.form-row');
      const messageRow = messageField.closest('.form-row');

      const nameOk = nameField.value.trim().length > 0;
      setInvalid(nameRow, !nameOk);
      if (!nameOk) valid = false;

      const emailOk = emailPattern.test(emailField.value.trim());
      setInvalid(emailRow, !emailOk);
      if (!emailOk) valid = false;

      const messageOk = messageField.value.trim().length > 0;
      setInvalid(messageRow, !messageOk);
      if (!messageOk) valid = false;

      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusBox.className = 'form-status';

      if (!validate()){
        statusBox.textContent = 'Please fill in your name, a valid email, and a short message before sending.';
        statusBox.classList.add('error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Placeholder submit — connect to a real backend/email service to actually deliver messages.
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Project Inquiry';
        statusBox.textContent = "Thanks for reaching out. Your project details have been received. I'll review your requirements and get back to you.";
        statusBox.classList.add('success');
        form.reset();
      }, 900);
    });
  }

});
