/**
 * 封装echarts
 * warning：通常情况下不需要安装@types/echarts，因为其中的type和echarts里的不同
 * @author joanoor
 */
import * as echarts from 'echarts'
import type { ECharts, EChartsOption, EChartsCoreOption } from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { debounce } from 'lodash-es'
import type { MoreOpt, ThemeOpt } from './types'

export class IChart {
  private echartInstance: ECharts

  constructor(el: HTMLElement, isRealRefresh = false, theme?: ThemeOpt) {
    this.echartInstance = this.initChart(el, isRealRefresh, theme)
  }

  /**
   * 初始化echart对象
   * @param el 传进来的dom对象
   * @param isRealRefresh 是否实时刷新chart，当通过接口实时返回数据，实时更新图表的时候，可以设置为true，否则设置为false
   * @param theme 主题
   */
  private initChart(el: HTMLElement, isRealRefresh = false, theme?: ThemeOpt) {
    // 获取dom容器上的char实例
    const _chart = echarts.getInstanceByDom(el)

    /**
     * 当含有主题的时候
     * 建议从https://echarts.apache.org/zh/theme-builder.html下载json格式的主题（是下载主题不是导出配置 📣 🎨）
     * @example
     * ```
     * 例如：下载了westeros.json主题文件，
     * 1、项目中引入
     * import theme from './westeros.json'
     * 或axios.get下载
     * axios.get('./westeros.json').then(res=>......)
     * 2、注册主题
     * echarts.registerTheme(name:string,theme:ThemeOpt)
     * 3、实例化的时候使用注册好的主题名称
     * echarts.init(el:HTMLElement, name:string)
     * 附录：或者不注册主题，在实例化的时候，直接使用主题选项
     * ```
     */
    if (theme) {
      echarts.registerTheme(theme.name, theme.theme)
    }

    const chart = _chart
      ? !isRealRefresh
        ? (echarts.dispose(_chart),
          echarts.init(el, theme ? theme.name : undefined))
        : _chart
      : echarts.init(el, theme ? theme.name : undefined)
    // 增加resize监听
    const erd = elementResizeDetectorMaker()
    erd.listenTo(
      el,
      debounce(() => this.resizeChart())
    )
    return chart
  }

  /**
   * 获取echart实例
   */
  getChartInstance() {
    return this.echartInstance
  }

  /**
   * 设置echart对象的option
   * @param chartOption 等同于echart的option
   * @param moreOpt 设置是否合并(默认合并)，懒更新，静默模式
   * [查看官方配置详情](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)
   */
  setOption(chartOption: EChartsOption, moreOpt?: MoreOpt) {
    this.echartInstance.setOption(chartOption, moreOpt)
  }

  /**
   * 当页面变化的时候，重新resize图表
   */
  resizeChart(): void {
    this.echartInstance.resize()
  }

  /**
   * 更新chart
   * @param chartOption
   * @param option
   */
  refreshChart(chartOption: EChartsOption, option?: MoreOpt): void {
    this.setOption(chartOption, option)
  }

  /**
   * 销毁chart实例
   */
  disposeChart() {
    this.echartInstance.dispose()
  }

  /**
   * 返回chart的option
   * @param el
   */
  getChartOption(el: HTMLCanvasElement): EChartsCoreOption | boolean {
    const _chart = echarts.getInstanceByDom(el)
    return _chart ? _chart.getOption() : false
  }
}
