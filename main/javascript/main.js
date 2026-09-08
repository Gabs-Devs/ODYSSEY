const OPTIONS = [
  { icon: '🚀', label: 'Início',     title: 'Início da Jornada',   desc: 'O ponto de partida. Aqui você conhece a essência da Odyssey e o que está por vir.' },
  { icon: '🧭', label: 'Explorar',   title: 'Explorar Territórios', desc: 'Navegue pelas soluções e descubra caminhos ainda não percorridos.' },
  { icon: '🛰️', label: 'Missões',    title: 'Nossas Missões',       desc: 'Projetos e cases que mostram a jornada em ação, do briefing ao lançamento.' },
  { icon: '👨‍🚀', label: 'Tripulação', title: 'A Tripulação',       desc: 'Conheça as pessoas que tornam cada missão possível.' },
  { icon: '📖', label: 'Diário',     title: 'Diário de Bordo',     desc: 'Registros, aprendizados e bastidores de cada etapa da viagem.' },
  { icon: '🌌', label: 'Galeria',    title: 'Galeria Estelar',     desc: 'Um mosaico visual de tudo que já construímos pelo caminho.' },
  { icon: '📡', label: 'Contato',    title: 'Sinal de Contato',    desc: 'Pronto para embarcar? Envie um sinal e vamos planejar a próxima rota.' },
];

// --- referências DOM ---
const orbit = document.getElementById('orbit');
const wheelWrap = document.getElementById('wheelWrap');
const infoTitle = document.getElementById('infoTitle');
const infoDesc = document.getElementById('infoDesc');
const infoIndex = document.getElementById('infoIndex');
const infoPanel = document.getElementById('infoPanel');

let radius = 190;
let currentAngle = 0;
let targetAngle = null;
let autoRotate = true;
const AUTO_SPEED = 0.06; // graus por frame
let activeIndex = -1;
const nodeEls = [];

function computeRadius() {
  const size = Math.min(wheelWrap.clientWidth, wheelWrap.clientHeight);
  radius = size / 2 - 55;
}

function buildWheel() {
  orbit.innerHTML = '';
  nodeEls.length = 0;
  const step = 360 / OPTIONS.length;

  OPTIONS.forEach((opt, i) => {
    const baseAngle = i * step;
    const node = document.createElement('div');
    node.className = 'node';
    node.dataset.index = i;

    // Técnica clássica de posicionamento circular via transform composto:
    // 1) centraliza no meio do orbit
    // 2) gira até o ângulo do item
    // 3) empurra pra fora (raio)
    // 4) desgira, deixando a caixa "reta" (posição correta, orientação neutra)
    node.style.transform =
      `translate(-50%, -50%) rotate(${baseAngle}deg) translateY(-${radius}px) rotate(${-baseAngle}deg)`;

    node.innerHTML = `
      <div class="node-inner">
        <span class="node-icon">${opt.icon}</span>
        <span class="node-label">${opt.label}</span>
      </div>`;

    node.addEventListener('click', () => selectNode(i));
    orbit.appendChild(node);
    nodeEls.push(node);
  });
}

function normalizeAngle(a) {
  a = a % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

function selectNode(index) {
  activeIndex = index;
  autoRotate = false;

  nodeEls.forEach((n, i) => n.classList.toggle('active', i === index));

  const baseAngle = index * (360 / OPTIONS.length);
  const desired = -baseAngle; // ângulo do orbit que traz esse nó pro topo
  const diff = normalizeAngle(desired - currentAngle);
  targetAngle = currentAngle + diff; // caminho mais curto

  updateInfoPanel(index);
}

function updateInfoPanel(index) {
  const opt = OPTIONS[index];

  infoPanel.style.animation = 'none';
  void infoPanel.offsetWidth; // força reflow pra reiniciar a animação
  infoPanel.style.animation = 'fadeUp .5s ease';

  infoIndex.textContent = String(index + 1).padStart(2, '0');
  infoTitle.textContent = opt.title;
  infoDesc.textContent = opt.desc;
}

function animate() {
  if (targetAngle !== null) {
    const diff = targetAngle - currentAngle;
    currentAngle += diff * 0.08; // easing suave até o alvo
    if (Math.abs(diff) < 0.05) {
      currentAngle = targetAngle;
      targetAngle = null;
    }
  } else if (autoRotate) {
    currentAngle += AUTO_SPEED;
  }

  orbit.style.transform = `rotate(${currentAngle}deg)`;

  // contra-rotação: mantém ícone/texto de cada nó sempre "em pé"
  nodeEls.forEach(node => {
    const inner = node.querySelector('.node-inner');
    inner.style.transform = `rotate(${-currentAngle}deg)`;
  });

  requestAnimationFrame(animate);
}

// pausa a rotação automática ao passar o mouse (se nada selecionado ainda)
wheelWrap.addEventListener('mouseenter', () => { if (activeIndex === -1) autoRotate = false; });
wheelWrap.addEventListener('mouseleave', () => { if (activeIndex === -1) autoRotate = true; });

window.addEventListener('resize', () => {
  computeRadius();
  buildWheel();
});

// --- fundo estrelado ---
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase);
      ctx.globalAlpha = 0.3 + twinkle * 0.7;
      ctx.fillStyle = '#cfe8ff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}

// --- inicialização ---
computeRadius();
buildWheel();
animate();
initStarfield();