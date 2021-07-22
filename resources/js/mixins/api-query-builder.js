const { convertArrayToObject } = require("../utils/apiEventMapping");
const { queryBuilder } = require("../utils/constants");

export default {
    methods: {
        filterComponent(items) {
            return items.reduce((result, item) => {
                if (item.rules) return this.filterComponent(item.rules);
                if (typeof item.config === "undefined")
                    return this.filterComponent(item);
                if (typeof item.config.name !== "undefined") {
                    const column = `${item.config.schema}.${item.config.table}.${item.config.name}`;
                    const query = item.config.query;
                    Object.keys(item).forEach(function (key) { delete item[key]; });
                    item.column = column;
                    item.operator = query.operator;
                    item.value = query.value;
                }
                return result;
            }, []);
        },
        async buildApiRequest(config) {
            const structure = config;
            const builder = {};
            builder.method = structure.method;
            builder.name = structure.name;
            builder.type = structure.type;
            if (builder.type === queryBuilder.TYPE) {
                const data = {};
                const options = structure.options.query;
                data.method = builder.method;
                data.table = `${options.database}.${options.table}`;
                // if (options.alias) {
                //     data.table = `${data.table} AS ${options.alias}`
                // }
                // SELECT
                data.select = options.select.reduce(function (result, item) {
                    if (item.config.name) {
                        const query = item.config.query;
                        const column = `${item.config.schema}.${item.config.table}.${item.config.name}`;
                        if (item.config.name !== query.mapping) {
                            result.push(`${column} AS ${query.mapping}`);
                        } else {
                            result.push(column)
                        }
                    }
                    return result;
                }, []);
                // JOIN
                data.join = options.join.reduce(function (result, item) {
                    const query = item.config.query;
                    if (query.type) {
                        const table = `${query.database}.${query.table}`;
                        // if (query.alias) {
                        //     table = `${table} AS ${options.alias}`
                        // }
                        const leftConfig = query.leftCol[0].config;
                        const rightConfig = query.rightCol[0].config;
                        const leftCol = `${leftConfig.schema}.${leftConfig.table}.${leftConfig.name}`;
                        const rightCol = `${rightConfig.schema}.${rightConfig.table}.${rightConfig.name}`;
                        const join = {};
                        join.type = query.type;
                        join.table = table;
                        join.operator = query.operator;
                        join.left = leftCol;
                        join.right = rightCol;
                        result.push(join);
                    }
                    return result;
                }, []);
                // WHERE
                const cloneWhere = _.cloneDeep(options.where);
                await this.filterComponent(cloneWhere.rules);
                data.where = {};
                data.where.condition = cloneWhere.condition;
                data.where.rules = cloneWhere.rules;
                // GROUP BY
                data.groupby = options.groupby.reduce(function (result, item) {
                    if (item.config.name) {
                        const column = `${item.config.schema}.${item.config.table}.${item.config.name}`;
                        result.push(column)
                    }
                    return result;
                }, []);
                // HAVING
                data.having = options.having.reduce(function (result, item) {
                    if (item.config.name) {
                        const column = `${item.config.schema}.${item.config.table}.${item.config.name}`;
                        const query = item.config.query;
                        const having = {};
                        having.column = column;
                        having.operator = query.operator;
                        having.value = query.value;
                        if (query.aggregation) {
                            having.aggregation = query.aggregation.toUpperCase();
                        }
                        result.push(having);
                    }
                    return result;
                }, []);
                // ORDER BY
                data.orderby = options.orderby.reduce(function (result, item) {
                    if (item.config.name) {
                        const column = `${item.config.schema}.${item.config.table}.${item.config.name}`;
                        const query = item.config.query;
                        const orderby = {};
                        orderby.column = column;
                        orderby.direction = query.sort;
                        result.push(orderby)
                    }
                    return result;
                }, []);
                builder.url = queryBuilder.ENDPOINT;
                builder.data = data;
            } else {
                const options = structure.options.restful;
                builder.url = options.endpoint;
                builder.params = convertArrayToObject(options.params);
                builder.auth = convertArrayToObject(options.auth);
                builder.headers = convertArrayToObject(options.headers);
                builder.data = convertArrayToObject(options.body);
            }
            return builder;
        }
    }
}