(function () {
  'use strict';

  // Lista de biomas — sem landing page: cada item só precisa de ícone,
  // rótulo, título e descrição (usados no painel de informação abaixo
  // da roda). Itens com "comingSoon: true" ficam visualmente desativados.
  const OPTIONS = [
    {
      icon: '🌊',
      label: 'Oceano',
      slug: 'oceano',
      title: 'Oceano',
      desc: 'Cobrindo a maior parte da superfície da Terra, os oceanos regulam o clima e abrigam a maior biodiversidade do planeta.',
    },
    { icon: '🌲', label: 'Em breve', comingSoon: true },
    { icon: '🌴', label: 'Em breve', comingSoon: true },
    { icon: '🦁', label: 'Em breve', comingSoon: true },
    { icon: '🏜️', label: 'Em breve', comingSoon: true },
    { icon: '❄️', label: 'Em breve', comingSoon: true },
    { icon: '🪸', label: 'Em breve', comingSoon: true },
  ];

  // Tempo (em ms) que a roda fica parada mostrando o item selecionado
  // antes de retomar o giro automático sozinha.
  const RESUME_DELAY = 3500;

  // --- utilidades ---

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // --- referências DOM: roda orbital ---
  const orbit = document.getElementById('orbit');
  const wheelWrap = document.getElementById('wheelWrap');
  const infoTitle = document.getElementById('infoTitle');
  const infoDesc = document.getElementById('infoDesc');
  const infoIndex = document.getElementById('infoIndex');
  const infoPanel = document.getElementById('infoPanel');

  const DEFAULT_INFO = {
    index: '00',
    title: 'Escolha seu destino',
    desc: 'Gire ou clique em um módulo da órbita para revelar cada bioma do planeta.',
  };

  let radius;
  let currentAngle = 0;
  let targetAngle = null;
  let autoRotate = !prefersReducedMotion;
  const AUTO_SPEED = 0.06; // graus por frame
  let activeIndex = -1;
  let resumeTimer = null;
  let rafId = null;

  // cache de { node, inner } pra evitar querySelector dentro do loop de animação
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

      // Técnica clássica de posicionamento circular via transform composto:
      // 1) centraliza no meio do orbit
      // 2) gira até o ângulo do item
      // 3) empurra pra fora (raio)
      // 4) desgira, deixando a caixa "reta" (posição correta, orientação neutra)
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

  function normalizeAngle(a) {
    a = a % 360;
    if (a > 180) a -= 360;
    if (a < -180) a += 360;
    return a;
  }

  function selectNode(index) {
    const opt = OPTIONS[index];
    if (opt.comingSoon) return; // segurança extra: itens desativados não fazem nada

    if (resumeTimer !== null) {
      clearTimeout(resumeTimer);
      resumeTimer = null;
    }

    activeIndex = index;
    autoRotate = false;
    nodeEls.forEach(({ node }, i) => node.classList.toggle('active', i === index));

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

  function resetInfoPanel() {
    infoPanel.style.animation = 'none';
    void infoPanel.offsetWidth;
    infoPanel.style.animation = 'fadeUp .5s ease';

    infoIndex.textContent = DEFAULT_INFO.index;
    infoTitle.textContent = DEFAULT_INFO.title;
    infoDesc.textContent = DEFAULT_INFO.desc;
  }

  // Agenda a retomada automática da rotação, chamada assim que a roda
  // termina o giro assistido até o item selecionado.
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

  // --- loop de animação da roda ---

  function animate() {
    if (targetAngle !== null) {
      const diff = targetAngle - currentAngle;
      currentAngle += diff * 0.08; // easing suave até o alvo
      if (Math.abs(diff) < 0.05) {
        currentAngle = targetAngle;
        targetAngle = null;
        // chegou ao item selecionado: agenda a volta do giro automático
        if (activeIndex !== -1) scheduleResume();
      }
    } else if (autoRotate) {
      currentAngle += AUTO_SPEED;
    }

    orbit.style.transform = `rotate(${currentAngle}deg)`;

    // contra-rotação: mantém ícone/texto de cada nó sempre "em pé"
    nodeEls.forEach(({ inner }) => {
      inner.style.transform = `rotate(${-currentAngle}deg)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  function startLoop() {
    if (rafId === null) {
      rafId = requestAnimationFrame(animate);
    }
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // pausa tudo quando a aba não está visível, economizando CPU/bateria
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  // pausa a rotação automática ao passar o mouse (se nada selecionado)
  wheelWrap.addEventListener('mouseenter', () => {
    if (activeIndex === -1) autoRotate = false;
  });
  wheelWrap.addEventListener('mouseleave', () => {
    if (activeIndex === -1 && !prefersReducedMotion) autoRotate = true;
  });

  // resize único e debounced, cobrindo roda + starfield
  const handleResize = debounce(() => {
    computeRadius();
    buildWheel();
    resizeStarfield();
  }, 150);

  window.addEventListener('resize', handleResize);

  // --- fundo estrelado ---

  const starfieldCanvas = document.getElementById('starfield');
  const starCtx = starfieldCanvas.getContext('2d');
  let stars = [];

  const MAX_STARS = 400; // teto pra evitar excesso em telas grandes/4K

  function resizeStarfield() {
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

  function drawStarfield(t) {
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

  // --- inicialização ---
  computeRadius();
  buildWheel();
  startLoop();
  resizeStarfield();
  requestAnimationFrame(drawStarfield);
})();