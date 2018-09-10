CREATE FUNCTION pgpw_test.get_one_by_id (
  p_id uuid
)
RETURNS TABLE(
  id uuid,
  data text
)
AS $$
BEGIN
  RETURN QUERY
  SELECT t1.id AS id,
         t1.data AS data
    FROM pgpw_test.table_one AS t1
   WHERE t1.id = p_id;
END;
$$ LANGUAGE plpgsql;



CREATE FUNCTION pgpw_test.get_two_by_id (
  p_id uuid
)
RETURNS TABLE(
  id uuid,
  one_id uuid,
  data text
)
AS $$
BEGIN
  RETURN QUERY
  SELECT t2.id AS id,
         t2.one_id AS one_id,
         t2.data AS data
    FROM pgpw_test.table_two AS t2
   WHERE t2.id = p_id;
END;
$$ LANGUAGE plpgsql;





CREATE FUNCTION pgpw_test.add_two(
  p_id uuid,
  p_one_id uuid,
  p_data text
)
RETURNS void
AS $$
BEGIN
  INSERT INTO pgpw_test.table_two (
         id,
         one_id,
         data
         )
  VALUES (
         p_id,
         p_one_id,
         p_data
         );
END;
$$ LANGUAGE plpgsql;
