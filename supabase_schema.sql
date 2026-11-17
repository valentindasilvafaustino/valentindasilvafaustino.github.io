-- ===================================================================
-- SHONEN STUDY HUB - SCHEMA DO BANCO DE DADOS SUPABASE
-- Execute este script no SQL Editor do seu Dashboard Supabase
-- ===================================================================

-- 1. TABELA DE PERFIS DE USUÁRIOS
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default 'Guerreiro do Conhecimento',
  avatar text default 'goku',
  xp integer default 350,
  streak integer default 1,
  theme text default 'multiverse',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABELA DE ANOTAÇÕES / GRIMÓRIO
create table if not exists public.notes (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  subject text default 'Geral',
  tags text[] default array[]::text[],
  body text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABELA DE MISSÕES / TAREFAS
create table if not exists public.tasks (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  difficulty text default 'C',
  xp integer default 100,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABELA DE COFRE DE LINKS / RECURSOS
create table if not exists public.links (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  category text default 'doc',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TABELA DE SESSÕES DE TREINO (SALA DO TEMPO / POMODORO)
create table if not exists public.trainings (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  mode text not null, -- 'focus', 'short', 'long'
  duration_minutes integer not null,
  xp_earned integer default 0,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ===================================================================
-- SEGURANÇA E POLÍTICAS RLS (Row Level Security)
-- Garante que cada usuário só veja, edite e delete SEUS PRÓPRIOS DADOS
-- ===================================================================

alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.links enable row level security;
alter table public.trainings enable row level security;

-- Políticas para Profiles
drop policy if exists "Perfis são visíveis pelo próprio usuário" on public.profiles;
create policy "Perfis são visíveis pelo próprio usuário" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Usuário pode atualizar seu próprio perfil" on public.profiles;
create policy "Usuário pode atualizar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Usuário pode inserir seu próprio perfil" on public.profiles;
create policy "Usuário pode inserir seu próprio perfil" on public.profiles
  for insert with check (auth.uid() = id);

-- Políticas para Notes (Grimório)
drop policy if exists "Notas visíveis pelo dono" on public.notes;
create policy "Notas visíveis pelo dono" on public.notes
  for select using (auth.uid() = user_id);

drop policy if exists "Notas inseridas pelo dono" on public.notes;
create policy "Notas inseridas pelo dono" on public.notes
  for insert with check (auth.uid() = user_id);

drop policy if exists "Notas atualizadas pelo dono" on public.notes;
create policy "Notas atualizadas pelo dono" on public.notes
  for update using (auth.uid() = user_id);

drop policy if exists "Notas deletadas pelo dono" on public.notes;
create policy "Notas deletadas pelo dono" on public.notes
  for delete using (auth.uid() = user_id);

-- Políticas para Tasks (Missões)
drop policy if exists "Tarefas visíveis pelo dono" on public.tasks;
create policy "Tarefas visíveis pelo dono" on public.tasks
  for select using (auth.uid() = user_id);

drop policy if exists "Tarefas inseridas pelo dono" on public.tasks;
create policy "Tarefas inseridas pelo dono" on public.tasks
  for insert with check (auth.uid() = user_id);

drop policy if exists "Tarefas atualizadas pelo dono" on public.tasks;
create policy "Tarefas atualizadas pelo dono" on public.tasks
  for update using (auth.uid() = user_id);

drop policy if exists "Tarefas deletadas pelo dono" on public.tasks;
create policy "Tarefas deletadas pelo dono" on public.tasks
  for delete using (auth.uid() = user_id);

-- Políticas para Links (Cofre)
drop policy if exists "Links visíveis pelo dono" on public.links;
create policy "Links visíveis pelo dono" on public.links
  for select using (auth.uid() = user_id);

drop policy if exists "Links inseridos pelo dono" on public.links;
create policy "Links inseridos pelo dono" on public.links
  for insert with check (auth.uid() = user_id);

drop policy if exists "Links deletados pelo dono" on public.links;
create policy "Links deletados pelo dono" on public.links
  for delete using (auth.uid() = user_id);

-- Políticas para Trainings (Treinos)
drop policy if exists "Treinos visíveis pelo dono" on public.trainings;
create policy "Treinos visíveis pelo dono" on public.trainings
  for select using (auth.uid() = user_id);

drop policy if exists "Treinos inseridos pelo dono" on public.trainings;
create policy "Treinos inseridos pelo dono" on public.trainings
  for insert with check (auth.uid() = user_id);

-- ===================================================================
-- TRIGGER AUTOMÁTICO PARA CRIAR PERFIL AO SE CADASTRAR
-- ===================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar, xp, streak, theme)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Guerreiro Z'),
    coalesce(new.raw_user_meta_data->>'avatar', 'goku'),
    350,
    1,
    'multiverse'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
