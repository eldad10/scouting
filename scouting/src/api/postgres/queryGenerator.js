import { generateInsertForm, generateInsertTeam } from "./queries/insert.js";
import { searchTeam, searchForms, getRankings  } from "./queries/get.js";
export class QueryGenerator{
    insertForm;
    insertTeam;
    getForms;
    getTeams;
    getRankings;

    constructor(){
        this.insertForm = generateInsertForm;
        this.insertTeam = generateInsertTeam;
        this.getForms = searchTeam;
        this.getTeams = searchForms
        this.getRankings = getRankings;
    }
}