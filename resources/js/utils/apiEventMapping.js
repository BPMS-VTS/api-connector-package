const Mustache = require('mustache');

export function convertArrayToObject(list) {
    return list.reduce(function (result, item) {
        if (item.key) result[item.key] = item.value;
        return result;
    }, {});
}

function requestMapping(config, options, screen) {
    const request = config.options.request;
    request.forEach((val, index) => {
        const datasource = val.config.datasource;
        let path = datasource.root;
        if (datasource.path) {
            path = `${datasource.root}.${datasource.path}`;
            if (datasource.root === "body") {
                path = `data.${datasource.path}`;
            }
        }
        _.set(options, path, screen.data[`${val.config.name}`]);
    });
}

function responseMapping(config, data, screen) {
    const response = config.options.response;
    response.forEach((val, index) => {
        const datasource = val.config.datasource;
        let path = datasource.root;
        if (datasource.path) {
            path = `${datasource.root}.${datasource.path}`;
        }
        screen.data[`${val.config.name}`] = _.get(data, path);
    });
}

function paginationMapping(config, api) {
    const options = JSON.parse(api.request);
    const method = api.config.options[api.config.type].method;
    if (method === "GET" || method === "SELECT") {
        const pagination = config.options.pagination;
        const page = pagination.page;
        const perPage = pagination.perPage;
        const pageAlias = page.alias || "page";
        const perPageAlias = perPage.alias || "per_page";
        if (typeof options.params === "undefined") options.params = {};
        options.params[pageAlias] = page.value;
        options.params[perPageAlias] = perPage.value;
        api.request = JSON.stringify(options);
    }
}

export function setupApiEventMapping(configuration, screen) {
    const val = configuration;
    const api = val.config.api[0];

    if (typeof api === "undefined") return;
    paginationMapping(val.config, api);
    const optionsRender = Mustache.render(api.request, screen.data);
    const options = JSON.parse(optionsRender);
    // remove unuse data
    delete options.type;
    delete options.name;
    requestMapping(val.config, options, screen);

    ProcessMaker.apiClient(options)
        .then(response => {
            responseMapping(val.config, response, screen);
        })
        .catch(error => {
            if (error.response.status && error.response.status === 422) {
                ProcessMaker.alert(error.response.data.error, "danger");
            }
        });
}