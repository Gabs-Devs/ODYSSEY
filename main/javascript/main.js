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
      desc: 'Cobrindo a maior parte da superfície da Terra, os oceanos regulam o clima e abrigam a maior biodiversidade do planeta.',
      // Estrutura específica do oceano: zonas de profundidade,
      // réplica do design de referência (blocos de cor sólida + cards translúcidos).
      zones: [
        {
          theme: 'sunlight',
          title: 'Sunlight Zone',
          subtitle: 'A área menos profunda do oceano.',
          cards: [
            {
              type: 'chart',
              title: 'Absorção de Cor abaixo d\'água',
              items: [
                { color: '#e53935', depth: '5 m' },
                { color: '#fb8c00', depth: '10 m' },
                { color: '#fdd835', depth: '20 m' },
                { color: '#43a047', depth: '30 m' },
                { color: '#1e88e5', depth: '50 m' },
                { color: '#5e35b1', depth: '100 m' },
              ],
            },
            {
              type: 'text',
              text: 'A cor se dissipa na água devido à absorção seletiva da luz pelas moléculas de água. Cores quentes, como a vermelha, são absorvidas mais rapidamente, enquanto cores frias, como a azul, podem penetrar em maiores profundidades. Isso resulta numa diminuição da intensidade das cores quentes à medida que a profundidade aumenta, com tonalidades azuis e verdes predominando em maiores profundidades.',
            },
            {
              type: 'icons',
              title: 'Peixes de água rasa mais comuns',
              items: [
                { icon: '🐟', label: 'Atum' },
                { icon: '🐟', label: 'Sardinha' },
                { icon: '🐠', label: 'Cavala' },
                { icon: '🐡', label: 'Barracuda' },
                { icon: '🐟', label: 'Badejo' },
                { icon: '🐠', label: 'Bonito' },
                { icon: '🐡', label: 'Pargo' },
              ],
            },
          ],
        },
        {
          theme: 'twilight',
          title: 'Luz',
          cards: [
            {
              type: 'text',
              text: 'A partir dessa área (cerca de 200 metros) a luz começa a se dissipar. Muitas criaturas têm uma aparência diferente do habitual, além disso algumas das espécies marinhas mais raras e distintas ficam nessa zona. Nessa zona todas as cores já "sumiram" pois já não são mais visíveis sem o auxílio de uma fonte de luz, ainda que seja possível enxergar algumas coisas.',
            },
            {
              type: 'highlight',
              html: 'A Zona Crepuscular do oceano, formalmente conhecida como zona mesopelágica, é encontrada a partir de <mark>200 a 1.000 metros</mark> abaixo da superfície.',
              extra: 'Lar de uma variedade de espécies, desde o tamboril à lula-vampira e os chamados fosforescentes, a zona crepuscular é um lugar onde reina, sobretudo, a estranheza.',
            },
            {
              type: 'stat-pair',
              items: [
                'Apenas 20% do carbono na superfície do oceano chega ao oceano profundo, enquanto 20% é consumido por animais e bactérias na zona crepuscular.',
                'A zona crepuscular é um elo crucial entre a superfície e o oceano profundo, afetando a capacidade do oceano de armazenar dióxido de carbono.',
              ],
            },
          ],
        },
      ],
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

  // --- referências DOM: landing ---
  const biomeLanding = document.getElementById('biomeLanding');
  const landingContent = document.getElementById('landingContent');
  const landingBg = document.getElementById('landingBg');
  const landingDivider = document.getElementById('landingDivider');
  const landingClose = document.getElementById('landingClose');
  const landingBack = document.getElementById('landingBack');
  const landingInner = document.getElementById('landingInner');
  const landingIcon = document.getElementById('landingIcon');
  const landingTitle = document.getElementById('landingTitle');
  const landingTagline = document.getElementById('landingTagline');
  const landingStats = document.getElementById('landingStats');
  const landingBody = document.getElementById('landingBody');
  const landingFact = document.getElementById('landingFact');
  const oceanZones = document.getElementById('oceanZones');

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

  // --- landing padrão (Amazônia / Tundra) ---

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

  // Divisor SVG temático: árvores (amazônia) ou neve (tundra).
  function renderDivider(type) {
    if (type === 'trees') {
      const count = 11;
      let shapes = '';
      for (let i = 0; i < count; i++) {
        const x = (1200 / count) * i + 54;
        const h = 50 + ((i % 3) * 14);
        const cls = i % 2 === 0 ? 'divider-shape-strong' : 'divider-shape-soft';
        shapes += `<polygon class="divider-shape ${cls}" points="${x},${96 - h} ${x - 20},96 ${x + 20},96"></polygon>`;
      }
      return `<svg class="landing-divider-svg" viewBox="0 0 1200 96" preserveAspectRatio="none">${shapes}</svg>`;
    }

    if (type === 'snow') {
      let flakes = '';
      for (let i = 0; i < 28; i++) {
        const x = (i * 43) % 1200;
        const y = 8 + ((i * 31) % 62);
        const r = 1 + (i % 3);
        const cls = i % 2 === 0 ? 'divider-shape-strong' : 'divider-shape-soft';
        flakes += `<circle class="divider-shape ${cls}" cx="${x}" cy="${y}" r="${r}"></circle>`;
      }
      const ground = `<path class="divider-shape divider-shape-strong" d="M0,82 L1200,82 L1200,96 L0,96 Z"></path>`;
      return `<svg class="landing-divider-svg" viewBox="0 0 1200 96" preserveAspectRatio="none">${flakes}${ground}</svg>`;
    }

    return '';
  }

  // --- landing do oceano: zonas de profundidade ---

  function renderChartCard(card) {
    const cols = card.items
      .map(
        (it) => `
      <div class="depth-col">
        <div class="depth-bar" style="background: linear-gradient(180deg, ${it.color}, ${it.color}00);"></div>
        <span class="depth-label">${it.depth}</span>
      </div>`
      )
      .join('');

    return `
      <div class="ocean-card">
        <div class="ocean-card-title">${card.title}</div>
        <div class="depth-chart">${cols}</div>
      </div>`;
  }

  function renderTextCard(card) {
    return `<div class="ocean-card"><p>${card.text}</p></div>`;
  }

  function renderIconsCard(card) {
    const items = card.items
      .map(
        (it) => `
      <div class="icon-grid-item">
        <span class="icon-grid-icon" aria-hidden="true">${it.icon}</span>
        <span class="icon-grid-label">${it.label}</span>
      </div>`
      )
      .join('');

    return `
      <div class="ocean-card">
        <div class="ocean-card-title">${card.title}</div>
        <div class="icon-grid">${items}</div>
      </div>`;
  }

  function renderHighlightCard(card) {
    return `
      <div class="ocean-card ocean-highlight">
        <p>${card.html}</p>
        <p>${card.extra}</p>
      </div>`;
  }

  function renderStatPairCard(card) {
    const items = card.items
      .map((text) => `<div class="ocean-card"><p>${text}</p></div>`)
      .join('');
    return `<div class="stat-pair">${items}</div>`;
  }

  function renderOceanCard(card) {
    switch (card.type) {
      case 'chart':
        return renderChartCard(card);
      case 'text':
        return renderTextCard(card);
      case 'icons':
        return renderIconsCard(card);
      case 'highlight':
        return renderHighlightCard(card);
      case 'stat-pair':
        return renderStatPairCard(card);
      default:
        return '';
    }
  }

  function renderOceanZone(zone) {
    const subtitle = zone.subtitle
      ? `<p class="ocean-zone-subtitle">${zone.subtitle}</p>`
      : '';
    const cards = zone.cards.map(renderOceanCard).join('');

    return `
      <section class="ocean-zone" data-theme="${zone.theme}">
        <div class="ocean-zone-inner">
          <h3 class="ocean-zone-title">${zone.title}</h3>
          ${subtitle}
          ${cards}
        </div>
      </section>`;
  }

  function renderOceanZones(zones) {
    return zones.map(renderOceanZone).join('');
  }

  function openLanding(index) {
    const opt = OPTIONS[index];
    const isOcean = !!opt.zones;

    biomeLanding.dataset.biome = opt.slug;
    biomeLanding.setAttribute('aria-label', opt.title);
    landingContent.classList.toggle('is-ocean', isOcean);

    if (isOcean) {
      oceanZones.innerHTML = renderOceanZones(opt.zones);
      oceanZones.hidden = false;
      landingInner.hidden = true;
      landingBg.hidden = true;
    } else {
      oceanZones.innerHTML = '';
      oceanZones.hidden = true;
      landingInner.hidden = false;
      landingBg.hidden = false;

      landingDivider.innerHTML = renderDivider(opt.separator);
      landingIcon.textContent = opt.icon;
      landingTitle.textContent = opt.title;
      landingTagline.textContent = opt.tagline;
      landingStats.innerHTML = renderStats(opt.stats);
      landingBody.innerHTML = renderBody(opt.body);
      landingFact.textContent = opt.fact;
    }

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