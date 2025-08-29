/**
 * Generate an INSERT query for the FORMS table
 * @param {Object} formData - an object with column-value pairs
 * @returns {string} SQL query
 */
export function generateInsertForm(formData) {
  // Ensure required keys exist
  if (!formData.MatchNumber || !formData.TeamNumber) {
    throw new Error('MatchNumber and TeamNumber are required.');
  }

  // Columns are the keys of the object
  const columns = Object.keys(formData);

  // Values need proper formatting based on type
  const values = columns.map((col) => {
    const value = formData[col];

    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'string') {
      // Escape single quotes for SQL
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return value; // numbers
  });

  // Build the query
  const query = `
    INSERT INTO FORMS (${columns.join(', ')})
    VALUES (${values.join(', ')})
    ON CONFLICT (MatchNumber, TeamNumber) DO NOTHING;
  `;

  return query;
}

/**
 * Generate an INSERT query for the Teams table
 * @param {Object} teamData - object with column-value pairs
 * @returns {string} SQL query
 */
export function generateInsertTeam(teamData) {
  // Ensure required key exists
  if (!teamData.TeamNumber) {
    throw new Error('TeamNumber is required.');
  }

  // Columns are the keys of the object
  const columns = Object.keys(teamData);

  // Values need proper formatting
  const values = columns.map((col) => {
    const value = teamData[col];

    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return value; // numbers
  });

  // Build query
  const query = `
    INSERT INTO Teams (${columns.join(', ')})
    VALUES (${values.join(', ')})
    ON CONFLICT (TeamNumber) DO NOTHING;
  `;

  return query;
}

