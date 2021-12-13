import { Inject, Injectable } from '@nestjs/common';
import {
  NETDISK_COPY_SUFFIX,
  NETDISK_DELIMITER,
  NETDISK_HANDLE_MAX_ITEM,
  NETDISK_LIMIT,
  QINIU_CONFIG,
} from '../../admin.constants';
import { IQiniuConfig } from '../../admin.interface';
import * as qiniu from 'qiniu';
import { rs, conf, auth } from 'qiniu';
import { UtilService } from 'src/shared/services/util.service';
import { isEmpty } from 'lodash';
import { SFileInfo, SFileInfoDetail, SFileList } from './manage.class';
import { SysUserService } from '../../system/user/user.service';
import { AccountInfo } from '../../system/user/user.class';
import { extname, basename } from 'path';
import { FileOpItem } from './manage.dto';

@Injectable()
export class NetDiskManageService {
  private config: conf.ConfigOptions;
  private mac: auth.digest.Mac;
  private bucketManager: rs.BucketManager;

  constructor(
    @Inject(QINIU_CONFIG) private qiniuConfig: IQiniuConfig,
    private userService: SysUserService,
    private util: UtilService,
  ) {
    this.mac = new qiniu.auth.digest.Mac(
      this.qiniuConfig.accessKey,
      this.qiniuConfig.secretKey,
    );
    this.config = new qiniu.conf.Config({
      zone: this.qiniuConfig.zone,
    });
    // bucket manager
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }

