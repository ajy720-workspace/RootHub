create extension if not exists "pgcrypto";

create type etymology_type as enum ('prefix', 'root', 'suffix');
create type collection_item_type as enum ('word', 'etymology');

create table if not exists etymologies (
  id uuid primary key default gen_random_uuid(),
  type etymology_type not null,
  text text not null,
  meaning text not null,
  origin text not null,
  role text not null default '',
  family text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (type, text)
);

create table if not exists words (
  id uuid primary key default gen_random_uuid(),
  target_word text unique not null,
  total_meaning text not null,
  etymology_story text not null,
  related_words text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists word_segments (
  id uuid primary key default gen_random_uuid(),
  word_id uuid not null references words(id) on delete cascade,
  etymology_id uuid not null references etymologies(id) on delete restrict,
  sequence int not null,
  custom_text text,
  created_at timestamptz not null default now(),
  unique (word_id, sequence)
);

create table if not exists user_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_type collection_item_type not null,
  item_id uuid not null,
  created_at timestamptz not null default now()
);
