<template>
    <div class="update-paper">
        <a-row>
            <a-button @click="handleBack('cancel')" type="text" size="large">
                <template #icon>
                    <ArrowLeftOutlined />
                </template>
                {{ (props.id ?? "").length > 0 ? '更新' : '添加' }}考试
            </a-button>
        </a-row>
        <a-steps :current="state.curStep" :items="state.steps" style="padding: 16px" @change="handleStep"></a-steps>
        <a-card v-show="state.curStep === 0" title="题目列表" headStyle="text-align: left">
            <template #extra><a href="#">总分：{{ state.totalScore }}</a></template>
            <a-row style="margin-bottom: 16px;"><a-button @click="handleAddQuestion" type="primary">添加试题</a-button></a-row>
            <a-table :columns="columns" :data-source="state.selectQuestion" :pagination="false"
                :rowKey="(record: any) => (record.id)">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'quType'">
                        <span>{{ questionTypeArr[record.quType] }}</span>
                    </template>
                    <template v-else-if="column.dataIndex === 'score'">
                        <a-input v-model:value="record[column.dataIndex]"></a-input>
                    </template>
                    <template v-else-if="column.dataIndex === 'operation'">
                        <a-button danger shape="circle" @click="delUpdateQuestion(record.id)"
                            :icon="h(DeleteOutlined)"></a-button>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-card v-show="state.curStep === 1" bodyStyle="text-align: left">
            <a-radio-group v-model:value="examForm.examType" size="medium" button-style="solid">
                <a-radio-button :value="parseInt('1')">完全公开</a-radio-button>
                <a-radio-button :value="parseInt('2')">需要密码</a-radio-button>
            </a-radio-group>
            <a-alert :message="examForm.examType === 1 ? '开放的，任何人都可以进行考试！' : '半开放的，知道密码的人员才可以考试！'" type="error"
                style="margin-top: 16px;" />
            <a-input style="margin-top: 15px;width: 20%" v-model:value="examForm.examPassword"
                v-show="examForm.examType === 2" type="password" show-password placeholder="输入考试密码"></a-input>
        </a-card>
        <a-card v-show="state.curStep === 2">
            <a-form :model="examForm" :rules="examFormRules" ref="examFormRef" @finish="onFinish"
                @finishFailed="onFinishFailed" v-bind="layout">
                <a-form-item label="考试名称" prop="examName">
                    <a-input v-model:value="examForm.examName"></a-input>
                </a-form-item>

                <a-form-item label="考试描述" prop="examDesc">
                    <a-textarea v-model:value="examForm.examDesc"></a-textarea>
                </a-form-item>

                <a-form-item label="总分数" prop="totalScore">
                    <a-input-number :value="totalScore" :disabled="true" style="width: 50%"></a-input-number>
                </a-form-item>

                <a-form-item label="及格分数" prop="passScore">
                    <a-input-number v-model:value="examForm.passScore" :min="1" style="width: 50%"></a-input-number>
                </a-form-item>

                <a-form-item label="考试时长(分钟)" prop="examDuration">
                    <a-input-number v-model:value="examForm.examDuration" :min="1" style="width: 50%"></a-input-number>
                </a-form-item>

                <a-form-item label="考试时间" prop="startTime">
                    <a-range-picker style="margin-left: 5px" v-model:value="examForm.examTime" :placeholder="['考试开始时间', '考试结束时间']"
                        :disabled-date="disabledDate" :disabled-time="disabledRangeTime" format="YYYY-MM-DD HH:mm:ss">
                    </a-range-picker>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
                    <a-space>
                        <a-button @click="handleBack('cancel')" size="large">取消</a-button>
                        <a-button type="primary" html-type="submit" size="large">提交</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>
        <a-modal title="添加题目" v-model:open="state.questionVisible" width="60%" :footer="null">
            <QuestionBank :readonly="true" @selected="handleSelected" />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import {
    onMounted,
    ref,
    reactive,
    h,
    computed,
} from 'vue';
import { message } from 'ant-design-vue';
import request from '../../service/request';
import API from '../../api/api'
import { Res } from '../../api/type';
import dayjs, { Dayjs } from 'dayjs';
import { defineEmits } from 'vue';
import { EditOutlined, LockOutlined, SettingOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue';
import QuestionBank from '../QuestionManagement/QuestionBank.vue';
import { range } from 'lodash';

const props = defineProps({
    // 表格配置项
    id: {
        type: String,
        default: null,
        required: false
    },
    visible: {
        type: Boolean,
        default: false,
    },
});
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
}
const questionTypeArr = ["未知", "单选题", "多选题", "判断题", "简答题"];

