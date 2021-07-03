const screenBuilderContainer = document.getElementById('screen-container');

// check if screen builder container is existed
if (screenBuilderContainer) {
    const { default: ApiConnectorModals } = require('./components/ApiConnectorModals');

    //create a placeholder and append it to main screen
    const div = document.createElement('div');
    div.setAttribute('id', 'api-connector-modals');
    document.getElementById('screen-container').appendChild(div);

    // create component and mount it to DOM
    const Modals = Vue.component('apiConnectorModals', ApiConnectorModals);
    const apiConnectorModals = new Modals().$mount('#api-connector-modals');

    window.ProcessMaker.EventBus.$on("screen-builder-start", (builder) => {
        // add to menu
        builder.optionsMenu.find(x => x.id === "group_properties")
            .items.push(apiConnectorModals.optionMenu);
        // mapping datas
        apiConnectorModals.builder = builder
    });


    window.ProcessMaker.EventBus.$on("save-screen", (value, onSuccess, onError) => {
        apiConnectorModals.updateConnectorConfiguration(value, onSuccess, onError);
    });

    // export to global use
    global.apiConnectorModals = apiConnectorModals;
}
