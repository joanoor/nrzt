import merge from 'deepmerge'
import { isString } from 'lodash-es'
import type {
  // LegendComponentOption,
  GridComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
  EChartsOption,
  // TitleComponentOption,
  BarSeriesOption,
  SunburstSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  MapSeriesOption,
  RadarSeriesOption,
  RadiusAxisComponentOption,
} from 'echarts'
import type {
  AxisLabelOption2,
  AxisLineOption2,
  AxisTickOption2,
  ChartType,
  SplitLineOption2,
} from './types'

// type RadiusAxisOption2 = EChartsOption['radiusAxis']

const color_bar = [
  '#1890FF',
  '#13C2C2',
  '#2FC25B',
  '#FACC14',
  '#F04864',
  '#8543E0',
  '#3436C7',
  '#223273',
  '#578DC6',
  '#9CCF25',
  '#AC662E',
  '#BC2F5C',
  '#6D7C9D',
  '#51599D',
  '#5D71CB',
  '#304B94',
]
const color_line = [
  '#1890FF',
  '#13C2C2',
  '#2FC25B',
  '#FACC14',
  '#F04864',
  '#8543E0',
  '#3436C7',
  '#223273',
  '#578DC6',
  '#9CCF25',
  '#AC662E',
  '#BC2F5C',
  '#6D7C9D',
  '#51599D',
  '#5D71CB',
  '#304B94',
]
const color_pie = [
  '#1890FF',
  '#13C2C2',
  '#2FC25B',
  '#FACC14',
  '#F04864',
  '#8543E0',
  '#3436C7',
  '#223273',
  '#578DC6',
  '#9CCF25',
  '#AC662E',
  '#BC2F5C',
  '#6D7C9D',
  '#51599D',
  '#5D71CB',
  '#304B94',
]
// const color_title = '#404040' // 标题
// const color_text = '#8b8b8b' // 默认文本颜色
// const color_bg = '#fff' // 背景色
const color_axisTick = '#ebebeb' // 坐标轴刻度线
const color_axisLine = '#ebebeb' // 轴线
const color_axisLabel = '#8b8b8b' // 坐标轴刻度标签
const color_splitLine = '#ebebeb' // 坐标轴里面的辅助线


// // 文本属性
// const textStyle = {
//   color: color_text,
//   fontFamily: 'Microsoft YaHei',
//   fontSize: '14',
// }
// // 标题
// const title: TitleComponentOption = {
//   text: '',
//   top: '5',
//   left: '10',
//   textStyle: {
//     fontSize: '16',
//     fontWeight: 'normal',
//     color: color_title,
//   },
// }
// // 背景色
// const backgroundColor = color_bg
// // 图例-上方右对齐
// const legend: LegendComponentOption = {
//   data: [],
//   top: '0',
//   icon: 'circle',
//   itemHeight: 10,
//   type: 'scroll', // 图例多的时候出现滚动条
//   width: '70%', // 图例最多占一半的宽度
//   selectedMode: false, // 图标不可点
//   right: '60', // 图例居中对齐
//   textStyle: {
//     fontSize: '14',
//   },
// }
// 笛卡尔坐标轴下图表的间距
const grid: GridComponentOption = {
  containLabel: true, // 区域是否包含坐标轴的刻度标签。
  left: '32',
  top: '35', // 上部需要放置坐标轴名称和图例
  bottom: '75', // 下边会有拖动轴
  right: '32',
}
// 坐标轴刻度不显示
const axisTickHide = {
  show: false,
}
// 坐标轴刻度相关
const axisTick: AxisTickOption2 = {
  show: true,
  // interval: 0,
  // length: 5,
  alignWithLabel: true,
  inside: true,
  lineStyle: {
    color: color_axisTick,
  },
}
// 坐标轴轴线不显示
const axisLine_y = {
  lineStyle: {
    color: color_axisLine,
    width: 2,
  },
}
// 坐标轴轴线
const axisLine: AxisLineOption2 = {
  lineStyle: {
    color: color_axisLine,
  },
}
// 坐标轴刻度标签
const axisLabel: AxisLabelOption2 = {
  color: color_axisLabel,
  // @ts-ignore
  formatter: function (value) {
    let back = value
    if (value && value.length > 6) {
      back = value.substring(0, 5) + '...'
    }
    return back
  },
}
// 坐标轴在 grid 区域中的分隔线不显示
const splitLineHide = {
  show: false,
}
// 坐标轴在 grid 区域中的分隔线
const splitLine: SplitLineOption2 = {
  show: true,
  lineStyle: {
    color: color_splitLine,
    type: 'dotted',
  },
}

const xAxis: XAXisComponentOption = {
  type: 'category',
  data: [],
  axisTick,
  splitLine: splitLineHide,
  axisLine,
  axisLabel,
  nameLocation: 'end',
  name: '',
}
const yAxis: YAXisComponentOption = {
  type: 'value',
  splitLine,
  axisLabel,
  axisTick: axisTickHide,
  axisLine: axisLine_y,
  name: '',
}

const polar = {}
const angleAxis = {}
const radiusAxis: RadiusAxisComponentOption = {
  type: 'category',
  data: [],
  z: 10,
}

// 柱状图
const series_hbar: BarSeriesOption = {
  type: 'bar',
  barMaxWidth: 20,
  data: [],
}

const series_bar: BarSeriesOption = {
  ...series_hbar,
  barGap: 0,
}

