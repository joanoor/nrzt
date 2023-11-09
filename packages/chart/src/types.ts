import type { BarSeriesOption, XAXisComponentOption } from 'echarts'

export type ChartType =
  | 'mix'
  | 'vbar'
  | 'hbar'
  | 'pictorialBar'
  | 'pie'
  | 'pie_m'
  | 'line'
  | 'scatter'
  | 'map'
  | 'scatter-map'
  | 'sankey'
  | 'radar'
  | 'funnel'
  | 'gauge'
  | 'polarBar'
  | 'sunburst'

export interface CreateChartConfig {
  chartType?: ChartType
  theme?: ThemeOpt
  isRealRefresh?: boolean
  moreOpt?: MoreOpt
}

// echarts主题
export interface ThemeOpt {
  name: string
  theme: Recordable
}

// echarts更多设置
export interface MoreOpt {
  notMerge?: boolean
  replaceMerge?: string | string[]
  lazyUpdate?: boolean
}

export type LabelOption2 = PropValue<BarSeriesOption, 'label'>
export type LabelLineOption2 = PropValue<BarSeriesOption, 'labelLine'>
export type ItemStyleOption2 = PropValue<BarSeriesOption, 'itemStyle'>
export type AxisTickOption2 = PropValue<XAXisComponentOption, 'axisTick'>
export type AxisLabelOption2 = PropValue<XAXisComponentOption, 'axisLabel'>
export type SplitLineOption2 = XAXisComponentOption['splitLine']
export type AxisLineOption2 = PropValue<XAXisComponentOption, 'axisLine'>
export type AxisPointerOption2 = PropValue<XAXisComponentOption, 'axisPointer'>
