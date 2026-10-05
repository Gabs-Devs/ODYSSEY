import { OPTIONS } from './config.js';

const infoTitle = document.getElementById('infoTitle');
const infoDesc = document.getElementById('infoDesc');
const infoIndex = document.getElementById('infoIndex');
const infoPanel = document.getElementById('infoPanel');

export const DEFAULT_INFO = {
  index: '00',
  title: 'Escolha seu destino',
  desc: 'Gire ou clique em um módulo da órbita para revelar cada bioma do planeta.',
};

export function updateInfoPanel(index) {
  const opt = OPTIONS[index];

  infoPanel.style.animation = 'none';
  void infoPanel.offsetWidth; 
  infoPanel.style.animation = 'fadeUp .5s ease';

  infoIndex.textContent = String(index + 1).padStart(2, '0');
  infoTitle.textContent = opt.title;
  infoDesc.textContent = opt.desc;
}

export function resetInfoPanel() {
  infoPanel.style.animation = 'none';
  void infoPanel.offsetWidth;
  infoPanel.style.animation = 'fadeUp .5s ease';

  infoIndex.textContent = DEFAULT_INFO.index;
  infoTitle.textContent = DEFAULT_INFO.title;
  infoDesc.textContent = DEFAULT_INFO.desc;
}