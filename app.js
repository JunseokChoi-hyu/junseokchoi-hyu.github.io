const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const CLICKABLE = [
  'a.button[href]',
  '.page-index a[href]',
  '.archive-category-card[href]',
  '.archive-card[href]',
  '.site-header nav a[href]'
].join(',');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function spawnRipple(host, event) {
  const rect = host.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.8;
  const fromKeyboard = event.clientX === 0 && event.clientY === 0;
  const originX = fromKeyboard ? rect.width / 2 : event.clientX - rect.left;
  const originY = fromKeyboard ? rect.height / 2 : event.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.className = 'button-ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${originX - size / 2}px`;
  ripple.style.top = `${originY - size / 2}px`;
  ripple.addEventListener('animationend', () => ripple.remove());
  host.appendChild(ripple);
}

document.querySelectorAll(CLICKABLE).forEach((host) => {
  host.addEventListener('click', (event) => {
    const href = host.getAttribute('href');
    const modified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (!href || modified || reducedMotion.matches) return;

    spawnRipple(host, event);
    host.classList.add('is-pressed');
    window.setTimeout(() => host.classList.remove('is-pressed'), 260);

    // 같은 페이지 앵커나 새 탭 링크는 기본 동작을 막지 않고 효과만 보여준다.
    if (href.startsWith('#') || host.target === '_blank') return;

    event.preventDefault();
    window.setTimeout(() => { window.location.href = href; }, 320);
  });
});
