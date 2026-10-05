import { OPTIONS, RESUME_DELAY } from './config.js';
import { normalizeAngle } from './utils.js';
import { updateInfoPanel, resetInfoPanel } from './infoPanel.js';
import { loadBiomaPage } from './landingLoader.js';

const orbit = document.getElementById('orbit');
const wheelWrap = document.getElementById('wheelWrap');

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

let radius;
let currentAngle = 0;
let targetAngle = null;
let autoRotate = !prefersReducedMotion;
const AUTO_SPEED = 0.06;
let activeIndex = -1;
let resumeTimer = null;
let rafId = null;


const nodeEls = [];

export function computeRadius() {
  const size = Math.min(wheelWrap.clientWidth, wheelWrap.clientHeight);

  if (!size || size <= 0) {
    const cssRadius = parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--radius-wheel')
    ) || 190;
    radius = cssRadius - 55 > 0 ? cssRadius - 55 : cssRadius;
    return;
  }
  radius = size / 2 - 55;
}

export function buildWheel() {
  orbit.innerHTML = '';
  nodeEls.length = 0;
  const step = 360 / OPTIONS.length;

  OPTIONS.forEach((opt, i) => {
    const baseAngle = i * step;
    const node = document.createElement('div');
    node.className = 'node' + (opt.comingSoon ? ' is-disabled' : '');
    node.dataset.index = i;

    if (opt.comingSoon) {
      node.setAttribute('aria-disabled', 'true');
      node.setAttribute('aria-label', 'Bioma em breve');
      node.setAttribute('tabindex', '-1');
    } else {
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', `Explorar bioma: ${opt.title}`);
    }

    node.style.transform =
      `translate(-50%, -50%) rotate(${baseAngle}deg) translateY(-${radius}px) rotate(${-baseAngle}deg)`;

    node.innerHTML = `
      <div class="node-inner">
        <span class="node-icon" aria-hidden="true">${opt.icon}</span>
        <span class="node-label">${opt.label}</span>
      </div>`;

    if (!opt.comingSoon) {
      node.addEventListener('click', () => selectNode(i));
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectNode(i);
        }
      });
    }

    orbit.appendChild(node);
    nodeEls.push({ node, inner: node.querySelector('.node-inner') });
  });
}

function selectNode(index) {
  const opt = OPTIONS[index];
  if (opt.comingSoon) return;

  if (resumeTimer !== null) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }

  activeIndex = index;
  autoRotate = false;
  nodeEls.forEach(({ node }, i) => node.classList.toggle('active', i === index));

  const baseAngle = index * (360 / OPTIONS.length);
  const desired = -baseAngle;
  const diff = normalizeAngle(desired - currentAngle);
  targetAngle = currentAngle + diff;

  updateInfoPanel(index);

  if (opt.slug) {
    loadBiomaPage(opt.slug);
  }
}

function scheduleResume() {
  if (resumeTimer !== null) return;

  resumeTimer = setTimeout(() => {
    resumeTimer = null;
    activeIndex = -1;
    nodeEls.forEach(({ node }) => node.classList.remove('active'));
    resetInfoPanel();
    if (!prefersReducedMotion) autoRotate = true;
  }, RESUME_DELAY);
}

function animate() {
  if (targetAngle !== null) {
    const diff = targetAngle - currentAngle;
    currentAngle += diff * 0.08;
    if (Math.abs(diff) < 0.05) {
      currentAngle = targetAngle;
      targetAngle = null;
      if (activeIndex !== -1) scheduleResume();
    }
  } else if (autoRotate) {
    currentAngle += AUTO_SPEED;
  }

  orbit.style.transform = `rotate(${currentAngle}deg)`;

  nodeEls.forEach(({ inner }) => {
    inner.style.transform = `rotate(${-currentAngle}deg)`;
  });

  rafId = requestAnimationFrame(animate);
}

export function startLoop() {
  if (rafId === null) {
    rafId = requestAnimationFrame(animate);
  }
}

export function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}


wheelWrap.addEventListener('mouseenter', () => {
  if (activeIndex === -1) autoRotate = false;
});
wheelWrap.addEventListener('mouseleave', () => {
  if (activeIndex === -1 && !prefersReducedMotion) autoRotate = true;
});
