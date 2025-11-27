<template>
    <div class="marking-detail-container">
        <a-row>
            <a-button @click="handleBack('cancel')" type="text" size="large">
                <template #icon>
                    <ArrowLeftOutlined />
                </template>
                批阅试卷
            </a-button>
        </a-row>
        <div class="main">
            <div class="marking-detail-info">

                <div class="examName">{{ state.examInfo?.examName }}</div>
                <div class="examText">交卷时间：{{ state.examRecord?.examTime }}</div>
                <a-tooltip placement="topLeft" class="item">
                    <template #title>
                        <span>包括(单选,多选,判断题)</span>
                    </template>
                    <div class="examText">
                        逻辑题得分: {{ state.examRecord?.logicScore }}分
                    </div>
                </a-tooltip>
                <a-tooltip placement="topLeft" class="item">
                    <template #title>
                        <span>简答题与逻辑题</span>
                    </template>
                    <div class="examText">
                        总分: {{ state.examInfo?.totalScore }}分
                    </div>
                </a-tooltip>

                <a-button @click="creditVisible = true" type="primary">查看诚信截图</a-button>
            </div>

            <div class="marking-detail-content">
                <div class="marking-list">
                    <div v-for="(item, index) in state.questionInfo" :key="index" style="margin-top: 15px">
                        <div class="questionTitle">
                            <i class="num">{{ index + 1 }}</i>
                            <span v-if="item.questionType === 1">【单选题】</span>
                            <span v-else-if="item.questionType === 2">【多选题】</span>
                            <span v-else-if="item.questionType === 3">【判断题】</span>
                            <span v-else>【简答题】</span>
                            <span>{{ item.questionContent }}:</span>
                            <span style="color: red; font-style: italic; font-weight: 400">&nbsp; ({{
                questionScore.get(String(item.questionId)) }}分)
                            </span>
                        </div>
                        <!--题目中的配图-->
                        <img v-for="url in item.images" :src="url" title="点击查看大图" alt="题目图片"
                            style="width: 100px; height: 100px; cursor: pointer" @click="showBigImg(url)" />

                        <!--单选 和 判断 的答案列表-->
                        <div class="answers" v-if="item.questionType === 1 || item.questionType === 3">
                            <div class="answer-group">
                                <label v-for="(i2, index2) in item.answer" :class="String(index2) === userAnswer[index] && i2.isTrue === 'true'
                ? 'activeAndTrue'
                : String(index2) === userAnswer[index]
                    ? 'active'
                    : i2.isTrue === 'true'
                        ? 'true'
                        : ''
                ">
                                    <span>{{ optionName[index2] + '、' + i2.answer }}</span>
                                    <img class="image" title="点击查看大图" v-if="i2.images !== null" v-for="i3 in i2.images"
                                        :src="i3" alt="" @mouseover="showBigImg(i3)" />
                                </label>
                            </div>
                        </div>

                        <!--多选的答案列表-->
                        <div class="answers" v-if="item.questionType === 2">
                            <div class="answer-group">
                                <label v-for="(i2, index2) in item.answer" :class="(userAnswer[index] + '').indexOf(index2 + '') !== -1 &&
                i2.isTrue === 'true'
                ? 'activeAndTrue'
                : (userAnswer[index] + '').indexOf(index2 + '') !== -1
                    ? 'active'
                    : i2.isTrue === 'true'
                        ? 'true'
                        : ''
                ">
                                    <span>{{ optionName[index2] + '、' + i2.answer }}</span>
                                    <img class="image" title="点击查看大图" v-if="i2.images !== null" v-for="i3 in i2.images"
                                        :src="i3" alt="" @mouseover="showBigImg(i3)" />
                                </label>
                            </div>
                        </div>

                        <!--简答题的答案-->
                        <div class="answers" v-if="item.questionType === 4">
                            <div class="ques-analysis">
                                <h3 style="font-weight: 400">我的回答：</h3>
                                <p style="font-weight: 400; color: orange">
                                    {{ userAnswer[index] }}
                                </p>
                            </div>
                            <span>评分：</span>
                            <a-input-number v-model="item.score" :min="0"
                                :max="parseInt(questionScore.get(String(item.questionId)))"></a-input-number>
                        </div>
                    </div>
                </div>
                <a-button size="large" style="margin-top: 25px; padding: 0 64px;" type="primary"
                    @click="uploadMarkExam">提交阅卷</a-button>
            </div>
        </div>


        <!--图片回显-->
        <a-modal v-model:open="bigImgVisible" @cancel="bigImgVisible = false" :footer="null">
            <img style="width: 100%;min-height: 120px;" :src="bigImgUrl" />
        </a-modal>

        <!--诚信考试图片-->
        <a-modal v-model:open="creditVisible" @cancel="creditVisible = false" title="诚信截图" :footer="null">
            <img style="width: 100%; min-height: 120px;" v-for="item in state.examRecord?.creditImgUrl.split(',')"
                :key="item" :src="item" />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import request from '../../service/request';
