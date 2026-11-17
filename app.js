/* ===================================================================
   SHONEN STUDY HUB - APP LOGIC & ENGINE
   Themes: Dragon Ball, One Piece, Naruto, My Hero Academia, Multiverse
   Features: Canvas Particles, Web Audio Synth, Local Storage,
             Magic URL Sharing, JSON Backup, Pomodoro & Quests
   =================================================================== */

// ================= APP STATE =================
const STATE_KEY = 'SHONEN_STUDY_HUB_DATA_V1';

const DEFAULT_STATE = {
  theme: 'multiverse',
  soundEnabled: true,
  profile: {
    name: 'Guerreiro do Conhecimento',
    avatar: 'goku',
    xp: 350,
    level: 1,
    streak: 3,
    lastStudyDate: new Date().toISOString().split('T')[0]
  },
  notes: [
    {
      id: 'note-1',
      title: 'Técnica Pomodoro na Sala do Tempo ⚡',
      subject: 'Programação',
      tags: ['produtividade', 'foco', 'estudos'],
      body: `1. Escolha 1 única tarefa prioritária.\n2. Treine seu foco por 25 minutos sem interrupções.\n3. Descanse 5 minutos para recarregar o Ki/Chakra.\n4. A cada 4 ciclos, faça uma pausa longa de 15 minutos.\n\n"Supere seus limites aqui e agora!" — Yami Sukehiro`,
      date: new Date().toLocaleDateString('pt-BR')
    },
    {
      id: 'note-2',
      title: 'Comandos Essenciais do Git & GitHub 🐙',
      subject: 'Programação',
      tags: ['git', 'github', 'dev'],
      body: `• git init (iniciar repositório)\n• git add . (adicionar arquivos)\n• git commit -m "feat: meu estudo"\n• git branch -M main\n• git remote add origin <URL>\n• git push -u origin main\n\nPara ativar o GitHub Pages:\nSettings > Pages > Branch main > Save!`,
      date: new Date().toLocaleDateString('pt-BR')
    },
    {
      id: 'note-3',
      title: 'Regra de Ouro dos Estudos: Efeito Espaçado 🧠',
      subject: 'Ciências',
      tags: ['memoria', 'revisao'],
      body: `A curva do esquecimento de Ebbinghaus mostra que esquecemos 70% do que estudamos em 24h a menos que revisemos:\n• Revisão 1: 24 horas depois (10 min)\n• Revisão 2: 7 dias depois (5 min)\n• Revisão 3: 30 dias depois (3 min)`,
      date: new Date().toLocaleDateString('pt-BR')
    }
  ],
  tasks: [
    { id: 'task-1', title: 'Completar 1 ciclo de foco na Sala do Tempo', difficulty: 'C', xp: 100, completed: false },
    { id: 'task-2', title: 'Criar meu primeiro resumo no Grimório', difficulty: 'C', xp: 100, completed: true },
    { id: 'task-3', title: 'Publicar o projeto no GitHub Pages', difficulty: 'S', xp: 500, completed: false }
  ],
  links: [
    { id: 'link-1', title: 'MDN Web Docs (Guia Web)', url: 'https://developer.mozilla.org', category: 'doc' },
    { id: 'link-2', title: 'GitHub (Repositórios & Portfólio)', url: 'https://github.com', category: 'tool' },
    { id: 'link-3', title: 'YouTube Edu (Aulas & Cursos)', url: 'https://youtube.com', category: 'video' },
    { id: 'link-4', title: 'Canva / Anotações Visuais', url: 'https://canva.com', category: 'tool' }
  ]
};

// Shonen Quotes Collection
const SHONEN_QUOTES = [
  { text: "Os limites só existem se você os deixar existir. Supere a si mesmo todos os dias!", author: "Son Goku (Dragon Ball)" },
  { text: "Se você não arriscar, não poderá criar um futuro!", author: "Monkey D. Luffy (One Piece)" },
  { text: "Não desista! Não há vergonha em cair, a verdadeira vergonha é não se levantar de novo!", author: "Shintaro Midorima" },
  { text: "Um herói de verdade é aquele que supera os infortúnios da vida. Vá além! PLUS ULTRA!", author: "All Might (My Hero Academia)" },
  { text: "Trabalho duro vence o talento quando o talento não trabalha duro.", author: "Rock Lee (Naruto)" },
  { text: "Não importa o quão difícil seja o caminho, eu nunca volto atrás na minha palavra!", author: "Naruto Uzumaki" },
  { text: "A cicatriz nas costas é a maior vergonha de um espadachim. Encare os desafios de frente!", author: "Roronoa Zoro (One Piece)" }
];

