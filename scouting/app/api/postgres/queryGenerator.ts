import { generateInsertForm, generateInsertTeam } from "./queries/insert";
import { searchTeam, searchForms, getRankings  } from "./queries/get";
class QueryGenerator{
    insertForm;
    insertTeam;
    getForms;
    getTeams;
    getRankings;

    constructor(){
        this.insertForm = generateInsertForm;
        this.insertTeam = generateInsertTeam;
        this.getForms = searchForms;
        this.getTeams = searchTeam
        this.getRankings = getRankings;
    }
}
export default new QueryGenerator();