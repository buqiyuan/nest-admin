import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';
import { Disk, ServeStatInfo } from './serve.class';

@Injectable()
export class SysServeService {
  /**
   * 获取服务器信息
   */
  async getServeStat(): Promise<ServeStatInfo> {
    const versions = await si.versions('node, npm');
    const osinfo = await si.osInfo();
    const cpuinfo = await si.cpu();
    const currentLoadinfo = await si.currentLoad();

    // 计算总空间
    const diskListInfo = await si.fsSize();
    const diskinfo = new Disk();
    diskinfo.size = diskListInfo[0].size;
    diskinfo.available = diskListInfo[0].available;
    diskinfo.used = 0;
    diskListInfo.forEach((d) => {
      diskinfo.used += d.used;
    });

    const meminfo = await si.mem();

    return {
      runtime: {
        npmVersion: versions.npm,
        nodeVersion: versions.node,
        os: osinfo.platform,
        arch: osinfo.arch,
      },
      cpu: {
        manufacturer: cpuinfo.manufacturer,
        brand: cpuinfo.brand,
        physicalCores: cpuinfo.physicalCores,
        model: cpuinfo.model,
        speed: cpuinfo.speed,
        rawCurrentLoad: currentLoadinfo.rawCurrentLoad,
        rawCurrentLoadIdle: currentLoadinfo.rawCurrentLoadIdle,
        coresLoad: currentLoadinfo.cpus.map((e) => {
          return {
            rawLoad: e.rawLoad,
            rawLoadIdle: e.rawLoadIdle,
          };
        }),
      },
      disk: diskinfo,
      memory: {
        total: meminfo.total,
        available: meminfo.available,
      },
    };
  }
}
