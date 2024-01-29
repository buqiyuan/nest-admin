import { Injectable } from '@nestjs/common'
import * as si from 'systeminformation'

import { Disk, ServeStatInfo } from './serve.model'

@Injectable()
export class ServeService {
  /**
   * 获取服务器信息
   */
  async getServeStat(): Promise<ServeStatInfo> {
    const [versions, osinfo, cpuinfo, currentLoadinfo, meminfo] = (
      await Promise.allSettled([
        si.versions('node, npm'),
        si.osInfo(),
        si.cpu(),
        si.currentLoad(),
        si.mem(),
      ])
    ).map((p: any) => p.value)

    // 计算总空间
    const diskListInfo = await si.fsSize()
    const diskinfo = new Disk()
    diskinfo.size = 0
    diskinfo.available = 0
    diskinfo.used = 0
    diskListInfo.forEach((d) => {
      diskinfo.size += d.size
      diskinfo.available += d.available
      diskinfo.used += d.used
    })

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
          }
        }),
      },
      disk: diskinfo,
      memory: {
        total: meminfo.total,
        available: meminfo.available,
      },
    }
  }
}
