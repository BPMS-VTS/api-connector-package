console.log('WELCOME TO THE WORLD')
import ApiConnector from '@bpms-vts/api-connector';
import apiEventMapping from './utils/apiEventMapping';

Vue.use(ApiConnector);

window.ProcessMaker.EventBus.$on("screen-renderer-init", (screen) => {
    window.onload = () => {
        apiEventMapping.setupApiEventMapping(screen);
    }
});