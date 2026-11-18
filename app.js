/* ===================================================================
   TINTINGAMEZ - APP LOGIC & DATABASE ENGINE
   Themes: Dragon Ball, One Piece, Naruto, My Hero Academia, Multiverse
   Features: Supabase Auth (Login/Cadastro), Supabase DB Sync (Notas,
             Missões, Treinos, Links, XP isolados por usuário),
             Canvas Energy Particles, Web Audio Synth, Pomodoro & Sharing
   =================================================================== */

// CREDENCIAIS PERMANENTES DO SUPABASE (Sempre conectado!)
const SUPABASE_PROJECT_URL = 'https://prnrtffmodhydrxxqwzt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_tufnjKA7ky5zLDhAzDyxRg_jrvlZQGM';

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

// Audio Theme Synth (Native Web Audio API)
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
    if (app && !app.soundEnabled) return;
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
    if (app && !app.soundEnabled) return;
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
    if (app && !app.soundEnabled) return;
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
    if (app && !app.soundEnabled) return;
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

// Ambient Audio Synth
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
    this.numParticles = 46;
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
        color = Math.random() > 0.3 ? 'rgba(251, 191, 36, 0.85)' : 'rgba(6, 182, 212, 0.85)';
        speedY = -(Math.random() * 2.2 + 0.6);
        speedX = (Math.random() - 0.5) * 0.9;
        if (Math.random() > 0.85) shape = 'dragonball';
        break;
      case 'onepiece':
        color = Math.random() > 0.4 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.75)';
        size = Math.random() * 4 + 1;
        break;
      case 'naruto':
        color = Math.random() > 0.35 ? 'rgba(249, 115, 22, 0.85)' : 'rgba(2, 132, 199, 0.85)';
        speedY = (Math.random() - 0.5) * 2;
        break;
      case 'mha':
        color = Math.random() > 0.3 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(6, 182, 212, 0.9)';
        shape = 'spark';
        break;
      default:
        color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.85)' : 'rgba(56, 189, 248, 0.85)';
    }

    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size,
      speedX,
      speedY,
      color,
      shape
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

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
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#dc2626';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'spark') {
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 1.8;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + (Math.random() - 0.5) * 16, p.y + (Math.random() - 0.5) * 16);
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ================= MAIN SHONEN & SUPABASE APPLICATION =================
class ShonenApp {
  constructor() {
    this.sound = new SoundFX();
    this.ambient = new AmbientAudioEngine();
    this.canvasEngine = null;
    this.soundEnabled = true;

    // Supabase State
    this.supabase = null;
    this.currentUser = null;
    this.userProfile = {
      name: 'Guerreiro Z',
      avatar: 'goku',
      xp: 350,
      streak: 1,
      theme: 'multiverse'
    };

    // Data in Memory (Synced with Supabase)
    this.notes = [];
    this.tasks = [];
    this.links = [];
    this.trainingsCount = 0;

    // Auth screen state
    this.authMode = 'login'; // 'login' or 'register'

    // Pomodoro Timer State
    this.timerInterval = null;
    this.timerTimeLeft = 25 * 60;
    this.timerTotal = 25 * 60;
    this.timerIsRunning = false;
    this.timerMode = 'focus';

    // Filters
    this.taskFilter = 'pending';
  }

  async init() {
    // 1. Start Particle Canvas
    this.canvasEngine = new EnergyParticleCanvas('energyCanvas');

    // 2. Init Supabase Connection
    await this.initSupabase();

    // 3. Setup Listeners
    this.setupEventListeners();
    this.renderDailyQuote();
    this.updatePomodoroDisplay();

    // 4. Check Magic URL Share Hash
    this.checkUrlForSharedData();
  }

