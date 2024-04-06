<template>

  <div class="exam-online">
    <a-header class="exam-header">
      <a-row>
        <a-col :span="19" :offset="2" style="border-bottom: 1px solid #f5f5f5">
          <span class="start-exam">开始考试</span>
          <span class="exam-title">距离考试结束还有：</span>
          <span style="color: red;font-size: 18px;">{{ formatTimeToHHMM(duration) }}</span>
          <a-button shape="round" style="background-color: #ffd550;float: right;color: #895F07;font-weight: 800"
            size="large" @click="uploadExamToAdmin">提交试卷
          </a-button>
        </a-col>
      </a-row>
    </a-header>
    <a-main>
      <a-row>
        <a-col :span="12" :offset="2">
          <a-card style="min-height: 500px">
            <a-space>
              <i class="num">{{ state.curIndex + 1 }}</i>
              <span v-if="state.questionInfo[state.curIndex]?.questionType === 1">【单选题】</span>
              <span v-else-if="state.questionInfo[state.curIndex]?.questionType === 2">【多选题】</span>
              <span v-else-if="state.questionInfo[state.curIndex]?.questionType === 3">【判断题】</span>
              <span v-else>【简答题】</span>
              <span>{{ state.questionInfo[state.curIndex]?.questionContent }}:</span>
            </a-space>
            <img v-for="url in state.questionInfo[state.curIndex]?.images" :src="url" title="点击查看大图" alt="题目图片"
              style="width: 100px;height: 100px;cursor: pointer" @click="showBigImg(url)">
            <div style="margin-top: 25px"
              v-show="state.questionInfo[state.curIndex]?.questionType === 1 || state.questionInfo[state.curIndex]?.questionType === 3">
              <div class="a-radio-group">
                <label v-for="(item, index) in state.questionInfo[state.curIndex]?.answer"
                  @click="checkSingleAnswer(index)" :class="index === state.userAnswer[state.curIndex] ? 'active' : ''">
                  <span>{{ state.optionName[index] + '、' + item.answer }}</span>
                  <img class="small-img" title="点击查看大图" v-if="item.images !== null"
                    v-for="i2 in item.images" :src="i2" alt="" @click="showBigImg(i2)">
                </label>
              </div>
            </div>
            <div style="margin-top: 25px" v-show="state.questionInfo[state.curIndex]?.questionType === 2">
              <div class="a-radio-group">
                <label v-for="(item, index) in state.questionInfo[state.curIndex]?.answer"
                  @click="selectedMultipleAnswer(index)"
                  :class="(state.userAnswer[state.curIndex] + '').indexOf(index + '') !== -1 ? 'active' : ''">
                  <span>{{ state.optionName[index] + '、' + item.answer }}</span>
                  <img class="small-img" title="点击查看大图" v-if="item.images !== null"
                    v-for="i2 in item.images" :src="i2" alt="" @click="showBigImg(i2)">
                </label>
              </div>
            </div>
            <!--简答题的答案-->
            <div style="margin-top: 25px" v-show="state.questionInfo[state.curIndex]?.questionType === 4">
              <a-textarea :rows="8" placeholder="请输入答案" v-model="state.userAnswer[state.curIndex]">
              </a-textarea>
            </div>

            <!--上一题 下一题-->
            <a-space style="margin-top: 25px">
              <a-button type="primary" :disabled="state.curIndex < 1" @click="state.curIndex--">
                <template #icon>
                  <LeftOutlined />
                </template>
                上一题
              </a-button>
              <a-button type="primary" :disabled="state.curIndex >= state.questionInfo.length - 1"
                @click="state.curIndex++">
                <template #icon>
                  <RightOutlined />
                </template>
                下一题
              </a-button>
            </a-space>

          </a-card>
        </a-col>

        <a-col :span="6" :offset="1">
          <!--答题卡卡片-->
          <a-card>
            <div>
              <p style="font-size: 18px;">答题卡</p>
              <div style="margin-top: 25px">
                <span style="background-color: rgb(238,238,238);padding: 5px 10px 5px 10px;margin-left: 15px">未作答</span>
                <span style="background-color: rgb(87,148,247);color: white;
                padding: 5px 10px 5px 10px;margin-left: 15px">已作答</span>
              </div>
            </div>

            <!--单选的答题卡-->
            <div style="margin-top: 25px">
              <p style="font-size: 18px;">单选题</p>
              <a-button style="margin-top: 10px;margin-left: 15px" size="mini"
                v-show="state.questionInfo[item - 1].questionType === 1"
                :class="state.questionInfo[item - 1].questionType === 1 && state.userAnswer[item - 1] !== undefined ?
          'done' : state.userAnswer[item - 1] === undefined ? state.curIndex === (item - 1) ? 'orange' : 'noAnswer' : 'noAnswer'" v-for="item in state.questionInfo.length"
                :key="item" @click="state.curIndex = item - 1">{{ item }}
              </a-button>
            </div>

            <!--多选的答题卡-->
            <div style="margin-top: 25px">
              <p style="font-size: 18px;">多选题</p>
              <a-button style="margin-top: 10px;margin-left: 15px" size="mini"
                v-show="state.questionInfo[item - 1].questionType === 2"
                :class="state.questionInfo[item - 1].questionType === 2 && state.userAnswer[item - 1] !== undefined ?
          'done' : state.userAnswer[item - 1] === undefined ? state.curIndex === (item - 1) ? 'orange' : 'noAnswer' : 'noAnswer'" v-for="item in state.questionInfo.length"
                :key="item" @click="state.curIndex = item - 1">{{ item }}
              </a-button>
            </div>

            <!--判断的答题卡-->
            <div style="margin-top: 25px">
              <p style="font-size: 18px;">判断题</p>
              <a-button style="margin-top: 10px;margin-left: 15px" size="mini"
                v-show="state.questionInfo[item - 1].questionType === 3"
                :class="state.questionInfo[item - 1].questionType === 3 && state.userAnswer[item - 1] !== undefined ?
          'done' : state.userAnswer[item - 1] === undefined ? state.curIndex === (item - 1) ? 'orange' : 'noAnswer' : 'noAnswer'" v-for="item in state.questionInfo.length"
                :key="item" @click="state.curIndex = item - 1">{{ item }}
              </a-button>
            </div>

            <!--简答的答题卡-->
            <div style="margin-top: 25px">
              <p style="font-size: 18px;">简答题</p>
              <a-button style="margin-top: 10px;margin-left: 15px" size="mini"
                v-show="state.questionInfo[item - 1].questionType === 4"
                :class="state.questionInfo[item - 1].questionType === 4 && state.userAnswer[item - 1] !== undefined ?
          'done' : state.userAnswer[item - 1] === undefined ? state.curIndex === (item - 1) ? 'orange' : 'noAnswer' : 'noAnswer'" v-for="item in state.questionInfo.length"
                :key="item" @click="state.curIndex = item - 1">{{ item }}
              </a-button>
            </div>
          </a-card>
        </a-col>

      </a-row>
      <video id="video" v-bind:muted="true" style="float:right;position: fixed;top: 80%;left: 85%" width="200px"
        height="200px" v-bind:autoplay="true"></video>
      <canvas id="canvas" hidden width="200px" height="200px"></canvas>
    </a-main>
    <!--图片回显-->
    <a-modal v-model:open="state.bigImgVisible" width="45%" @cancel="state.bigImgVisible = false" :footer="null" bodyStyle="min-height: 250px" title="查看图片">
      <img style="width: 100%" :src="state.bigImgUrl">
    </a-modal>
  </div>

