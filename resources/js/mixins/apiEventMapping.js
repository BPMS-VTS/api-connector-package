export default {
    methods: {
        convertArrayToObject(list) {
            return list.reduce(function (result, item) {
                if (item.key) result[item.key] = item.value;
                return result;
            }, {});
        },
        getVueFromElement(el) {
            while (el) {
                if (el.__vue__) {
                    return el.__vue__
                } else {
                    el = el.parentNode
                }
            }
        },
        requestMapping(request, data) {
            request.forEach((val, index) => {
                const datasource = val.config.datasource;
                let path = datasource.root;
                if (datasource.path) {
                    path = `${datasource.root}.${datasource.path}`;
                    if (datasource.root === 'body') {
                        path = `data.${datasource.path}`;
                    }
                }
                _.set(data, path, this.formData[`${val.config.name}`]);
            });
        },
        responseMapping(response, data) {
            response.forEach((val, index) => {
                const datasource = val.config.datasource;
                let path = datasource.root;
                if (datasource.path) {
                    path = `${datasource.root}.${datasource.path}`;
                }
                this.formData[`${val.config.name}`] = _.get(data, path);
            });
        },
        requestMethodMapping(method, apiClientOptions, config) {
            switch (method) {
                case "GET": {
                    const pagination = config.options.pagination;
                    apiClientOptions.params[pagination.page.alias] = pagination.page.value >= 0 ? pagination.page.value : 1;
                    apiClientOptions.params[pagination.perPage.alias] = pagination.perPage.value >= 0 ? pagination.perPage.value : 10;
                    break;
                }
                default:
                    break;
            }
        },
        setupApiEventMapping() {
            task.screen.api_config.forEach((val) => {
                const api = val.config.api[0];
                const component = val.config.component[0];
                const restfulAPI = api.config.options.restful;
                document.querySelector(`[data-cy="screen-field-${component.config.name}"]`)
                    .addEventListener(val.config.event, () => {
                        const options = {
                            method: api.config.method,
                            url: api.config.options.endpoint,
                            params: this.convertArrayToObject(restfulAPI.param),
                            auth: this.convertArrayToObject(restfulAPI.authorization),
                            headers: this.convertArrayToObject(restfulAPI.header),
                            data: this.convertArrayToObject(restfulAPI.body),
                        }
                        this.requestMethodMapping(api.config.method, options, val.config);
                        this.requestMapping(val.config.options.request, options);
                        ProcessMaker.apiClient(options)
                            .then(response => {
                                this.responseMapping(val.config.options.response, response);
                            })
                            .catch(error => {
                                console.log(error)
                                console.log(error.response)
                                if (error.response.status && error.response.status === 422) {
                                    ProcessMaker.alert(error.response.data.error, "danger");
                                }
                            });
                    });
            });
        },
        removeApiEventMapping() {
            task.screen.api_config.forEach((val) => {
                const component = val.config.component[0];
                document.querySelector(`[data-cy="screen-field-${component.config.name}"]`)
                    .removeEventListener(val.config.event, null);
            });
        },
    },
    created() {
        window.onload = () => {
            this.setupApiEventMapping();
        }
    },
    destroyed() {
        this.removeApiEventMapping();
    },
}