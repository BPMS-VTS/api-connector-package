function convertArrayToObject(list) {
    return list.reduce(function (result, item) {
        if (item.key) result[item.key] = item.value;
        return result;
    }, {});
}

function requestMapping(request, data, screen) {
    request.forEach((val, index) => {
        const datasource = val.config.datasource;
        let path = datasource.root;
        if (datasource.path) {
            path = `${datasource.root}.${datasource.path}`;
            if (datasource.root === 'body') {
                path = `data.${datasource.path}`;
            }
        }
        _.set(data, path, screen.data[`${val.config.name}`]);
    });
}

function responseMapping(response, data, screen) {
    response.forEach((val, index) => {
        const datasource = val.config.datasource;
        let path = datasource.root;
        if (datasource.path) {
            path = `${datasource.root}.${datasource.path}`;
        }
        screen.data[`${val.config.name}`] = _.get(data, path);
    });
}

function requestMethodMapping(method, apiClientOptions, config) {
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
}

export function setupApiEventMapping(screen) {
    task.screen.api_config.forEach((val) => {
        const api = val.config.api[0];
        const component = val.config.component[0];
        const restfulAPI = api.config.options.restful;
        document.querySelector(`[data-cy="screen-field-${component.config.name}"]`)
            .addEventListener(val.config.event, () => {
                const options = {
                    method: api.config.method,
                    url: api.config.options.endpoint,
                    params: convertArrayToObject(restfulAPI.param),
                    auth: convertArrayToObject(restfulAPI.authorization),
                    headers: convertArrayToObject(restfulAPI.header),
                    data: convertArrayToObject(restfulAPI.body),
                }
                requestMethodMapping(api.config.method, options, val.config);
                requestMapping(val.config.options.request, options, screen);
                ProcessMaker.apiClient(options)
                    .then(response => {
                        responseMapping(val.config.options.response, response, screen);
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
}

export function removeApiEventMapping() {
    task.screen.api_config.forEach((val) => {
        const component = val.config.component[0];
        document.querySelector(`[data-cy="screen-field-${component.config.name}"]`)
            .removeEventListener(val.config.event, null);
    });
}
