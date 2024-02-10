import { ApiProperty } from '@nestjs/swagger';

export class SpaceInfo {
  @ApiProperty({ description: '当月的X号', type: [Number] })
  times: number[];

  @ApiProperty({ description: '对应天数的容量, byte单位', type: [Number] })
  datas: number[];
}

export class CountInfo {
  @ApiProperty({ description: '当月的X号', type: [Number] })
  times: number[];

  @ApiProperty({ description: '对应天数的文件数量', type: [Number] })
  datas: number[];
}

export class FlowInfo {
  @ApiProperty({ description: '当月的X号', type: [Number] })
  times: number[];

  @ApiProperty({ description: '对应天数的耗费流量', type: [Number] })
  datas: number[];
}

export class HitInfo {
  @ApiProperty({ description: '当月的X号', type: [Number] })
  times: number[];

  @ApiProperty({ description: '对应天数的Get请求次数', type: [Number] })
  datas: number[];
}

export class OverviewSpaceInfo {
  @ApiProperty({ description: '当前使用容量' })
  spaceSize: number;

  @ApiProperty({ description: '当前文件数量' })
  fileSize: number;

  @ApiProperty({ description: '当天使用流量' })
  flowSize: number;

  @ApiProperty({ description: '当天请求次数' })
  hitSize: number;

  @ApiProperty({ description: '流量趋势，从当月1号开始计算', type: FlowInfo })
  flowTrend: FlowInfo;

  @ApiProperty({ description: '容量趋势，从当月1号开始计算', type: SpaceInfo })
  sizeTrend: SpaceInfo;
}
