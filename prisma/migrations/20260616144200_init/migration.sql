CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE etymology_type AS ENUM ('prefix', 'root', 'suffix');
CREATE TYPE collection_item_type AS ENUM ('word', 'etymology');

CREATE TABLE etymologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type etymology_type NOT NULL,
  text text NOT NULL,
  meaning text NOT NULL,
  origin text NOT NULL,
  role text NOT NULL DEFAULT '',
  family text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT etymologies_type_text_key UNIQUE (type, text)
);

CREATE TABLE words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_word text NOT NULL,
  total_meaning text NOT NULL,
  etymology_story text NOT NULL,
  related_words text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT words_target_word_key UNIQUE (target_word)
);

CREATE TABLE word_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id uuid NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  etymology_id uuid NOT NULL REFERENCES etymologies(id) ON DELETE RESTRICT,
  sequence integer NOT NULL,
  custom_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT word_segments_word_id_sequence_key UNIQUE (word_id, sequence)
);

CREATE TABLE user_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_type collection_item_type NOT NULL,
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