  // ================= SUPABASE CLIENT INITIALIZATION =================
  async initSupabase() {
    const url = (window.SUPABASE_CONFIG?.url || SUPABASE_PROJECT_URL).trim();
    const key = (window.SUPABASE_CONFIG?.anonKey || SUPABASE_PUBLISHABLE_KEY).trim();

    const pill = document.getElementById('dbStatusPill');
    const statusText = document.getElementById('dbStatusText');

    try {
      if (!window.supabase) {
        throw new Error('Biblioteca Supabase SDK ainda não carregou.');
      }

      this.supabase = window.supabase.createClient(url, key);

      // Check current session
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) throw error;

      if (pill) {
        pill.querySelector('.status-dot').className = 'status-dot online';
        statusText.textContent = 'Servidor Online';
      }

      // Setup Auth state listener
      this.supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (event === 'PASSWORD_RECOVERY') {
          this.openModal('newPasswordRecoveryModal');
          return;
        }
        if (currentSession && currentSession.user) {
          this.currentUser = currentSession.user;
          this.showDashboard();
          await this.loadAllUserData();
        } else {
          this.currentUser = null;
          this.showAuthScreen();
        }
      });

      if (session && session.user) {
        this.currentUser = session.user;
        this.showDashboard();
        await this.loadAllUserData();
      } else {
        this.showAuthScreen();
      }

      return true;
    } catch (err) {
      console.error('Connection error:', err);
      if (pill) {
        pill.querySelector('.status-dot').className = 'status-dot offline';
        statusText.textContent = 'Erro de Conexão com o Servidor';
      }
      this.showAuthAlert(`Erro na conexão com o servidor: ${err.message}`, 'error');
      return false;
    }
  }

  // ================= AUTH UI TOGGLE =================
  showAuthScreen() {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('mainDashboard').style.display = 'none';
  }

  showDashboard() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'flex';
    const emailBadge = document.getElementById('userEmailBadgeFooter');
    if (emailBadge && this.currentUser) {
      emailBadge.textContent = `Autenticado: ${this.currentUser.email}`;
    }
  }

  setAuthMode(mode) {
    this.authMode = mode;
    const loginTab = document.getElementById('tabLoginBtn');
    const regTab = document.getElementById('tabRegisterBtn');
    const nameGroup = document.getElementById('registerNameGroup');
    const avatarGroup = document.getElementById('registerAvatarGroup');
    const submitText = document.getElementById('authSubmitText');
    const alertBox = document.getElementById('authAlert');

    alertBox.style.display = 'none';

    if (mode === 'login') {
      loginTab.classList.add('active');
      regTab.classList.remove('active');
      nameGroup.style.display = 'none';
      avatarGroup.style.display = 'none';
      submitText.textContent = 'Entrar no TintinGamez';
    } else {
      regTab.classList.add('active');
      loginTab.classList.remove('active');
      nameGroup.style.display = 'flex';
      avatarGroup.style.display = 'flex';
      submitText.textContent = 'Despertar Poder & Cadastrar';
    }
    this.sound.playClick();
  }

  showAuthAlert(message, type = 'error') {
    const alertBox = document.getElementById('authAlert');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `auth-alert ${type}`;
    alertBox.style.display = 'flex';
  }

  async handleAuthSubmit(e) {
    e.preventDefault();
    if (!this.supabase) {
      this.showAuthAlert('Erro: Servidor indisponível no momento.', 'error');
      return;
    }

    const email = document.getElementById('authEmailInput').value.trim();
    const password = document.getElementById('authPasswordInput').value;
    const submitBtn = document.getElementById('authSubmitBtn');

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';

    try {
      if (this.authMode === 'login') {
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        this.sound.playPowerUp();
        this.showToast('Login realizado com sucesso!');
      } else {
        // Register
        const name = document.getElementById('authNameInput').value.trim() || 'Guerreiro Z';
        const avatar = document.querySelector('input[name="authAvatarRadio"]:checked')?.value || 'goku';

        const { data, error } = await this.supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, avatar }
          }
        });
        if (error) throw error;

        this.sound.playSuccess();
        this.showAuthAlert('Conta criada com sucesso! Verifique seu e-mail se necessário, ou faça login.', 'success');
      }
    } catch (err) {
      console.error(err);
      let msg = err.message;
      if (msg.includes('Invalid login credentials')) msg = 'E-mail ou senha incorretos.';
      if (msg.includes('User already registered')) msg = 'Este e-mail já está cadastrado. Tente entrar.';
      if (msg.includes('Password should be at least 6 characters')) msg = 'A senha deve possuir pelo menos 6 caracteres.';
      this.showAuthAlert(msg, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  }

  async logout() {
    if (!this.supabase) return;
    if (confirm('Deseja realmente sair da sua conta?')) {
      await this.supabase.auth.signOut();
      this.sound.playClick();
      this.showToast('Você saiu da sua conta.');
    }
  }

  // ================= LOAD / SYNC DATA WITH SUPABASE =================
  async loadAllUserData() {
    if (!this.supabase || !this.currentUser) return;
    const uid = this.currentUser.id;

    try {
      // 1. Profile & Stats
      const { data: profile, error: pErr } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (profile) {
        this.userProfile = profile;
      } else {
        // Create initial profile if trigger did not execute
        const meta = this.currentUser.user_metadata || {};
        const newProf = {
          id: uid,
          name: meta.name || 'Guerreiro Z',
          avatar: meta.avatar || 'goku',
          xp: 350,
          streak: 1,
          theme: 'multiverse'
        };
        await this.supabase.from('profiles').insert(newProf);
        this.userProfile = newProf;
      }

      this.applyTheme(this.userProfile.theme || 'multiverse', false);
      this.updateUserStatsDisplay();

      // 2. Notes
      const { data: notes } = await this.supabase
        .from('notes')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      
      this.notes = notes || [];
      this.renderNotes();

      // 3. Tasks / Quests
      const { data: tasks } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      this.tasks = tasks || [];
      this.renderTasks();

      // 4. Links Vault
      const { data: links } = await this.supabase
        .from('links')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      this.links = links || [];
      this.renderLinks();

      // 5. Training Sessions Count
      const { count } = await this.supabase
        .from('trainings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', uid);

      this.trainingsCount = count || 0;
      const countEl = document.getElementById('trainingCountDisplay');
      if (countEl) countEl.textContent = this.trainingsCount;

      this.showToast(`🔥 Bem-vindo ao TintinGamez, ${this.userProfile.name}!`);
    } catch (err) {
      console.error('Error loading data:', err);
      this.showToast('Aviso: Verifique sua conexão com o servidor.');
    }
  }

  // ================= THEME & WALLPAPER =================
  async applyTheme(themeName, syncDb = true) {
    this.userProfile.theme = themeName;
    document.body.setAttribute('data-theme', themeName);

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeTarget === themeName);
    });

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

    if (syncDb && this.supabase && this.currentUser) {
      this.sound.playPowerUp();
      await this.supabase.from('profiles').update({ theme: themeName }).eq('id', this.currentUser.id);
      this.showToast(`Universo ativado: ${themeName.toUpperCase()}!`);
    }
  }

  // ================= STATS & XP =================
  async addXp(amount, reason = '') {
    this.userProfile.xp += amount;
    this.sound.playSuccess();
    this.showToast(`+${amount} XP ganho! ${reason}`);
    this.updateUserStatsDisplay();

    if (this.supabase && this.currentUser) {
      await this.supabase
        .from('profiles')
        .update({ xp: this.userProfile.xp, updated_at: new Date().toISOString() })
        .eq('id', this.currentUser.id);
    }
  }

  getRankTitle(xp) {
    if (xp < 500) return 'Guerreiro Novato';
    if (xp < 1200) return 'Chunin de Elite';
    if (xp < 2500) return 'Super Saiyajin';
    if (xp < 5000) return 'Comandante de Frota';
    return 'Hokage Lendário / Símbolo da Paz';
  }

  updateUserStatsDisplay() {
    const p = this.userProfile;
    const nameLabel = document.getElementById('userNameLabel');
    const powerDisplay = document.getElementById('powerLevelDisplay');
    const rankLabel = document.getElementById('currentRankLabel');
    const xpText = document.getElementById('currentXpText');
    const nextXpText = document.getElementById('nextLevelXpText');
    const progressBar = document.getElementById('xpProgressBar');
    const avatarImg = document.getElementById('userAvatarImg');
    const streakDisplay = document.getElementById('studyStreakDisplay');

    if (nameLabel) nameLabel.textContent = p.name || 'Guerreiro';
    if (powerDisplay) powerDisplay.textContent = `${((p.xp || 0) * 9 + 100).toLocaleString('pt-BR')}+`;
    if (rankLabel) rankLabel.textContent = this.getRankTitle(p.xp || 0);
    if (streakDisplay) streakDisplay.textContent = `${p.streak || 1} Dia(s)`;

    const level = Math.floor((p.xp || 0) / 500) + 1;
    const currentLevelBase = (level - 1) * 500;
    const nextLevelTarget = level * 500;
    const progress = Math.min(100, Math.max(5, (((p.xp || 0) - currentLevelBase) / 500) * 100));

    if (xpText) xpText.textContent = p.xp || 0;
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

  // ================= NOTES (GRIMÓRIO) =================
  renderNotes() {
    const container = document.getElementById('notesGridContainer');
    if (!container) return;

    const searchTerm = (document.getElementById('noteSearchInput')?.value || '').toLowerCase();
    const subjectFilter = document.getElementById('noteSubjectFilter')?.value || 'all';

    const filtered = this.notes.filter(note => {
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
          <p>Nenhuma anotação salva no seu banco. Clique em <strong>Nova Nota</strong> para adicionar!</p>
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
        <div class="note-date"><i class="fa-regular fa-clock"></i> ${new Date(note.created_at || Date.now()).toLocaleDateString('pt-BR')}</div>
      </div>
    `).join('');

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

  async saveNote(title, subject, tagsStr, body, editId = null) {
    if (!this.currentUser || !this.supabase) return;
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    try {
      if (editId) {
        const { error } = await this.supabase
          .from('notes')
          .update({
            title,
            subject,
            tags,
            body,
            updated_at: new Date().toISOString()
          })
          .eq('id', editId)
          .eq('user_id', this.currentUser.id);

        if (error) throw error;

        const idx = this.notes.findIndex(n => n.id === editId);
        if (idx !== -1) {
          this.notes[idx] = { ...this.notes[idx], title, subject, tags, body };
        }
        this.showToast('Nota atualizada com sucesso!');
      } else {
        const newNote = {
          id: 'note-' + Date.now(),
          user_id: this.currentUser.id,
          title,
          subject,
          tags,
          body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error } = await this.supabase.from('notes').insert(newNote);
        if (error) throw error;

        this.notes.unshift(newNote);
        await this.addXp(150, 'Nova nota registrada no Grimório!');
      }

      this.renderNotes();
    } catch (err) {
      console.error(err);
      this.showToast(`Erro ao salvar nota: ${err.message}`);
    }
  }

  editNote(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;

    document.getElementById('editNoteId').value = note.id;
    document.getElementById('noteTitleInput').value = note.title;
    document.getElementById('noteSubjectSelect').value = note.subject;
    document.getElementById('noteTagsInput').value = (note.tags || []).join(', ');
    document.getElementById('noteBodyInput').value = note.body;
    document.getElementById('noteModalTitle').innerHTML = '<i class="fa-solid fa-pen"></i> Editar Resumo de Estudo';

    this.openModal('noteModal');
  }

  async deleteNote(id) {
    if (!this.currentUser || !this.supabase) return;
    if (confirm('Deseja realmente apagar esta anotação?')) {
      try {
        const { error } = await this.supabase
          .from('notes')
          .delete()
          .eq('id', id)
          .eq('user_id', this.currentUser.id);

        if (error) throw error;

        this.notes = this.notes.filter(n => n.id !== id);
        this.renderNotes();
        this.showToast('Anotação removida do banco.');
      } catch (err) {
        this.showToast(`Erro ao excluir: ${err.message}`);
      }
    }
  }

  copyNoteContent(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;
    const textToCopy = `# ${note.title}\nAssunto: ${note.subject}\nTags: ${(note.tags || []).join(', ')}\n\n${note.body}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.sound.playClick();
      this.showToast('Resumo copiado para a área de transferência!');
    });
  }

  // ================= TASKS / MISSÕES =================
  renderTasks() {
    const container = document.getElementById('tasksListContainer');
    const pendingBadge = document.getElementById('pendingCount');
    const completedBadge = document.getElementById('completedCount');
    if (!container) return;

    const pending = this.tasks.filter(t => !t.completed);
    const completed = this.tasks.filter(t => t.completed);

    if (pendingBadge) pendingBadge.textContent = pending.length;
    if (completedBadge) completedBadge.textContent = completed.length;

    const currentList = this.taskFilter === 'pending' ? pending : completed;

    if (currentList.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 25px; color: var(--text-muted); font-size: 0.85rem;">
          <p>${this.taskFilter === 'pending' ? 'Nenhuma missão pendente! Adicione uma nova missão.' : 'Nenhuma missão concluída ainda.'}</p>
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

  async addTask(title, difficulty) {
    if (!this.currentUser || !this.supabase) return;
    const xpRewards = { D: 50, C: 100, B: 200, A: 350, S: 500 };
    const newTask = {
      id: 'task-' + Date.now(),
      user_id: this.currentUser.id,
      title,
      difficulty,
      xp: xpRewards[difficulty] || 100,
      completed: false,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await this.supabase.from('tasks').insert(newTask);
      if (error) throw error;

      this.tasks.unshift(newTask);
      this.renderTasks();
      this.sound.playClick();
      this.showToast(`Missão Rank ${difficulty} salva com sucesso!`);
    } catch (err) {
      this.showToast(`Erro ao criar tarefa: ${err.message}`);
    }
  }

  async toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task || !this.currentUser || !this.supabase) return;

    const newCompleted = !task.completed;
    task.completed = newCompleted;

    try {
      await this.supabase
        .from('tasks')
        .update({ completed: newCompleted })
        .eq('id', id)
        .eq('user_id', this.currentUser.id);

      if (newCompleted) {
        await this.addXp(task.xp, `Missão concluída! (+${task.xp} XP)`);
      } else {
        this.sound.playClick();
      }

      this.renderTasks();
    } catch (err) {
      this.showToast(`Erro ao atualizar tarefa: ${err.message}`);
    }
  }

  async deleteTask(id) {
    if (!this.currentUser || !this.supabase) return;
    try {
      await this.supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', this.currentUser.id);

      this.tasks = this.tasks.filter(t => t.id !== id);
      this.renderTasks();
    } catch (err) {
      this.showToast(`Erro ao excluir: ${err.message}`);
    }
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

    container.innerHTML = this.links.map(l => {
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

  async addLink(title, url, category) {
    if (!this.currentUser || !this.supabase) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const newLink = {
      id: 'link-' + Date.now(),
      user_id: this.currentUser.id,
      title,
      url,
      category,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await this.supabase.from('links').insert(newLink);
      if (error) throw error;

      this.links.push(newLink);
      await this.addXp(50, 'Novo recurso adicionado ao cofre!');
      this.renderLinks();
    } catch (err) {
      this.showToast(`Erro ao salvar link: ${err.message}`);
    }
  }

  async deleteLink(id) {
    if (!this.currentUser || !this.supabase) return;
    try {
      await this.supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', this.currentUser.id);

      this.links = this.links.filter(l => l.id !== id);
      this.renderLinks();
    } catch (err) {
      this.showToast(`Erro ao excluir: ${err.message}`);
    }
  }

  // ================= POMODORO & TREINO =================
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

    this.timerInterval = setInterval(async () => {
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
          // Register training session in Supabase!
          await this.recordTrainingSession();
          await this.addXp(120, 'Ciclo da Sala do Tempo Concluído!');
          alert('⚡ Parabéns guerreiro! Seu tempo de treino terminou e foi salvo com sucesso!');
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

  async recordTrainingSession() {
    if (!this.currentUser || !this.supabase) return;
    const durationMin = Math.round(this.timerTotal / 60);

    try {
      await this.supabase.from('trainings').insert({
        id: 'train-' + Date.now(),
        user_id: this.currentUser.id,
        mode: this.timerMode,
        duration_minutes: durationMin,
        xp_earned: 120,
        completed_at: new Date().toISOString()
      });

      this.trainingsCount++;
      const countEl = document.getElementById('trainingCountDisplay');
      if (countEl) countEl.textContent = this.trainingsCount;
    } catch (err) {
      console.warn('Erro ao salvar sessão de treino:', err);
    }
  }

  updatePomodoroDisplay() {
    const mins = Math.floor(this.timerTimeLeft / 60);
    const secs = this.timerTimeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const timerTimeEl = document.getElementById('timerTime');
    if (timerTimeEl) timerTimeEl.textContent = formatted;

    if (this.timerIsRunning) {
      document.title = `(${formatted}) ⚡ TintinGamez`;
    } else {
      document.title = 'TintinGamez ⚡ Plataforma de Estudos Anime';
    }

    const circle = document.getElementById('timerCircleProgress');
    if (circle) {
      const radius = 44;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (this.timerTimeLeft / this.timerTotal) * circumference;
      circle.style.strokeDashoffset = offset;
    }
  }

  // ================= SHARING & BACKUP =================
  generateShareLink() {
    try {
      const exportData = {
        hubVersion: '2.0',
        creator: this.userProfile.name,
        notes: this.notes,
        links: this.links,
        tasks: this.tasks
      };

      const jsonStr = JSON.stringify(exportData);
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
          setTimeout(async () => {
            const confirmImport = confirm(
              `⚡ Seu amigo (${sharedData.creator || 'Um Guerreiro'}) compartilhou um pacote de estudos com ${sharedData.notes?.length || 0} anotações e ${sharedData.links?.length || 0} recursos!\n\nDeseja importar esse conteúdo para a sua conta agora?`
            );
            if (confirmImport && this.currentUser && this.supabase) {
              for (let n of (sharedData.notes || [])) {
                await this.saveNote(n.title, n.subject || 'Geral', (n.tags || []).join(', '), n.body);
              }
              for (let l of (sharedData.links || [])) {
                await this.addLink(l.title, l.url, l.category || 'doc');
              }
              this.showToast('Pacote de estudos importado com sucesso!');
              window.history.replaceState(null, null, window.location.pathname);
            }
          }, 1200);
        }
      } catch (err) {
        console.warn('Could not parse shared URL data:', err);
      }
    }
  }

  exportJsonFile() {
    const fullBackup = {
      profile: this.userProfile,
      notes: this.notes,
      tasks: this.tasks,
      links: this.links
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tintingamez-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.sound.playSuccess();
    this.showToast('Arquivo de backup JSON baixado com sucesso!');
  }

  async importJsonFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (this.currentUser && this.supabase) {
          if (imported.notes) {
            for (let n of imported.notes) {
              await this.saveNote(n.title, n.subject, (n.tags || []).join(','), n.body);
            }
          }
          if (imported.links) {
            for (let l of imported.links) {
              await this.addLink(l.title, l.url, l.category);
            }
          }
          this.sound.playSuccess();
          this.showToast('Dados do arquivo importados com sucesso!');
          this.closeModal('shareModal');
        }
      } catch (err) {
        alert('Erro ao ler ou importar arquivo JSON.');
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
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyTheme(btn.dataset.themeTarget);
      });
    });

    // Sound toggle
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        soundBtn.innerHTML = this.soundEnabled
          ? '<i class="fa-solid fa-volume-high"></i>'
          : '<i class="fa-solid fa-volume-xmark"></i>';
        this.showToast(this.soundEnabled ? 'Efeitos sonoros ativados!' : 'Efeitos sonoros mutados.');
      });
    }

    // Auth screen tabs
    document.getElementById('tabLoginBtn')?.addEventListener('click', () => this.setAuthMode('login'));
    document.getElementById('tabRegisterBtn')?.addEventListener('click', () => this.setAuthMode('register'));
    document.getElementById('authForm')?.addEventListener('submit', (e) => this.handleAuthSubmit(e));

    // Password visibility toggle helper
    const setupToggle = (btnId, inputId) => {
      document.getElementById(btnId)?.addEventListener('click', () => {
        const input = document.getElementById(inputId);
        const icon = document.querySelector(`#${btnId} i`);
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'fa-solid fa-eye-slash';
        } else {
          input.type = 'password';
          if (icon) icon.className = 'fa-solid fa-eye';
        }
      });
    };
    setupToggle('togglePasswordBtn', 'authPasswordInput');
    setupToggle('toggleProfilePassBtn', 'profileNewPasswordInput');
    setupToggle('toggleRecoveryPassBtn', 'recoveryPasswordInput');

    // Forgot / Reset Password Triggers
    document.getElementById('openForgotPassBtn')?.addEventListener('click', () => {
      const currentEmail = document.getElementById('authEmailInput')?.value?.trim() || '';
      if (currentEmail) {
        document.getElementById('forgotEmailInput').value = currentEmail;
      }
      this.openModal('forgotPassModal');
    });

    document.getElementById('forgotPassForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmailInput').value.trim();
      const submitBtn = document.getElementById('forgotSubmitBtn');
      submitBtn.disabled = true;
      try {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname
        });
        if (error) throw error;
        this.showToast('Link de recuperação enviado! Verifique seu e-mail.');
        this.closeModal('forgotPassModal');
      } catch (err) {
        alert(`Erro ao solicitar recuperação: ${err.message}`);
      } finally {
        submitBtn.disabled = false;
      }
    });

    document.getElementById('newPasswordRecoveryForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPass = document.getElementById('recoveryPasswordInput').value.trim();
      if (newPass.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      const submitBtn = document.getElementById('recoverySubmitBtn');
      submitBtn.disabled = true;
      try {
        const { error } = await this.supabase.auth.updateUser({ password: newPass });
        if (error) throw error;
        this.sound.playSuccess();
        this.showToast('Nova senha salva com sucesso!');
        this.closeModal('newPasswordRecoveryModal');
      } catch (err) {
        alert(`Erro ao salvar nova senha: ${err.message}`);
      } finally {
        submitBtn.disabled = false;
      }
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

    // General Modal Open Buttons
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
      document.getElementById('profileNameInput').value = this.userProfile.name;
      this.openModal('profileModal');
    });

    // Close buttons for modals
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

    // Profile Form Submit (Nome, Avatar e Senha)
    document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('profileNameInput').value.trim();
      const selectedAvatar = document.querySelector('input[name="avatarRadio"]:checked')?.value || 'goku';
      const newPassword = document.getElementById('profileNewPasswordInput')?.value?.trim();

      if (newName && this.currentUser && this.supabase) {
        try {
          // 1. Atualizar senha se preenchida
          if (newPassword) {
            if (newPassword.length < 6) {
              alert('A nova senha deve possuir pelo menos 6 caracteres.');
              return;
            }
            const { error: passErr } = await this.supabase.auth.updateUser({ password: newPassword });
            if (passErr) throw passErr;
            this.showToast('Senha alterada com sucesso!');
            document.getElementById('profileNewPasswordInput').value = '';
          }

          // 2. Atualizar perfil (Nome e Avatar)
          this.userProfile.name = newName;
          this.userProfile.avatar = selectedAvatar;
          this.updateUserStatsDisplay();

          await this.supabase
            .from('profiles')
            .update({ name: newName, avatar: selectedAvatar, updated_at: new Date().toISOString() })
            .eq('id', this.currentUser.id);

          this.sound.playPowerUp();
          this.showToast('Perfil atualizado com sucesso!');
          this.closeModal('profileModal');
        } catch (err) {
          alert(`Erro ao atualizar perfil/senha: ${err.message}`);
        }
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
