-- Create Rankings View
-- This view automatically calculates team statistics from all form submissions
CREATE OR REPLACE VIEW rankings AS
SELECT
  f.teamnumber,
  COALESCE(t.teamname, f.teamnumber) as teamname,
  -- Auto phase average
  ROUND(AVG(f.auto_balls + 
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END
  )::numeric, 3) AS auto_points,
  
  -- Teleop phase average
  ROUND(AVG(f.teleop_balls +
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
  ROUND(AVG( f.auto_balls + 
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END +
f.teleop_balls +
    CASE f.teleop_climb_level 
      WHEN 1 THEN 10 
      WHEN 2 THEN 20 
      WHEN 3 THEN 30 
      ELSE 0 
    END
  )::numeric, 3) AS overall_points,
  
  -- Row count (number of matches scouted)
  COUNT(f.matchnumber) AS match_count,
  
  -- Rank based on overall_points
  ROW_NUMBER() OVER (ORDER BY ROUND(AVG( f.auto_balls + 
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END + f.teleop_balls +
    CASE f.teleop_climb_level 
      WHEN 1 THEN 10 
      WHEN 2 THEN 20 
      WHEN 3 THEN 30 
      ELSE 0 
    END
  )::numeric, 3) DESC) AS rank
FROM forms f
LEFT JOIN teams t ON f.teamnumber = t.teamnumber
GROUP BY f.teamnumber, t.teamname
ORDER BY overall_points DESC;

-- Grant permissions
-- GRANT SELECT ON rankings TO authenticated;
-- GRANT SELECT ON rankings TO anon;