import API from '../../api/api';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';

interface ExamRecordInterface {
    examId: number;
    examTime: Date;
    logicScore: number;
    totalScore: number;
    creditImgUrl: string;
    userAnswers: string;
}

interface ExamInfoInterface {
    examName: string;
    totalScore: number;
}

interface QuestionInfoInterface {
    questionId: number;
    questionType: number; // 可能是1（单选）、2（多选）、3（判断）、4（简答）
    questionContent: string;
    answer: {
        answerId: number;
        answer: string;
        isTrue: boolean | string;
        images?: string[];
    }[];
    images?: string[];
    score?: number; // 可能只在简答题中存在
}

const props = defineProps({
    recordId: {
        type: String,
        default: true,
    },
    // back: {
    //     type: Function,
    //     default: () => { },
    // },
});
const emit = defineEmits(['back']);
const state = reactive({
    examRecord: {} as ExamRecordInterface,
    examInfo: {} as ExamInfoInterface,
    questionInfo: [] as QuestionInfoInterface[],
});
const optionName = ref([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
]);
const bigImgUrl = ref('');
const bigImgVisible = ref(false);
const userAnswer = ref([]);
const questionScore = ref(new Map());
const creditVisible = ref(false);

const getExamRecord = async () => {
    await request("get", API.teacher.getExamRecordById + '/' + props.recordId).then((resp) => {
        if (resp.code === 200) {
            state.examRecord = resp.data
            console.log(resp.data)
            getExamInfoById(resp.data.examId)
            userAnswer.value = resp.data.userAnswers.split('-')
            //获取单题的分值
            getQuestionScore(resp.data.examId)
            //获取所有题目信息
            resp.data.questionIds.split(',').forEach((item: any) => {
                getQuestionInfoById(item)
            })
        }
    })
};
const getExamInfoById = (examId: any) => {
    console.log(examId)
    request("GET", API.teacher.getExamInfoById, { examId: examId }).then((resp) => {
        if (resp.code === 200) {
            state.examInfo = resp.data
        }
    }).catch((error) => {
        console.error('请求失败:', error)
    })
};
const getQuestionInfoById = async (questionId: string) => {
    await request("get", API.teacher.getQuestionById + '/' + questionId).then((resp) => {
        if (resp.code === 200) {
            if (resp.data.questionType === 4) {
                resp.data.score = 0
            }
            state.questionInfo.push(resp.data)
            //重置问题的顺序 单选 多选 判断 简答
            state.questionInfo = state.questionInfo.sort(function (a, b) {
                return a.questionType - b.questionType
            })
        }
    })
};
const showBigImg = (url: string) => {
    bigImgUrl.value = url
    bigImgVisible.value = true
};
const getQuestionScore = async (examId: string) => {
    await request("get", API.teacher.getExamQuestionByExamId + '/' + examId).then((resp) => {
        if (resp.code === 200) {
            const scores = resp.data.scores.split(',')
            resp.data.questionIds.split(',').forEach((item: any, index: string | number) => {
                questionScore.value.set(item, scores[index])
            })
        }
    })
};
const handleBack = (type: "cancel" | "ok") => {
    console.log(111)
    emit('back', type, type === "ok");
};
const uploadMarkExam = () => {
    //客观题的分数
    let otherScore = 0
    state.questionInfo.forEach(item => {
        if (item.questionType === 4) {
            otherScore += item?.score ?? 0
        }
    })
    let totalScore = state.examRecord.logicScore + otherScore
    console.log(totalScore,  props.recordId)
    request("post", API.teacher.setObjectQuestionScore, {
        'totalScore': totalScore,
        'examRecordId': props.recordId
    }).then((resp) => {
        if (resp.code === 200) {
            message.success(resp.message)
            handleBack("ok");
        }
    }).catch((_err) => {
        handleBack("cancel");
    })
};
onMounted(() => {

    // 一创建就改变头部的面包屑
    // this.$emit('giveChildChangeBreakInfo', '考试结果', '考试结果');
    // createTagsInParent();
    getExamRecord();
})


