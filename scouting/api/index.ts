import config from './config/config'
import { PostgresManager } from './postgres/connection'
import { QueryGenerator } from './postgres/queryGenerator';
import API from './api'

console.log("Strting----------------------------------");

const start = async ()=>{
    const manager = new PostgresManager(config.postgres);
    const queryGenerator = new QueryGenerator();
    await manager.init();
    const api =  new API(manager, queryGenerator);
    return api;
}

export default await start()

