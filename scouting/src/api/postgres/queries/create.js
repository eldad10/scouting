export const createTeams = `
CREATE TABLE IF NOT EXISTS Teams(
TeamNumber VARCHAR(100) PRIMARY KEY,
TeamName VARCHAR(100)
)
`

export const createForms = `
CREATE TABLE IF NOT EXISTS FORMS(
ScouterName VARCHAR(100),
MatchNumber INT,
TeamNumber VARCHAR(100), 
StartPosition Boolean,
PassedLine Boolean,
L1CoralsAuto INT,
L2CoralsAuto INT,
L3CoralsAuto INT,
L4CoralsAuto INT,
NetAuto INT, 
L1CoralsTele INT,
L2CoralsTele INT,
L3CoralsTele INT,
L4CoralsTele INT,
NetTele INT, 
Processor INT, 
HighClimb boolean,
LowClimb boolean,
Comments VARCHAR(150),
PRIMARY KEY (MatchNumber, TeamNumber),
FOREIGN KEY (TeamNumber) REFERENCES Teams(TeamNumber)
)
`

export const createRankingView = `
create or replace view Rankings as
select
    forms.teamnumber as teamnumber,teamname,

    -- averages of raw fields
    round(avg(cast(passedLine as int)), 3) as avg_passed_line,
    round(avg(cast(L1CoralsAuto as int)), 3) as avg_l1_corals_auto,
    round(avg(cast(L2CoralsAuto as int)), 3) as avg_l2_corals_auto,
    round(avg(cast(L3CoralsAuto as int)), 3) as avg_l3_corals_auto,
    round(avg(cast(L4CoralsAuto as int)), 3) as avg_l4_corals_auto,
    round(avg(cast(NetAuto as int)), 3) as avg_net_auto,

    round(avg(cast(L1CoralsTele as int)), 3) as avg_l1_corals_tele,
    round(avg(cast(L2CoralsTele as int)), 3) as avg_l2_corals_tele,
    round(avg(cast(L3CoralsTele as int)), 3) as avg_l3_corals_tele,
    round(avg(cast(L4CoralsTele as int)), 3) as avg_l4_corals_tele,
    round(avg(cast(NetTele as int)), 3) as avg_net_tele,
    round(avg(cast(Processor as int)), 3) as avg_processor,

    round(avg(cast(HighClimb as int)), 3) as avg_high_climb,
    round(avg(cast(LowClimb as int)), 3) as avg_low_climb,

    round(avg(cast(StartPosition as int)), 3) as avg_start_position,

    -- points totals (built from averages above)
    round(
        (avg(cast(PassedLine as int)) * 2) +
        (avg(cast(L1CoralsAuto as int)) * 3) +
        (avg(cast(L2CoralsAuto as int)) * 4) +
        (avg(cast(L3CoralsAuto as int)) * 6) +
        (avg(cast(L4CoralsAuto as int)) * 7) +
        (avg(cast(NetAuto as int)) * 4), 3
    ) as auto_points,

    round(
        (avg(cast(L1CoralsTele as int)) * 2) +
        (avg(cast(L2CoralsTele as int)) * 3) +
        (avg(cast(L3CoralsTele as int)) * 4) +
        (avg(cast(L4CoralsTele as int)) * 5) +
        (avg(cast(NetTele as int)) * 4) +
        (avg(cast(Processor as int)) * 2), 3
    ) as teleop_points,

    round(
        (avg(cast(HighClimb as int)) * 6) +
        (avg(cast(LowClimb as int)) * 12), 3
    ) as climb_points,

    -- overall = sum of the three category points
    round(
        ((avg(cast(PassedLine as int)) * 2) +
         (avg(cast(L1CoralsAuto as int)) * 3) +
         (avg(cast(L2CoralsAuto as int)) * 4) +
         (avg(cast(L3CoralsAuto as int)) * 6) +
         (avg(cast(L4CoralsAuto as int)) * 7) +
         (avg(cast(NetAuto as int)) * 4)) +

        ((avg(cast(L1CoralsTele as int)) * 2) +
         (avg(cast(L2CoralsTele as int)) * 3) +
         (avg(cast(L3CoralsTele as int)) * 4) +
         (avg(cast(L4CoralsTele as int)) * 5) +
         (avg(cast(NetTele as int)) * 4) +
         (avg(cast(Processor as int)) * 2)) +

        ((avg(cast(HighClimb as int)) * 6) +
         (avg(cast(LowClimb as int)) * 12)), 3
    ) as overall_points

from forms join teams on forms.teamnumber = teams.teamnumber
group by forms.teamnumber, teamname;
`

export const searchTeamFunction = `
create or replace function get_teams_with_rank()
returns table (
  teamname varchar,
  teamnumber varchar,
  rank int
)
language sql
as $$
  select t.teamname, t.teamnumber, r.rank
  from teams t
  join rankings r on r.teamnumber = t.teamnumber;
$$;
`