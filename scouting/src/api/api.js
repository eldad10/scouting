export default class API{
    postgresManager;
    queryGenerator;
    constructor(postgresManager, queryGenerator){
        this.postgresManager = postgresManager;
        this.queryGenerator = queryGenerator;
    }
    // INSERTS
    async insertForm(form){
        const query = this.queryGenerator.insertForm(form);
        this.postgresManager.query(query);
    }

    async insertTeam(team){
        const query = this.queryGenerator.insertTeam(team);
        this.postgresManager.query(query);
    }
}