// Audio Theme Synth
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!app.state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playPowerUp() {
    if (!app.state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playSuccess() {
    if (!app.state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = this.ctx.currentTime + (idx * 0.09);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  playGong() {
    if (!app.state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }
}

// Ambient Audio Synth (No external audio files needed!)
class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.currentMode = 'none';
    this.nodes = [];
  }

  stop() {
    this.nodes.forEach(n => {
      try { n.stop ? n.stop() : n.disconnect(); } catch (e) {}
    });
    this.nodes = [];
  }

  setMode(mode) {
    this.stop();
    this.currentMode = mode;
    if (mode === 'none') return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!this.ctx && AudioCtx) this.ctx = new AudioCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.nodes.push(masterGain);

    if (mode === 'binaural') {
      // Alpha waves: 216Hz & 226Hz (10Hz binaural beat difference)
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      oscL.frequency.value = 216;
      oscR.frequency.value = 226;
      oscL.connect(masterGain);
      oscR.connect(masterGain);
      oscL.start();
      oscR.start();
      this.nodes.push(oscL, oscR);
    } else if (mode === 'cosmic') {
      // Cosmic Ki drone (55Hz sub + modulated harmonics)
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 55;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      osc.connect(filter);
      filter.connect(masterGain);
      osc.start();
      this.nodes.push(osc, filter);
    } else if (mode === 'rain') {
      // Rain noise buffer simulation
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 0.5;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      this.nodes.push(whiteNoise, filter);
    }
  }
}

// ================= CANVAS ENERGY PARTICLES =================
class EnergyParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 48;
    this.mouse = { x: null, y: null };
    this.theme = 'multiverse';

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.initParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setTheme(theme) {
    this.theme = theme;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    let color;
    let size = Math.random() * 3.5 + 1.2;
    let speedY = (Math.random() - 0.5) * 1.5;
    let speedX = (Math.random() - 0.5) * 1.5;
    let shape = 'circle';

    switch (this.theme) {
      case 'dragonball':
        // Goku Ki: Rising golden aura & occasional 4-star dragon ball spark
        color = Math.random() > 0.3 ? 'rgba(251, 191, 36, 0.85)' : 'rgba(6, 182, 212, 0.85)';
        speedY = -(Math.random() * 2.2 + 0.6); // Rising upwards
        speedX = (Math.random() - 0.5) * 0.9;
        if (Math.random() > 0.8) shape = 'dragonball';
        break;
      case 'onepiece':
        // Luffy Haki: Black/Red lightning sparks & white Joy Boy steam
        color = Math.random() > 0.4 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.75)';
        size = Math.random() * 4 + 1;
        break;
      case 'naruto':
        // Naruto Sage/Kurama: Orange chakra & Rasengan blue spirals
        color = Math.random() > 0.35 ? 'rgba(249, 115, 22, 0.85)' : 'rgba(2, 132, 199, 0.85)';
        speedY = (Math.random() - 0.5) * 2;
        break;
      case 'mha':
        // Deku OFA: Electric cyan/emerald lightning crackles
        color = Math.random() > 0.3 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(6, 182, 212, 0.9)';
        shape = 'spark';
        break;
      default:
        // Multiverse cosmic
        color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.85)' : 'rgba(56, 189, 248, 0.85)';
    }

    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size,
      speedX,
      speedY,
      color,
      shape,
      alpha: Math.random() * 0.6 + 0.3,
      pulse: Math.random() * 0.05 + 0.01
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around bounds
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Mouse repulsion/attraction
      if (this.mouse.x !== null) {
        let dx = this.mouse.x - p.x;
        let dy = this.mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 2;
          p.y -= (dy / dist) * 2;
        }
      }

      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = p.color;

      if (p.shape === 'dragonball') {
        // Mini Dragon Ball with star outline
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#dc2626';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'spark') {
        // Deku Lightning spark line
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 1.8;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + (Math.random() - 0.5) * 16, p.y + (Math.random() - 0.5) * 16);
        this.ctx.stroke();
      } else {
        // Circular energy orb
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ================= MAIN APP CLASS =================
class ShonenApp {
  constructor() {
    this.state = this.loadState();
    this.sound = new SoundFX();
    this.ambient = new AmbientAudioEngine();
    this.canvasEngine = null;

    // Pomodoro State
    this.timerInterval = null;
    this.timerTimeLeft = 25 * 60; // in seconds
    this.timerTotal = 25 * 60;
    this.timerIsRunning = false;
    this.timerMode = 'focus'; // focus, short, long

    // Task Filter state
    this.taskFilter = 'pending';
  }

  loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved state, using default.', e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
  }

  init() {
    // 1. Check if URL contains shared study data (#share=... or #data=...)
    this.checkUrlForSharedData();

    // 2. Initialize Canvas & Background
    this.canvasEngine = new EnergyParticleCanvas('energyCanvas');
    this.applyTheme(this.state.theme, false);

    // 3. Render Dashboard Elements
    this.updateUserStatsDisplay();
    this.renderDailyQuote();
    this.renderNotes();
    this.renderTasks();
    this.renderLinks();
    this.setupEventListeners();
    this.updatePomodoroDisplay();

    // 4. Welcome notification
    setTimeout(() => {
      this.showToast(`🔥 Bem-vindo ao Shonen Study Hub, ${this.state.profile.name}!`);
    }, 500);
  }

  // ================= THEME & WALLPAPER =================
  applyTheme(themeName, playSound = true) {
    this.state.theme = themeName;
    document.body.setAttribute('data-theme', themeName);

    // Update active button state
    document.querySelectorAll('.theme-btn').forEach(btn => {
      if (btn.dataset.themeTarget === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Wallpaper background with stylized anime artwork
    const overlay = document.getElementById('wallpaperOverlay');
    const wallpapers = {
      multiverse: 'radial-gradient(circle at 50% 20%, #312e81 0%, #09090b 80%)',
      dragonball: 'radial-gradient(circle at 60% 30%, #78350f 0%, #171120 70%)',
      onepiece: 'radial-gradient(circle at 40% 30%, #7f1d1d 0%, #080f1e 70%)',
      naruto: 'radial-gradient(circle at 50% 30%, #7c2d12 0%, #150e09 70%)',
      mha: 'radial-gradient(circle at 50% 30%, #064e3b 0%, #051412 70%)'
    };

    overlay.style.background = wallpapers[themeName] || wallpapers.multiverse;

    if (this.canvasEngine) {
      this.canvasEngine.setTheme(themeName);
    }

    if (playSound) {
      this.sound.playPowerUp();
      this.showToast(`Universo ativado: ${themeName.toUpperCase()}!`);
    }

    this.saveState();
  }

  // ================= STATS & XP =================
  addXp(amount, reason = '') {
    this.state.profile.xp += amount;
    this.sound.playSuccess();
    this.showToast(`+${amount} XP ganho! ${reason}`);
    this.updateUserStatsDisplay();
    this.saveState();
  }

  getRankTitle(xp) {
    if (xp < 500) return 'Guerreiro Novato';
    if (xp < 1200) return 'Chunin de Elite';
    if (xp < 2500) return 'Super Saiyajin';
    if (xp < 5000) return 'Comandante de Frota';
    return 'Hokage Lendário / Símbolo da Paz';
  }

  updateUserStatsDisplay() {
    const p = this.state.profile;
    const nameLabel = document.getElementById('userNameLabel');
    const powerDisplay = document.getElementById('powerLevelDisplay');
    const rankLabel = document.getElementById('currentRankLabel');
    const xpText = document.getElementById('currentXpText');
    const nextXpText = document.getElementById('nextLevelXpText');
    const progressBar = document.getElementById('xpProgressBar');
    const avatarImg = document.getElementById('userAvatarImg');
    const streakDisplay = document.getElementById('studyStreakDisplay');

    if (nameLabel) nameLabel.textContent = p.name;
    if (powerDisplay) powerDisplay.textContent = `${(p.xp * 9 + 100).toLocaleString('pt-BR')}+`;
    if (rankLabel) rankLabel.textContent = this.getRankTitle(p.xp);
    if (streakDisplay) streakDisplay.textContent = `${p.streak} Dias`;

    const level = Math.floor(p.xp / 500) + 1;
    const currentLevelBase = (level - 1) * 500;
    const nextLevelTarget = level * 500;
    const progress = Math.min(100, Math.max(5, ((p.xp - currentLevelBase) / 500) * 100));

    if (xpText) xpText.textContent = p.xp;
    if (nextXpText) nextXpText.textContent = nextLevelTarget;
    if (progressBar) progressBar.style.width = `${progress}%`;

    const avatarMap = {
      goku: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80',
      luffy: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80',
      naruto: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=100&auto=format&fit=crop&q=80',
      deku: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=100&auto=format&fit=crop&q=80'
    };
    if (avatarImg) avatarImg.src = avatarMap[p.avatar] || avatarMap.goku;
  }

  renderDailyQuote() {
    const quote = SHONEN_QUOTES[Math.floor(Math.random() * SHONEN_QUOTES.length)];
    const textEl = document.getElementById('dailyQuoteText');
    const authorEl = document.getElementById('dailyQuoteAuthor');
    if (textEl) textEl.textContent = `"${quote.text}"`;
    if (authorEl) authorEl.textContent = `— ${quote.author}`;
  }

  // ================= NOTES ENGINE =================
  renderNotes() {
    const container = document.getElementById('notesGridContainer');
    if (!container) return;

    const searchTerm = (document.getElementById('noteSearchInput')?.value || '').toLowerCase();
    const subjectFilter = document.getElementById('noteSubjectFilter')?.value || 'all';

    const filtered = this.state.notes.filter(note => {
      const matchSearch = note.title.toLowerCase().includes(searchTerm) ||
                          note.body.toLowerCase().includes(searchTerm) ||
                          (note.tags && note.tags.some(t => t.toLowerCase().includes(searchTerm)));
      const matchSubject = subjectFilter === 'all' || note.subject === subjectFilter;
      return matchSearch && matchSubject;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-scroll" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4;"></i>
          <p>Nenhuma anotação encontrada. Crie sua primeira nota clicando em <strong>Nova Nota</strong> acima!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(note => `
      <div class="note-item" data-id="${note.id}">
        <div class="note-top">
          <span class="note-subject-pill">${this.escapeHtml(note.subject || 'Geral')}</span>
          <div class="note-actions">
            <button class="note-btn copy-btn" title="Copiar Resumo" onclick="app.copyNoteContent('${note.id}')">
              <i class="fa-solid fa-copy"></i>
            </button>
            <button class="note-btn edit-btn" title="Editar Nota" onclick="app.editNote('${note.id}')">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="note-btn del-btn" title="Excluir Nota" onclick="app.deleteNote('${note.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <h4 class="note-title">${this.escapeHtml(note.title)}</h4>
        <div class="note-body">${this.escapeHtml(note.body)}</div>
        <div class="note-tags">
          ${(note.tags || []).map(t => `<span class="note-tag">#${this.escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="note-date"><i class="fa-regular fa-clock"></i> ${note.date || 'Hoje'}</div>
      </div>
    `).join('');

    // Attach 3D tilt interaction to each note
    this.setupNoteTilt();
  }

  setupNoteTilt() {
    const cards = document.querySelectorAll('.note-item');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 12;
        const rotateY = (x / rect.width) * 12;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });
  }

  saveNote(title, subject, tagsStr, body, editId = null) {
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    if (editId) {
      const idx = this.state.notes.findIndex(n => n.id === editId);
      if (idx !== -1) {
        this.state.notes[idx] = {
          ...this.state.notes[idx],
          title,
          subject,
          tags,
          body
        };
        this.showToast('Nota atualizada com sucesso!');
      }
    } else {
      const newNote = {
        id: 'note-' + Date.now(),
        title,
        subject,
        tags,
        body,
        date: new Date().toLocaleDateString('pt-BR')
      };
      this.state.notes.unshift(newNote);
      this.addXp(150, 'Nova nota criada no Grimório!');
    }

    this.saveState();
    this.renderNotes();
  }

  editNote(id) {
    const note = this.state.notes.find(n => n.id === id);
    if (!note) return;

    document.getElementById('editNoteId').value = note.id;
    document.getElementById('noteTitleInput').value = note.title;
    document.getElementById('noteSubjectSelect').value = note.subject;
    document.getElementById('noteTagsInput').value = (note.tags || []).join(', ');
    document.getElementById('noteBodyInput').value = note.body;
    document.getElementById('noteModalTitle').innerHTML = '<i class="fa-solid fa-pen"></i> Editar Resumo de Estudo';

    this.openModal('noteModal');
  }

  deleteNote(id) {
    if (confirm('Deseja realmente apagar esta anotação do seu grimório?')) {
      this.state.notes = this.state.notes.filter(n => n.id !== id);
      this.saveState();
      this.renderNotes();
      this.showToast('Anotação removida.');
    }
  }

  copyNoteContent(id) {
    const note = this.state.notes.find(n => n.id === id);
    if (!note) return;
    const textToCopy = `# ${note.title}\nAssunto: ${note.subject}\nTags: ${(note.tags || []).join(', ')}\n\n${note.body}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.sound.playClick();
      this.showToast('Resumo copiado para a área de transferência!');
    });
  }

  // ================= TASKS / QUESTS ENGINE =================
  renderTasks() {
    const container = document.getElementById('tasksListContainer');
    const pendingBadge = document.getElementById('pendingCount');
    const completedBadge = document.getElementById('completedCount');
    if (!container) return;

    const pending = this.state.tasks.filter(t => !t.completed);
    const completed = this.state.tasks.filter(t => t.completed);

    if (pendingBadge) pendingBadge.textContent = pending.length;
    if (completedBadge) completedBadge.textContent = completed.length;

    const currentList = this.taskFilter === 'pending' ? pending : completed;

    if (currentList.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 25px; color: var(--text-muted); font-size: 0.85rem;">
          <p>${this.taskFilter === 'pending' ? 'Nenhuma missão pendente! Descanse ou adicione uma nova.' : 'Nenhuma missão concluída ainda. Mãos à obra!'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = currentList.map(t => `
      <div class="task-item ${t.completed ? 'completed' : ''}">
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="app.toggleTask('${t.id}')">
          <span class="rank-badge rank-${t.difficulty}">Rank ${t.difficulty}</span>
          <span class="task-label" title="${this.escapeHtml(t.title)}">${this.escapeHtml(t.title)}</span>
        </div>
        <button class="task-del-btn" title="Excluir Missão" onclick="app.deleteTask('${t.id}')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');
  }

  addTask(title, difficulty) {
    const xpRewards = { D: 50, C: 100, B: 200, A: 350, S: 500 };
    const newTask = {
      id: 'task-' + Date.now(),
      title,
      difficulty,
      xp: xpRewards[difficulty] || 100,
      completed: false
    };

    this.state.tasks.unshift(newTask);
    this.saveState();
    this.renderTasks();
    this.sound.playClick();
    this.showToast(`Missão Rank ${difficulty} adicionada!`);
  }

  toggleTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    if (task.completed) {
      this.addXp(task.xp, `Missão concluída! (+${task.xp} XP)`);
    } else {
      this.sound.playClick();
    }

    this.saveState();
    this.renderTasks();
  }

  deleteTask(id) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    this.saveState();
    this.renderTasks();
  }

  // ================= LINKS VAULT =================
  renderLinks() {
    const container = document.getElementById('linksListContainer');
    if (!container) return;

    const iconMap = {
      video: 'fa-youtube',
      doc: 'fa-file-lines',
      book: 'fa-book-open',
      tool: 'fa-screwdriver-wrench'
    };

    container.innerHTML = this.state.links.map(l => {
      let hostname = '';
      try {
        hostname = new URL(l.url).hostname;
      } catch (e) {
        hostname = l.url;
      }

      return `
        <div class="link-item">
          <a href="${this.escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="link-left" style="text-decoration: none; color: inherit; flex: 1;">
            <div class="link-icon">
              <i class="fa-solid ${iconMap[l.category] || 'fa-link'}"></i>
            </div>
            <div>
              <div class="link-title">${this.escapeHtml(l.title)}</div>
              <div class="link-host">${hostname}</div>
            </div>
          </a>
          <button class="link-del-btn" onclick="app.deleteLink('${l.id}')" title="Remover Link">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  addLink(title, url, category) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const newLink = {
      id: 'link-' + Date.now(),
      title,
      url,
      category
    };

    this.state.links.push(newLink);
    this.addXp(50, 'Novo recurso adicionado ao cofre!');
    this.saveState();
    this.renderLinks();
  }

  deleteLink(id) {
    this.state.links = this.state.links.filter(l => l.id !== id);
    this.saveState();
    this.renderLinks();
  }

  // ================= POMODORO SALA DO TEMPO =================
  setPomodoroMode(mode, minutes) {
    this.stopPomodoro();
    this.timerMode = mode;
    this.timerTotal = minutes * 60;
    this.timerTimeLeft = this.timerTotal;

    const badge = document.getElementById('pomoModeBadge');
    if (badge) {
      badge.textContent = mode === 'focus' ? 'Foco Intenso' : mode === 'short' ? 'Descanso Curto' : 'Meditação Longa';
    }

    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    this.updatePomodoroDisplay();
  }

  startPomodoro() {
    if (this.timerIsRunning) {
      this.pausePomodoro();
      return;
    }

    this.timerIsRunning = true;
    this.sound.playPowerUp();

    const startBtn = document.getElementById('startTimerBtn');
    if (startBtn) {
      startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar Treino';
    }

    this.timerInterval = setInterval(() => {
      this.timerTimeLeft--;
      this.updatePomodoroDisplay();

      if (this.timerTimeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerIsRunning = false;
        this.sound.playGong();

        if (startBtn) {
          startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar Treino';
        }

        if (this.timerMode === 'focus') {
          this.addXp(120, 'Ciclo da Sala do Tempo Concluído!');
          alert('⚡ Parabéns guerreiro! Seu tempo de treino terminou. Hora de descansar a mente!');
        } else {
          alert('🔔 Descanso finalizado! Pronto para o próximo round de estudos?');
        }
      }
    }, 1000);
  }

  pausePomodoro() {
    clearInterval(this.timerInterval);
    this.timerIsRunning = false;
    const startBtn = document.getElementById('startTimerBtn');
    if (startBtn) {
      startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Continuar Treino';
    }
    this.sound.playClick();
  }

  stopPomodoro() {
    clearInterval(this.timerInterval);
    this.timerIsRunning = false;
    this.timerTimeLeft = this.timerTotal;
    const startBtn = document.getElementById('startTimerBtn');
    if (startBtn) {
      startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar Treino';
    }
    this.updatePomodoroDisplay();
  }

  updatePomodoroDisplay() {
    const mins = Math.floor(this.timerTimeLeft / 60);
    const secs = this.timerTimeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const timerTimeEl = document.getElementById('timerTime');
    if (timerTimeEl) timerTimeEl.textContent = formatted;

    // Browser tab title update
    if (this.timerIsRunning) {
      document.title = `(${formatted}) ⚡ Shonen Study Hub`;
    } else {
      document.title = 'Shonen Study Hub ⚡ Plataforma de Estudos Anime';
    }

    // Circular progress SVG
    const circle = document.getElementById('timerCircleProgress');
    if (circle) {
      const radius = 44;
      const circumference = 2 * Math.PI * radius; // ~276.46
      const offset = circumference - (this.timerTimeLeft / this.timerTotal) * circumference;
      circle.style.strokeDashoffset = offset;
    }
  }

  // ================= SHARING & BACKUP (PARTILHAR COM AMIGOS) =================
  generateShareLink() {
    try {
      const exportData = {
        hubVersion: '1.0',
        creator: this.state.profile.name,
        notes: this.state.notes,
        links: this.state.links,
        tasks: this.state.tasks
      };

      const jsonStr = JSON.stringify(exportData);
      // Encode cleanly using base64 with UTF-8 support
      const encoded = btoa(encodeURIComponent(jsonStr));
      const fullUrl = `${window.location.origin}${window.location.pathname}#share=${encoded}`;

      const urlInput = document.getElementById('shareUrlField');
      const statusMsg = document.getElementById('shareUrlStatus');

      if (urlInput) urlInput.value = fullUrl;
      if (statusMsg) statusMsg.textContent = 'Link gerado com sucesso! Envie para seus amigos.';

      this.sound.playSuccess();
      return fullUrl;
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar o link.');
    }
  }

  checkUrlForSharedData() {
    if (window.location.hash.startsWith('#share=')) {
      try {
        const raw = window.location.hash.replace('#share=', '');
        const decodedJson = decodeURIComponent(atob(raw));
        const sharedData = JSON.parse(decodedJson);

        if (sharedData && (sharedData.notes || sharedData.links)) {
          setTimeout(() => {
            const confirmImport = confirm(
              `⚡ Seu amigo (${sharedData.creator || 'Um Guerreiro'}) compartilhou um pacote de estudos com ${sharedData.notes?.length || 0} anotações e ${sharedData.links?.length || 0} recursos!\n\nDeseja importar esse conteúdo para o seu Shonen Study Hub agora?`
            );
            if (confirmImport) {
              if (sharedData.notes) {
                this.state.notes = [...sharedData.notes, ...this.state.notes];
              }
              if (sharedData.links) {
                this.state.links = [...sharedData.links, ...this.state.links];
              }
              if (sharedData.tasks) {
                this.state.tasks = [...sharedData.tasks, ...this.state.tasks];
              }
              this.saveState();
              this.renderNotes();
              this.renderTasks();
              this.renderLinks();
              this.showToast('Pacote de estudos do amigo importado com sucesso!');
              // Clean hash
              window.history.replaceState(null, null, window.location.pathname);
            }
          }, 800);
        }
      } catch (err) {
        console.warn('Could not parse shared URL data:', err);
      }
    }
  }

  exportJsonFile() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `shonen-study-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.sound.playSuccess();
    this.showToast('Arquivo de backup JSON baixado com sucesso!');
  }

  importJsonFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.notes && imported.profile) {
          this.state = imported;
          this.saveState();
          this.applyTheme(this.state.theme || 'multiverse', false);
          this.updateUserStatsDisplay();
          this.renderNotes();
          this.renderTasks();
          this.renderLinks();
          this.sound.playSuccess();
          this.showToast('Backup JSON restaurado com sucesso!');
          this.closeModal('shareModal');
        } else {
          alert('Arquivo JSON inválido. Formato não reconhecido.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
  }

  // ================= UI HELPERS & MODALS =================
  openModal(modalId) {
    this.sound.playClick();
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bolt"></i> <span>${this.escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ================= EVENT LISTENERS =================
  setupEventListeners() {
    // Theme switch buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyTheme(btn.dataset.themeTarget);
      });
    });

    // Sound toggle
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.state.soundEnabled = !this.state.soundEnabled;
        soundBtn.innerHTML = this.state.soundEnabled
          ? '<i class="fa-solid fa-volume-high"></i>'
          : '<i class="fa-solid fa-volume-xmark"></i>';
        this.showToast(this.state.soundEnabled ? 'Efeitos sonoros ativados!' : 'Efeitos sonoros mutados.');
        this.saveState();
      });
    }

    // Modal open buttons
    document.getElementById('openShareModalBtn')?.addEventListener('click', () => this.openModal('shareModal'));
    document.getElementById('openNewNoteBtn')?.addEventListener('click', () => {
      document.getElementById('noteForm').reset();
      document.getElementById('editNoteId').value = '';
      document.getElementById('noteModalTitle').innerHTML = '<i class="fa-solid fa-feather-pointed"></i> Registrar Anotação de Estudo';
      this.openModal('noteModal');
    });
    document.getElementById('openAddLinkBtn')?.addEventListener('click', () => {
      document.getElementById('linkForm').reset();
      this.openModal('linkModal');
    });
    document.getElementById('openAddQuestBtn')?.addEventListener('click', () => {
      document.getElementById('quickTaskInput').focus();
    });
    document.getElementById('userBadge')?.addEventListener('click', () => {
      document.getElementById('profileNameInput').value = this.state.profile.name;
      this.openModal('profileModal');
    });

    // Modal close triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal(btn.dataset.closeModal);
      });
    });

    // Note Search and Subject Filter
    document.getElementById('noteSearchInput')?.addEventListener('input', () => this.renderNotes());
    document.getElementById('noteSubjectFilter')?.addEventListener('change', () => this.renderNotes());

    // Note Form Submit
    document.getElementById('noteForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('noteTitleInput').value.trim();
      const subject = document.getElementById('noteSubjectSelect').value;
      const tags = document.getElementById('noteTagsInput').value;
      const body = document.getElementById('noteBodyInput').value.trim();
      const editId = document.getElementById('editNoteId').value;

      if (!title || !body) return;
      this.saveNote(title, subject, tags, body, editId);
      this.closeModal('noteModal');
    });

    // Link Form Submit
    document.getElementById('linkForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('linkTitleInput').value.trim();
      const url = document.getElementById('linkUrlInput').value.trim();
      const category = document.getElementById('linkCategorySelect').value;

      if (!title || !url) return;
      this.addLink(title, url, category);
      this.closeModal('linkModal');
    });

    // Quick Task Form Submit
    document.getElementById('quickTaskForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('quickTaskInput');
      const difficulty = document.getElementById('quickTaskDifficulty').value;
      const val = input.value.trim();
      if (!val) return;

      this.addTask(val, difficulty);
      input.value = '';
    });

    // Task Tab Filter
    document.querySelectorAll('.task-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.task-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.taskFilter = tab.dataset.taskFilter;
        this.renderTasks();
      });
    });

    // Pomodoro Mode Tabs
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const time = parseInt(tab.dataset.time, 10);
        const mode = tab.dataset.mode;
        this.setPomodoroMode(mode, time);
      });
    });

    // Pomodoro Controls
    document.getElementById('startTimerBtn')?.addEventListener('click', () => this.startPomodoro());
    document.getElementById('resetTimerBtn')?.addEventListener('click', () => this.stopPomodoro());

    // Ambient Audio Picker
    document.getElementById('ambientAudioSelect')?.addEventListener('change', (e) => {
      this.ambient.setMode(e.target.value);
    });

    // Profile Form
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('profileNameInput').value.trim();
      const selectedAvatar = document.querySelector('input[name="avatarRadio"]:checked')?.value || 'goku';

      if (newName) {
        this.state.profile.name = newName;
        this.state.profile.avatar = selectedAvatar;
        this.updateUserStatsDisplay();
        this.saveState();
        this.sound.playPowerUp();
        this.showToast('Perfil de Guerreiro atualizado!');
        this.closeModal('profileModal');
      }
    });

    // Share Actions
    document.getElementById('generateShareLinkBtn')?.addEventListener('click', () => this.generateShareLink());
    document.getElementById('copyShareLinkBtn')?.addEventListener('click', () => {
      const field = document.getElementById('shareUrlField');
      if (field && field.value) {
        navigator.clipboard.writeText(field.value).then(() => {
          this.sound.playClick();
          this.showToast('Link copiado! Envie para seus amigos.');
        });
      } else {
        const generated = this.generateShareLink();
        navigator.clipboard.writeText(generated);
      }
    });

    document.getElementById('exportJsonBtn')?.addEventListener('click', () => this.exportJsonFile());
    document.getElementById('importJsonFileInput')?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.importJsonFile(e.target.files[0]);
      }
    });

    // Flashcard next tip
    const tips = [
      "Técnica Feynman: Explique o assunto que você acabou de estudar em termos tão simples como se estivesse ensinando uma criança de 8 anos.",
      "Repetição Espaçada: Revisar 10 minutos após 24h consolida mais a memória do que 5 horas seguidas na véspera da prova.",
      "Sono de Qualidade: É durante o sono REM que o cérebro transfere o que você estudou para a memória de longo prazo.",
      "Metodologia Kaizen: Melhore 1% todos os dias. No final de um ano, você estará 37 vezes melhor!"
    ];
    let tipIdx = 0;
    document.getElementById('nextTipBtn')?.addEventListener('click', () => {
      tipIdx = (tipIdx + 1) % tips.length;
      const el = document.getElementById('studyTipContent');
      if (el) el.innerHTML = `<p>${tips[tipIdx]}</p>`;
      this.sound.playClick();
    });
  }
}

// Global initialization
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new ShonenApp();
  app.init();
});
