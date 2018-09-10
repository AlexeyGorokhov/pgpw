CREATE TABLE pgpw_test.table_one(
  id uuid PRIMARY KEY,
  data text NOT NULL
);

CREATE TABLE pgpw_test.table_two(
  id uuid PRIMARY KEY,
  one_id uuid NOT NULL REFERENCES pgpw_test.table_one(id),
  data text NOT NULL
);
