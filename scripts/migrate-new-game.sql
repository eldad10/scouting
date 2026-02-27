-- Drop the old rankings view and forms table
DROP VIEW IF EXISTS rankings;
DROP TABLE IF EXISTS forms;

-- Create the new forms table for ball-scoring game
CREATE TABLE forms (
  scoutername VARCHAR(100),
  matchnumber INT,
  teamnumber VARCHAR(100),

  -- Autonomous period
  auto_balls VARCHAR(10),
  auto_climb BOOLEAN DEFAULT false,
  auto_labels TEXT DEFAULT '',

  -- Teleop period
  teleop_balls VARCHAR(10),
  teleop_climb_level INT DEFAULT 0,
  defence_rating INT DEFAULT 0,
  delivery_rating INT DEFAULT 0,
  teleop_labels TEXT DEFAULT '',

  -- Comments
  comments VARCHAR(300),

  PRIMARY KEY (matchnumber, teamnumber),
  FOREIGN KEY (teamnumber) REFERENCES teams(teamnumber)
);

-- Create the new rankings view with midpoint-based scoring
CREATE OR REPLACE VIEW rankings AS
SELECT
  teamnumber,

  -- Auto points average
  ROUND(AVG(
    CASE auto_balls
      WHEN '0-5' THEN 2.5 WHEN '5-10' THEN 7.5 WHEN '10-15' THEN 12.5
      WHEN '15-20' THEN 17.5 WHEN '20+' THEN 22.5 ELSE 0
    END + CASE WHEN auto_climb THEN 15 ELSE 0 END
  )::numeric, 3) AS auto_points,

  -- Teleop points average
  ROUND(AVG(
    CASE teleop_balls
      WHEN '0-10' THEN 5 WHEN '10-20' THEN 15 WHEN '20-40' THEN 30
      WHEN '40-60' THEN 50 WHEN '60-80' THEN 70 WHEN '80-100' THEN 90 WHEN '100+' THEN 110 ELSE 0
    END +
    CASE teleop_climb_level WHEN 1 THEN 10 WHEN 2 THEN 20 WHEN 3 THEN 30 ELSE 0 END
  )::numeric, 3) AS teleop_points,

  -- Climb points average (auto + teleop)
  ROUND(AVG(
    CASE WHEN auto_climb THEN 15 ELSE 0 END +
    CASE teleop_climb_level WHEN 1 THEN 10 WHEN 2 THEN 20 WHEN 3 THEN 30 ELSE 0 END
  )::numeric, 3) AS climb_points,

  -- Defence average
  ROUND(AVG(defence_rating)::numeric, 3) AS avg_defence,

  -- Delivery average
  ROUND(AVG(delivery_rating)::numeric, 3) AS avg_delivery,

  -- Overall points (auto + teleop scoring)
  ROUND(AVG(
    CASE auto_balls
      WHEN '0-5' THEN 2.5 WHEN '5-10' THEN 7.5 WHEN '10-15' THEN 12.5
      WHEN '15-20' THEN 17.5 WHEN '20+' THEN 22.5 ELSE 0
    END + CASE WHEN auto_climb THEN 15 ELSE 0 END +
    CASE teleop_balls
      WHEN '0-10' THEN 5 WHEN '10-20' THEN 15 WHEN '20-40' THEN 30
      WHEN '40-60' THEN 50 WHEN '60-80' THEN 70 WHEN '80-100' THEN 90 WHEN '100+' THEN 110 ELSE 0
    END +
    CASE teleop_climb_level WHEN 1 THEN 10 WHEN 2 THEN 20 WHEN 3 THEN 30 ELSE 0 END
  )::numeric, 3) AS overall_points

FROM forms
GROUP BY teamnumber;