</script>

<style scoped lang="scss">
* {
    font-weight: 800;
}


.marking-detail-container {
    animation: leftMoveIn .7s ease-in;
    width: 100%;
    margin: 24px;
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

.main {
    display: flex;
    width: calc(100% - 48px);
    margin-top: 16px;
    justify-content: space-between
}

.marking-detail-info {
    flex: 0 0 300px;
    background-color: #fff;
    margin-right: 24px;
    height: 500px;
    border-radius: 10px;
    box-shadow: 10px 10px 20px #E1E2E5;
}

.marking-detail-content {
    flex: 1 1;
    background-color: #fff;
    box-shadow: 10px 10px 20px #E1E2E5;
    color: #33394D;
    padding: 16px;

}

.marking-list {
    height: 70vh;
    overflow-y: overlay;
}

.examName {
    color: #FAAB0C;
    font-size: 18px;
    line-height: 2;
    font-weight: 700;
    padding-top: 16px
}

.examText {
    font-size: 16px;
    color: #33394D;
    margin: 16px;
    font-weight: 700;
    text-align: left;
}

.questionTitle {
    text-align: left;
    margin: 24px 24px 0;
}

.answers {
    margin-top: 16px;
    margin-left: 81px;
}

.answer-group label {
    display: block;
    width: 400px;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    // box-shadow: 6px 6px 8px #F5F5F6;
    margin-bottom: 10px;
    position: relative;
    text-align: left;

    span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
    }
}

.num {
    display: inline-block;
    background: url('../../assets/images/examTitle.png') no-repeat 100% 100%;
    background-size: contain;
    height: 37px;
    width: 37px;
    line-height: 30px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    margin-right: 15px;
}

/*选中的答案*/
.active {
    border: 2px solid #FF3838 !important;
    box-shadow: 6px 6px 8px #FFE5E5 !important;
    // background-color: #FFE5E5;
    opacity: .5;
}

/*  选中的答案且是正确答案*/
.activeAndTrue {
    border: 2px solid #2DA641 !important;
    box-shadow: 6px 6px 8px #EBFAED !important;
    opacity: .5;
    height: 15px;
    width: 15px;
    background-size: contain;
    background: url('../../assets/images/true.png') no-repeat 95%;
    position: absolute;
    top: 0;
    left: 0;
}

.true {
    height: 15px;
    width: 15px;
    background-size: contain;
    background: url('../../assets/images/true.png') no-repeat 95%;
    position: absolute;
    top: 0;
    left: 0;
}

.ques-analysis {
    padding: 30px 40px;
    background: #f6f6f8;
    margin-bottom: 20px;
}

.image {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    float: right;
    cursor: pointer;
}
</style>
