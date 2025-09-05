//GET TEAMS by prefix
export function searchTeam (prefix){
    return `
    SELECT * FROM Teams
    ${prefix? `WHERE teamnumber LIKE '${prefix}%' OR teamname LIKE '${prefix}%'` : ''}
    `
}

/**
 * Generate a dynamic query to search FORMS
 * @param {Object} filters - { filterTeam, filterMatch, filterName }
 * @returns {string} SQL query
 */
export function searchForms(filters) {
  const conditions = [];

  // Filter by team prefix
  if (filters.filterTeam) {
    const team = filters.filterTeam.replace(/'/g, "''"); // escape single quotes
    conditions.push(`TeamNumber LIKE '${team}%'`);
  }

  // Filter by match number (exact match)
  if (filters.filterMatch) {
    conditions.push(`MatchNumber = ${filters.filterMatch}`);
  }

  // Filter by scouter name prefix
  if (filters.filterName) {
    const name = filters.filterName.replace(/'/g, "''");
    conditions.push(`ScouterName LIKE '${name}%'`);
  }

  // Build the WHERE clause only if there are conditions
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT * FROM FORMS
    ${whereClause};
  `;

  return query;
}

export function getRankings (rankField = 'overall_points'){
  return `
  select Rank() over (ORDER BY ${rankField} DESC) AS rank, teamnumber, overall_points, auto_points, teleop_points, climb_points
  from rankings;
  `
}