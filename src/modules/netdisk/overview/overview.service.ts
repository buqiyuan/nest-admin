import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import * as qiniu from 'qiniu'

import { IOssConfig, OssConfig } from '~/config'
import { OSS_API } from '~/constants/oss.constant'

import { CountInfo, FlowInfo, HitInfo, SpaceInfo } from './overview.dto'

@Injectable()
export class NetDiskOverviewService {
  private mac: qiniu.auth.digest.Mac
  private readonly FORMAT = 'YYYYMMDDHHmmss'

  constructor(
    @Inject(OssConfig.KEY) private qiniuConfig: IOssConfig,
    private readonly httpService: HttpService,
  ) {
    this.mac = new qiniu.auth.digest.Mac(
      this.qiniuConfig.accessKey,
      this.qiniuConfig.secretKey,
    )
  }

  /** 获取格式化后的起始和结束时间 */
  getStartAndEndDate(start: Date, end = new Date()) {
    return [dayjs(start).format(this.FORMAT), dayjs(end).format(this.FORMAT)]
  }

  /**
   * 获取数据统计接口路径
   * @see: https://developer.qiniu.com/kodo/3906/statistic-interface
   */
  getStatisticUrl(type: string, queryParams = {}) {
    const bucketKey = type === 'blob_io' ? '$bucket' : 'bucket'
    const defaultParams = {
      [bucketKey]: this.qiniuConfig.bucket,
      g: 'day',
    }
    const searchParams = new URLSearchParams({ ...defaultParams, ...queryParams })
    return decodeURIComponent(`${OSS_API}/v6/${type}?${searchParams}`)
  }

  /** 获取统计数据 */
  getStatisticData(url: string) {
    const accessToken = qiniu.util.generateAccessTokenV2(
      this.mac,
      url,
      'GET',
      'application/x-www-form-urlencoded',
    )
    return this.httpService.axiosRef.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `${accessToken}`,
      },
    })
  }

  /**
   * 获取当天零时
   */
  getZeroHourToDay(current: Date): Date {
    const year = dayjs(current).year()
    const month = dayjs(current).month()
    const date = dayjs(current).date()
    return new Date(year, month, date, 0)
  }

  /**
   * 获取当月1号零时
   */
  getZeroHourAnd1Day(current: Date): Date {
    const year = dayjs(current).year()
    const month = dayjs(current).month()
    return new Date(year, month, 1, 0)
  }

  /**
   * 该接口可以获取标准存储的当前存储量。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3908/statistic-space
   */
  async getSpace(beginDate: Date, endDate = new Date()): Promise<SpaceInfo> {
    const [begin, end] = this.getStartAndEndDate(beginDate, endDate)
    const url = this.getStatisticUrl('space', { begin, end })
    const { data } = await this.getStatisticData(url)
    return {
      datas: data.datas,
      times: data.times.map((e) => {
        return dayjs.unix(e).date()
      }),
    }
  }

  /**
   * 该接口可以获取标准存储的文件数量。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3914/count
   */
  async getCount(beginDate: Date, endDate = new Date()): Promise<CountInfo> {
    const [begin, end] = this.getStartAndEndDate(beginDate, endDate)
    const url = this.getStatisticUrl('count', { begin, end })
    const { data } = await this.getStatisticData(url)
    return {
      times: data.times.map((e) => {
        return dayjs.unix(e).date()
      }),
      datas: data.datas,
    }
  }

  /**
   * 外网流出流量统计
   * 该接口可以获取外网流出流量、CDN回源流量统计和 GET 请求次数。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3820/blob-io
   */
  async getFlow(beginDate: Date, endDate = new Date()): Promise<FlowInfo> {
    const [begin, end] = this.getStartAndEndDate(beginDate, endDate)
    const url = this.getStatisticUrl('blob_io', { begin, end, $ftype: 0, $src: 'origin', select: 'flow' })
    const { data } = await this.getStatisticData(url)
    const times = []
    const datas = []
    data.forEach((e) => {
      times.push(dayjs(e.time).date())
      datas.push(e.values.flow)
    })
    return {
      times,
      datas,
    }
  }

  /**
   * GET 请求次数统计
   * 该接口可以获取外网流出流量、CDN回源流量统计和 GET 请求次数。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3820/blob-io
   */
  async getHit(beginDate: Date, endDate = new Date()): Promise<HitInfo> {
    const [begin, end] = this.getStartAndEndDate(beginDate, endDate)
    const url = this.getStatisticUrl('blob_io', { begin, end, $ftype: 0, $src: 'inner', select: 'hit' })
    const { data } = await this.getStatisticData(url)
    const times = []
    const datas = []
    data.forEach((e) => {
      times.push(dayjs(e.time).date())
      datas.push(e.values.hit)
    })
    return {
      times,
      datas,
    }
  }
}
