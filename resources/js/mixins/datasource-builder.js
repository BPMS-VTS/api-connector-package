export default {
    data() {
        return {
            datasourceFilter: {
                database: null,
                table: null,
            },
            datasource: {
                databases: [],
                tables: [],
                columns: [],
            }
        }
    },
    computed: {
        databaseFilter() {
            return this.datasourceFilter.database;
        },
        tableFilter() {
            return this.datasourceFilter.table;
        }
    },
    watch: {
        databaseFilter: {
            deep: true,
            handler: async function(newVal) {
                if (newVal) {
                    try {
                        const res = await ProcessMaker.apiClient.get(`connections/${newVal}/tables`);
                        this.$set(this.datasource, 'tables', res.data);
                    } catch (error) {
                        this.errors = error.response.data.errors;
                    }
                }
            },
        },
        tableFilter: {
            deep: true,
            handler: async function(newVal) {
                if (newVal) {
                    try {
                        const res = await ProcessMaker.apiClient.get(`connections/${this.databaseFilter}/tables/${newVal}?verbose=1`);
                        this.$set(this.datasource, 'columns', res.data);
                    } catch (error) {
                        this.errors = error.response.data.errors;
                    }
                }
            },
        },
    },
    async created() {
        try {
            const res = await ProcessMaker.apiClient.get("connections");
            this.$set(this.datasource, 'databases', res.data);
        } catch (error) {
            this.errors = error.response.data.errors;
        }
    }
}