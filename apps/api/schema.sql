CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY, email text UNIQUE NOT NULL, role text NOT NULL CHECK (role IN ('admin','coach','client')),
 password_hash text NOT NULL
);
CREATE TABLE IF NOT EXISTS invitations (
 token_hash text PRIMARY KEY, email text NOT NULL, role text NOT NULL CHECK (role IN ('coach','client')),
 expires_at timestamptz NOT NULL, redeemed_at timestamptz, created_by uuid NOT NULL REFERENCES users
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users, expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS assignments (
 client_id uuid REFERENCES users, coach_id uuid REFERENCES users,
 scope text CHECK (scope IN ('training','nutrition')), PRIMARY KEY(client_id,scope)
);
CREATE TABLE IF NOT EXISTS assessments (
 client_id uuid PRIMARY KEY REFERENCES users, answers jsonb NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor_id uuid REFERENCES users,
 action text NOT NULL, subject_id uuid, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS programme_revisions (
 client_id uuid NOT NULL REFERENCES users,
 revision integer NOT NULL CHECK (revision > 0),
 title text NOT NULL,
 exercises jsonb NOT NULL,
 created_by uuid NOT NULL REFERENCES users,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (client_id, revision)
);
