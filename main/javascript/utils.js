export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function normalizeAngle(a) {
  a = a % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}