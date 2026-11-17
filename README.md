# ⚡ Shonen Study Hub — Central de Estudos Multiverso Anime

Uma aplicação web inovadora com estética anime (Dragon Ball, One Piece, Naruto, My Hero Academia), efeitos visuais interativos em tempo real, sintetizador de áudio nativo, gamificação de estudos, gerenciamento de anotações e **compartilhamento instantâneo com amigos via link ou arquivo JSON**.

Pronto para rodar localmente ou ser publicado no **GitHub Pages** em menos de 2 minutos!

---

## 🌟 Efeitos Inovadores & Recursos Visuais

- 🌌 **Motor de Partículas Interativo (HTML5 Canvas)**:
  - **Goku (Dragon Ball)**: Chamas e partículas de Ki douradas subindo pela tela + esferas do dragão reluzentes.
  - **Luffy (One Piece)**: Relâmpagos de Haki do Conquistador vermelho/preto e vapor de Gear 5 / Joy Boy.
  - **Naruto (Shippuden)**: Brasas de chakra da Kurama e névoa azul de Rasengan.
  - **Deku (My Hero Academia)**: Arcos elétricos esmeralda e ciano de *One For All: Full Cowl*.
  - **Multiverso Shonen**: Partículas cósmicas que interagem com o movimento do mouse.
- 🔮 **Glassmorphism & Cyber Neon HUD**: Painéis de vidro translúcido com desfoque (*backdrop-filter*), contornos brilhantes adaptativos e grade cibernética.
- 🎴 **Efeito 3D Tilt**: Os cartões de anotações reagem à posição do cursor com rotação tridimensional física suave.
- 🎵 **Sintetizador Web Audio API NATIVO**:
  - Efeitos sonoros futuristas para cliques, subida de nível (*Level Up*), sino da Sala do Tempo e golpes de Ki.
  - Gerador de frequências sonoras ambientes (*Ondas Alpha para foco profundo, Chuva de Konoha e Aura Cósmica*), **sem depender de arquivos externos ou falhas de carregamento**.

---

## 📚 Funcionalidades de Estudo & Organização

1. **Grimório de Anotações**:
   - Crie, edite, organize por matéria (Programação, Matemática, Idiomas, Ciências, Humanas, etc.) e adicione tags.
   - Campo de busca instantânea em tempo real.
   - Botão de cópia rápida formatada em Markdown para o Discord ou editor de texto.
2. **Sala do Tempo (Pomodoro Shonen)**:
   - Temporizador de 25 min (Foco Intenso), 5 min (Descanso Curto) e 15 min (Meditação).
   - Anel de progresso circular dinâmico em SVG.
   - Atualização do título da aba do navegador com contagem regressiva.
3. **Missões de Treino & Gamificação (XP & Ranks)**:
   - Adicione tarefas com níveis de dificuldade (Rank D, C, B, A e S).
   - Ganhe XP ao concluir tarefas e anotações.
   - Suba de patente: de *Guerreiro Novato* até *Hokage Lendário / Símbolo da Paz*.
4. **Cofre de Links de Estudo**:
   - Guarde links para documentações, videoaulas, livros e ferramentas com ícones automáticos.

---

## 🤝 Como Guardar suas Coisas & Partilhar com Amigos

### 1. Salvamento Automático
Todas as suas anotações, tarefas, links, XP e configurações são **salvas automaticamente no navegador** via `localStorage`. Mesmo se fechar o navegador ou desligar o PC, tudo estará lá quando voltar!

### 2. Gerar Link Mágico para Amigos
1. Clique no botão **"Compartilhar"** no topo da página.
2. Na opção 1, clique em **"Gerar Link"** e depois em **"Copiar"**.
3. Envie esse link no WhatsApp, Discord ou Telegram para seu amigo.
4. Quando seu amigo abrir o link, o sistema detectará o pacote de estudos e perguntará se ele deseja importar suas anotações e recursos com apenas 1 clique!

### 3. Backup em Arquivo JSON
1. No menu de compartilhamento, clique em **"Baixar Dados (JSON)"** para salvar um arquivo no seu computador.
2. Para restaurar ou importar as anotações de um amigo que te enviou o arquivo, basta clicar em **"Importar Arquivo JSON"**.

---

## 🚀 Como Colocar no GitHub e Ativar o GitHub Pages (Passo a Passo)

Você pode publicar esta página gratuitamente para que você e seus amigos acessem de qualquer computador, tablet ou celular:

### Passo 1: Criar um Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê um nome ao repositório, por exemplo: `shonen-study-hub`.
3. Deixe o repositório como **Public** e clique em **Create repository**.

### Passo 2: Enviar os Arquivos
No terminal da pasta do projeto, execute os seguintes comandos:

```bash
git init
git add .
git commit -m "feat: shonen study hub completo com temas anime e efeitos inovadores"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/shonen-study-hub.git
git push -u origin main
```

*(Substitua `SEU_USUARIO` pelo seu usuário do GitHub).*

### Passo 3: Ativar o GitHub Pages
1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. Na barra lateral esquerda, clique em **Pages**.
3. Em **Build and deployment > Branch**, selecione a branch `main` e a pasta `/ (root)`.
4. Clique em **Save**.
5. Em cerca de 1 a 2 minutos, o GitHub exibirá o link público do seu site:  
   👉 `https://SEU_USUARIO.github.io/shonen-study-hub/`

Agora você e seus amigos podem acessar de onde quiserem!

---

## 📂 Estrutura de Arquivos

```text
├── index.html        # Estrutura semântica e interface da aplicação
├── style.css         # Estilização Glassmorphism, temas anime, animações e responsividade
├── app.js            # Motor de partículas, áudio nativo, gamificação, compartilhamento e storage
└── README.md         # Documentação e guia de publicação
```

---

*“Vá além! PLUS ULTRA!”* ⚡
