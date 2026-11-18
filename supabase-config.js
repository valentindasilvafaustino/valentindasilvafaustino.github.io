/* ===================================================================
   TINTINGAMEZ - CONFIGURAÇÃO AUTOMÁTICA DA NUVEM
   Estas chaves são públicas (anon/publishable) e permitem a conexão
   direta e automática tanto localmente quanto online.
   =================================================================== */

window.SUPABASE_CONFIG = {
  // URL do seu Projeto Supabase
  url: 'https://prnrtffmodhydrxxqwzt.supabase.co',

  // Chave Pública Anônima (Publishable Key)
  anonKey: 'sb_publishable_tufnjKA7ky5zLDhAzDyxRg_jrvlZQGM'
};

// Grava também no armazenamento do navegador para redundância
try {
  localStorage.setItem('SHONEN_SUPABASE_URL', window.SUPABASE_CONFIG.url);
  localStorage.setItem('SHONEN_SUPABASE_ANON_KEY', window.SUPABASE_CONFIG.anonKey);
} catch (e) {
  // Ignora se localStorage estiver bloqueado
}
