import { debounce } from './utils.js';
import { computeRadius, buildWheel, startLoop, stopLoop } from './wheel.js';
import { resizeStarfield, drawStarfield } from './starfield.js';

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopLoop();
  } else {
    startLoop();
  }
});

const handleResize = debounce(() => {
  computeRadius();
  buildWheel();
  resizeStarfield();
}, 150);

window.addEventListener('resize', handleResize);

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