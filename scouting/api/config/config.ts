import dotenv from "dotenv";

dotenv.config(); // loads .env into process.env

export class Config {
  private postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };

  constructor() {
    this.postgres = {
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER || "user",
      password: process.env.POSTGRES_PASSWORD || "password",
      database: process.env.POSTGRES_DB || "postgres",
    };
  }

  getPostgres() {
    return this.postgres;
  }
}

export default new Config();
