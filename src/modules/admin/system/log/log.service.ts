import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SysLoginLog from 'src/entities/admin/sys-login-log.entity';
import SysTaskLog from 'src/entities/admin/sys-task-log.entity';
import SysUser from 'src/entities/admin/sys-user.entity';
import { In, Repository } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { LoginLogInfo, TaskLogInfo } from './log.class';
import { UtilService } from '@/shared/services/util.service';

@Injectable()
export class SysLogService {
  constructor(
    @InjectRepository(SysLoginLog)
    private loginLogRepository: Repository<SysLoginLog>,
    @InjectRepository(SysTaskLog)
    private taskLogRepository: Repository<SysTaskLog>,
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,
    private readonly utilService: UtilService,
  ) {}

  /**
   * 记录登录日志
   */
  async saveLoginLog(uid: number, ip: string, ua: string): Promise<void> {
    const loginLocation = await this.utilService.getLocation(
      ip.split(',').at(-1).trim(),
    );
    await this.loginLogRepository.save({
      ip,
      loginLocation,
      userId: uid,
      ua,
    });
  }

  /**
   * 计算登录日志日志总数
   */
  async countLoginLog(): Promise<number> {
    const userIds = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id'])
      .getMany();
    return await this.loginLogRepository.count({
      where: { userId: In(userIds.map((n) => n.id)) },
    });
  }

  /**
   * 分页加载日志信息
   */
  async pageGetLoginLog(page: number, count: number): Promise<LoginLogInfo[]> {
    // const result = await this.getRepo().admin.sys.LoginLog.find({
    //   order: {
    //     id: 'DESC',
    //   },
    //   take: count,
    //   skip: page * count,
    // });
    const result = await this.loginLogRepository
      .createQueryBuilder('login_log')
      .innerJoinAndSelect('sys_user', 'user', 'login_log.user_id = user.id')
      .orderBy('login_log.created_at', 'DESC')
      .offset(page * count)
      .limit(count)
      .getRawMany();
    const parser = new UAParser();
    return result.map((e) => {
      const u = parser.setUA(e.login_log_ua).getResult();

      return {
        id: e.login_log_id,
        ip: e.login_log_ip,
        os: `${u.os.name} ${u.os.version}`,
        browser: `${u.browser.name} ${u.browser.version}`,
        time: e.login_log_created_at,
        username: e.user_username,
        loginLocation: e.login_log_login_location,
      };
    });
  }

  /**
   * 清空表中的所有数据
   */
  async clearLoginLog(): Promise<void> {
    await this.loginLogRepository.clear();
  }
  // ----- task

  /**
   * 记录任务日志
   */
  async recordTaskLog(
    tid: number,
    status: number,
    time?: number,
    err?: string,
  ): Promise<number> {
    const result = await this.taskLogRepository.save({
      taskId: tid,
      status,
      detail: err,
    });
    return result.id;
  }

  /**
   * 计算日志总数
   */
  async countTaskLog(): Promise<number> {
    return await this.taskLogRepository.count();
  }

  /**
   * 分页加载日志信息
   */
  async page(page: number, count: number): Promise<TaskLogInfo[]> {
    // const result = await this.getRepo().admin.sys.TaskLog.find({
    //   order: {
    //     id: 'DESC',
    //   },
    //   take: count,
    //   skip: page * count,
    // });
    // return result;
    const result = await this.taskLogRepository
      .createQueryBuilder('task_log')
      .leftJoinAndSelect('sys_task', 'task', 'task_log.task_id = task.id')
      .orderBy('task_log.id', 'DESC')
      .offset(page * count)
      .limit(count)
      .getRawMany();
    return result.map((e) => {
      return {
        id: e.task_log_id,
        taskId: e.task_id,
        name: e.task_name,
        createdAt: e.task_log_created_at,
        consumeTime: e.task_log_consume_time,
        detail: e.task_log_detail,
        status: e.task_log_status,
      };
    });
  }

  /**
   * 清空表中的所有数据
   */
  async clearTaskLog(): Promise<void> {
    await this.taskLogRepository.clear();
  }
}
