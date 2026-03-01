-- Create Rankings View
-- This view automatically calculates team statistics from all form submissions
CREATE OR REPLACE VIEW rankings AS
SELECT
  f.teamnumber,
  COALESCE(t.TeamName, f.teamnumber) as teamname,
  -- Auto phase average
  ROUND(AVG(
    CASE f.auto_balls
      WHEN '0-5' THEN 2.5 
      WHEN '5-10' THEN 7.5 
      WHEN '10-15' THEN 12.5
      WHEN '15-20' THEN 17.5 
      WHEN '20+' THEN 22.5 
      ELSE 0
    END + 
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END
  )::numeric, 3) AS auto_points,
  
  -- Teleop phase average
  ROUND(AVG(
    CASE f.teleop_balls
      WHEN '0-10' THEN 5 
      WHEN '10-20' THEN 15 
      WHEN '20-40' THEN 30
      WHEN '40-60' THEN 50 
      WHEN '60-80' THEN 70 
      WHEN '80-100' THEN 90 
      WHEN '100+' THEN 110 
      ELSE 0
    END +
    CASE f.teleop_climb_level 
      WHEN 1 THEN 10 
      WHEN 2 THEN 20 
      WHEN 3 THEN 30 
      ELSE 0 
    END
  )::numeric, 3) AS teleop_points,
  
  -- Climb phase average
  ROUND(AVG(
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END +
    CASE f.teleop_climb_level 
      WHEN 1 THEN 10 
      WHEN 2 THEN 20 
      WHEN 3 THEN 30 
      ELSE 0 
    END
  )::numeric, 3) AS climb_points,
  
  -- Defence and delivery averages
  ROUND(AVG(f.defence_rating)::numeric, 3) AS avg_defence,
  ROUND(AVG(f.delivery_rating)::numeric, 3) AS avg_delivery,
  
  -- Overall total average
  ROUND(AVG(
    CASE f.auto_balls
      WHEN '0-5' THEN 2.5 
      WHEN '5-10' THEN 7.5 
      WHEN '10-15' THEN 12.5
      WHEN '15-20' THEN 17.5 
      WHEN '20+' THEN 22.5 
      ELSE 0
    END + 
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END +
    CASE f.teleop_balls
      WHEN '0-10' THEN 5 
      WHEN '10-20' THEN 15 
      WHEN '20-40' THEN 30
      WHEN '40-60' THEN 50 
      WHEN '60-80' THEN 70 
      WHEN '80-100' THEN 90 
      WHEN '100+' THEN 110 
      ELSE 0
    END +
    CASE f.teleop_climb_level 
      WHEN 1 THEN 10 
      WHEN 2 THEN 20 
      WHEN 3 THEN 30 
      ELSE 0 
    END
  )::numeric, 3) AS overall_points,
  
  -- Row count (number of matches scouted)
  COUNT(f.matchnumber) AS match_count
FROM forms f
LEFT JOIN Teams t ON f.teamnumber = t.TeamNumber
GROUP BY f.teamnumber, t.TeamName
ORDER BY overall_points DESC;

-- Grant permissions
-- GRANT SELECT ON rankings TO authenticated;
-- GRANT SELECT ON rankings TO anon;

PRINT('✓ Rankings view created successfully!');
