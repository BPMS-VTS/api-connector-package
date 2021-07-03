const screenRendererContainer = document.getElementById('task');

// check if screen renderer container is existed
if (screenRendererContainer) {
    const { setupApiEventMapping } = require('./utils/apiEventMapping');

    window.ProcessMaker.EventBus.$on("screen-renderer-init", (screen) => {
        window.onload = () => {
            if (screen.$root.$el.id === 'task') {
                setupApiEventMapping(screen);
            }
        }
    });
}
