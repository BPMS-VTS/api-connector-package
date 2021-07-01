import Vue from 'vue';
import ScreenBuilder from './screen';
import Vuex from 'vuex';
import ApiConnector from '@bpms-vts/api-connector';

Vue.use(ApiConnector);
Vue.use(Vuex);
const store = new Vuex.Store({ modules: {} });

// Bootstrap our Designer application
new Vue({
    store,
    el: '#screen-container',
    components: { ScreenBuilder }
});
