-- INSERT SAMPLE DATA (OPTIONAL)
-- Run this script to populate the database with test data
-- Useful for testing the app before real scouting begins

-- Insert sample teams
INSERT INTO Teams (TeamNumber, TeamName) VALUES
('1234', 'Robotics Team Alpha'),
('5678', 'Engineering Squad Beta'),
('9012', 'Tech Warriors'),
('3456', 'Innovation Crew'),
('7890', 'Coding Masters')
ON CONFLICT (TeamNumber) DO NOTHING;

-- Insert sample match data
INSERT INTO forms (scoutername, matchnumber, teamnumber, auto_balls, auto_climb, auto_labels, teleop_balls, teleop_climb_level, defence_rating, delivery_rating, teleop_labels, comments)
VALUES
-- Team 1234
('Alex Johnson', 1, '1234', '5-10', true, 'Crossed to middle of field,Collected from depot', '20-40', 2, 4, 3, 'Played very good defence,Fast climb', 'Good overall performance'),
('Sarah Chen', 2, '1234', '10-15', true, 'Collected from human player', '40-60', 3, 5, 4, 'Experienced in defence,Collects balls very fast', 'Excellent match'),
('Mike Davis', 3, '1234', '0-5', false, 'Robot not working in auto', '10-20', 0, 2, 2, 'Robot had issues - limited play', 'Need to debug auto mode'),

-- Team 5678
('Emma Wilson', 1, '5678', '10-15', true, 'Crossed to middle of field', '20-40', 1, 3, 4, 'Collects balls very fast', 'Solid performance'),
('James Lee', 2, '5678', '5-10', false, '', '30-40', 2, 4, 3, 'Good climbing ability', 'Auto needs work'),
('Priya Patel', 3, '5678', '15-20', true, 'Collected from human player,Collected from depot', '60-80', 3, 5, 5, 'Played very good defence,Experienced in defence', 'Outstanding match!'),

-- Team 9012
('Chris Brown', 1, '9012', '0-5', false, 'Robot not working in auto', '10-20', 0, 1, 1, 'Robot had issues - limited play', 'Major issues with motor'),
('Lisa Garcia', 2, '9012', '5-10', true, 'Interfered with other robot', '20-40', 1, 2, 2, 'Misses a lot of shots', 'Needs accuracy improvement'),
('David Martinez', 3, '9012', '10-15', true, 'Crossed to middle of field', '40-60', 2, 3, 3, 'Fast climb', 'Better performance this match'),

-- Team 3456
('Sophie Turner', 1, '3456', '15-20', true, 'Collected from depot', '40-60', 2, 4, 4, 'Played very good defence,Fast climb', 'Great match'),
('Ryan Anderson', 2, '3456', '10-15', true, 'Crossed to middle of field,Collected from human player', '30-40', 2, 3, 3, 'Collects balls very fast', 'Good consistency'),
('Olivia White', 3, '3456', '5-10', false, 'Interfered with other robot', '20-40', 1, 2, 2, 'Struggles with defence', 'Defensive struggles continue'),

-- Team 7890
('Nathan Green', 1, '7890', '20+', true, 'Collected from human player,Collected from depot', '80-100', 3, 5, 5, 'Played very good defence,Experienced in defence,Fast climb', 'Dominant performance!'),
('Julia Rodriguez', 2, '7890', '15-20', true, 'Crossed to middle of field', '60-80', 3, 4, 4, 'Experienced in defence', 'Consistent excellence'),
('Kevin Thomas', 3, '7890', '10-15', true, 'Collected from human player', '40-60', 2, 3, 3, 'Fast climb', 'Solid match overall')
ON CONFLICT (matchnumber, teamnumber) DO NOTHING;

PRINT('✓ Sample data inserted successfully!');
PRINT('');
PRINT('TEAMS CREATED:');
PRINT('- 1234: Robotics Team Alpha');
PRINT('- 5678: Engineering Squad Beta');
PRINT('- 9012: Tech Warriors');
PRINT('- 3456: Innovation Crew');
PRINT('- 7890: Coding Masters');
PRINT('');
PRINT('SAMPLE MATCHES: 15 total (3 matches per team)');
PRINT('Ready to test the scouting app!');
