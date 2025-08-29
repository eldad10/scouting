// postgresManager.js
import pkg from 'pg';
import { createTeams, createForms, createRankingView } from './queries/create.js';
const { Pool } = pkg;

export class PostgresManager {
  /**
   * @param {Object} config - PostgreSQL config
   * @param {string} config.user - DB username
   * @param {string} config.host - DB host
   * @param {string} config.database - DB name
   * @param {string} config.password - DB password
   * @param {number} config.port - DB port
   */
  constructor(config) {
    this.config = config;
    this.pool = new Pool(config);
    this.pool.on('error', (err) => {
      console.error('Unexpected Postgres error:', err);
    });
  }

  /** Run a single query */
  async query(text, params = []) {
    try {
      const res = await this.pool.query(text, params);
      return res.rows;
    } catch (err) {
      console.error('Query error:', err);
      throw err;
    }
  }

  async insert(text) {
    const res = await this.pool.insert(text)
  }

  /** Run a transaction with multiple queries */
  async transaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  /** Close all connections */
  async close() {
    await this.pool.end();
  }

  async init(){
    await this.query(createTeams);
    await this.query(createForms);
    await this.query(createRankingView);
  }
}
