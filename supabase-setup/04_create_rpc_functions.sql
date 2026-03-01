-- RPC Function to get teams with their rank (overall points)
CREATE OR REPLACE FUNCTION get_teams_with_rank1()
RETURNS TABLE (
  teamnumber TEXT,
  teamname TEXT,
  rank NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t."TeamNumber",
    t."TeamName",
    COALESCE(r.overall_points, 0) as rank
  FROM "Teams" t
  LEFT JOIN rankings r ON t."TeamNumber"::TEXT = r.teamnumber::TEXT
  ORDER BY t."TeamNumber" ASC;
END;
$$ LANGUAGE plpgsql;
