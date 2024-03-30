<template>
  <div class="dashboard">
    <a-row style="margin-bottom: 16px;margin-top: 16px">
      <div id="examFrequency" style="width: 60vw;height:40vh;"></div>
    </a-row>

    <a-row>
      <div id="passRate" style="width: 60vw;height:40vh;"></div>
    </a-row>

  </div>
</template>
<script setup lang="ts">

import * as echarts from 'echarts';
import request from '../../service/request';
import API from '../../api/api';
import { onMounted } from 'vue';

const examFrequencyInit = async () => {
  const examFrequencyEcharts = echarts.init(document.getElementById('examFrequency') as HTMLDivElement);
  try {
    const res = await request("GET", API.teacher.getExamNumbers);
    examFrequencyEcharts.setOption({
      title: {
        text: "考试次数",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (parms: { value: number; axisValue: string; marker: string; }[]) {
          var str =
            parms[0].axisValue +
            "</br>" +
            parms[0].marker +
            "参加考试数量：" +
            parms[0].value + '人/次'
          return str;
        },
      },
      textStyle: {
        color: "#333",
      },
      color: ["#7BA9FA", "#4690FA"],
      grid: {
        containLabel: true,
        left: "10%",
        top: "20%",
        bottom: "5%",
        right: "10%",
      },
      xAxis: {
        type: "category",
        data: res.data[0].split(','),
        axisLine: {
          lineStyle: {
            color: "#333",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          margin: 20, //刻度标签与轴线之间的距离。
          textStyle: {
            color: "#000",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#B5B5B5",
          },
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ["#B5B5B5"],
            type: "dashed",
            opacity: 0.5,
          },
        },
        axisLabel: {},
      },
      series: [{
        data: res.data[1].split(',').map((i: string) => Number(i) * 100),
        stack: "zs",
        type: "bar",
        barMaxWidth: "auto",
        barWidth: 60,
        itemStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: "linear",
            global: false,
            colorStops: [{
              offset: 0,
              color: "#5EA1FF",
            },
            {
              offset: 1,
              color: "#90BEFF",
            },
            ],
          },
        },
      },
      //下面的立体,控制颜色是color第一个
      {
        data: res.data[1].split(',').map((_i: any) => 1),
        type: "pictorialBar",
        barMaxWidth: "20",
        symbol: "diamond",
        symbolOffset: [0, "50%"],
        symbolSize: [60, 15],
        zlevel: 2,
      },
      //上面的立体,控制颜色是color第二个
      {
        data: res.data[1].split(',').map((i: string) => Number(i) * 100),
        type: "pictorialBar",
        barMaxWidth: "20",
        symbolPosition: "end",
        symbol: "diamond",
        symbolOffset: [0, "-50%"],
        symbolSize: [60, 12],
        zlevel: 2,
      }
      ],
    })
  } catch (error) {
    console.log(error);
  }
};
const passRateInit = async () => {
  const passRateEcharts = echarts.init(document.getElementById('passRate') as HTMLDivElement);
  try {
    const res = await request("GET", API.teacher.getExamPassRate, {});
    passRateEcharts.setOption({
      title: {
        text: "考试通过率",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          lineStyle: {
            color: "#333",
          },
        },
        formatter: function (parms: { value: number; axisValue: string; marker: string; }[]) {
          var str =
            parms[0].axisValue +
            "</br>" +
            parms[0].marker +
            "平均通过率：" +
            parms[0].value + '%'
          return str;
        },
      },
      grid: {
        containLabel: true,
        left: "10%",
        top: "20%",
        bottom: "5%",
        right: "10%",
      },
      xAxis: {
        type: 'category',
        data: res.data[0].split(','),
        axisTick: {
          show: false //隐藏X轴刻度
        },
        axisLine: {
          lineStyle: {
            color: "#CCCCCC"
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000',
            fontSize: 14,
            fontFamily: 'Source Han Sans CN-Regular',
          }
        },
      },
      yAxis: {
        type: 'value',
        name: "",
        nameTextStyle: {
          color: 'rgba(0,0,0,0.65)',
          fontSize: 14,
          fontFamily: 'Source Han Sans CN-Regular',
          align: "left",
          verticalAlign: "center",
        },
        axisLabel: {
          color: 'rgba(0,0,0,0.65)',
          textStyle: {
            fontSize: 14
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(223, 223, 223, 1)',
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(223, 223, 223, 1)',
            type: "dashed",
          }
        }
      },
      series: [{
        data: res.data[1].split(',').map((i: string) => Number(i) * 100),
        type: 'line',
        symbolSize: 8, //标记的大小
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(116,160,249,0.25)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(29,63,120,0)' // 100% 处的颜色
          }], false),
        },
        lineStyle: {
          color: "#5B8FF9",
          width: 3,
          shadowColor: 'rgba(26,117,218,0.05)',//设置折线阴影
          shadowBlur: 5,
          shadowOffsetY: 9,
        },
        itemStyle: {
          //折线拐点标志的样式
          color: "#5B8FF9",
          borderColor: "#5B8FF9",
          borderWidth: 5,
        },
        smooth: 0.4,
        emphasis: {
          scale: 1.5
        }
      },
      ],
    })
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  examFrequencyInit();
  passRateInit();
})
</script>
<style scoped lang="scss">
.dashboard {
  width: 100%;
  height: 100%;
}

.dashboard {
  animation: leftMoveIn .7s ease-in;
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