  /**
   * 获取文件列表
   * @param prefix 当前文件夹路径，搜索模式下会被忽略
   * @param marker 下一页标识
   * @returns iFileListResult
   */
  async getFileList(prefix = '', marker = '', skey = ''): Promise<SFileList> {
    // 是否需要搜索
    const searching = !isEmpty(skey);
    return new Promise<SFileList>((resolve, reject) => {
      this.bucketManager.listPrefix(
        this.qiniuConfig.bucket,
        {
          prefix: searching ? '' : prefix,
          limit: NETDISK_LIMIT,
          delimiter: searching ? '' : NETDISK_DELIMITER,
          marker,
        },
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            // 如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
            // 指定options里面的marker为这个值
            const fileList: SFileInfo[] = [];
            // 处理目录，但只有非搜索模式下可用
            if (!searching && !isEmpty(respBody.commonPrefixes)) {
              // dir
              for (const dirPath of respBody.commonPrefixes) {
                const name = (dirPath as string)
                  .substr(0, dirPath.length - 1)
                  .replace(prefix, '');
                if (isEmpty(skey) || name.includes(skey)) {
                  fileList.push({
                    name: (dirPath as string)
                      .substr(0, dirPath.length - 1)
                      .replace(prefix, ''),
                    type: 'dir',
                    id: this.util.generateRandomValue(10),
                  });
                }
              }
            }
            // handle items
            if (!isEmpty(respBody.items)) {
              // file
              for (const item of respBody.items) {
                // 搜索模式下处理
                if (searching) {
                  const pathList: string[] = item.key.split(NETDISK_DELIMITER);
                  // dir is empty stirng, file is key string
                  const name = pathList.pop();
                  if (
                    item.key.endsWith(NETDISK_DELIMITER) &&
                    pathList[pathList.length - 1].includes(skey)
                  ) {
                    // 结果是目录
                    const ditName = pathList.pop();
                    fileList.push({
                      id: this.util.generateRandomValue(10),
                      name: ditName,
                      type: 'dir',
                      belongTo: pathList.join(NETDISK_DELIMITER),
                    });
                  } else if (name.includes(skey)) {
                    // 文件
                    fileList.push({
                      id: this.util.generateRandomValue(10),
                      name,
                      type: 'file',
                      fsize: item.fsize,
                      mimeType: item.mimeType,
                      putTime: new Date(parseInt(item.putTime) / 10000),
                      belongTo: pathList.join(NETDISK_DELIMITER),
                    });
                  }
                } else {
                  // 正常获取列表
                  const fileKey = item.key.replace(prefix, '') as string;
                  if (!isEmpty(fileKey)) {
                    fileList.push({
                      id: this.util.generateRandomValue(10),
                      name: fileKey,
                      type: 'file',
                      fsize: item.fsize,
                      mimeType: item.mimeType,
                      putTime: new Date(parseInt(item.putTime) / 10000),
                    });
                  }
                }
              }
            }
            resolve({
              list: fileList,
              marker: respBody.marker || null,
            });
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(name: string, path: string): Promise<SFileInfoDetail> {
    return new Promise((resolve, reject) => {
      this.bucketManager.stat(
        this.qiniuConfig.bucket,
        `${path}${name}`,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode == 200) {
            const detailInfo: SFileInfoDetail = {
              fsize: respBody.fsize,
              hash: respBody.hash,
              md5: respBody.md5,
              mimeType: respBody.mimeType.split('/x-qn-meta')[0],
              putTime: new Date(parseInt(respBody.putTime) / 10000),
              type: respBody.type,
              uploader: '',
              mark: respBody?.['x-qn-meta']?.['!mark'] ?? '',
            };
            if (!respBody.endUser) {
              resolve(detailInfo);
            } else {
              this.userService
                .getAccountInfo(parseInt(respBody.endUser))
                .then((user: AccountInfo) => {
                  if (isEmpty(user)) {
                    resolve(detailInfo);
                  } else {
                    detailInfo.uploader = user.name;
                    resolve(detailInfo);
                  }
                });
            }
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 修改文件MimeType
   */
  async changeFileHeaders(
    name: string,
    path: string,
    headers: { [k: string]: string },
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bucketManager.changeHeaders(
        this.qiniuConfig.bucket,
        `${path}${name}`,
        headers,
        (err, _, respInfo) => {
          if (err) {
            reject();
            return;
          }
          if (respInfo.statusCode == 200) {
            resolve();
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 创建文件夹
   * @returns true创建成功
   */
  async createDir(dirName: string): Promise<void> {
    const safeDirName = dirName.endsWith('/') ? dirName : `${dirName}/`;
    return new Promise((resolve, reject) => {
      // 上传一个空文件以用于显示文件夹效果
      const formUploader = new qiniu.form_up.FormUploader(this.config);
      const putExtra = new qiniu.form_up.PutExtra();
      formUploader.put(
        this.createUploadToken(''),
        safeDirName,
        ' ',
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve();
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 检查文件是否存在，同可检查目录
   */
  async checkFileExist(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // fix path end must a /

      // 检测文件夹是否存在
      this.bucketManager.stat(
        this.qiniuConfig.bucket,
        filePath,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            return;
          }
          if (respInfo.statusCode === 200) {
            // 文件夹存在
            resolve(true);
          } else if (respInfo.statusCode === 612) {
            // 文件夹不存在
            resolve(false);
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 创建Upload Token, 默认过期时间一小时
   * @returns upload token
   */
  createUploadToken(endUser: string): string {
    const policy = new qiniu.rs.PutPolicy({
      scope: this.qiniuConfig.bucket,
      insertOnly: 1,
      endUser,
    });
    const uploadToken = policy.uploadToken(this.mac);
    return uploadToken;
  }

  /**
   * 重命名文件
   * @param dir 文件路径
   * @param name 文件名称
   */
  async renameFile(dir: string, name: string, toName: string): Promise<void> {
    const fileName = `${dir}${name}`;
    const toFileName = `${dir}${toName}`;
    const op = {
      force: true,
    };
    return new Promise((resolve, reject) => {
      this.bucketManager.move(
        this.qiniuConfig.bucket,
        fileName,
        this.qiniuConfig.bucket,
        toFileName,
        op,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
          } else {
            if (respInfo.statusCode === 200) {
              resolve();
            } else {
              reject(
                new Error(
                  `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                ),
              );
            }
          }
        },
      );
    });
  }

  /**
   * 移动文件
   */
  async moveFile(dir: string, toDir: string, name: string): Promise<void> {
    const fileName = `${dir}${name}`;
    const toFileName = `${toDir}${name}`;
    const op = {
      force: true,
    };
    return new Promise((resolve, reject) => {
      this.bucketManager.move(
        this.qiniuConfig.bucket,
        fileName,
        this.qiniuConfig.bucket,
        toFileName,
        op,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
          } else {
            if (respInfo.statusCode === 200) {
              resolve();
            } else {
              reject(
                new Error(
                  `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                ),
              );
            }
          }
        },
      );
    });
  }

  /**
   * 复制文件
   */
  async copyFile(dir: string, toDir: string, name: string): Promise<void> {
    const fileName = `${dir}${name}`;
    // 拼接文件名
    const ext = extname(name);
    const bn = basename(name, ext);
    const toFileName = `${toDir}${bn}${NETDISK_COPY_SUFFIX}${ext}`;
    const op = {
      force: true,
    };
    return new Promise((resolve, reject) => {
      this.bucketManager.copy(
        this.qiniuConfig.bucket,
        fileName,
        this.qiniuConfig.bucket,
        toFileName,
        op,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
          } else {
            if (respInfo.statusCode === 200) {
              resolve();
            } else {
              reject(
                new Error(
                  `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                ),
              );
            }
          }
        },
      );
    });
  }

  /**
   * 重命名文件夹
   */
  async renameDir(path: string, name: string, toName: string): Promise<void> {
    const dirName = `${path}${name}`;
    const toDirName = `${path}${toName}`;
    let hasFile = true;
    let marker = '';
    const op = {
      force: true,
    };
    const bucketName = this.qiniuConfig.bucket;
    while (hasFile) {
      await new Promise<void>((resolve, reject) => {
        // 列举当前目录下的所有文件
        this.bucketManager.listPrefix(
          this.qiniuConfig.bucket,
          {
            prefix: dirName,
            limit: NETDISK_HANDLE_MAX_ITEM,
            marker,
          },
          (err, respBody, respInfo) => {
            if (err) {
              reject(err);
              return;
            }
            if (respInfo.statusCode === 200) {
              const moveOperations = respBody.items.map((item) => {
                const { key } = item;
                const destKey = key.replace(dirName, toDirName);
                return qiniu.rs.moveOp(
                  bucketName,
                  key,
                  bucketName,
                  destKey,
                  op,
                );
              });
              this.bucketManager.batch(
                moveOperations,
                (err2, respBody2, respInfo2) => {
                  if (err2) {
                    reject(err2);
                    return;
                  }
                  if (respInfo2.statusCode === 200) {
                    if (isEmpty(respBody.marker)) {
                      hasFile = false;
                    } else {
                      marker = respBody.marker;
                    }
                    resolve();
                  } else {
                    reject(
                      new Error(
                        `Qiniu Error Code: ${respInfo2.statusCode}, Info: ${respInfo2.statusMessage}`,
                      ),
                    );
                  }
                },
              );
            } else {
              reject(
                new Error(
                  `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                ),
              );
            }
          },
        );
      });
    }
  }

  /**
   * 获取七牛下载的文件url链接
   * @param key 文件路径
   * @returns 连接
   */
  getDownloadLink(key: string): string {
    if (this.qiniuConfig.access === 'public') {
      return this.bucketManager.publicDownloadUrl(this.qiniuConfig.domain, key);
    } else if (this.qiniuConfig.access === 'private') {
      return this.bucketManager.privateDownloadUrl(
        this.qiniuConfig.domain,
        key,
        Date.now() / 1000 + 36000,
      );
    }
    throw new Error('qiniu config access type not support');
  }

  /**
   * 删除文件
   * @param dir 删除的文件夹目录
   * @param name 文件名
   */
  async deleteFile(dir: string, name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(
        this.qiniuConfig.bucket,
        `${dir}${name}`,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve();
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 删除文件夹
   * @param dir 文件夹所在的上级目录
   * @param name 文件目录名称
   */
  async deleteMultiFileOrDir(
    fileList: FileOpItem[],
    dir: string,
  ): Promise<void> {
    const files = fileList.filter((item) => item.type === 'file');
    if (files.length > 0) {
      // 批处理文件
      const copyOperations = files.map((item) => {
        const fileName = `${dir}${item.name}`;
        return qiniu.rs.deleteOp(this.qiniuConfig.bucket, fileName);
      });
      await new Promise<void>((resolve, reject) => {
        this.bucketManager.batch(copyOperations, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve();
          } else if (respInfo.statusCode === 298) {
            reject(new Error('操作异常，但部分文件夹删除成功'));
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        });
      });
    }
    // 处理文件夹
    const dirs = fileList.filter((item) => item.type === 'dir');
    if (dirs.length > 0) {
      // 处理文件夹的复制
      for (let i = 0; i < dirs.length; i++) {
        const dirName = `${dir}${dirs[i].name}/`;
        let hasFile = true;
        let marker = '';
        while (hasFile) {
          await new Promise<void>((resolve, reject) => {
            // 列举当前目录下的所有文件
            this.bucketManager.listPrefix(
              this.qiniuConfig.bucket,
              {
                prefix: dirName,
                limit: NETDISK_HANDLE_MAX_ITEM,
                marker,
              },
              (err, respBody, respInfo) => {
                if (err) {
                  reject(err);
                  return;
                }
                if (respInfo.statusCode === 200) {
                  const moveOperations = respBody.items.map((item) => {
                    const { key } = item;
                    return qiniu.rs.deleteOp(this.qiniuConfig.bucket, key);
                  });
                  this.bucketManager.batch(
                    moveOperations,
                    (err2, respBody2, respInfo2) => {
                      if (err2) {
                        reject(err2);
                        return;
                      }
                      if (respInfo2.statusCode === 200) {
                        if (isEmpty(respBody.marker)) {
                          hasFile = false;
                        } else {
                          marker = respBody.marker;
                        }
                        resolve();
                      } else {
                        reject(
                          new Error(
                            `Qiniu Error Code: ${respInfo2.statusCode}, Info: ${respInfo2.statusMessage}`,
                          ),
                        );
                      }
                    },
                  );
                } else {
                  reject(
                    new Error(
                      `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                    ),
                  );
                }
              },
            );
          });
        }
      }
    }
  }

  /**
   * 复制文件，含文件夹
   */
  async copyMultiFileOrDir(
    fileList: FileOpItem[],
    dir: string,
    toDir: string,
  ): Promise<void> {
    const files = fileList.filter((item) => item.type === 'file');
    const op = {
      force: true,
    };
    if (files.length > 0) {
      // 批处理文件
      const copyOperations = files.map((item) => {
        const fileName = `${dir}${item.name}`;
        // 拼接文件名
        const ext = extname(item.name);
        const bn = basename(item.name, ext);
        const toFileName = `${toDir}${bn}${NETDISK_COPY_SUFFIX}${ext}`;
        return qiniu.rs.copyOp(
          this.qiniuConfig.bucket,
          fileName,
          this.qiniuConfig.bucket,
          toFileName,
          op,
        );
      });
      await new Promise<void>((resolve, reject) => {
        this.bucketManager.batch(copyOperations, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve();
          } else if (respInfo.statusCode === 298) {
            reject(new Error('操作异常，但部分文件夹删除成功'));
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        });
      });
    }
    // 处理文件夹
    const dirs = fileList.filter((item) => item.type === 'dir');
    if (dirs.length > 0) {
      // 处理文件夹的复制
      for (let i = 0; i < dirs.length; i++) {
        const dirName = `${dir}${dirs[i].name}/`;
        const copyDirName = `${toDir}${dirs[i].name}${NETDISK_COPY_SUFFIX}/`;
        let hasFile = true;
        let marker = '';
        while (hasFile) {
          await new Promise<void>((resolve, reject) => {
            // 列举当前目录下的所有文件
            this.bucketManager.listPrefix(
              this.qiniuConfig.bucket,
              {
                prefix: dirName,
                limit: NETDISK_HANDLE_MAX_ITEM,
                marker,
              },
              (err, respBody, respInfo) => {
                if (err) {
                  reject(err);
                  return;
                }
                if (respInfo.statusCode === 200) {
                  const moveOperations = respBody.items.map((item) => {
                    const { key } = item;
                    const destKey = key.replace(dirName, copyDirName);
                    return qiniu.rs.copyOp(
                      this.qiniuConfig.bucket,
                      key,
                      this.qiniuConfig.bucket,
                      destKey,
                      op,
                    );
                  });
                  this.bucketManager.batch(
                    moveOperations,
                    (err2, respBody2, respInfo2) => {
                      if (err2) {
                        reject(err2);
                        return;
                      }
                      if (respInfo2.statusCode === 200) {
                        if (isEmpty(respBody.marker)) {
                          hasFile = false;
                        } else {
                          marker = respBody.marker;
                        }
                        resolve();
                      } else {
                        reject(
                          new Error(
                            `Qiniu Error Code: ${respInfo2.statusCode}, Info: ${respInfo2.statusMessage}`,
                          ),
                        );
                      }
                    },
                  );
                } else {
                  reject(
                    new Error(
                      `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                    ),
                  );
                }
              },
            );
          });
        }
      }
    }
  }

  /**
   * 移动文件，含文件夹
   */
  async moveMultiFileOrDir(
    fileList: FileOpItem[],
    dir: string,
    toDir: string,
  ): Promise<void> {
    const files = fileList.filter((item) => item.type === 'file');
    const op = {
      force: true,
    };
    if (files.length > 0) {
      // 批处理文件
      const copyOperations = files.map((item) => {
        const fileName = `${dir}${item.name}`;
        const toFileName = `${toDir}${item.name}`;
        return qiniu.rs.moveOp(
          this.qiniuConfig.bucket,
          fileName,
          this.qiniuConfig.bucket,
          toFileName,
          op,
        );
      });
      await new Promise<void>((resolve, reject) => {
        this.bucketManager.batch(copyOperations, (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve();
          } else if (respInfo.statusCode === 298) {
            reject(new Error('操作异常，但部分文件夹删除成功'));
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        });
      });
    }
    // 处理文件夹
    const dirs = fileList.filter((item) => item.type === 'dir');
    if (dirs.length > 0) {
      // 处理文件夹的复制
      for (let i = 0; i < dirs.length; i++) {
        const dirName = `${dir}${dirs[i].name}/`;
        const toDirName = `${toDir}${dirs[i].name}/`;
        // 移动的目录不是是自己
        if (toDirName.startsWith(dirName)) {
          continue;
        }
        let hasFile = true;
        let marker = '';
        while (hasFile) {
          await new Promise<void>((resolve, reject) => {
            // 列举当前目录下的所有文件
            this.bucketManager.listPrefix(
              this.qiniuConfig.bucket,
              {
                prefix: dirName,
                limit: NETDISK_HANDLE_MAX_ITEM,
                marker,
              },
              (err, respBody, respInfo) => {
                if (err) {
                  reject(err);
                  return;
                }
                if (respInfo.statusCode === 200) {
                  const moveOperations = respBody.items.map((item) => {
                    const { key } = item;
                    const destKey = key.replace(dirName, toDirName);
                    return qiniu.rs.moveOp(
                      this.qiniuConfig.bucket,
                      key,
                      this.qiniuConfig.bucket,
                      destKey,
                      op,
                    );
                  });
                  this.bucketManager.batch(
                    moveOperations,
                    (err2, respBody2, respInfo2) => {
                      if (err2) {
                        reject(err2);
                        return;
                      }
                      if (respInfo2.statusCode === 200) {
                        if (isEmpty(respBody.marker)) {
                          hasFile = false;
                        } else {
                          marker = respBody.marker;
                        }
                        resolve();
                      } else {
                        reject(
                          new Error(
                            `Qiniu Error Code: ${respInfo2.statusCode}, Info: ${respInfo2.statusMessage}`,
                          ),
                        );
                      }
                    },
                  );
                } else {
                  reject(
                    new Error(
                      `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                    ),
                  );
                }
              },
            );
          });
        }
      }
    }
  }
}
