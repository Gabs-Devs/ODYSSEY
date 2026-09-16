import { debounce } from './utils.js';
import { computeRadius, buildWheel, startLoop, stopLoop } from './wheel.js';
import { resizeStarfield, drawStarfield } from './starfield.js';

// pausa tudo quando a aba não está visível, economizando CPU/bateria
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopLoop();
  } else {
    startLoop();
  }
});

// resize único e debounced, cobrindo roda + starfield
const handleResize = debounce(() => {
  computeRadius();
  buildWheel();
  resizeStarfield();
}, 150);

window.addEventListener('resize', handleResize);

// --- inicialização ---

function init() {
  computeRadius();
  buildWheel();
  startLoop();
  resizeStarfield();
  requestAnimationFrame(drawStarfield);
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}