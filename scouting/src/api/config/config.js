import fs from 'fs';
import yaml from 'js-yaml';


export class Config {
  postgres;

  /**
   * @param {string} filePath - Path to the YAML config file
   */
  constructor(filePath = './config.yaml') {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const config = yaml.load(fileContents);

      this.postgres = config.postgres;
    } catch (err) {
      console.error('Failed to load config.yaml:', err);
      throw err;
    }
  }
}

export default new Config();
