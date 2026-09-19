const starfieldCanvas = document.getElementById('starfield');
const starCtx = starfieldCanvas.getContext('2d');
let stars = [];

const MAX_STARS = 400;
export function resizeStarfield() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;

  starfieldCanvas.width = cssWidth * dpr;
  starfieldCanvas.height = cssHeight * dpr;
  starfieldCanvas.style.width = `${cssWidth}px`;
  starfieldCanvas.style.height = `${cssHeight}px`;
  starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(
    Math.floor((cssWidth * cssHeight) / 6000),
    MAX_STARS
  );

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * cssWidth,
    y: Math.random() * cssHeight,
    r: Math.random() * 1.4 + 0.2,
    speed: Math.random() * 0.3 + 0.05,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function drawStarfield(t) {
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;

  starCtx.clearRect(0, 0, cssWidth, cssHeight);
  stars.forEach((s) => {
    const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase);
    starCtx.globalAlpha = 0.3 + twinkle * 0.7;
    starCtx.fillStyle = '#cfe8ff';
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fill();
  });
  starCtx.globalAlpha = 1;

  if (!document.hidden) {
    requestAnimationFrame(drawStarfield);
  }
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    requestAnimationFrame(drawStarfield);
  }
});