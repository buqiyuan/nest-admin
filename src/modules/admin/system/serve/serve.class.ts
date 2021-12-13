import { ApiProperty } from '@nestjs/swagger';

export class Runtime {
  @ApiProperty({ description: '系统' })
  os?: string;

  @ApiProperty({ description: '服务器架构' })
  arch?: string;

  @ApiProperty({ description: 'Node版本' })
  nodeVersion?: string;

  @ApiProperty({ description: 'Npm版本' })
  npmVersion?: string;
}

export class CoreLoad {
  @ApiProperty({ description: '当前CPU资源消耗' })
  rawLoad?: number;

  @ApiProperty({ description: '当前空闲CPU资源' })
  rawLoadIdle?: number;
}

// Intel(R) Xeon(R) Platinum 8163 CPU @ 2.50GHz
export class Cpu {
  @ApiProperty({ description: '制造商 e.g. Intel(R)' })
  manufacturer?: string;

  @ApiProperty({ description: '品牌	e.g. Core(TM)2 Duo' })
  brand?: string;

  @ApiProperty({ description: '物理核心数' })
  physicalCores?: number;

  @ApiProperty({ description: '型号' })
  model?: string;

  @ApiProperty({ description: '速度 in GHz e.g. 3.4' })
  speed?: number;

  @ApiProperty({ description: 'CPU资源消耗 原始滴答' })
  rawCurrentLoad?: number;

  @ApiProperty({ description: '空闲CPU资源 原始滴答' })
  rawCurrentLoadIdle?: number;

  @ApiProperty({ description: 'cpu资源消耗', type: [CoreLoad] })
  coresLoad?: CoreLoad[];
}

export class Disk {
  @ApiProperty({ description: '磁盘空间大小 (bytes)' })
  size?: number;

  @ApiProperty({ description: '已使用磁盘空间 (bytes)' })
  used?: number;

  @ApiProperty({ description: '可用磁盘空间 (bytes)' })
  available?: number;
}

export class Memory {
  @ApiProperty({ description: 'total memory in bytes' })
  total?: number;

  @ApiProperty({ description: '可用内存' })
  available?: number;
}

/**
 * 系统信息
 */
export class ServeStatInfo {
  @ApiProperty({ description: '运行环境', type: Runtime })
  runtime?: Runtime;

  @ApiProperty({ description: 'CPU信息', type: Cpu })
  cpu?: Cpu;

  @ApiProperty({ description: '磁盘信息', type: Disk })
  disk?: Disk;

  @ApiProperty({ description: '内存信息', type: Memory })
  memory?: Memory;
}
