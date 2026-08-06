const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a.button[href]').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const href = btn.getAttribute('href');
    const skip = !href || href.startsWith('#') || btn.target === '_blank' ||
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (skip) return;
    event.preventDefault();

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const fromKeyboard = event.clientX === 0 && event.clientY === 0;
    const originX = fromKeyboard ? rect.width / 2 : event.clientX - rect.left;
    const originY = fromKeyboard ? rect.height / 2 : event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${originX - size / 2}px`;
    ripple.style.top = `${originY - size / 2}px`;
    btn.appendChild(ripple);
    btn.classList.add('is-pressed');

    window.setTimeout(() => { window.location.href = href; }, 320);
  });
});
