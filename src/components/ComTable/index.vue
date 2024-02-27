<template>
    <a-table class="tableList" :rowKey="(record: any) => record.id" :columns="columns" :data-source="datas" :pagination="false"
        :loading="tableLoading" size="small">
        <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
                {{ `${(pageParams.PageNumber - 1) * pageParams.MaxResultCount + index + 1}` }}
            </template>
            <template v-if="column.key === 'action'">
                <slot name='tableBtns' :row='record'></slot>
                <a href="javascript:;" @click="del(record)" v-if="delBut" class="delBtn">删除</a>
            </template>
        </template>
    </a-table>
    <div class="paginationBox">
        <a-pagination size="small" :defaultPageSize="15" :page-size-options="pageSizeOptions"
            v-model:current="pageParams.PageNumber" :total="totalCount" :show-total="(___total: any) => `共 ${totalCount} 条`"
            show-size-changer @change="change" />
    </div>
</template>
   
<script setup lang="ts">
import { usePageReq } from './usePageReq.js'
import { onMounted, ref, h, RendererElement, RendererNode, VNode, VNodeArrayChildren } from 'vue'
import { message, Modal } from "ant-design-vue";
const props = defineProps({
    // 表格配置项
    columns: {
        type: Array,
        default: () => []
    },
    // 是否展示删除按钮
    delBut: {
        type: Boolean,
        default: true
    },
    // 删除接口
    delApi: {
        type: Function,
        default: () => { },
        required: false
    },
    // 请求数据的接口
    api: {
        type: Promise<any>,
        default: () => Promise<any>
    },
    // 接口参数
    apiParams: {
        type: Object,
        default: () => { }
    },
    // 表格X轴的滚动距离
    scrollX: {
        type: Number,
        default: 2500
    },
    // 表格Y轴的滚动距离
    scrollY: {
        type: Number,
        default: 450
    },
})

const { datas, pageParams, getPage, totalCount, tableLoading } = usePageReq(props.api, props.apiParams)
const pageSizeOptions = ref(['15', '20', '30', '40', '50']);
const change = (cur: number, max: number) => {
    if (pageParams.MaxResultCount != max) {
        pageParams.PageNumber = 1
        pageParams.MaxResultCount = max
    } else {
        pageParams.PageNumber = cur
    }
    getPage()
}
const del = async (params: { name: string | number | boolean | VNode<RendererNode, RendererElement, { [key: string]: any; }> | VNodeArrayChildren | (() => any) | { [name: string]: unknown; $stable?: boolean | undefined; } | undefined; id: any; }) => {
    Modal.confirm({
        title: h("div", {}, "是否确认删除？"),
        okText: "确定",
        cancelText: "取消",
        closable: true,
        onOk: () => {
            props.delApi({ id: params.id })
                .then((_res: any) => {
                    message.success("删除成功！")
                    pageParams.PageNumber =
                        datas.value.length == 1 && pageParams.PageNumber != 1
                            ? pageParams.PageNumber - 1
                            : pageParams.PageNumber;
                    getPage();
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },
    });
}
onMounted(() => {
    // getPage()
})
defineExpose({
    datas,
    pageParams,
    getPage,
    totalCount
})
</script>

<style></style>