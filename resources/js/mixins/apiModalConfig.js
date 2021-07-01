import datatableMixin from "../../../components/common/mixins/datatable";
import dataLoadingMixin from "../../../components/common/mixins/apiDataLoading";

export default {
    mixins: [datatableMixin, dataLoadingMixin],
    data() {
        return {
            apiConnectorOptionMenu: {
                id: "button_connector",
                type: "button",
                title: this.$t("API Connector"),
                name: this.$t("Connector"),
                variant: "secondary",
                icon: "fas fa-database",
                action: 'openApiConfigurationModal()'
            },
            apiConfiguration: [],
            filter: "",
        }
    },
    methods: {
        reload(filter) {
            if (filter) {
                this.filter = filter.name;
            }
            this.dataManager([
                {
                    field: "updated_at",
                    direction: "desc"
                }
            ]);
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
        },
        openApiConfigurationModal() {
            this.$refs.apiConfigurationModal.show();
        },
        openApiBuilderModal(event) {
            this.$refs.apiBuilderModal.data = event;
            this.$refs.apiBuilderModal.show();
        },
        fetch() {
            this.loading = true;
            // Load from our api client
            ProcessMaker.apiClient
                .get(
                    "api_connectors?page=" +
                    this.page +
                    "&per_page=" +
                    this.perPage +
                    "&filter=" +
                    this.filter +
                    "&order_by=" +
                    this.orderBy +
                    "&order_direction=" +
                    this.orderDirection
                )
                .then((response) => {
                    this.$refs.apiConfigurationModal.data = this.transform(response.data);
                    this.loading = false;
                });
        }
    },
    created() {
        this.optionsMenu.find(x => x.id === "group_properties").items.push(this.apiConnectorOptionMenu);
    }
}