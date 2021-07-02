import ApiConnector from '@bpms-vts/api-connector';
import { setupApiEventMapping } from './utils/apiEventMapping';

Vue.use(ApiConnector);

window.ProcessMaker.EventBus.$on("screen-renderer-init", (screen) => {
    window.onload = () => {
        if (screen.$root.$el.id === 'task') {
            setupApiEventMapping(screen);
        }
    }
});
