-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  teamnumber VARCHAR(100) PRIMARY KEY,
  teamname VARCHAR(100) NOT NULL
);

-- Create Forms table
CREATE TABLE IF NOT EXISTS forms (
  scoutername VARCHAR(100) NOT NULL,
  matchnumber INT NOT NULL,
  teamnumber VARCHAR(100) NOT NULL,
  auto_balls INT,
  auto_climb BOOLEAN DEFAULT false,
  auto_labels TEXT DEFAULT '',
  teleop_balls INT,
  teleop_climb_level INT DEFAULT 0,
  defence_rating INT DEFAULT 0,
  delivery_rating INT DEFAULT 0,
  teleop_labels TEXT DEFAULT '',
  comments VARCHAR(300),
  PRIMARY KEY (matchnumber, teamnumber),
  FOREIGN KEY (teamnumber) REFERENCES teams(teamnumber) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_forms_teamnumber ON forms(teamnumber);
CREATE INDEX idx_forms_matchnumber ON forms(matchnumber);
CREATE INDEX idx_forms_scoutername ON forms(scoutername);

CREATE TABLE IF NOT EXISTS team_info (
  teamnumber           VARCHAR(100) PRIMARY KEY,
  shooter_type         VARCHAR(20)  DEFAULT 'fixed',
  shooter_width        VARCHAR(20)  DEFAULT 'single',
  shooting_position    VARCHAR(20)  DEFAULT 'fixed',
  statbotics_rank              INT,
  balls_count           INT DEFAULT 0,
  shooting_description TEXT         DEFAULT '',
  delivery_rating      INT          DEFAULT 0,
  defence_rating       INT          DEFAULT 0,
  speed_balance_rating INT          DEFAULT 1,
  advantages           TEXT         DEFAULT '',
  disadvantages        TEXT         DEFAULT '',
  additional_info      TEXT         DEFAULT '',
  FOREIGN KEY (teamnumber) REFERENCES teams(teamnumber) ON DELETE CASCADE
);
