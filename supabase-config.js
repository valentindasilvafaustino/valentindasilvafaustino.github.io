/* ===================================================================
   SHONEN STUDY HUB - CONFIGURAÇÃO DO SUPABASE
   Carrega as credenciais via window.SUPABASE_CONFIG, .env ou Local Cache
   =================================================================== */

window.SUPABASE_CONFIG = {
  // Substitua pela URL do seu Projeto Supabase (ex: https://xyzcompany.supabase.co)
  // Encontre em: Supabase Dashboard > Project Settings > API > Project URL
  url: '',

  // Substitua pela Chave Pública Anônima (anon public)
  // Encontre em: Supabase Dashboard > Project Settings > API > Project API Keys > anon public
  anonKey: '',

  // Senha da base de dados definida na criação
  dbPass: 'Y$K46FPpn-RdbHu'
};

// Função para tentar carregar variáveis do arquivo .env caso esteja rodando em servidor local
async function loadEnvFile() {
  try {
    const res = await fetch('.env');
    if (!res.ok) return;
    const text = await res.text();
    const lines = text.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key === 'SUPABASE_URL' && val && !val.includes('SEU_PROJETO')) {
        window.SUPABASE_CONFIG.url = val;
      }
      if (key === 'SUPABASE_ANON_KEY' && val && !val.includes('sua_chave')) {
        window.SUPABASE_CONFIG.anonKey = val;
      }
      if (key === 'supabase' || key === 'SUPABASE_DB_PASS') {
        window.SUPABASE_CONFIG.dbPass = val;
      }
    });
  } catch (err) {
    // Falha silenciosa se rodando via file:// ou sem permissão de fetch
  }
}

// Carregar chaves salvas localmente caso o usuário as tenha inserido no assistente do app
function loadStoredConfig() {
  const savedUrl = localStorage.getItem('SHONEN_SUPABASE_URL');
  const savedKey = localStorage.getItem('SHONEN_SUPABASE_ANON_KEY');
  if (savedUrl && !window.SUPABASE_CONFIG.url) {
    window.SUPABASE_CONFIG.url = savedUrl;
  }
  if (savedKey && !window.SUPABASE_CONFIG.anonKey) {
    window.SUPABASE_CONFIG.anonKey = savedKey;
  }
}

loadStoredConfig();
loadEnvFile();
