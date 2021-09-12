CREATE EXTENSION pgcrypto;

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addr text,
  tag text,
  seed text UNIQUE,
  input_box text UNIQUE,
  processed_txn text UNIQUE,
  unspent_box text UNIQUE,
  created_on timestamp without time zone DEFAULT current_timestamp,
  processed_on timestamp without time zone
);

CREATE INDEX idx_reservations_addr ON reservations(addr);

