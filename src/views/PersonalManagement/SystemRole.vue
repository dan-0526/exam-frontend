<template>
    <div class="role">

        <a-table ref="roleForm" highlight-current-row :border="true" v-loading="loading" :dataSource="roleInfo" :columns="columns" :pagination="false"
            tooltip-effect="dark" style="width: 100%">
        </a-table>

    </div>
</template>

<script setup lang="ts">
import request from '../../service/request';
import API from '../../api/api'
import { message } from 'ant-design-vue';
import { ref, reactive, onMounted} from 'vue';
import {Res} from '../../api/type'
interface RoleInfo {
    roleId: string;
    roleName: string;
  // 其他属性...
}
let roleInfo = reactive<RoleInfo[]>([]);
const columns = [
    {
        title: '角色ID',
        dataIndex: 'roleId',
        key: 'roleId',
        width: 120,
    },
    {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 160,
    },
    {
        title: '菜单权限',
        dataIndex: 'menuInfo',
        key: 'menuInfo',
        ellipsis: true,
    },
]
const loading = ref(true);
const getRoleInfo = () => {
    request("GET", API.admin.getRoleInfo).then((resp: Res<RoleInfo[]>) => {
        if (resp.code === 200) {
            roleInfo = resp.data
            loading.value = false;
        } else {
            message.error('获取信息失败');
            loading.value = false;
        }
    })
}
onMounted(() => {
    getRoleInfo();
});
</script>

<style>
.role {
    animation: leftMoveIn .7s ease-in;
    padding: 16px 24px;
}

@keyframes leftMoveIn {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }

    100% {
        transform: translateX(0%);
        opacity: 1;
    }
}

</style>