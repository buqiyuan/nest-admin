import { Inject, Injectable } from '@nestjs/common';
import { QINIU_API, QINIU_CONFIG } from '../../admin.constants';
import { IQiniuConfig } from '../../admin.interface';
import * as qiniu from 'qiniu';
import {
  getMonth,
  getYear,
  format,
  getDate,
  fromUnixTime,
  parseISO,
} from 'date-fns';
import { CountInfo, FlowInfo, HitInfo, SpaceInfo } from './overview.class';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NetDiskOverviewService {
  private mac: qiniu.auth.digest.Mac;
  private readonly FORMAT = 'yyyyMMddHHmmss';

  constructor(
    @Inject(QINIU_CONFIG) private qiniuConfig: IQiniuConfig,
    private readonly httpService: HttpService,
  ) {
    this.mac = new qiniu.auth.digest.Mac(
      this.qiniuConfig.accessKey,
      this.qiniuConfig.secretKey,
    );
  }

  /**
   * 获取当天零时
   */
  getZeroHourToDay(current: Date): Date {
    const month = getMonth(current);
    const year = getYear(current);
    const date = getDate(current);
    return new Date(year, month, date, 0);
  }

  /**
   * 获取当月1号零时
   */
  getZeroHourAnd1Day(current: Date): Date {
    const month = getMonth(current);
    const year = getYear(current);
    return new Date(year, month, 1, 0);
  }

  /**
   * 该接口可以获取标准存储的当前存储量。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3908/statistic-space
   */
  async getSpace(start: Date, end = new Date()): Promise<SpaceInfo> {
    const beginDate = format(start, this.FORMAT);
    const endDate = format(end, this.FORMAT);
    const url = `${QINIU_API}/v6/space?bucket=${this.qiniuConfig.bucket}&g=day&begin=${beginDate}&end=${endDate}`;
    const accessToken = qiniu.util.generateAccessTokenV2(
      this.mac,
      url,
      'GET',
      'application/x-www-form-urlencoded',
    );
    const { data } = await this.httpService.axiosRef.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `${accessToken}`,
      },
    });
    return {
      datas: data.datas,
      times: data.times.map((e) => {
        return getDate(fromUnixTime(e));
      }),
    };
  }

  /**
   * 该接口可以获取标准存储的文件数量。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3914/count
   */
  async getCount(start: Date, end = new Date()): Promise<CountInfo> {
    const beginDate = format(start, this.FORMAT);
    const endDate = format(end, this.FORMAT);
    const url = `${QINIU_API}/v6/count?bucket=${this.qiniuConfig.bucket}&g=day&begin=${beginDate}&end=${endDate}`;
    const accessToken = qiniu.util.generateAccessTokenV2(
      this.mac,
      url,
      'GET',
      'application/x-www-form-urlencoded',
    );
    const { data } = await this.httpService.axiosRef.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `${accessToken}`,
      },
    });
    return {
      times: data.times.map((e) => {
        return getDate(fromUnixTime(e));
      }),
      datas: data.datas,
    };
  }

  /**
   * 外网流出流量统计
   * 该接口可以获取外网流出流量、CDN回源流量统计和 GET 请求次数。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3820/blob-io
   */
  async getFlow(start: Date, end = new Date()): Promise<FlowInfo> {
    const beginDate = format(start, this.FORMAT);
    const endDate = format(end, this.FORMAT);
    const url = `${QINIU_API}/v6/blob_io?$bucket=${this.qiniuConfig.bucket}&g=day&$ftype=0&begin=${beginDate}&end=${endDate}&$src=origin&select=flow`;
    const accessToken = qiniu.util.generateAccessTokenV2(
      this.mac,
      url,
      'GET',
      'application/x-www-form-urlencoded',
    );
    const { data } = await this.httpService.axiosRef.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `${accessToken}`,
      },
    });
    const times = [];
    const datas = [];
    data.forEach((e) => {
      times.push(getDate(parseISO(e.time)));
      datas.push(e.values.flow);
    });
    return {
      times,
      datas,
    };
  }

  /**
   * GET 请求次数统计
   * 该接口可以获取外网流出流量、CDN回源流量统计和 GET 请求次数。可查询当天计量，统计延迟大概 5 分钟。
   * https://developer.qiniu.com/kodo/3820/blob-io
   */
  async getHit(start: Date, end = new Date()): Promise<HitInfo> {
    const beginDate = format(start, this.FORMAT);
    const endDate = format(end, this.FORMAT);
    const url = `${QINIU_API}/v6/blob_io?$bucket=${this.qiniuConfig.bucket}&g=day&$ftype=0&begin=${beginDate}&end=${endDate}&$src=origin&$src=inner&select=hit`;
    const accessToken = qiniu.util.generateAccessTokenV2(
      this.mac,
      url,
      'GET',
      'application/x-www-form-urlencoded',
    );
    const { data } = await this.httpService.axiosRef.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `${accessToken}`,
      },
    });
    const times = [];
    const datas = [];
    data.forEach((e) => {
      times.push(getDate(parseISO(e.time)));
      datas.push(e.values.hit);
    });
    return {
      times,
      datas,
    };
  }
}
