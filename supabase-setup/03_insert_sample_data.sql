-- Seed demo teams
INSERT INTO teams (teamnumber, teamname) VALUES
  ('254',  'The Cheesy Poofs'),
  ('1114', 'Simbotics'),
  ('2056', 'OP Robotics'),
  ('1678', 'Citrus Circuits'),
  ('3310', 'Black Hawk Robotics'),
  ('6328', 'Mechanical Advantage'),
  ('4414', 'HighTide'),
  ('7407', 'Steel Hawks')
ON CONFLICT (teamnumber) DO NOTHING;

-- Seed forms (auto_balls and teleop_balls are exact integers)
INSERT INTO forms (scoutername, matchnumber, teamnumber, auto_balls, auto_climb, auto_labels, teleop_balls, teleop_climb_level, defence_rating, delivery_rating, teleop_labels, comments) VALUES
  ('Alice',  1, '254',  18, true,  'Crossed to middle of field,Collected from depot',           72,  3, 4, 5, 'Collects balls very fast,Fast climb',            'Excellent auto performance'),
  ('Bob',    2, '254',  22, true,  'Crossed to middle of field',                                91,  3, 3, 4, 'Played very good defence,Fast climb',            'Dominated the field'),
  ('Alice',  3, '254',  17, false, '',                                                          68,  2, 5, 5, 'Played very good defence,Experienced in defence', 'Great defence game'),
  ('Carol',  1, '1114', 12, true,  'Collected from human player,Crossed to middle of field',    47,  3, 2, 3, 'Fast climb',                                     'Solid auto, good climb'),
  ('Carol',  2, '1114', 16, true,  'Crossed to middle of field',                                65,  3, 3, 4, 'Collects balls very fast,Fast climb',            'Improving each match'),
  ('Dan',    3, '1114', 11, false, 'Robot not working in auto',                                 43,  2, 2, 3, 'Robot had issues - limited play',                 'Auto issues this match'),
  ('Eve',    1, '2056', 13, false, 'Collected from depot',                                      45,  2, 5, 2, 'Played very good defence,Experienced in defence', 'Defence specialist'),
  ('Eve',    2, '2056',  7, false, '',                                                          25,  1, 5, 1, 'Played very good defence,Experienced in defence', 'Heavy defence robot'),
  ('Frank',  3, '2056', 12, true,  'Crossed to middle of field',                                44,  2, 4, 2, 'Experienced in defence,Fast climb',               'Good mix this game'),
  ('Grace',  1, '1678', 17, true,  'Crossed to middle of field,Collected from human player',    88,  3, 1, 5, 'Collects balls very fast',                        'Scoring machine'),
  ('Grace',  2, '1678', 21, true,  'Crossed to middle of field',                                105, 3, 0, 5, 'Collects balls very fast,Misses a lot of shots',  'Record-breaking teleop'),
  ('Henry',  3, '1678', 18, true,  'Crossed to middle of field',                                86,  3, 1, 4, 'Collects balls very fast',                        'Consistent top scorer'),
  ('Iris',   1, '3310',  7, false, '',                                                          28,  1, 3, 2, 'Struggles with defence',                          'Learning curve'),
  ('Iris',   2, '3310', 11, false, 'Collected from depot',                                      44,  2, 3, 3, '',                                                'Improved significantly'),
  ('Jake',   3, '3310', 12, true,  'Crossed to middle of field',                                48,  2, 4, 3, 'Interfered with team robot',                      'Good improvement'),
  ('Kate',   1, '6328', 13, true,  'Collected from human player',                               66,  3, 2, 4, 'Collects balls very fast,Fast climb',             ''),
  ('Kate',   2, '6328', 16, true,  'Crossed to middle of field,Collected from human player',    84,  3, 2, 5, 'Collects balls very fast',                        'Very fast collector'),
  ('Leo',    3, '6328', 12, false, '',                                                          63,  2, 1, 4, '',                                                ''),
  ('Mia',    1, '4414',  3, false, 'Robot not working in auto',                                 22,  0, 4, 1, 'Played very good defence,Experienced in defence', 'Defence-focused robot'),
  ('Mia',    2, '4414',  6, false, '',                                                          24,  1, 5, 2, 'Played very good defence',                        ''),
  ('Noah',   3, '4414',  2, false, 'Robot not working in auto',                                 14,  0, 5, 1, 'Played very good defence,Experienced in defence', 'Pure defence specialist'),
  ('Olivia', 1, '7407',  6, false, 'Interfered with other robot',                               16,  1, 2, 2, 'Robot had issues - limited play',                 'Struggled with interference'),
  ('Olivia', 2, '7407', 11, false, '',                                                          27,  1, 2, 3, '',                                                ''),
  ('Paul',   3, '7407', 12, true,  'Collected from depot',                                      42,  2, 3, 3, '',                                                'Best match yet')
ON CONFLICT (matchnumber, teamnumber) DO NOTHING;

-- Seed robot scouting cards (team_info)
INSERT INTO team_info (teamnumber, shooter_type, shooter_width, shooting_position, shooting_description, delivery_rating, defence_rating, speed_balance_rating, advantages, disadvantages, additional_info) VALUES
  ('254',  'turret', 'wide',   'all_around', 'High-speed turret with wide intake. Can shoot from anywhere on the field with exceptional accuracy.',        5, 4, 5, 'Incredible accuracy, fast cycle time, strong climb',     'Vulnerable when defence targets the intake',         'One of the top teams globally. Protect them.'),
  ('1114', 'fixed',  'double', 'fixed',      'Fixed shooter at the substation zone. Double-wide intake allows rapid ball collection.',                    4, 3, 4, 'Very consistent scoring, reliable auto, strong climb',   'Struggles when pushed off preferred shooting spot',  'Strong alliance partner. Reliable in all phases.'),
  ('2056', 'fixed',  'single', 'fixed',      'Primarily a defence robot with a modest fixed shooter for opportunistic scoring.',                          2, 5, 5, 'Exceptional defence, fast and very hard to push',        'Low scoring output when not playing defence',        'Best used as a defence bot. Do not rely on scoring.'),
  ('1678', 'turret', 'wide',   'all_around', 'Top-tier turret shooter with wide collection. Highest scoring team in the competition.',                    5, 1, 4, 'Highest teleop output, excellent auto, consistent climb', 'Almost no defence capability',                       'Pure scorer. Pair with a defence partner.'),
  ('3310', 'fixed',  'single', 'fixed',      'Mid-range fixed shooter still developing consistency. Improving match over match.',                         3, 4, 3, 'Improving consistency, decent defence',                  'Auto reliability issues, lower ball count',          'Developing team with upside in later matches.'),
  ('6328', 'turret', 'double', 'all_around', 'Strong turret with double intake. Second-tier scorer with reliable climb.',                                 4, 2, 4, 'Fast intake, good climb, versatile positioning',         'Can be disrupted by heavy defence',                  'Reliable alliance partner. Good backup scorer.'),
  ('4414', 'fixed',  'single', 'fixed',      'Dedicated defence robot. Rarely shoots, focused entirely on disrupting opponents.',                         1, 5, 5, 'Dominant defence, very hard to push, fast',              'Near-zero scoring contribution',                     'Use only when you need a full defence robot.'),
  ('7407', 'fixed',  'single', 'fixed',      'Developing team with a basic fixed shooter. Has shown improvement across matches.',                         2, 2, 3, 'Improving each match, solid climb by match 3',           'Interference issues early, lower ball count',         'Monitor progress. May be reliable in later rounds.')
ON CONFLICT (teamnumber) DO NOTHING;