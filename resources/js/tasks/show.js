import Vue from 'vue';
import Task from '@processmaker/screen-builder';
import TaskView from './components/TaskView';
import AvatarImage from '../components/AvatarImage';
import MonacoEditor from "vue-monaco";
import debounce from 'lodash/debounce';
import Timeline from '../components/Timeline';
import TimelineItem from '../components/TimelineItem';
import _ from "lodash";
import apiEventMapping from '../vendor/api-connector/mixins/apiEventMapping';

Vue.use('task', Task);
Vue.component('task-view', TaskView);
Vue.component('avatar-image', AvatarImage);
Vue.component('monaco-editor', MonacoEditor);
Vue.component('timeline', Timeline);
Vue.component('timeline-item', TimelineItem);
window.debounce = debounce;

new Vue({
    el: "#task",
    mixins: [apiEventMapping],
    data: {
        //Edit data
        fieldsToUpdate: [],
        jsonData: "",
        monacoLargeOptions: {
            automaticLayout: true,
        },
        showJSONEditor: false,

        // Reassignment
        selected: null,
        selectedIndex: -1,
        usersList: [],
        filter: "",
        showReassignment: false,
        task,
        userHasAccessToTask,
        statusCard: "card-header text-capitalize text-white bg-success",
        selectedUser: [],
        hasErrors: false,
        redirectInProcess: false,
        formData: {},
    },
    watch: {
        task: {
            deep: true,
            handler(task, oldTask) {
                window.ProcessMaker.breadcrumbs.taskTitle = task.element_name;
                if (task && oldTask && task.id !== oldTask.id) {
                    history.replaceState(null, null, `/tasks/${task.id}/edit`);
                }
            }
        },
    },
    computed: {
        taskDefinitionConfig() {
            let config = {};
            if (this.task.definition && this.task.definition.config) {
                return JSON.parse(this.task.definition.config);
            }
            return {};
        },
        taskHasComments() {
            const commentsPackage = 'comment-editor' in Vue.options.components;
            let config = {};
            if (commentsPackage && this.task.definition && this.task.definition.config) {
                config = JSON.parse(this.task.definition.config);
            }
            return config;
        },
        dueLabel() {
            const dueLabels = {
                'open': 'Due',
                'completed': 'Completed',
                'overdue': 'Due',
            };
            return dueLabels[this.task.advanceStatus] || '';
        },
        isSelfService() {
            return this.task.process_request.status === 'ACTIVE' && this.task.is_self_service;
        },
        dateDueAt() {
            return this.task.due_at;
        },
        createdAt() {
            return this.task.created_at;
        },
        completedAt() {
            return this.task.completed_at;
        },
        showDueAtDates() {
            return this.task.status !== "CLOSED";
        },
        disabled() {
            return this.selectedUser ? this.selectedUser.length === 0 : true;
        },
        styleDataMonaco() {
            let height = window.innerHeight * 0.55;
            return "height: " + height + "px; border:1px solid gray;";
        }
    },
    methods: {
        escalateToManager() {
            ProcessMaker.confirmModal(
                'Confirm action', 'Are you sure to scale this task?', '', () => {
                    ProcessMaker.apiClient
                        .put("tasks/" + this.task.id, {
                            user_id: '#manager',
                        })
                        .then(response => {
                            this.redirect("/tasks");
                        });
                });
        },
        completed(processRequestId) {
            // avoid redirection if using a customized renderer
            if (this.task.component && this.task.component === 'AdvancedScreenFrame') {
                return;
            }
            // If it is inside a subprocess
            if (this.task.process_request.parent_request_id) {
                this.redirect(`/requests/${this.task.process_request_id}/owner`);
                return;
            }

            this.redirect(`/requests/${processRequestId}`);
        },
        error(processRequestId) {
            this.redirect(`/requests/${this.task.process_request_id}`);
        },
        closed(taskId) {
            // avoid redirection if using a customized renderer
            if (this.task.component && this.task.component === 'AdvancedScreenFrame') {
                return;
            }
            this.redirect("/tasks");
        },
        claimTask() {
            ProcessMaker.apiClient
                .put("tasks/" + this.task.id, {
                    user_id: window.ProcessMaker.user.id,
                    is_self_service: 0,
                })
                .then(response => {
                    window.location.reload();
                });
        },
        // Data editor
        updateRequestData() {
            const data = JSON.parse(this.jsonData);
            ProcessMaker.apiClient
                .put("requests/" + this.task.process_request_id, {
                    data: data,
                    task_element_id: this.task.element_id,
                })
                .then(response => {
                    this.fieldsToUpdate.splice(0);
                    ProcessMaker.alert("{{__('The request data was saved.')}}", "success");
                });
        },
        saveJsonData() {
            try {
                const value = JSON.parse(this.jsonData);
                this.updateRequestData();
            } catch (e) {
                // Invalid data
            }
        },
        editJsonData() {
            this.jsonData = JSON.stringify(this.task.request_data, null, 4);
        },
        // Reassign methods
        show() {
            this.showReassignment = true;
        },
        cancelReassign() {
            this.showReassignment = false;
            this.selectedUser = [];
        },
        reassignUser() {
            if (this.selectedUser) {
                ProcessMaker.apiClient
                    .put("tasks/" + this.task.id, {
                        user_id: this.selectedUser.id
                    })
                    .then(response => {
                        this.showReassignment = false;
                        this.selectedUser = [];
                        this.redirect('/tasks');
                    });
            }
        },
        redirect(to) {
            if (this.redirectInProcess) {
                return;
            }
            this.redirectInProcess = true;
            window.location.href = to;
        },
        assignedUserAvatar(user) {
            return [{
                src: user.avatar,
                name: user.fullname
            }];
        },
        resizeMonaco() {
            let editor = this.$refs.monaco.getMonaco();
            editor.layout({ height: window.innerHeight * 0.65 });
        },
        prepareData() {
            this.updateRequestData = debounce(this.updateRequestData, 1000);
            this.editJsonData();
        },
        updateTask(val) {
            this.$set(this, 'task', val);
        },
        submit(task) {
            if (this.isSelfService) {
                ProcessMaker.alert(this.$t('Claim the Task to continue.'), 'warning');
            } else {
                let message = this.$t('Task Completed Successfully');
                const taskId = task.id;
                ProcessMaker.apiClient
                    .put("tasks/" + taskId, { status: "COMPLETED", data: this.formData })
                    .then(() => {
                        window.ProcessMaker.alert(message, 'success', 5, true);
                    })
                    .catch(error => {
                        // If there are errors, the user will be redirected to the request page
                        // to view error details. This is done in loadTask in Task.vue
                    });
            }

        },
        taskUpdated(task) {
            this.task = task;
        },
    },
    mounted() {
        this.prepareData();
    },
});
