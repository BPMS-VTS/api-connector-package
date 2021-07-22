window.ProcessMaker.EventBus.$on("screen-renderer-init", (screen) => {
    if (screen.$root.$el.id === 'task') {
        const { setupApiEventMapping } = require("./utils/apiEventMapping");

        const domEventLevel = ["load", "unload"];
        const componentType = ["FormHtmlDocument"];
        const apiConfiguration = task.screen.api_config;

        apiConfiguration.forEach((val) => {
            const event = val.config.event;
            const component = val.config.component[0];

            if (typeof component === "undefined" || event === null) return;

            if (domEventLevel.includes(event) && componentType.includes(component["editor-control"])) {
                window.addEventListener(event, () => setupApiEventMapping(val, screen), false);
            } else {
                document.addEventListener('readystatechange', () => {
                    const selector = `[data-cy="screen-field-${component.config.name}"]`;
                    const dom = document.querySelector(selector);
                    dom.addEventListener(event, (e) => {
                        setupApiEventMapping(val, screen);
                        e.stopPropagation();
                    }, false);
                })
            }
        });
    }
});
