import datatableMixin from "../components/common/mixins/datatable";
import dataLoadingMixin from "../components/common/mixins/apiDataLoading";
import datasourceBuilder from "../mixins/datasource-builder";
import { ApiBuilder, ApiConfiguration, CustomModal } from '@bpms-vts/api-connector';

export default {
    template: `
        <div id="api-connector-modal">
            <custom-modal title="API Configuration" id="api-configuration-modal" ref="apiConfigurationModal">
                <template slot-scope="{ data }">
                    <api-configuration
                        :screen="config"
                        :config="apiConfiguration"
                        :datasource="data"
                        @filter="reload($event)"
                        @open-edit="openApiBuilderModal($event)"
                    ></api-configuration>
                </template>
            </custom-modal>
            <custom-modal title="API Builder" id="api-builder-modal" ref="apiBuilderModal">
                <template slot-scope="{ data }">
                    <api-builder
                        :data="data"
                        :datasource="datasource"
                        :filter="datasourceFilter"
                        @update="updateConnector"
                    ></api-builder>
                </template>
            </custom-modal>
        </div>
    `,
    components: { ApiBuilder, ApiConfiguration, CustomModal },
    mixins: [datatableMixin, dataLoadingMixin, datasourceBuilder],
    data() {
        return {
            optionMenu: {
                id: "button_connector",
                type: "button",
                title: "API Connector",
                name: "Connector",
                variant: "secondary",
                icon: "fas fa-database",
                action: () => { apiConnectorModals.openApiConfigurationModal() }
            },
            apiConfiguration: [],
            filter: "",
            builder: null,
        }
    },
    watch: {
        builder: {
            handler: function(builder) {
                this.builder = builder;
                this.apiConfiguration = this.apiConfig;
            },
        }
    },
    computed: {
        apiConfig() {
            const config = this.builder.screen.api_config;
            return config ? config : [];
        },
        config() {
            const config = _.cloneDeep(this.builder.config);
            this.builder.computed.forEach((el) => {
                config[0].items.splice(0, 0, this.convertComputedToComponent(el));
            })
            return config;
        },
        screen() {
            return this.builder.screen;
        }
    },
    methods: {
        convertComputedToComponent(computed) {
            const template = {
                component: 'FormDataVariable',
                config: {
                    icon: "fas fa-flask",
                    label: computed.name,
                    name: computed.property,
                    readonly: true,
                },
                inspector: [],
                'editor-component': "FormComputedVariable",
                'editor-control': "FormDataVariable",
                label: "Computed Variable"
            }
            return template;
        },
        reload(filter) {
            if (filter) {
                this.filter = filter.name;
            }
            this.dataManager([{
                field: "updated_at",
                direction: "desc"
            }]);
        },
        async filterComponent(items) {
            return items.reduce((a, item) => {
                if (item.items) return this.filterComponent(item.items);
                if (typeof item.config === "undefined")
                    return this.filterComponent(item);
                if (
                    typeof item.config.defaultValue !== "undefined" &&
                    !item.config.defaultValue.value
                )
                    delete item.config.defaultValue;
                return a;
            }, []);
        },
        async updateConnectorConfiguration(exportScreen, onSuccess, onError) {
            await this.filterComponent(this.screen.config);
            ProcessMaker.apiClient
                .put("screens/" + this.screen.id, {
                    title: this.screen.title,
                    description: this.screen.description,
                    type: this.screen.type,
                    config: this.screen.config,
                    api_config: this.apiConfiguration,
                })
                .then(response => {
                    if (exportScreen) {
                        // do nothing
                    }
                    ProcessMaker.alert(this.$t("Successfully saved api configuration"), "success");
                    ProcessMaker.EventBus.$emit("save-changes");
                    if (typeof onSuccess === "function") {
                        onSuccess(response);
                    }
                })
                .catch(err => {
                    if (typeof onError === "function") {
                        onError(err);
                    }
                });

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
            this.perPage = 100;
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
}