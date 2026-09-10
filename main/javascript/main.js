(function () {
  'use strict';

  // Apenas oceano, amazônia e tundra estão ativos e possuem landing própria.
  // Savana, deserto, corais e taiga ficam desativados, exibindo "Em breve".
  const OPTIONS = [
    {
      icon: '🌊',
      label: 'Oceano',
      slug: 'oceano',
      title: 'Oceano',
      tagline: 'O maior bioma do planeta, quase todo submerso.',
      desc: 'Cobrindo a maior parte da superfície da Terra, os oceanos regulam o clima e abrigam a maior biodiversidade do planeta.',
      separator: 'waves',
      stats: [
        { label: 'Superfície da Terra', value: '~71%' },
        { label: 'Profundidade média', value: '~3.700 m' },
        { label: 'Espécies catalogadas', value: '+240 mil' },
      ],
      body: [
        'Os oceanos formam um único sistema interligado que troca calor, oxigênio e nutrientes entre todos os continentes. Suas correntes moldam o clima em escala global e absorvem grande parte do carbono emitido na atmosfera.',
        'Da zona de arrebentação às fossas abissais, cada camada de profundidade sustenta uma comunidade própria — de recifes vibrantes a criaturas bioluminescentes que nunca viram a luz do sol.',
      ],
      fact: 'Curiosidade: menos de 20% do fundo oceânico foi mapeado em alta resolução — conhecemos melhor a superfície de Marte.',
    },
    {
      icon: '🌲',
      label: 'Em breve',
      comingSoon: true,
    },
    {
      icon: '🌴',
      label: 'Amazônia',
      slug: 'amazonia',
      title: 'Amazônia',
      tagline: 'A maior floresta tropical do planeta.',
      desc: 'Um mar verde de biodiversidade que produz oxigênio, regula chuvas e abriga povos e espécies únicos no mundo.',
      separator: 'trees',
      stats: [
        { label: 'Área aproximada', value: '~5,5M km²' },
        { label: 'Países que abrange', value: '9' },
        { label: 'Espécies de árvores', value: '+16 mil' },
      ],
      body: [
        'A Floresta Amazônica se estende por nove países da América do Sul e concentra a maior biodiversidade terrestre já registrada. Estima-se que um único hectare possa abrigar mais espécies de árvores do que toda a América do Norte.',
        'Seus rios formam a maior bacia hidrográfica do mundo, e a evapotranspiração das árvores ajuda a criar os chamados "rios voadores", responsáveis por levar umidade a regiões distantes do continente.',
      ],
      fact: 'Curiosidade: a Amazônia produz tanta umidade que parte da chuva que cai no Sul e Sudeste do Brasil se origina na floresta.',
    },
    {
      icon: '🦁',
      label: 'Em breve',
      comingSoon: true,
    },
    {
      icon: '🏜️',
      label: 'Em breve',
      comingSoon: true,
    },
    {
      icon: '❄️',
      label: 'Tundra',
      slug: 'tundra',
      title: 'Tundra',
      tagline: 'A última fronteira antes do gelo permanente.',
      desc: 'Um bioma gelado e sem árvores, onde o subsolo permanece congelado durante quase todo o ano.',
      separator: 'snow',
      stats: [
        { label: 'Estação de crescimento', value: '6–10 semanas' },
        { label: 'Solo congelado', value: 'Permafrost' },
        { label: 'Temp. média anual', value: 'entre -5°C e -20°C' },
      ],
      body: [
        'Na tundra, o subsolo permanece congelado o ano inteiro — um fenômeno chamado permafrost — enquanto apenas a camada mais superficial descongela por algumas semanas no verão, permitindo o surgimento rápido de musgos, líquens e pequenas flores.',
        'É um bioma de extremos: renas, ursos-polares e aves migratórias dependem de uma janela curtíssima de comida abundante para sobreviver aos longos meses de escuridão e frio.',
      ],
      fact: 'Curiosidade: o degelo do permafrost pode liberar gases presos no solo há milhares de anos, tornando a tundra uma peça-chave no equilíbrio climático global.',
    },
    {
      icon: '🪸',
      label: 'Em breve',
      comingSoon: true,
    },
  ];

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

  // --- referências DOM: landing (conteúdo direto na página) ---
  const biomeLanding = document.getElementById('biomeLanding');
  const landingDivider = document.getElementById('landingDivider');
  const landingClose = document.getElementById('landingClose');
  const landingBack = document.getElementById('landingBack');
  const landingIcon = document.getElementById('landingIcon');
  const landingTitle = document.getElementById('landingTitle');
  const landingTagline = document.getElementById('landingTagline');
  const landingStats = document.getElementById('landingStats');
  const landingBody = document.getElementById('landingBody');
  const landingFact = document.getElementById('landingFact');

  let radius;
  let currentAngle = 0;
  let targetAngle = null;
  let autoRotate = !prefersReducedMotion;
  const AUTO_SPEED = 0.06; // graus por frame
  let activeIndex = -1;
  let lastFocusedNode = null;
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
        node.setAttribute('aria-label', `${opt.icon ? '' : ''}Bioma em breve`);
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
    if (opt.comingSoon) return; // segurança extra: nunca abre landing pra "em breve"

    activeIndex = index;
    autoRotate = false;
    lastFocusedNode = nodeEls[index].node;

    nodeEls.forEach(({ node }, i) => node.classList.toggle('active', i === index));

    const baseAngle = index * (360 / OPTIONS.length);
    const desired = -baseAngle; // ângulo do orbit que traz esse nó pro topo
    const diff = normalizeAngle(desired - currentAngle);
    targetAngle = currentAngle + diff; // caminho mais curto

    updateInfoPanel(index);
    openLanding(index);
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

  // --- landing (conteúdo direto na página) ---

  function renderStats(stats) {
    return stats
      .map(
        (s) => `
      <div class="stat">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>`
      )
      .join('');
  }

  function renderBody(paragraphs) {
    return paragraphs.map((p) => `<p>${p}</p>`).join('');
  }

  // Divisor SVG temático: ondas (oceano), árvores (amazônia) ou neve (tundra).
  // É a única separação visual entre a roda e o conteúdo do bioma.
  function renderDivider(type) {
    if (type === 'waves') {
      return `
        <svg class="landing-divider-svg" viewBox="0 0 1200 64" preserveAspectRatio="none">
          <path class="divider-shape divider-shape-soft"
            d="M0,32 C150,60 350,4 600,32 C850,60 1050,4 1200,32 L1200,64 L0,64 Z"></path>
          <path class="divider-shape divider-shape-strong"
            d="M0,44 C150,20 350,68 600,44 C850,20 1050,68 1200,44 L1200,64 L0,64 Z"></path>
        </svg>`;
    }

    if (type === 'trees') {
      const count = 9;
      let shapes = '';
      for (let i = 0; i < count; i++) {
        const x = (1200 / count) * i + 66;
        const h = 34 + ((i % 3) * 10);
        const cls = i % 2 === 0 ? 'divider-shape-strong' : 'divider-shape-soft';
        shapes += `<polygon class="divider-shape ${cls}" points="${x},${64 - h} ${x - 16},64 ${x + 16},64"></polygon>`;
      }
      return `<svg class="landing-divider-svg" viewBox="0 0 1200 64" preserveAspectRatio="none">${shapes}</svg>`;
    }

    if (type === 'snow') {
      let flakes = '';
      for (let i = 0; i < 22; i++) {
        const x = (i * 53) % 1200;
        const y = 6 + ((i * 37) % 40);
        const r = 1 + (i % 3);
        const cls = i % 2 === 0 ? 'divider-shape-strong' : 'divider-shape-soft';
        flakes += `<circle class="divider-shape ${cls}" cx="${x}" cy="${y}" r="${r}"></circle>`;
      }
      const ground = `<path class="divider-shape divider-shape-strong" d="M0,54 L1200,54 L1200,64 L0,64 Z"></path>`;
      return `<svg class="landing-divider-svg" viewBox="0 0 1200 64" preserveAspectRatio="none">${flakes}${ground}</svg>`;
    }

    return '';
  }

  function openLanding(index) {
    const opt = OPTIONS[index];

    biomeLanding.dataset.biome = opt.slug;
    landingDivider.innerHTML = renderDivider(opt.separator);
    landingIcon.textContent = opt.icon;
    landingTitle.textContent = opt.title;
    landingTagline.textContent = opt.tagline;
    landingStats.innerHTML = renderStats(opt.stats);
    landingBody.innerHTML = renderBody(opt.body);
    landingFact.textContent = opt.fact;

    biomeLanding.classList.add('is-open');
    biomeLanding.setAttribute('aria-hidden', 'false');

    // rola suavemente até o conteúdo, já que ele nasce embaixo da roda
    requestAnimationFrame(() => {
      biomeLanding.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
      });
    });

    landingClose.focus();
  }

  function closeLanding() {
    biomeLanding.classList.remove('is-open');
    biomeLanding.setAttribute('aria-hidden', 'true');
    if (lastFocusedNode) lastFocusedNode.focus();
  }

  landingClose.addEventListener('click', closeLanding);
  landingBack.addEventListener('click', closeLanding);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && biomeLanding.classList.contains('is-open')) {
      closeLanding();
    }
  });

  // --- loop de animação da roda ---

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
    // (usa referência cacheada, sem querySelector a cada frame)
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

  // pausa a rotação automática ao passar o mouse (se nada selecionado ainda)
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