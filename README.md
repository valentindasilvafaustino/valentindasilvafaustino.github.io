# ⚡ Shonen Study Hub — Central de Estudos Anime com Supabase

Uma aplicação web com estética anime (Dragon Ball, One Piece, Naruto, My Hero Academia), efeitos visuais interativos em tempo real, **autenticação completa (Login & Cadastro com Senha)** e **banco de dados em nuvem Supabase**, garantindo que as anotações, missões, treinos e XP de cada usuário fiquem salvos separadamente e com total privacidade!

---

## 🌟 O que há de novo: Integração com Supabase & Autenticação

1. **Página de Login e Cadastro Dedicada**:
   - Tela de acesso com visual anime, alternância entre *Entrar* e *Criar Conta*.
   - Escolha de Avatar inicial (Goku, Luffy, Naruto ou Deku) e nome de guerreiro.
   - Validações completas e botão para exibir/ocultar senha.
2. **Banco de Dados em Nuvem Seguro (Supabase)**:
   - **Adeus `localStorage` isolado**: agora todos os dados são salvos nas tabelas PostgreSQL do Supabase.
   - **Isolamento por Usuário**: Cada usuário cadastrado possui seus dados salvos separadamente pelo seu `user_id`. Ninguém tem acesso aos dados dos outros graças ao *Row Level Security (RLS)*.
   - **Tabelas do Banco**:
     - `profiles`: Nome, avatar, XP, streak, tema e poder de luta.
     - `notes`: Grimório de anotações com matérias, tags e corpo do texto.
     - `tasks`: Missões e tarefas de estudo categorizadas por Rank (D, C, B, A, S).
     - `links`: Cofre de links e documentações categorizadas.
     - `trainings`: Histórico de treinos e ciclos de Pomodoro concluídos na Sala do Tempo.
3. **Persistência do arquivo `.env` e `supabase-config.js`**:
   - As credenciais podem ser configuradas no arquivo `.env` ou `supabase-config.js`, ou diretamente pelo botão "⚙️ Configurar Chaves Supabase" na tela de login.

---

## 🛠️ Passo a Passo para Configurar o Supabase

### 1. Criar as Tabelas no seu Supabase
1. Acesse o seu projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Na barra lateral esquerda, clique em **SQL Editor**.
3. Abra o arquivo [supabase_schema.sql](file:///c:/Users/valen/Desktop/github/supabase_schema.sql) deste repositório, copie todo o conteúdo e cole no editor do Supabase.
4. Clique em **Run** (Executar). Pronto! Todas as tabelas, permissões de segurança RLS e gatilhos de criação de usuário estão configurados.

### 2. Preencher as Chaves de Conexão
No Supabase, acesse **Project Settings > API**:
- Copie o **Project URL** (ex: `https://xyzsuaempresa.supabase.co`).
- Copie a **Project API Key (anon public)**.

Você pode adicioná-las no seu arquivo `.env`:
```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_publica_aqui
supabase='Y$K46FPpn-RdbHu'
```
Ou no arquivo `supabase-config.js`:
```javascript
window.SUPABASE_CONFIG = {
  url: 'https://SEU_PROJETO.supabase.co',
  anonKey: 'sua_chave_anonima_publica_aqui',
  dbPass: 'Y$K46FPpn-RdbHu'
};
```
*(Você também pode simplesmente abrir a página no navegador e clicar no botão "Configurar Chaves Supabase" para colar as duas chaves diretamente).*

---

## 📚 Funcionalidades de Estudo & Organização

- 📜 **Grimório de Anotações**: Crie, edite, exclua e pesquise anotações salvas em tempo real no banco.
- ⏱️ **Sala do Tempo (Pomodoro)**: 25 min de foco, 5 min de descanso e 15 min de meditação. Ao concluir um treino, o ciclo é gravado na tabela `trainings` e você ganha XP!
- ⚔️ **Missões de Treino**: Adicione tarefas com níveis de dificuldade (Rank D até S) e ganhe pontos para subir de Rank.
- 🔗 **Cofre de Links**: Guarde links de cursos, PDFs e repositórios favoritos.
- 🤝 **Compartilhar com Amigos**:
  - **Link Mágico**: Compartilhe seu conjunto de anotações com amigos através de uma URL compactada.
  - **Backup JSON**: Baixe ou restaure backups das suas anotações.

---

## 🚀 Publicar no GitHub Pages

Para atualizar o seu site no GitHub Pages com todas as novidades:

```bash
git add .
git commit -m "feat: login, autenticacao e integracao completa com banco de dados Supabase"
git push origin main
```

Acesse seu link público:
👉 `https://valentindasilvafaustino.github.io/`

---

*“Vá além! PLUS ULTRA!”* ⚡
