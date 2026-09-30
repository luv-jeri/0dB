PRAGMA foreign_keys = ON;
CREATE TABLE topics (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, title_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'received', component_url TEXT,
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE reports (
  id TEXT PRIMARY KEY, token_hash TEXT NOT NULL, payload_hash TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('bug','request')), title TEXT NOT NULL,
  description TEXT NOT NULL, email TEXT NOT NULL, contact_hash TEXT NOT NULL, references_json TEXT NOT NULL,
  diagnostics_json TEXT, pins_json TEXT NOT NULL, topic_id TEXT REFERENCES topics(id),
  status TEXT NOT NULL DEFAULT 'received', component_url TEXT,
  issue_number INTEGER, issue_node_id TEXT, issue_url TEXT,
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
  technical_purged INTEGER NOT NULL DEFAULT 0, private_purged INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX reports_topic ON reports(topic_id, contact_hash);
CREATE INDEX reports_created ON reports(created_at DESC);
CREATE TABLE attachments (
  id TEXT NOT NULL, report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, sha256 TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'pending', object_key TEXT NOT NULL,
  PRIMARY KEY(report_id,id)
);
CREATE TABLE outbox (
  id TEXT PRIMARY KEY, report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
  due_at INTEGER NOT NULL, lease_until INTEGER NOT NULL DEFAULT 0, lease_token TEXT,
  last_error TEXT, provider_id TEXT, created_at INTEGER NOT NULL
);
CREATE INDEX outbox_due ON outbox(state, due_at);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE webhook_events (id TEXT PRIMARY KEY, created_at INTEGER NOT NULL);