</template>

<script setup lang="ts">
import { createVNode, onMounted, reactive, ref, watchEffect } from 'vue';
import request from '../../service/request';
import API from '../../api/api'
import { useRoute, useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import { Res } from '../../api/type';
import { ExclamationCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

interface QuestionInfoType {
  questionContent: string;
  questionType: number;
  questionAnswer: string;
  questionScore: number;
  questionImages: string[];
  questionAnswerImages: string[];
  questionAnswerContent: string;
  images: string[];
  questionId: string;
  answer: {
    answer: string;
    images: string[];
  }[];
}
const state = reactive({
  //当前考试的信息
  examInfo: {} as { [key: string | number]: any },
  //当前的考试题目
  questionInfo: [] as QuestionInfoType[],
  //当前题目的索引值
  curIndex: 0,
  //控制大图的对话框
  bigImgVisible: false,
  //当前要展示的大图的url
  bigImgUrl: '',
  //用户选择的答案
  userAnswer: [] as any[],
  //页面数据加载
  loading: {},
  //页面绘制是否开始
  show: false,
  //答案的选项名abcd数据
  optionName: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  //摄像头对象
  mediaStreamTrack: null as MediaStream | MediaStreamTrack | null,
  //诚信照片的url
  takePhotoUrl: [] as string[],
  //摄像头是否开启
  cameraOn: false,
})
const duration = ref(1);
let timer = null
const route = useRoute();
const router = useRouter()
const formatTimeToHHMM = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
const getExamInfo = () => {
  console.log(route);
  request("GET", API.teacher.getExamInfoById, { examId: route.params.id }).then((resp) => {
    if (resp.code === 200) {
      state.examInfo = resp.data
      //设置定时(秒)
      const key = `examDuration${state.examInfo?.examId}`;
      if (localStorage.getItem(key) === '0') {
        localStorage.removeItem(key);
      }
      duration.value = parseInt(localStorage.getItem(key) ?? "") || resp.data.examDuration * 60
      //考试剩余时间定时器
      timer = window.setInterval(() => {
        if (duration.value > 0) {
          duration.value--
        }
      }, 1000)
      getQuestionInfo(resp.data.questionIds.split(','))
    }
  })
}
//查询考试的题目信息
const getQuestionInfo = async (ids: any[]) => {
  try {
    state.questionInfo = await Promise.all(
      ids.map(async (id) => {
        const resp = await request("GET", `${API.teacher.getQuestionById}/${id}`);
        if (resp.code === 200) {
          return resp.data;
        } else {
          console.error(`Failed to fetch question with id ${id}:`, resp.message);
          return null; // 或者抛出错误，根据实际需求决定
        }
      })
    );
    state.questionInfo = state.questionInfo.filter(Boolean);

    // 重置问题的顺序（按 questionType 排序）
    state.questionInfo.sort((a, b) => a.questionType - b.questionType);
  // state.loading

    state.show = true;
  } catch(err) {
    console.log(err);
  }

}
//点击展示高清大图
const showBigImg = (url: any) => {
  state.bigImgUrl = url
  state.bigImgVisible = true
}
//检验单选题的用户选择的答案
const checkSingleAnswer = (index: any) => {
  state.userAnswer[state.curIndex] = index
}
//多选题用户的答案选中
const selectedMultipleAnswer = (index: any) => {
  if (state.userAnswer[state.curIndex] === undefined) {
    state.userAnswer[state.curIndex] = [index] as unknown as any;
  } else {
    const currentAnswers = state.userAnswer[state.curIndex];

    const answerIndex = currentAnswers.indexOf(index);

    if (answerIndex !== -1) { // 取消选中
      currentAnswers.splice(answerIndex, 1);
      if (currentAnswers.length === 0) {
        state.userAnswer[state.curIndex] = undefined;
      }
    } else { // 第n个答案
      currentAnswers.push(index);
    }

    // 答案格式化顺序（DBAC -> ABCD）
    state.userAnswer[state.curIndex] = currentAnswers.sort((a: string, b: any) => a.localeCompare(b));
  }
}
const getCamera = () => {
  let constraints = {
    video: {
      width: 200,
      height: 200
    },
    audio: false
  }
  let videoElement = document.getElementById('video')
  if (videoElement !== null) {
    let promise = navigator.mediaDevices.getUserMedia(constraints)
    const video = videoElement as HTMLVideoElement
    promise.then((mediaStream) => {
      state.mediaStreamTrack = state.mediaStreamTrack instanceof MediaStream ? mediaStream : mediaStream.getTracks()[1]
      video.srcObject = mediaStream
      video.play()
      state.cameraOn = true
    }).catch((_back) => {
      message.warning('请开启摄像头权限o(╥﹏╥)o!')
    })
  }

}
const takePhoto: () => void = () => {
  if (state.cameraOn) {//摄像头是否开启 开启了才执行上传信用图片
    //获得Canvas对象
    let video = document.getElementById('video') as HTMLVideoElement | null;
    let canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (video !== null && canvas !== null) {
      let ctx = canvas.getContext('2d')
      if (ctx !== null) {
        ctx.drawImage(video, 0, 0, 200, 200)
      }
      // toDataURL  ---  可传入'image/png'---默认, 'image/jpeg'
      let img = canvas.toDataURL()
      //构造post的form表单
      let formData = new FormData()
      if (img !== null) {
        //convertBase64UrlToBlob函数是将base64编码转换为Blob
        formData.append('file', base64ToFile(img, 'examTakePhoto.png'))
        //上传阿里云OSS
        request("POST", API.teacher.uploadQuestionImage, formData).then((resp: Res<string>) => {
          if (resp.code === 200) {
            state.takePhotoUrl.push(resp.data)
          }
        })
      }
    }
  }
}
//关闭摄像头
const closeCamera = () => {
  let videoElement = document.getElementById('video') as HTMLVideoElement | null;
  if (videoElement !== null) {
    let stream = videoElement.srcObject as MediaStream | null
    if (stream !== null) {
      let tracks = stream.getTracks()

      tracks.forEach(function (track: { stop: () => void; }) {
        track.stop()
      })
      videoElement.srcObject = null
    }

  }

}
//将摄像头截图的base64串转化为file提交后台
const base64ToFile = (urlData: string, fileName: string) => {
  let arr = urlData.split(',')
  const data = arr[0].match(/:(.*?);/) as RegExpMatchArray
  let mime = data[1]
  let bytes = atob(arr[1]) // 解码base64
  let n = bytes.length
  let ia = new Uint8Array(n)
  while (n--) {
    ia[n] = bytes.charCodeAt(n)
  }
  return new File([ia], fileName, { type: mime })
}
//上传用户考试信息进入后台
const uploadExamToAdmin = async () => {
  if (state.cameraOn) {
    await takePhoto()//结束的时候拍照上传一张
  }
  //题目未做完
  if (state.userAnswer.length < state.questionInfo.length) {
    Modal.confirm({
      title: "提交试卷",
      icon: createVNode(ExclamationCircleOutlined),
      content: "当前试题暂未做完, 是否继续提交o(╥﹏╥)o ?",
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        let data: { [key: string]: any } = {}
        data.questionIds = []
        data.userAnswers = state.userAnswer.join('-')
        state.questionInfo.forEach((item, index: number) => {
          data.questionIds.push(item.questionId)
          //当前数据不完整,用户回答不完整(我们自动补充空答案,防止业务出错)
          if (index > state.userAnswer.length) {
            data.userAnswers += ' -'
          }
        })
        //如果所有题目全部未答
        if (data.userAnswers === '') {
          state.questionInfo.forEach((_item: any) => {
            data.userAnswers += ' -'
          })
          data.userAnswers.split(0, data.userAnswers.length - 1)
        }
        data.examId = parseInt(route.params.id as string)
        data.questionIds = data.questionIds.join(',')
        data.creditImgUrl = state.takePhotoUrl.join(',')
        request("POST", API.teacher.addExamRecord, data).then((resp: Res<string>) => {
          if (resp.code === 200) {
            message.success('考试结束 *^▽^*')
            router.push('/examResult/' + resp.data)
          }
        })
      },
      onCancel() {
        message.success('继续加油! *^▽^*')
      },
    });
  } else {//当前题目做完了
    if (state.cameraOn) {
      //结束的时候拍照上传一张
      takePhoto()
      closeCamera()
    }
    let data: { [key: string]: any } = {}
    data.questionIds = []
    data.userAnswers = state.userAnswer.join('-')
    data.examId = parseInt(route.params.examId as string)
    data.creditImgUrl = state.takePhotoUrl.join(',')
    state.questionInfo.forEach((item: { questionId: any; }, _index: any) => {
      data.questionIds.push(item.questionId)
    })
    data.questionIds = data.questionIds.join(',')
    request("POST", API.teacher.addExamRecord, data).then((resp: { data: { code: number; data: string; }; }) => {
      if (resp.data.code === 200) {
        message.success('考试结束 *^▽^*')
        router.push('/examResult/' + resp.data.data)
      }
    })
  }
}
onMounted(() => {
  getExamInfo()
  //页面数据加载的等待状态栏
  // state.loading = this.$Loading.service({
  //   body: true,
  //   lock: true,
  //   text: '数据拼命加载中,(*╹▽╹*)',
  //   spinner: 'a-icon-loading',
  // })
  //开启摄像头
  window.onload = () => {
    setTimeout(() => {
      getCamera()
    }, 1000)
    //生成3次时间点截图
    let times = []
    for (let i = 0; i < 2; i++) {
      times.push(Math.ceil(Math.random() * duration.value * 1000))
    }
    times.push(10000)
    //一次考试最多3次随机的诚信截图
    times.forEach(item => {
      window.setTimeout(() => {
        takePhoto()
      }, item)
    })
  }
  var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf('Opera') > -1 //判断是否Opera浏览器
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera //判断是否IE浏览器
  var isIE11 = userAgent.indexOf('rv:11.0') > -1 //判断是否是IE11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE //判断是否IE的Edge浏览器
  if (!isIE && !isEdge && !isIE11) {//兼容chrome和firefox
    var _beforeUnload_time = 0, _gap_time = 0
    var is_fireFox = navigator.userAgent.indexOf('Firefox') > -1//是否是火狐浏览器
    window.onunload = function () {
      _gap_time = new Date().getTime() - _beforeUnload_time
      if (_gap_time <= 5) {
        localStorage.removeItem('examDuration' + state.examInfo.examId)
      } else {//谷歌浏览器刷新
      }
    }
    window.onbeforeunload = function () {
      _beforeUnload_time = new Date().getTime()
      if (is_fireFox) {//火狐关闭执行
      } else {//火狐浏览器刷新
      }
    }
  }
})
watchEffect(() => {
  const newVal = duration.value;
  localStorage.setItem(`examDuration${state.examInfo.examId}`, newVal.toString());

  // 摄像头数据
  const constraints = {
    video: {
      width: 200,
      height: 200,
    },
    audio: false,
  };

  // 通过调用摄像头判断用户是否中途关闭摄像头
  navigator.mediaDevices.getUserMedia(constraints)
    .catch((_back) => {
      state.cameraOn = false;
    });

  if (!state.cameraOn) { // 如果摄像头未开启,就再次调用开启
    getCamera();
  }

  // 考试时间结束了提交试卷
  if (newVal < 1) {
    if (state.cameraOn) {
      takePhoto();
      closeCamera();
    }

    const data = {
      questionIds: [] as string[],
      userAnswers: state.userAnswer.join('-'),
      examId: null as number | null,
      creditImgUrl: ""
    };

    state.questionInfo.forEach((item, index) => {
      data.questionIds.push(item.questionId);

      // 当前数据不完整,用户回答不完整(我们自动补充空答案,防止业务出错)
      if (index > state.userAnswer.length) {
        data.userAnswers += ' -';
      }
    });

    // 如果所有题目全部未答
    if (data.userAnswers === '') {
      state.questionInfo.forEach(_ => {
        data.userAnswers += ' -';
      });
      data.userAnswers = data.userAnswers.slice(0, data.userAnswers.length - 1);
    }

    data.examId = parseInt(route.params.examId as string); // 假设 routeParams 已经定义并包含 examId

    data.questionIds = (data.questionIds as string[]).join(',') as unknown as string[];
    data.creditImgUrl = state.takePhotoUrl.join(',');
    console.log(111)
    request("POST", API.teacher.addExamRecord, data).then(resp => {
      if (resp.code === 200) {
        message.success('考试结束 *^▽^*');
        router.push(`/examResult/${resp.data.data}`);
      }
    });
  }
});
</script>

<style scoped lang="scss">
* {
  font-weight: 800;
}

.div {
  width: 100%;
  height: 100%;
}

.exam-online {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  text-align: left;
  // background-color: rgba(233, 239, 252, 0.1);
  background-color: #fff;
  padding-top: 56px;
  height: 100%;
  .exam-header {
    margin-bottom: 16px;
  }
  .ant-card {
    box-shadow: 6px 6px 12px 6px rgba(128,128,128, 0.1);
  }
}

.start-exam {
  color: #160f58;
  border-bottom: 4px solid #ffd550;
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 12px
}

.exam-title {
  font-size: 18px;
  color: #cbcacf;
  margin-left: 20px;
  font-weight: 700;
}
.small-img {
  position: absolute;
  left:100%;
  top:50%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  float: right;
  cursor: pointer;
  margin-left: 16px;
}
.a-radio-group label {
  display: block;
  width: 400px;
  padding: 48px 20px 10px 20px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;

  span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
  }
}

.a-radio-group label:hover {
  background-color: rgb(245, 247, 250);
}

/*当前选中的答案*/
.active {
  border: 1px solid #396EE0 !important;
  opacity: .7;
  color: #19439E;
  font-weight: 800;
}

/*做过的题目的高亮颜色*/
.done {
  background-color: rgb(87, 148, 247);
  color: #E9EFFC;
}

/*未做题目的高亮颜色*/
.noAnswer {
  background-color: rgb(238, 238, 238);
  color: #33394D;
}

/*当前在做的题目高亮的颜色*/
.orange {
  background-color: rgb(255, 213, 80);
  color: #895F07;
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
  margin-right: 6px;
}
</style>
