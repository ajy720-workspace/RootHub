CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  email_verified timestamptz,
  image text,
  CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE accounts (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  CONSTRAINT accounts_provider_provider_account_id_key UNIQUE (provider, provider_account_id)
);

CREATE TABLE sessions (
  id text PRIMARY KEY,
  session_token text NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires timestamptz NOT NULL,
  CONSTRAINT sessions_session_token_key UNIQUE (session_token)
);

CREATE TABLE verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamptz NOT NULL,
  CONSTRAINT verification_tokens_identifier_token_key UNIQUE (identifier, token)
);

ALTER TABLE user_collections
  ADD CONSTRAINT user_collections_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_collections
  ADD CONSTRAINT user_collections_user_id_item_type_item_id_key
  UNIQUE (user_id, item_type, item_id);
