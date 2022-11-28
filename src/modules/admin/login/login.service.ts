import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import * as svgCaptcha from 'svg-captcha';
import { UtilService } from 'src/shared/services/util.service';
import { ApiException } from 'src/common/exceptions/api.exception';
import { RedisService } from 'src/shared/services/redis.service';
import { SysLogService } from '../system/log/log.service';
import { SysUserService } from '../system/user/user.service';
import { SysMenuService } from '../system/menu/menu.service';
import { ImageCaptchaDto } from './login.dto';
import { ImageCaptcha, PermMenuInfo } from './login.class';

@Injectable()
export class LoginService {
  constructor(
    private redisService: RedisService,
    private menuService: SysMenuService,
    private userService: SysUserService,
    private logService: SysLogService,
    private util: UtilService,
    private jwtService: JwtService,
  ) {}

  /**
   * 创建验证码并缓存加入redis缓存
   * @param captcha 验证码长宽
   * @returns svg & id obj
   */
  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: this.util.generateUUID(), // this.utils.generateUUID()
    };
    // 5分钟过期时间
    await this.redisService
      .getRedis()
      .set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
    return result;
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redisService
      .getRedis()
      .get(`admin:captcha:img:${id}`);
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) {
      throw new ApiException(10002);
    }
    // 校验成功后移除验证码
    await this.redisService.getRedis().del(`admin:captcha:img:${id}`);
  }

  /**
   * 获取登录JWT
   * 返回null则账号密码有误，不存在该用户
   */
  async getLoginSign(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<string> {
    const user = await this.userService.findUserByUserName(username);
    if (isEmpty(user)) {
      throw new ApiException(10003);
    }
    const comparePassword = this.util.md5(`${password}${user.psalt}`);
    if (user.password !== comparePassword) {
      throw new ApiException(10003);
    }
    const perms = await this.menuService.getPerms(user.id);
    // TODO 系统管理员开放多点登录
    if (user.id === 1) {
      const oldToken = await this.getRedisTokenById(user.id);
      if (oldToken) {
        this.logService.saveLoginLog(user.id, ip, ua);
        return oldToken;
      }
    }
    const jwtSign = this.jwtService.sign(
      {
        uid: parseInt(user.id.toString()),
        pv: 1,
      },
      // {
      //   expiresIn: '24h',
      // },
    );
    await this.redisService
      .getRedis()
      .set(`admin:passwordVersion:${user.id}`, 1);
    // Token设置过期时间 24小时
    await this.redisService
      .getRedis()
      .set(`admin:token:${user.id}`, jwtSign, 'EX', 60 * 60 * 24);
    await this.redisService
      .getRedis()
      .set(`admin:perms:${user.id}`, JSON.stringify(perms));
    await this.logService.saveLoginLog(user.id, ip, ua);
    return jwtSign;
  }

  /**
   * 清除登录状态信息
   */
  async clearLoginStatus(uid: number): Promise<void> {
    await this.userService.forbidden(uid);
  }

  /**
   * 获取权限菜单
   */
  async getPermMenu(uid: number): Promise<PermMenuInfo> {
    const menus = await this.menuService.getMenus(uid);
    const perms = await this.menuService.getPerms(uid);
    return { menus, perms };
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:token:${id}`);
  }

  async getRedisPermsById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:perms:${id}`);
  }
}
