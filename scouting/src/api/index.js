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
    TeamNumber: '2',
    StartPosition: false,
    PassedLine: true,
    L1CoralsAuto: 3,
    L2CoralsAuto: 1,
    L3CoralsAuto: 3,
    L4CoralsAuto: 0,
    NetAuto: 5,
    L1CoralsTele: 1,
    L2CoralsTele: 2,
    L3CoralsTele: 7,
    L4CoralsTele: 2,
    NetTele: 5,
    Processor: 12,
    HighClimb: false,
    LowClimb: true,
    Comments: 'Good match'
    };
    const newTeam = {
    TeamNumber: '2',
    TeamName: 'Blue Rockets'
    };
    await api.insertTeam(newTeam);
    await api.insertForm(formData);
}

start()

