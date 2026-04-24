-- Rankings View
-- auto_balls and teleop_balls are now direct integers — no CASE/WHEN range lookups needed
CREATE OR REPLACE VIEW rankings AS
SELECT
  f.teamnumber,
  COALESCE(t.teamname, f.teamnumber) AS teamname,

  -- Auto phase average (balls + optional auto climb bonus)
  ROUND(AVG(
    f.auto_balls + CASE WHEN f.auto_climb THEN 15 ELSE 0 END
  )::numeric, 3) AS auto_points,

  -- Teleop phase average (balls + climb level bonus)
  ROUND(AVG(
    f.teleop_balls +
    CASE f.teleop_climb_level WHEN 1 THEN 10 WHEN 2 THEN 20 WHEN 3 THEN 30 ELSE 0 END
  )::numeric, 3) AS teleop_points,

  -- Climb phase average
  ROUND(AVG(
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END +
    CASE f.teleop_climb_level WHEN 1 THEN 10 WHEN 2 THEN 20 WHEN 3 THEN 30 ELSE 0 END
  )::numeric, 3) AS climb_points,

  -- Defence and delivery averages
  ROUND(AVG(f.defence_rating)::numeric,  3) AS avg_defence,
  ROUND(AVG(f.delivery_rating)::numeric, 3) AS avg_delivery,

  -- Overall total average
  ROUND(AVG(
    f.auto_balls +
    CASE WHEN f.auto_climb THEN 15 ELSE 0 END +
    f.teleop_balls +
    CASE f.teleop_climb_level WHEN 1 THEN 10 WHEN 2 THEN 20 WHEN 3 THEN 30 ELSE 0 END
  )::numeric, 3) AS overall_points,

  COUNT(f.matchnumber) AS match_count,

  ROW_NUMBER() OVER (
    ORDER BY ROUND(AVG(
      f.auto_balls +
      CASE WHEN f.auto_climb THEN 15 ELSE 0 END +
      f.teleop_balls +
      CASE f.teleop_climb_level WHEN 1 THEN 10 WHEN 2 THEN 20 WHEN 3 THEN 30 ELSE 0 END
    )::numeric, 3) DESC
  ) AS rank

FROM forms f
LEFT JOIN teams t ON f.teamnumber = t.teamnumber
GROUP BY f.teamnumber, t.teamname
ORDER BY overall_points DESC;
