-- Create Teams table
CREATE TABLE IF NOT EXISTS Teams (
  TeamNumber VARCHAR(100) PRIMARY KEY,
  TeamName VARCHAR(100) NOT NULL
);

-- Create Forms table
CREATE TABLE IF NOT EXISTS forms (
  scoutername VARCHAR(100) NOT NULL,
  matchnumber INT NOT NULL,
  teamnumber VARCHAR(100) NOT NULL,
  auto_balls VARCHAR(10),
  auto_climb BOOLEAN DEFAULT false,
  auto_labels TEXT DEFAULT '',
  teleop_balls VARCHAR(10),
  teleop_climb_level INT DEFAULT 0,
  defence_rating INT DEFAULT 0,
  delivery_rating INT DEFAULT 0,
  teleop_labels TEXT DEFAULT '',
  comments VARCHAR(300),
  PRIMARY KEY (matchnumber, teamnumber),
  FOREIGN KEY (teamnumber) REFERENCES Teams(TeamNumber) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_forms_teamnumber ON forms(teamnumber);
CREATE INDEX idx_forms_matchnumber ON forms(matchnumber);
CREATE INDEX idx_forms_scoutername ON forms(scoutername);

-- Add Row Level Security (optional - for production)
-- ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE Teams ENABLE ROW LEVEL SECURITY;

PRINT('✓ Teams and forms tables created successfully!');
