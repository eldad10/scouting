import { generateInsertForm, generateInsertTeam } from "./queries/insert";
import { searchTeam, searchForms, getRankings  } from "./queries/get";
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