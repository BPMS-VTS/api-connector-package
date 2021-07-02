<template>
  <div class="data-table">
    <data-loading
      :for="/api_connectors\?page/"
      v-show="shouldShowLoader"
      :empty="'No Data Available'"
      :empty-desc="''"
      empty-icon="noData"
    />
    <div v-show="!shouldShowLoader" class="card card-body table-card">
      <vuetable
        :dataManager="dataManager"
        :sortOrder="sortOrder"
        :css="css"
        :api-mode="false"
        @vuetable:pagination-data="onPaginationData"
        :fields="fields"
        :data="data"
        data-path="data"
        :noDataTemplate="'No Data Available'"
        pagination-path="meta"
      >
        <template slot="actions" slot-scope="props">
          <div class="actions">
            <div class="popout">
              <b-btn
                variant="link"
                @click="onAction('edit-item', props.rowData, props.rowIndex)"
                v-b-tooltip.hover
                :title="'Edit'"
              >
                <!-- v-if="permission.includes('edit-api_connectors')" -->
                <i class="fas fa-pen-square fa-lg fa-fw"></i>
              </b-btn>
              <b-btn
                variant="link"
                @click="onAction('remove-item', props.rowData, props.rowIndex)"
                v-b-tooltip.hover
                :title="'Delete'"
              >
                <!-- v-if="permission.includes('delete-api_connectors')" -->
                <i class="fas fa-trash-alt fa-lg fa-fw"></i>
              </b-btn>
            </div>
          </div>
        </template>
      </vuetable>
      <pagination
        :single="'Variable'"
        :plural="'Variables'"
        :perPageSelectEnabled="true"
        @changePerPage="changePerPage"
        @vuetable-pagination:change-page="onPageChange"
        ref="pagination"
      ></pagination>
    </div>
  </div>
</template>

<script>
import datatableMixin from "../components/common/mixins/datatable";
import dataLoadingMixin from "../components/common/mixins/apiDataLoading";

export default {
  mixins: [datatableMixin, dataLoadingMixin],
  props: ["filter", "permission"],
  data() {
    return {
      orderBy: "name",
      // Our listing of variables
      sortOrder: [
        {
          field: "name",
          sortField: "name",
          direction: "asc",
        },
      ],
      fields: [
        {
          title: "Name",
          name: "name",
          sortField: "name",
        },
        {
          title: "Description",
          name: "description",
          sortField: "description",
        },
        {
          title: "Modified",
          name: "updated_at",
          sortField: "updated_at",
          callback: "formatDate",
        },
        {
          title: "Created",
          name: "created_at",
          sortField: "created_at",
          callback: "formatDate",
        },
        {
          name: "__slot:actions",
          title: "",
        },
      ],
    };
  },
  methods: {
    onAction(action, data, index) {
      switch (action) {
        case "edit-item":
          if (typeof data.config === "string") {
            const config = JSON.parse(data.config);
            data.config = config;
          }
          this.$parent.$refs.apiBuilderModal.data = data;
          this.$parent.$refs.apiBuilderModal.show();
          break;
        case "remove-item":
          ProcessMaker.confirmModal(
            "Caution!",
            `Are you sure you want to delete the api connector ${data.name} ?`,
            "",
            () => {
              this.$emit("delete", data);
            }
          );
          break;
      }
    },
    fetch() {
      this.loading = true;
      // Load from our api client
      ProcessMaker.apiClient
        .get(
          "api_connectors?page=" +
            this.page +
            "&per_page=" +
            this.perPage +
            "&filter=" +
            this.filter +
            "&order_by=" +
            this.orderBy +
            "&order_direction=" +
            this.orderDirection
        )
        .then((response) => {
          this.data = this.transform(response.data);
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
