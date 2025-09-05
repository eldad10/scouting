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

    async searchTeam(prefix = null){
        const query = this.queryGenerator(this.searchTeam(prefix));
        this.postgresManager.query(query)
    }

    async searchForms(filters = {}) {
        const query = this.queryGenerator(this.searchForms(filters));
        this.postgresManager.query(query)
    }

    async rankTeams(rankField = 'overall_points') {
        const query = this.queryGenerator(this.rankTeams(rankField));
        this.postgresManager.query(query)
    }
}