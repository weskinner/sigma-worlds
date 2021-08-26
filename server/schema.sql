CREATE EXTENSION pgcrypto;

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addr text,
  tag text,
  seed text UNIQUE,
  created_on timestamp without time zone DEFAULT current_timestamp
);

CREATE INDEX idx_reservations_addr ON reservations(addr);