// 旭日图
const series_sunburst: SunburstSeriesOption = {
  type: 'sunburst',
  data: [],
  center: ['50%', '50%'],
  radius: ['15%', '75%'],
  label: {
    show: false,
  },
  levels: [
    {
      // 留给数据下钻点的空白配置
    },
    // 第一层
    {
      r0: '20%',
      r: '40%',
      label: {
        show: false,
      },
    },
    // 第二层
    {
      r0: '40%',
      r: '65%',
      label: {
        position: 'outside',
        padding: 3,
        silent: false,
      },
    },
  ],
}

const series_line: LineSeriesOption = {
  type: 'line',
  name: '',
  data: [],
}
const series_pie: PieSeriesOption = {
  type: 'pie',
  radius: ['0%', '55%'],
  center: ['50%', '50%'],
  data: [],
  label: {
    show: true,
    formatter: '{b}:\n{c} ({d}%)',
  },
  labelLine: {
    show: true,
  },
}
const series_pie_m: PieSeriesOption = {
  type: 'pie',
  clockwise: true,
  label: {
    show: true,
    position: 'outside',
  },
  labelLine: {
    show: true,
  },
  animation: false,
}

const series_scatter: ScatterSeriesOption = {
  type: 'scatter',
  name: '',
  data: [],
}
const series_map: MapSeriesOption = {
  type: 'map',
  selectedMode: 'single',
  label: {
    show: true,
  },
  itemStyle: {
    areaColor: '#e1e1e1',
  },
  data: [],
  map: '',
}
const series_radar: RadarSeriesOption = {
  type: 'radar',
  areaStyle: {},
  itemStyle: {},
  data: [],
}
const series_polarBar: BarSeriesOption = {
  type: 'bar',
  data: [],
  coordinateSystem: 'polar',
  name: '',
  stack: '',
}
const allChartOpt: Record<ChartType, EChartsOption> = {
  mix: {
    color: color_bar,
    tooltip: { trigger: 'axis' },
    grid,
    xAxis,
    series: [],
  },
  vbar: {
    color: color_bar,
    tooltip: { trigger: 'axis' },
    grid,
    xAxis: {
      ...xAxis,
    },
    yAxis,
    series: series_bar,
  },
  // 水平bar
  hbar: {
    color: color_bar,
    tooltip: { trigger: 'axis' },
    grid: merge(grid, { right: '80px' }),
    xAxis: {
      ...(yAxis as XAXisComponentOption),
      axisLine: {
        show: false,
      },
    },
    yAxis: merge(xAxis, { inverse: true }),
    series: series_hbar,
  },
  pictorialBar: {
    grid: merge({}, grid),
    xAxis,
    yAxis,
    series: {
      type: 'pictorialBar',
    },
  },
  pie: {
    animation: false,
    calculable: true,
    color: color_pie,
    series: series_pie,
  },
  pie_m: {
    animation: false,
    calculable: true,
    color: color_pie,
    series: series_pie_m,
  },
  line: {
    color: color_line,
    grid,
    xAxis,
    yAxis,
    tooltip: { trigger: 'axis' },
    series: series_line,
  },
  // 散点图
  scatter: {
    color: color_bar,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid,
    xAxis: {
      type: 'value',
      axisTick,
      splitLine: splitLineHide,
      axisLine,
      axisLabel,
      name: '',
    },
    yAxis: {
      type: 'value',
      axisTick,
      splitLine: splitLineHide,
      axisLine,
      axisLabel,
      name: '',
    },
    series: series_scatter,
  },
  // 地图
  map: {
    animation: false,
    visualMap: {
      min: 0,
      max: 1000,
      hoverLink: false,
      show: false,
      color: ['#3a8dfb', '#39fdef'],
      textStyle: { color: '#fff' },
    },
    series: series_map,
  },
  // 散点图和地图结合
  'scatter-map': {
    animation: true,
    visualMap: {
      show: false,
      min: 0,
      max: 12,
      text: ['高', '低'], // 文本，默认为数值文本
      seriesIndex: [1],
      inRange: {
        color: ['#224786', '#e8e6f8'],
      },
    },
  },
  // 桑基图
  sankey: {
    series: {
      type: 'sankey',
      data: [],
    },
  },
  // 雷达图
  radar: {
    color: color_line,
    tooltip: {},

    series: merge(series_radar, {
      center: ['50%', '50%'],
      radius: '50%',
      name: {
        textStyle: {
          color: color_axisLabel,
          padding: [3, 5],
        },
      },
      splitArea: {
        areaStyle: {
          color: 'rgba(255,255,255,0)',
        },
      },
      indicator: [],
    }),
  },
  // 漏斗图
  funnel: {
    calculable: true,
    color: color_line,
    series: {
      name: '',
      type: 'funnel',
      funnelAlign: 'center',
      data: [],
    },
  },
  // 仪表盘
  gauge: {
    grid: {
      bottom: 'auto',
    },
  },
  // 180度的
  polarBar: {
    polar,
    radiusAxis,
    angleAxis,
    series_polarBar,
  },
  // 旭日图
  sunburst: {
    color: color_pie,
    series: series_sunburst,
    tooltip: {
      formatter: p => {
        if (!isString(p)) {
          // @ts-ignore
          if (p.name) {
            // @ts-ignore
            return p.marker + p.name + '：' + p.value
          } else {
            return '返回上一级'
          }
        } else {
          return p
        }
      },
    },
  },
}

export function getDefaultChartOpt(option: EChartsOption, type: ChartType) {
  return merge<EChartsOption>(allChartOpt[type], option)
}
