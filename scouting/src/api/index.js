import config from './config/config.js'
import { PostgresManager } from './postgres/connection.js'
import { QueryGenerator } from './postgres/queryGenerator.js';
import API from './api.js'

console.log("Strting----------------------------------");

const start = async ()=>{
    const manager = new PostgresManager(config.postgres);
    const queryGenerator = new QueryGenerator();
    await manager.init();
    const api =  new API(manager, queryGenerator);
    
    const formData = {
    ScouterName: 'Alice',
    MatchNumber: 1,
    TeamNumber: '1',
    StartPosition: true,
    PassedLine: true,
    L1CoralsAuto: 3,
    L2CoralsAuto: 2,
    L3CoralsAuto: 3,
    L4CoralsAuto: 2,
    NetAuto: 5,
    L1CoralsTele: 3,
    L2CoralsTele: 2,
    L3CoralsTele: 3,
    L4CoralsTele: 2,
    NetTele: 5,
    Processor: 101,
    HighClimb: true,
    LowClimb: false,
    Comments: 'Good match'
    };
    const newTeam = {
    TeamNumber: '1',
    TeamName: 'Red Rockets'
    };
    await api.insertTeam(newTeam);
    await api.insertForm(formData);
}

start()

