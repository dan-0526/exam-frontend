<template>
  <div class="table-box" :id="props.id">
      <Table class="table-content" bordered :rowKey="(record) => record[props.rowKey]" :row-selection="rowSelection"
          :pagination="false" :scroll="{ y: props.scrollY || state.scrollY }" :columns="props.columns"
          :loading="state.loading" :data-source="state.tableData" :size="props.size" v-bind="$attrs">
          <template v-slot:headerCell="{ column }">
              <p class="table-title" :class="tableTitleClass(props.columns)">{{ column.title }}</p>
          </template>
          <template v-if="props.isCustomEmpty" v-slot:emptyText>
              <slot name="emptyText"></slot>
          </template>
          <template v-slot:bodyCell="{ column, record, index }">
              <template v-for="slotName of props.slots">
                  <slot v-if="slotName === column?.dataIndex && column?.dataIndex !== 'index'" :name="slotName"
                      :column="column" :record="record" :index="index"></slot>
              </template>
              <span v-if="column && column?.dataIndex === 'index'">
                  {{ getRowIndex(index) }}
              </span>
              <span
                  v-if="column && column?.dataIndex !== 'index' && !props?.slots?.includes(column.dataIndex as string)">{{
                      parseDefaultValue(record, column.dataIndex as string)
                  }}</span>
          </template>
      </Table>
      <a-pagination v-if="props.isPagination" v-model:current="state.pagination.current"
          v-model:page-size="state.pagination.pageSize" :total="state.pagination.total"
          :showQuickJumper="state.pagination.showQuickJumper" :showSizeChanger="state.pagination.showSizeChanger"
          @change="state.pagination.onChange" :show-total="state.pagination.showTotal"
          :position="state.pagination.position" :size="props.size" />
  </div>
</template>
<script lang="ts" setup>
import { Table, TablePaginationConfig } from "ant-design-vue";
import { SizeType } from "ant-design-vue/lib/config-provider";
import { reactive, computed, watch, nextTick, onUnmounted } from "vue"
import request from "@/service/request";
import { AxiosRequestConfig } from "axios"
import _ from 'lodash' 

const props = withDefaults(defineProps<{
  columns: any[];
  pagination?: false | TablePaginationConfig;
  dataSource?: any[];
  slots?: string[];
  scrollY?: number | 'auto';
  rowKey?: string;
  url?: string;
  baseURL?: string;
  reqMethods?: string;
  reqHeaders?: object;
  query?: object;
  parseTableData?: Function;
  isPagination?: boolean;
  defaultLoad?: boolean;
  pageParams?: any;
  pageNo?: string | number;
  pageSize?: string | number;
  isSelected?: boolean;
  size?: SizeType;
  updateLoading?: Function;
  isCustomEmpty?: boolean;
  isClearSelectKeys?: boolean;
  currentKeys?: string[];
  currentKeysTable?: any[]
  id?: string
}>(), {
  defaultLoad: true,
  pagination: false,
  isPagination: true,
  isSelected: true,
  size: 'small',
  isCustomEmpty: false,
  reqMethods: "POST",
  parseTableData: ({ data, code }: any) => {
      if (code == 200) {
          return { data: data.data, total: data.totalCount };
      }
      return {};
  },
  rowKey: 'id',
  // id:'BaseTable'+generateUniqueID(),
  isClearSelectKeys: true
});

const {
  baseURL = window.EXAM_CONFIG.BASEURL,
  reqHeaders = {},
  pageParams = {
      pageNo: 1,
      pageSize: 10,
  },
} = props
interface TypeState {
  loading: boolean;
  tableData?: any[];
  pagination: TablePaginationConfig;
  selectedVlanIds: number[] | string[];
  scrollY: number | 'auto';
  tableHeight: string;
  selectedRows: any[];
}
const state: TypeState = reactive({
  loading: false,
  tableData: props.dataSource,
  pagination: {
      current: pageParams.pageNo,
      pageSize: pageParams.pageSize,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      position: ["bottomCenter"],
      showTotal: (total) => `共 ${total} 条`, // 展示总共有几条数据
      onChange: pageChange
  },
  selectedVlanIds: [] as string[] | number[],
  selectedRows: [] as any[],
  scrollY: 0,
  tableHeight: `calc(100% - 56px)`
})
function pageChange(page: number, pageSize: number) {
  currentChange(page)
  pageSize != state.pagination.pageSize && sizeChange(pageSize)
}