const columns = [
    {
        title: '题目内容',
        dataIndex: 'quContent',
        key: 'quContent',
        ellipsis: true,
    },
    {
        title: '题目类型',
        dataIndex: 'quType',
        key: 'quType',
        width: 180,
    },
    {
        title: '单题分数',
        dataIndex: 'score',
        key: 'score',
        width: 180,
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 140,
    }
]
const state = reactive({
    steps: [
        {
            title: '组卷配置',
            icon: h(EditOutlined),
        },
        {
            title: '考试权限',
            icon: h(LockOutlined),
        },
        {
            title: '补充配置',
            icon: h(SettingOutlined),
        },
    ],
    questionVisible: false,
    curStep: 0,
    totalScore: 0,
    selectQuestion: [] as any[],
})
const examFormRules = reactive({
    examName: [
        {
            required: true,
            message: '请输入考试名称',
            trigger: 'blur'
        }
    ],
    passScore: [
        {
            required: true,
            message: '请输入通过分数',
            trigger: 'blur'
        }
    ],
    examDuration: [
        {
            required: true,
            message: '请输入考试时长',
            trigger: 'blur'
        }
    ],
})
const examForm = reactive({
    examType: 1,
    examName: '',
    examDesc: '',
    passScore: 60,
    examDuration: 60,
    examTime: [],
    examPassword: ''
});
const examFormRef = ref();

const emit = defineEmits(['back']);

const handleSelected = (selectData: any[]) => {
    console.log(selectData)
    state.selectQuestion = selectData;
    state.questionVisible = false;
}
const handleBack = (type: "cancel" | "ok") => {
    console.log(111)
    emit('back', type, type === "ok");
};
const totalScore = computed(() => {
    let score = 0
    state.selectQuestion.forEach(item => {
        score += parseInt(item.score ?? 0)
    })
    state.totalScore = score
    return score
});
const disabledDate = (current: Dayjs) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
};

const disabledRangeTime = (_: Dayjs, type: 'start' | 'end') => {
    if (type === 'start') {
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
    return {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
    };
};
const handleStep = (step: number) => {
    state.curStep = step;
};
const handleAddQuestion = () => {
    state.questionVisible = true;
}
const delUpdateQuestion = (id: number) => {
    const index = state.selectQuestion.findIndex((item) => item.id === id);
    if (index !== -1) {
        state.selectQuestion.splice(index, 1)
    }
}
//表单信息提交
const onFinish = (values: any) => {
    console.log(values);
    const {examTime, examPassword, ...other} = values
    const totalScore = state.selectQuestion.reduce((acc, cur) => acc + parseInt(cur.score ?? 0), 0);
    const questionIds: string[] = [];
    let scores: number[] = [];
    state.selectQuestion.forEach((item) => {
        questionIds.push(item.id);
        scores.push(item.score);
    });
    const examInfo = {
        ...other,
        status: 1,
        totalScore,
        password: examForm.examType === 2 ? examForm.examPassword : null,
        startTime: examForm.examTime!== null && examForm.examTime[0] !== null ? examForm.examTime[0] : null,
        endTime: examForm.examTime!== null && examForm.examTime[1] !== null ? examForm.examTime[1] : null,
        questionIds: questionIds.join(","),
        scores: scores.join(",")
    }
    request("POST", API.teacher.addExamByQuestionList, examInfo).then((resp: Res<any[]>) => {
        if (resp.code === 200) {
            handleBack("ok")
            message.success(resp.message)
        } else {
            message.error(resp.message)
        }
    }).catch((err) => {
        console.log(err);
    })
};
const onFinishFailed = (error: any) => {
    console.log('Failed:', error);
    if (error.errorFields.length > 0) {
        error.errorFields.forEach((item: { errors: string[] }) => {
            message.warning(item.errors[0]);
        });
        return;
    } else {
        message.warning('请检查您所填写的信息是否有误'); // 请检查考试规则设置是否完整
    }
};


onMounted(() => {
    // getPage()
});
defineExpose({});
</script>

<style>
.update-paper {
    animation: leftMoveIn .7s ease-in;
    padding: 16px 24px;
    text-align: left;
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
