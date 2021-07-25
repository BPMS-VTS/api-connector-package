// Vue and BootstrapVue have been globally imported
import ConnectorsListing from "./components/ConnectorsListing";
import { ApiBuilder, CustomModal } from '@bpms-vts/api-connector';
import apiQueryBuilder from "./mixins/api-query-builder";
import datasourceBuilder from "./mixins/datasource-builder";

new Vue({
    el: "#process-connectors-listing",
    data: {
        filter: "",
    },
    components: { ConnectorsListing, ApiBuilder, CustomModal },
    mixins: [apiQueryBuilder, datasourceBuilder],
    methods: {
        deleteConnector(data) {
            ProcessMaker.apiClient.delete(`api_connectors/${data.id}`)
                .then((response) => {
                    ProcessMaker.alert("The api connector was deleted.", "success");
                    this.reload();
                });
        },
        reload() {
            this.$refs.listConnector.dataManager([{
                field: "updated_at",
                direction: "desc"
            }]);
        },
        openApiBuilder() {
            this.$refs.apiBuilderModal.data = null;
            this.$refs.apiBuilderModal.show();
        },
        async updateConnector(event) {
            const request = await this.buildApiRequest(event.config);
            console.log(request);
            if (typeof event.id === "undefined" || event.id === null) {
                ProcessMaker.apiClient.post('api_connectors', {
                        name: event.name,
                        description: event.description,
                        config: JSON.stringify(event.config),
                        request: JSON.stringify(request),
                        component: event.component,
                    })
                    .then(response => {
                        ProcessMaker.alert("The api connector was created.", 'success');
                        this.$refs.apiBuilderModal.hide();
                        this.reload();
                    })
                    .catch(error => {
                        this.disabled = false;
                        if (error.response.status === 422) {
                            this.errors = error.response.data.errors
                        }
                    });
            } else {
                ProcessMaker.apiClient.put('api_connectors/' + event.id, {
                        name: event.name,
                        description: event.description,
                        config: JSON.stringify(event.config),
                        request: JSON.stringify(request),
                        component: event.component,
                    })
                    .then(response => {
                        ProcessMaker.alert("The api connector was saved.", 'success');
                        this.$refs.apiBuilderModal.hide();
                        this.reload();
                    })
                    .catch(error => {
                        if (error.response.status && error.response.status === 422) {
                            this.errors = error.response.data.errors;
                        }
                    });
            }
        },
    },
});