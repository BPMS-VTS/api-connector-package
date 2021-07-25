const Mustache = require('mustache');

export function convertArrayToObject(list) {
    return list.reduce(function(result, item) {
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
            if (datasource.root === "body") {
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
        case "GET":
            {
                const pagination = config.options.pagination;
                apiClientOptions.params[pagination.page.alias] = pagination.page.value >= 0 ? pagination.page.value : 1;
                apiClientOptions.params[pagination.perPage.alias] = pagination.perPage.value >= 0 ? pagination.perPage.value : 10;
                break;
            }
        default:
            break;
    }
}

export function setupApiEventMapping(configuration, screen) {
    const val = configuration;
    const api = val.config.api[0];

    if (typeof api === "undefined") return;
    const optionsRender = Mustache.render(api.request, screen.data);
    const options = JSON.parse(optionsRender);
    // remove unuse data
    delete options.type;
    delete options.name;
    requestMethodMapping(api.request.method, options, val.config);
    requestMapping(val.config.options.request, options, screen);

    ProcessMaker.apiClient(options)
        .then(response => {
            responseMapping(val.config.options.response, response, screen);
        })
        .catch(error => {
            if (error.response.status && error.response.status === 422) {
                ProcessMaker.alert(error.response.data.error, "danger");
            }
        });
}