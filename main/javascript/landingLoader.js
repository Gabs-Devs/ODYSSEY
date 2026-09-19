const cache = new Map();
let stylesInjected = false;

function injectScopedStyles() {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.textContent = `
    .oceano-page {
      width: 100%;
      overflow-x: hidden;
    }

    @font-face {
      font-family: "greek-freak";
      src: url(/fonts/Greek-Freak.ttf);
    }

    @font-face {
      font-family: "Roman-sd";
      src: url(/fonts/Roman\\ SD.ttf);
    }

    .oceano-page h1 {
      font-size: max(60px, 4vw);
      font-family: "greek-freak";
      text-align: center;
    }

    .oceano-page .title-zone1 {
      color: #024B61;
      font-size: max(80px, 4vw);
      font-family: "greek-freak";
      text-align: center;
      background-color: #66c3d0;
    }

    .oceano-page .title-zone2 {
      color: #bb9929;
      font-size: max(80px, 4vw);
      font-family: "greek-freak";
      text-align: center;
    }

    .oceano-page header,
    .oceano-page section {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 100vh;
      height: auto;
      background: #66c3d0;
      flex-direction: column;
    }

    .oceano-page header {
      background: transparent;
      position: relative;
    }

    .oceano-page header h1 {
      padding: 10px 50px;
      margin: 50px;
      z-index: 2;
    }

    .oceano-page .waves {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: auto;
    }

    .oceano-page .waves-1 { animation: moveWave1 3s ease-in-out infinite alternate; }
    @keyframes moveWave1 { from { transform: translateX(-2000px); } }

    .oceano-page .waves-2 { animation: moveWave2 3s 1.2s ease-in-out infinite alternate; }
    @keyframes moveWave2 { from { transform: translateX(-1800px); } }

    .oceano-page .waves-3 { animation: moveWave3 3s 2.4s ease-in-out infinite alternate; }
    @keyframes moveWave3 { from { transform: translateX(-1500px); } }

    .oceano-page .content-base {
      background-color: #66c3d0;
    }

    .oceano-page .content-info {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      padding: 24px;
      margin-top: 50px;
      margin-bottom: 50px;
      width: 100%;
      max-width: 800px;
      min-height: 450px;
      height: auto;
    }

    .oceano-page .content-info-row {
      margin-top: 50px;
      margin-bottom: 50px;
      display: flex;
      flex-direction: row;
      gap: 50px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .oceano-page .big-card {
      width: 100%;
      max-width: 800px;
      min-height: 450px;
      height: auto;
    }

    .oceano-page .med-card {
      width: 350px;
      min-height: 300px;
      height: auto;
    }

    .oceano-page .content-text {
      color: #024B61;
      font-size: max(25px, 1.5vw);
      font-family: "roman-sd";
      text-align: center;
      line-height: 1.5;
      white-space: normal;
      overflow-wrap: break-word;
    }

    @media (max-width: 600px) {
      .oceano-page header h1 { padding: 10px 20px; margin: 30px 20px; }
      .oceano-page .content-info { width: calc(100% - 30px); padding: 20px; }
      .oceano-page .big-card { width: calc(100% - 30px); min-height: auto; }
      .oceano-page .content-text { font-size: 20px; line-height: 1.5; }
      .oceano-page .content-info-row { flex-direction: column; align-items: center; gap: 30px; }
      .oceano-page .med-card { width: calc(100% - 30px); }
    }
  `;
  document.head.appendChild(style);
}

export async function loadBiomaPage(slug) {
  const container = document.getElementById('biomaLanding');
  if (!container) return;

  if (slug === 'oceano') injectScopedStyles();

  if (cache.has(slug)) {
    container.innerHTML = cache.get(slug);
  } else {
    let res;
    try {
      res = await fetch(`${slug}.html`);
    } catch (err) {
      console.error(`Falha ao buscar a página do bioma "${slug}":`, err);
      return;
    }
    if (!res.ok) {
      console.error(`Página do bioma "${slug}" não encontrada (${res.status})`);
      return;
    }

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const bodyContent = `<div class="oceano-page">${doc.body.innerHTML}</div>`;

    cache.set(slug, bodyContent);
    container.innerHTML = bodyContent;
  }

  container.hidden = false;
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function hideBiomaLanding() {
  const container = document.getElementById('biomaLanding');
  if (container) container.hidden = true;
}