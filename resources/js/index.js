import Vue from "vue";
import ConnectorsListing from "./components/ConnectorsListing";
import { ApiBuilder, CustomModal } from '@bpms-vts/api-connector';

// Bootstrap our Connectors listing
new Vue({
    el: "#process-connectors-listing",
    data: {
        filter: ""
    },
    components: {
        ConnectorsListing,
        ApiBuilder,
        CustomModal,
    },
    methods: {
        deleteConnector(data) {
            ProcessMaker.apiClient.delete(`api_connectors/${data.id}`)
                .then((response) => {
                    ProcessMaker.alert(this.$t("The api connector was deleted."), "success");
                    this.reload();
                });
        },
        reload() {
            this.$refs.listConnector.dataManager([
                {
                    field: "updated_at",
                    direction: "desc"
                }
            ]);
        },
        openApiBuilder() {
            this.$refs.apiBuilderModal.data = null;
            this.$refs.apiBuilderModal.show();
        },
        updateConnector(event) {
            if (typeof event.id === "undefined" || event.id === null) {
                ProcessMaker.apiClient.post('api_connectors', {
                    name: event.name,
                    description: event.description,
                    config: JSON.stringify(event.config),
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
                ProcessMaker.apiClient.put('api_connectors/' + event.id, event)
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
        }
    }
});