const $emit = defineEmits(['currentChange', 'sizeChange', 'onData', 'selectChange', 'tableChange']); // 父组件的触发事件
async function getData() {
  if (!props.url) return;
  let params: AxiosRequestConfig = {
      baseURL: baseURL,
      url: props.url,
      method: props.reqMethods,
      headers: reqHeaders,
  };
  const page = {
      pageNo: state.pagination.current,
      pageSize: state.pagination.pageSize,
  }
  if (props.reqMethods === "GET") {
      params = {
          ...params,
          params: props.isPagination ? { ...props.query, ...page } : props.query,
      };
  } else {
      params = {
          ...params,
          data: props.isPagination ? { ...props.query, ...page } : props.query,
      };
  }
  try {
      if (props?.updateLoading) {
          props.updateLoading(true)
      } else {
          state.loading = true;
      }
      let dataS = await request(params);
      if (dataS) {
          let { data, total } = props.parseTableData(dataS);
          if (props?.isClearSelectKeys) {
              onSelectChange([], [])
          }
          if (props?.currentKeys?.length) {
              onSelectChange(props?.currentKeys, props?.currentKeysTable)
          }
          state.tableData = data;
          state.pagination.total = total;
          $emit("onData", data);
      }
  } catch (error) {
      console.log(error);
  } finally {
      if (props?.updateLoading) {
          props.updateLoading(false)
      } else {
          state.loading = false;
      }
  }
}
function refresh() {
  if (props.isPagination) {
      currentChange(1);
  } else {
      getData();
  }
}
function currentChange(val: number) {
  state.pagination.current = val;
  getData();
}
function sizeChange(val: number) {
  state.pagination.pageSize = val;
  $emit("sizeChange", val);
  currentChange(1);
}
const onSelectChange = (changeAbleRowKeys: any[], selectedRows: any) => {
  state.selectedVlanIds = changeAbleRowKeys;
  state.selectedRows = selectedRows;
  $emit('selectChange', changeAbleRowKeys, selectedRows)
};
const onSelect = (record: any, selected: any, _selectedRows: any) => {
  let arr = state.selectedVlanIds as any[];
  if (selected) {
      // onSelectChange(selectedRows?.map((e: any) => e[props.rowKey]), selectedRows)
      arr.push(record[props.rowKey] as string)
      state.selectedRows.push(record)
      onSelectChange(state.selectedVlanIds, state.selectedRows)
  } else {
      const arrI = arr.findIndex((e) => e === record[props.rowKey])
      const rowI = state.selectedRows.findIndex((e) => e[props.rowKey] === record[props.rowKey])
      state.selectedRows.splice(rowI, 1)
      arr.splice(arrI, 1)
      onSelectChange(arr, state.selectedRows)
  }
}

const onSelectAll = (selected: any, _selectedRows: any, _changeRows: any) => {
  if (selected) {
      if (state.tableData) {
          onSelectChange(state.tableData?.map((e: any) => e[props.rowKey]), state.tableData)
      }
  } else {
      onSelectChange([], [])
  }
}

const rowSelection = computed(() => {
  let result: {} | undefined = undefined
  if (props.isSelected) {
      result = {
          selectedRowKeys: state.selectedVlanIds,
          // onChange: onSelectChange,
          onSelectAll: onSelectAll,
          hideDefaultSelections: true,
          onSelect: onSelect,
      }
  }
  return result;
});
props.defaultLoad && refresh()
const parseDefaultValue = (record: Record<string, any>, dataIndex: string) => {
  const dataIndexs = dataIndex.split(".");
  let result = record;
  dataIndexs.forEach((element) => {
      if (result) {
          result = result[element];
      }
  });
  if (result == null) {
      return "--";
  }
  return result;
};
function getRowIndex(index: number) {
  const pageParams = {
      pageNo: state?.pagination?.current || 0,
      pageSize: state?.pagination?.pageSize,
  }
  if (pageParams && pageParams.pageSize) {
      return (
          pageParams.pageSize * (pageParams?.pageNo - 1) +
          index +
          1
      );
  }
  return index + 1;
}
function tableTitleClass(column: any) {
  return `${column?.isRequired ? 'is-required' : ''}`
}
function getTableData() {
  return state.tableData
}
function getSelectKeys() {
  return state.selectedVlanIds
}
const doLayout = _.debounce(function () {
  nextTick(() => {
      const tableMain = (document.querySelector(`#${props.id} .table-content`) as HTMLDivElement)?.offsetHeight
      const headerH = (document.querySelector(`#${props.id} .ant-table-header`) as HTMLDivElement)?.offsetHeight
      state.scrollY = tableMain - headerH
  })
}, 200)
doLayout()
window.addEventListener("resize", doLayout);
onUnmounted(() => {
  window.removeEventListener('resize', doLayout)
})
watch(
  () => props.isPagination,
  (val) => {
      nextTick(() => {
          const paginationH = (document.querySelector(`#${props.id} .ant-pagination`) as HTMLDivElement)?.offsetHeight
          state.tableHeight = val ? `calc(100% - ${paginationH}px)` : `100%`
      })
  },
  { immediate: true }
);
watch(
  () => props.dataSource,
  (val) => {
      state.tableData = val
  },
  { immediate: true, deep: true }
);
watch(
  () => state.tableData,
  (val) => {
      $emit('tableChange', val)
      doLayout()
  },
  { immediate: true }
);
defineExpose({
  refresh,
  getTableData,
  doLayout,
  onSelectChange,
  getSelectKeys
})
</script>

<style scoped lang="scss">
$bg-color: #fff;

.table-box {
  height: 100%;
  background-color: $bg-color;

  .table-content {
      height: v-bind("state.tableHeight");
      overflow: auto;
  }

  :deep(.ant-pagination) {
      padding: 12px;
      display: flex;
      justify-content: center;
      background-color: $bg-color;
  }
}


.is-required {
  &:before {
      content: '*';
      color: red
  }
}

.table-title {
  white-space: break-spaces;
}
</style>
