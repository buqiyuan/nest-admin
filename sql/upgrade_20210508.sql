-- ----------------------------
-- 增加七牛文件空间
-- ----------------------------
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

--
-- 转存表中的数据 `sys_menu`
--
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:38:40.990691','2021-05-16 01:38:40.990691',72,null,'网盘空间','/netdisk',null,0,'netdisk',255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:39:06.265986','2021-05-16 01:39:06.265986',73,72,'空间管理','/netdisk/manage',null,1,'netdisk-manage',255,'views/netdisk/manage',1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:40:03.423681','2021-05-16 01:40:03.423681',74,73,'查询',null,'netdisk:manage:list',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:40:27.605473','2021-05-16 01:40:27.605473',75,73,'创建文件夹',null,'netdisk:manage:mkdir',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:40:42.986572','2021-05-16 01:40:42.986572',76,73,'上传',null,'netdisk:manage:token',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:40:57.687251','2021-05-16 01:41:36.000000',77,73,'重命名',null,'netdisk:manage:rename,netdisk:manage:check',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:41:15.070191','2021-05-16 01:41:15.070191',78,73,'下载',null,'netdisk:manage:download',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:41:56.637858','2021-05-16 01:41:56.637858',79,73,'删除',null,'netdisk:manage:delete,netdisk:manage:check',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 01:42:17.793185','2021-05-16 01:42:17.793185',80,73,'预览',null,'netdisk:manage:info',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-16 23:42:36.775883','2021-05-16 23:42:36.775883',81,73,'备注',null,'netdisk:manage:mark',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-20 21:53:56.574672','2021-05-20 21:53:56.574672',82,73,'复制',null,'netdisk:manage:check,netdisk:manage:copy',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-20 21:54:18.770632','2021-05-20 21:54:18.770632',83,73,'剪切',null,'netdisk:manage:check,netdisk:manage:cut',2,null,255,null,1,1);
INSERT INTO `sys_menu` (`created_at`,`updated_at`,`id`,`parent_id`,`name`,`router`,`perms`,`type`,`icon`,`order_num`,`view_path`,`keepalive`,`is_show`) VALUES ('2021-05-27 15:30:32.119664','2021-05-27 15:30:32.119664',84,72,'网盘概览','/netdisk/overview',null,1,'disk-overview',255,'views/netdisk/overview',1,1);