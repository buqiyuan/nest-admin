/*
 Navicat Premium Data Transfer

 Source Server         : nest-admin
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:13307
 Source Schema         : nest_admin

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 28/02/2024 22:35:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_captcha_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_captcha_log`;
CREATE TABLE `sys_captcha_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `account` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_captcha_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_2c363c25cf99bcaab3a7f389ba` (`key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_config
-- ----------------------------
BEGIN;
INSERT INTO `sys_config` (`id`, `key`, `name`, `value`, `remark`, `created_at`, `updated_at`) VALUES (1, 'sys_user_initPassword', '初始密码', '123456', '创建管理员账号的初始密码', '2023-11-10 00:31:44.154921', '2023-11-10 00:31:44.161263');
INSERT INTO `sys_config` (`id`, `key`, `name`, `value`, `remark`, `created_at`, `updated_at`) VALUES (2, 'sys_api_token', 'API Token', 'nest-admin', '用于请求 @ApiToken 的控制器', '2023-11-10 00:31:44.154921', '2024-01-29 09:52:27.000000');
COMMIT;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `orderNo` int DEFAULT '0',
  `mpath` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `parentId` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_c75280b01c49779f2323536db67` (`parentId`) USING BTREE,
  CONSTRAINT `FK_c75280b01c49779f2323536db67` FOREIGN KEY (`parentId`) REFERENCES `sys_dept` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
BEGIN;
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (1, '华东分部', 1, '1.', NULL, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (2, '研发部', 1, '1.2.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (3, '市场部', 2, '1.3.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (4, '商务部', 3, '1.4.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (5, '财务部', 4, '1.5.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (6, '华南分部', 2, '6.', NULL, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (7, '西北分部', 3, '7.', NULL, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (8, '研发部', 1, '6.8.', 6, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
INSERT INTO `sys_dept` (`id`, `name`, `orderNo`, `mpath`, `parentId`, `created_at`, `updated_at`) VALUES (9, '市场部', 1, '6.9.', 6, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');
COMMIT;

-- ----------------------------
-- Table structure for sys_dict
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE `sys_dict` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int NOT NULL COMMENT '创建者',
  `update_by` int NOT NULL COMMENT '更新者',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d112365748f740ee260b65ce91` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of sys_dict
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_item
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_item`;
CREATE TABLE `sys_dict_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int NOT NULL COMMENT '创建者',
  `update_by` int NOT NULL COMMENT '更新者',
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order` int DEFAULT NULL COMMENT '字典项排序',
  `status` tinyint NOT NULL DEFAULT '1',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type_id` int DEFAULT NULL,
  `orderNo` int DEFAULT NULL COMMENT '字典项排序',
  PRIMARY KEY (`id`),
  KEY `FK_d68ea74fcb041c8cfd1fd659844` (`type_id`),
  CONSTRAINT `FK_d68ea74fcb041c8cfd1fd659844` FOREIGN KEY (`type_id`) REFERENCES `sys_dict_type` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of sys_dict_item
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_item` (`id`, `created_at`, `updated_at`, `create_by`, `update_by`, `label`, `value`, `order`, `status`, `remark`, `type_id`, `orderNo`) VALUES (1, '2024-01-29 01:24:51.846135', '2024-01-29 02:23:19.000000', 1, 1, '男', '1', 0, 1, '性别男', 1, 3);
INSERT INTO `sys_dict_item` (`id`, `created_at`, `updated_at`, `create_by`, `update_by`, `label`, `value`, `order`, `status`, `remark`, `type_id`, `orderNo`) VALUES (2, '2024-01-29 01:32:58.458741', '2024-01-29 01:58:20.000000', 1, 1, '女', '0', 1, 1, '性别女', 1, 2);
INSERT INTO `sys_dict_item` (`id`, `created_at`, `updated_at`, `create_by`, `update_by`, `label`, `value`, `order`, `status`, `remark`, `type_id`, `orderNo`) VALUES (3, '2024-01-29 01:59:17.805394', '2024-01-29 14:37:18.000000', 1, 1, '人妖王', '3', NULL, 1, '安布里奥·伊万科夫', 1, 0);
INSERT INTO `sys_dict_item` (`id`, `created_at`, `updated_at`, `create_by`, `update_by`, `label`, `value`, `order`, `status`, `remark`, `type_id`, `orderNo`) VALUES (5, '2024-01-29 02:13:01.782466', '2024-01-29 02:13:01.782466', 1, 1, '显示', '1', NULL, 1, '显示菜单', 2, 0);
INSERT INTO `sys_dict_item` (`id`, `created_at`, `updated_at`, `create_by`, `update_by`, `label`, `value`, `order`, `status`, `remark`, `type_id`, `orderNo`) VALUES (6, '2024-01-29 02:13:31.134721', '2024-01-29 02:13:31.134721', 1, 1, '隐藏', '0', NULL, 1, '隐藏菜单', 2, 0);
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int NOT NULL COMMENT '创建者',
  `update_by` int NOT NULL COMMENT '更新者',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_74d0045ff7fab9f67adc0b1bda` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_type` (`id`, `created_at`, `updated_at`, `create_by`, `update_by`, `name`, `status`, `remark`, `code`) VALUES (1, '2024-01-28 08:19:12.777447', '2024-02-08 13:05:10.000000', 1, 1, '性别', 1, '性别单选', 'sys_user_gender');
INSERT INTO `sys_dict_type` (`id`, `created_at`, `updated_at`, `create_by`, `update_by`, `name`, `status`, `remark`, `code`) VALUES (2, '2024-01-28 08:38:41.235185', '2024-01-29 02:11:33.000000', 1, 1, '菜单显示状态', 1, '菜单显示状态', 'sys_show_hide');
COMMIT;

-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ua` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_3029712e0df6a28edaee46fd470` (`user_id`),
  CONSTRAINT `FK_3029712e0df6a28edaee46fd470` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_login_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` tinyint NOT NULL DEFAULT '0',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `order_no` int DEFAULT '0',
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `keep_alive` tinyint NOT NULL DEFAULT '1',
  `show` tinyint NOT NULL DEFAULT '1',
  `status` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `is_ext` tinyint NOT NULL DEFAULT '0',
  `ext_open_mode` tinyint NOT NULL DEFAULT '1',
  `active_menu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (1, NULL, '/system', '系统管理', '', 0, 'ant-design:setting-outlined', 254, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (2, 1, '/system/user', '用户管理', 'system:user:list', 1, 'ant-design:user-outlined', 0, 'system/user/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (3, 1, '/system/role', '角色管理', 'system:role:list', 1, 'ep:user', 1, 'system/role/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (4, 1, '/system/menu', '菜单管理', 'system:menu:list', 1, 'ep:menu', 2, 'system/menu/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (5, 1, '/system/monitor', '系统监控', '', 0, 'ep:monitor', 5, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (6, 5, '/system/monitor/online', '在线用户', 'system:online:list', 1, '', 0, 'system/monitor/online/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (7, 5, '/sys/monitor/login-log', '登录日志', 'system:log:login:list', 1, '', 0, 'system/monitor/log/login/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (8, 5, '/system/monitor/serve', '服务监控', 'system:serve:stat', 1, '', 4, 'system/monitor/serve/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (9, 1, '/system/schedule', '任务调度', '', 0, 'ant-design:schedule-filled', 6, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (10, 9, '/system/task', '任务管理', '', 1, '', 0, 'system/schedule/task/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (11, 9, '/system/task/log', '任务日志', 'system:task:list', 1, '', 0, 'system/schedule/log/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (12, NULL, '/document', '文档', '', 0, 'ion:tv-outline', 2, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (14, 12, 'https://www.typeorm.org/', 'Typeorm中文文档(外链)', NULL, 1, '', 3, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 1, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (15, 12, 'https://docs.nestjs.cn/', 'Nest.js中文文档(内嵌)', '', 1, '', 4, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 1, 2, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (20, 2, NULL, '新增', 'system:user:create', 2, '', 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (21, 2, '', '删除', 'system:user:delete', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (22, 2, '', '更新', 'system:user:update', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (23, 2, '', '查询', 'system:user:read', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (24, 3, '', '新增', 'system:role:create', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (25, 3, '', '删除', 'system:role:delete', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (26, 3, '', '修改', 'system:role:update', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (27, 3, '', '查询', 'system:role:read', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (28, 4, NULL, '新增', 'system:menu:create', 2, NULL, 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (29, 4, NULL, '删除', 'system:menu:delete', 2, NULL, 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (30, 4, '', '修改', 'system:menu:update', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (31, 4, NULL, '查询', 'system:menu:read', 2, NULL, 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (32, 6, '', '下线', 'system:online:kick', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (34, 10, '', '新增', 'system:task:create', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (35, 10, '', '删除', 'system:task:delete', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (36, 10, '', '执行一次', 'system:task:once', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (37, 10, '', '查询', 'system:task:read', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (38, 10, '', '运行', 'system:task:start', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (39, 10, '', '暂停', 'system:task:stop', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (40, 10, '', '更新', 'system:task:update', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (41, 7, '', '查询登录日志', 'system:log:login:list', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (42, 7, '', '查询任务日志', 'system:log:task:list', 2, '', 0, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (43, NULL, '/about', '关于', '', 1, 'ant-design:info-circle-outlined', 260, 'account/about', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (48, NULL, '/tool', '系统工具', NULL, 0, 'ant-design:tool-outlined', 254, '', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (49, 48, '/tool/email', '邮件工具', 'system:tools:email', 1, 'ant-design:send-outlined', 1, 'tool/email/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (50, 49, NULL, '发送邮件', 'tools:email:send', 2, '', 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (51, 48, '/tool/storage', '存储管理', 'tool:storage:list', 1, 'ant-design:appstore-outlined', 2, 'tool/storage/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (52, 51, NULL, '文件上传', 'upload:upload', 2, '', 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (53, 51, NULL, '文件删除', 'tool:storage:delete', 2, '', 2, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (54, 2, NULL, '修改密码', 'system:user:password', 2, '', 5, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (56, 1, '/system/dict-type', '字典管理', 'system:dict-type:list', 1, 'ant-design:book-outlined', 4, 'system/dict-type/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (57, 56, NULL, '新增', 'system:dict-type:create', 2, '', 1, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (58, 56, NULL, '更新', 'system:dict-type:update', 2, '', 2, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (59, 56, NULL, '删除', 'system:dict-type:delete', 2, '', 3, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (60, 56, NULL, '查询', 'system:dict-type:info', 2, '', 4, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (61, 1, '/system/dept', '部门管理', 'system:dept:list', 1, 'ant-design:deployment-unit-outlined', 3, 'system/dept/index', 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (62, 61, NULL, '新增', 'system:dept:create', 2, '', 1, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (63, 61, NULL, '更新', 'system:dept:update', 2, '', 2, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (64, 61, NULL, '删除', 'system:dept:delete', 2, '', 3, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (65, 61, NULL, '查询', 'system:dept:read', 2, '', 4, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (68, 5, '/health', '健康检查', '', 1, '', 4, '', 0, 0, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (69, 68, NULL, '网络', 'app:health:network', 2, '', 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (70, 68, NULL, '数据库', 'app:health: database', 2, '', 0, NULL, 0, 1, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (86, 1, '/param-config', '参数配置', 'system:param-config:list', 1, 'ep:edit', 255, 'system/param-config/index', 0, 1, 1, '2024-01-10 17:34:52.569663', '2024-01-19 02:11:27.000000', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (87, 86, NULL, '查询', 'system:param-config:read', 2, '', 255, NULL, 0, 1, 1, '2024-01-10 17:39:20.983241', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (88, 86, NULL, '新增', 'system:param-config:create', 2, '', 255, NULL, 0, 1, 1, '2024-01-10 17:39:57.543510', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (89, 86, NULL, '更新', 'system:param-config:update', 2, '', 255, NULL, 0, 1, 1, '2024-01-10 17:40:27.355944', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (92, 86, NULL, '删除', 'system:param-config:delete', 2, '', 255, NULL, 0, 1, 1, '2024-01-10 17:57:32.059887', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (107, 1, 'system/dict-item/:id', '字典项管理', 'system:dict-item:list', 1, 'ant-design:facebook-outlined', 255, 'system/dict-item/index', 0, 0, 1, '2024-01-28 09:21:17.409532', '2024-01-30 13:09:47.000000', 0, 1, '字典管理');
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (108, 107, NULL, '新增', 'system:dict-item:create', 2, '', 255, NULL, 0, 1, 1, '2024-01-28 09:22:39.401758', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (109, 107, NULL, '更新', 'system:dict-item:update', 2, '', 255, NULL, 0, 1, 1, '2024-01-28 09:26:43.911886', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (110, 107, NULL, '删除', 'system:dict-item:delete', 2, '', 255, NULL, 0, 1, 1, '2024-01-28 09:27:28.535225', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (111, 107, NULL, '查询', 'system:dict-item:info', 2, '', 255, NULL, 0, 1, 1, '2024-01-28 09:27:43.894820', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (112, 12, 'https://antdv.com/components/overview-cn', 'antdv文档(内嵌)', NULL, 1, '', 255, NULL, 0, 1, 1, '2024-01-29 09:23:08.407723', '2024-02-28 22:05:52.102649', 1, 2, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (115, NULL, 'netdisk', '网盘管理', NULL, 0, 'ant-design:cloud-server-outlined', 255, NULL, 0, 1, 1, '2024-02-10 08:00:02.394616', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (116, 115, 'manage', '文件管理', 'netdisk:manage:list', 1, '', 252, 'netdisk/manage', 0, 1, 1, '2024-02-10 08:03:49.837348', '2024-02-10 09:34:41.000000', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (117, 116, NULL, '创建文件或文件夹', 'netdisk:manage:create', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:40:22.317257', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (118, 116, NULL, '查看文件', 'netdisk:manage:read', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:41:22.008015', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (119, 116, NULL, '更新', 'netdisk:manage:update', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:41:50.691643', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (120, 116, NULL, '删除', 'netdisk:manage:delete', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:42:09.480601', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (121, 116, NULL, '获取文件上传token', 'netdisk:manage:token', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:42:57.688104', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (122, 116, NULL, '添加文件备注', 'netdisk:manage:mark', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:43:40.117321', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (123, 116, NULL, '下载文件', 'netdisk:manage:download', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:44:01.338984', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (124, 116, NULL, '重命名文件或文件夹', 'netdisk:manage:rename', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:44:27.233379', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (125, 116, NULL, '复制文件或文件夹', 'netdisk:manage:copy', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:44:44.725391', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (126, 116, NULL, '剪切文件或文件夹', 'netdisk:manage:cut', 2, '', 255, NULL, 0, 1, 1, '2024-02-10 08:45:21.660511', '2024-02-28 22:05:52.102649', 0, 1, NULL);
INSERT INTO `sys_menu` (`id`, `parent_id`, `path`, `name`, `permission`, `type`, `icon`, `order_no`, `component`, `keep_alive`, `show`, `status`, `created_at`, `updated_at`, `is_ext`, `ext_open_mode`, `active_menu`) VALUES (127, 115, 'overview', '网盘概览', 'netdisk:overview:desc', 1, '', 254, 'netdisk/overview', 0, 1, 1, '2024-02-10 09:32:56.981190', '2024-02-10 09:34:18.000000', 0, 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `default` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_223de54d6badbe43a5490450c3` (`name`) USING BTREE,
  UNIQUE KEY `IDX_05edc0a51f41bb16b7d8137da9` (`value`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` (`id`, `value`, `name`, `remark`, `status`, `created_at`, `updated_at`, `default`) VALUES (1, 'admin', '管理员', '超级管理员', 1, '2023-11-10 00:31:44.058463', '2024-01-28 21:08:39.000000', NULL);
INSERT INTO `sys_role` (`id`, `value`, `name`, `remark`, `status`, `created_at`, `updated_at`, `default`) VALUES (2, 'user', '用户', '', 1, '2023-11-10 00:31:44.058463', '2024-01-30 18:44:45.000000', 1);
INSERT INTO `sys_role` (`id`, `value`, `name`, `remark`, `status`, `created_at`, `updated_at`, `default`) VALUES (9, 'test', '测试', NULL, 1, '2024-01-23 22:46:52.408827', '2024-01-30 01:04:52.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menus
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menus`;
CREATE TABLE `sys_role_menus` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `IDX_35ce749b04d57e226d059e0f63` (`role_id`),
  KEY `IDX_2b95fdc95b329d66c18f5baed6` (`menu_id`),
  CONSTRAINT `FK_2b95fdc95b329d66c18f5baed6d` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_35ce749b04d57e226d059e0f633` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_role_menus
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 1);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 2);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 3);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 4);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 5);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 6);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 7);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 8);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 9);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 10);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 11);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 12);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 14);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 15);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 20);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 21);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 22);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 23);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 24);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 25);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 26);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 27);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 28);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 29);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 30);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 31);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 32);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 34);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 35);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 36);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 37);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 38);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 39);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 40);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 41);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 42);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 43);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 48);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 49);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 50);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 51);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 52);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 53);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 54);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 56);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 57);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 58);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 59);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 60);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 61);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 62);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 63);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 64);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 65);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 68);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 69);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 70);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 86);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 87);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 88);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 89);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 92);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 107);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 108);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 109);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 110);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (1, 111);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 1);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 5);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 6);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 7);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 8);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 9);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 10);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 11);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 12);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 14);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 15);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 32);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 34);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 35);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 36);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 37);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 38);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 39);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 40);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 41);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 42);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 43);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 48);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 49);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 50);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 51);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 52);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 53);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 56);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 57);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 58);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 59);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 60);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 68);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 69);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 70);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 86);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 87);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 88);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 89);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 92);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 107);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 108);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 109);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 110);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 111);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (2, 112);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 1);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 2);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 3);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 4);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 5);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 6);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 7);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 8);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 9);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 10);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 11);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 20);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 21);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 22);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 23);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 24);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 25);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 26);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 27);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 28);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 29);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 30);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 31);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 32);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 34);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 35);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 36);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 37);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 38);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 39);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 40);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 41);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 42);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 54);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 56);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 57);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 58);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 59);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 60);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 61);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 62);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 63);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 64);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 65);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 68);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 69);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 70);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 86);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 87);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 88);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 89);
INSERT INTO `sys_role_menus` (`role_id`, `menu_id`) VALUES (9, 92);
COMMIT;

-- ----------------------------
-- Table structure for sys_task
-- ----------------------------
DROP TABLE IF EXISTS `sys_task`;
CREATE TABLE `sys_task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `service` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` tinyint NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '1',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `limit` int DEFAULT '0',
  `cron` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `every` int DEFAULT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `job_opts` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_ef8e5ab5ef2fe0ddb1428439ef` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_task
-- ----------------------------
BEGIN;
INSERT INTO `sys_task` (`id`, `name`, `service`, `type`, `status`, `start_time`, `end_time`, `limit`, `cron`, `every`, `data`, `job_opts`, `remark`, `created_at`, `updated_at`) VALUES (2, '定时清空登录日志', 'LogClearJob.clearLoginLog', 0, 1, NULL, NULL, 0, '0 0 3 ? * 1', 0, '', '{\"count\":1,\"key\":\"__default__:2:::0 0 3 ? * 1\",\"cron\":\"0 0 3 ? * 1\",\"jobId\":2}', '定时清空登录日志', '2023-11-10 00:31:44.197779', '2024-02-28 22:34:53.000000');
INSERT INTO `sys_task` (`id`, `name`, `service`, `type`, `status`, `start_time`, `end_time`, `limit`, `cron`, `every`, `data`, `job_opts`, `remark`, `created_at`, `updated_at`) VALUES (3, '定时清空任务日志', 'LogClearJob.clearTaskLog', 0, 1, NULL, NULL, 0, '0 0 3 ? * 1', 0, '', '{\"count\":1,\"key\":\"__default__:3:::0 0 3 ? * 1\",\"cron\":\"0 0 3 ? * 1\",\"jobId\":3}', '定时清空任务日志', '2023-11-10 00:31:44.197779', '2024-02-28 22:34:53.000000');
INSERT INTO `sys_task` (`id`, `name`, `service`, `type`, `status`, `start_time`, `end_time`, `limit`, `cron`, `every`, `data`, `job_opts`, `remark`, `created_at`, `updated_at`) VALUES (4, '访问百度首页', 'HttpRequestJob.handle', 0, 0, NULL, NULL, 1, '* * * * * ?', NULL, '{\"url\":\"https://www.baidu.com\",\"method\":\"get\"}', NULL, '访问百度首页', '2023-11-10 00:31:44.197779', '2023-11-10 00:31:44.206935');
INSERT INTO `sys_task` (`id`, `name`, `service`, `type`, `status`, `start_time`, `end_time`, `limit`, `cron`, `every`, `data`, `job_opts`, `remark`, `created_at`, `updated_at`) VALUES (5, '发送邮箱', 'EmailJob.send', 0, 0, NULL, NULL, -1, '0 0 0 1 * ?', NULL, '{\"subject\":\"这是标题\",\"to\":\"zeyu57@163.com\",\"content\":\"这是正文\"}', NULL, '每月发送邮箱', '2023-11-10 00:31:44.197779', '2023-11-10 00:31:44.206935');
COMMIT;

-- ----------------------------
-- Table structure for sys_task_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_task_log`;
CREATE TABLE `sys_task_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `consume_time` int DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_f4d9c36052fdb188ff5c089454b` (`task_id`),
  CONSTRAINT `FK_f4d9c36052fdb188ff5c089454b` FOREIGN KEY (`task_id`) REFERENCES `sys_task` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_task_log
-- ----------------------------
BEGIN;
INSERT INTO `sys_task_log` (`id`, `task_id`, `status`, `detail`, `consume_time`, `created_at`, `updated_at`) VALUES (1, 3, 1, NULL, 0, '2024-02-05 03:06:22.037448', '2024-02-05 03:06:22.037448');
INSERT INTO `sys_task_log` (`id`, `task_id`, `status`, `detail`, `consume_time`, `created_at`, `updated_at`) VALUES (2, 2, 1, NULL, 0, '2024-02-10 09:42:21.738712', '2024-02-10 09:42:21.738712');
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `psalt` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint DEFAULT '1',
  `qq` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_9e7164b2f1ea1348bc0eb0a7da` (`username`) USING BTREE,
  KEY `FK_96bde34263e2ae3b46f011124ac` (`dept_id`),
  CONSTRAINT `FK_96bde34263e2ae3b46f011124ac` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` (`id`, `username`, `password`, `avatar`, `email`, `phone`, `remark`, `psalt`, `status`, `qq`, `created_at`, `updated_at`, `nickname`, `dept_id`) VALUES (1, 'admin', 'a11571e778ee85e82caae2d980952546', 'https://thirdqq.qlogo.cn/g?b=qq&s=100&nk=1743369777', '1743369777@qq.com', '10086', '管理员', 'xQYCspvFb8cAW6GG1pOoUGTLqsuUSO3d', 1, '1743369777', '2023-11-10 00:31:44.104382', '2024-01-29 09:49:43.000000', 'bqy', 1);
INSERT INTO `sys_user` (`id`, `username`, `password`, `avatar`, `email`, `phone`, `remark`, `psalt`, `status`, `qq`, `created_at`, `updated_at`, `nickname`, `dept_id`) VALUES (2, 'user', 'dbd89546dec743f82bb9073d6ac39361', 'https://thirdqq.qlogo.cn/g?b=qq&s=100&nk=1743369777', 'luffy@qq.com', '10010', '王路飞', 'qlovDV7pL5dPYPI3QgFFo1HH74nP6sJe', 1, '1743369777', '2023-11-10 00:31:44.104382', '2024-01-29 09:49:57.000000', 'luffy', 8);
INSERT INTO `sys_user` (`id`, `username`, `password`, `avatar`, `email`, `phone`, `remark`, `psalt`, `status`, `qq`, `created_at`, `updated_at`, `nickname`, `dept_id`) VALUES (8, 'developer', 'f03fa2a99595127b9a39587421d471f6', '/upload/cfd0d14459bc1a47-202402032141838.jpeg', 'nami@qq.com', '10000', '小贼猫', 'NbGM1z9Vhgo7f4dd2I7JGaGP12RidZdE', 1, '1743369777', '2023-11-10 00:31:44.104382', '2024-02-03 21:41:18.000000', '娜美', 7);
COMMIT;

-- ----------------------------
-- Table structure for sys_user_roles
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_roles`;
CREATE TABLE `sys_user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `IDX_96311d970191a044ec048011f4` (`user_id`),
  KEY `IDX_6d61c5b3f76a3419d93a421669` (`role_id`),
  CONSTRAINT `FK_6d61c5b3f76a3419d93a4216695` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`),
  CONSTRAINT `FK_96311d970191a044ec048011f44` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of sys_user_roles
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_roles` (`user_id`, `role_id`) VALUES (1, 1);
INSERT INTO `sys_user_roles` (`user_id`, `role_id`) VALUES (2, 2);
INSERT INTO `sys_user_roles` (`user_id`, `role_id`) VALUES (8, 2);
COMMIT;

-- ----------------------------
-- Table structure for todo
-- ----------------------------
DROP TABLE IF EXISTS `todo`;
CREATE TABLE `todo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_9cb7989853c4cb7fe427db4b260` (`user_id`),
  CONSTRAINT `FK_9cb7989853c4cb7fe427db4b260` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of todo
-- ----------------------------
BEGIN;
INSERT INTO `todo` (`id`, `value`, `user_id`, `status`, `created_at`, `updated_at`) VALUES (1, 'nest.js', NULL, 0, '2023-11-10 00:31:44.139730', '2023-11-10 00:31:44.147629');
COMMIT;

-- ----------------------------
-- Table structure for tool_storage
-- ----------------------------
DROP TABLE IF EXISTS `tool_storage`;
CREATE TABLE `tool_storage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件名',
  `fileName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实文件名',
  `ext_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of tool_storage
-- ----------------------------
BEGIN;
INSERT INTO `tool_storage` (`id`, `created_at`, `updated_at`, `name`, `fileName`, `ext_name`, `path`, `type`, `size`, `user_id`) VALUES (78, '2024-02-03 21:41:16.851178', '2024-02-03 21:41:16.851178', 'cfd0d14459bc1a47-202402032141838.jpeg', 'cfd0d14459bc1a47.jpeg', 'jpeg', '/upload/cfd0d14459bc1a47-202402032141838.jpeg', '图片', '33.92 KB', 1);
COMMIT;

-- ----------------------------
-- Table structure for user_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS `user_access_tokens`;
CREATE TABLE `user_access_tokens` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expired_at` datetime NOT NULL COMMENT '令牌过期时间',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '令牌创建时间',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e9d9d0c303432e4e5e48c1c3e90` (`user_id`),
  CONSTRAINT `FK_e9d9d0c303432e4e5e48c1c3e90` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user_access_tokens
-- ----------------------------
BEGIN;
INSERT INTO `user_access_tokens` (`id`, `value`, `expired_at`, `created_at`, `user_id`) VALUES ('09cf7b0a-62e0-45ee-96b0-e31de32361e0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDc1MDkxNTd9.0gtKlcxrxQ-TarEai2lsBnfMc852ZDYHeSjjhpo5Fn8', '2024-02-11 04:05:58', '2024-02-10 04:05:57.696509', 1);
INSERT INTO `user_access_tokens` (`id`, `value`, `expired_at`, `created_at`, `user_id`) VALUES ('3f7dffae-db1f-47dc-9677-5c956c3de39e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDczMTEzMDJ9.D5Qpht1RquKor8WtgfGAcCp8LwG7z3FZhIwbyQzhDmE', '2024-02-08 21:08:22', '2024-02-07 21:08:22.130066', 1);
INSERT INTO `user_access_tokens` (`id`, `value`, `expired_at`, `created_at`, `user_id`) VALUES ('40342c3e-194c-42eb-adee-189389839195', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDczNzIxNjF9.tRQOxhB-01Pcut5MXm4L5D1OrbMJfS4LfUys0XB4kWs', '2024-02-09 14:02:41', '2024-02-08 14:02:41.081164', 1);
INSERT INTO `user_access_tokens` (`id`, `value`, `expired_at`, `created_at`, `user_id`) VALUES ('9d1ba8e9-dffc-4b15-b21f-4a90f196e39c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDc1Mjc5MDV9.7LeiS3LBBdiAc7YrULWpmnI1oNSvR79K-qjEOlBYOnI', '2024-02-11 09:18:26', '2024-02-10 09:18:25.656695', 1);
INSERT INTO `user_access_tokens` (`id`, `value`, `expired_at`, `created_at`, `user_id`) VALUES ('edbed8fb-bfc7-4fc7-a012-e9fca8ef93fb', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDczNzIxMjd9.VRuJHGca2IPrdfTyW09wfhht4x8JX207pKG-0aZyF60', '2024-02-09 14:02:07', '2024-02-08 14:02:07.390658', 1);
COMMIT;

-- ----------------------------
-- Table structure for user_refresh_tokens
-- ----------------------------
DROP TABLE IF EXISTS `user_refresh_tokens`;
CREATE TABLE `user_refresh_tokens` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expired_at` datetime NOT NULL COMMENT '令牌过期时间',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '令牌创建时间',
  `accessTokenId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_1dfd080c2abf42198691b60ae3` (`accessTokenId`),
  CONSTRAINT `FK_1dfd080c2abf42198691b60ae39` FOREIGN KEY (`accessTokenId`) REFERENCES `user_access_tokens` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user_refresh_tokens
-- ----------------------------
BEGIN;
INSERT INTO `user_refresh_tokens` (`id`, `value`, `expired_at`, `created_at`, `accessTokenId`) VALUES ('202d0969-6721-4f6f-bf34-f0d1931d4d01', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiRTRpOXVYei1TdldjdWRnclFXVmFXIiwiaWF0IjoxNzA3MzcyMTYxfQ.NOQufR5EAPE2uZoyenmAj9H7S7qo4d6W1aW2ojDxZQc', '2024-03-09 14:02:41', '2024-02-08 14:02:41.091492', '40342c3e-194c-42eb-adee-189389839195');
INSERT INTO `user_refresh_tokens` (`id`, `value`, `expired_at`, `created_at`, `accessTokenId`) VALUES ('461f9b7c-e500-4762-a6d9-f9ea47163064', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoicXJvTWNYMnhNRW5uRmZGWkQtaUx0IiwiaWF0IjoxNzA3MzExMzAyfQ.dFIWCePZnn2z2Qv1D5PKBKXUwVDI0Gp091MIOi9jiIo', '2024-03-08 21:08:22', '2024-02-07 21:08:22.145464', '3f7dffae-db1f-47dc-9677-5c956c3de39e');
INSERT INTO `user_refresh_tokens` (`id`, `value`, `expired_at`, `created_at`, `accessTokenId`) VALUES ('b375e623-2d82-48f0-9b7a-9058e3850cc6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoicDhUMzdGNFFaUDJHLU5yNGVha21wIiwiaWF0IjoxNzA3MzcyMTI3fQ.fn3It6RKIxXlKmqixg0BMmY_YsQmAxtetueqW-0y1IM', '2024-03-09 14:02:07', '2024-02-08 14:02:07.410008', 'edbed8fb-bfc7-4fc7-a012-e9fca8ef93fb');
INSERT INTO `user_refresh_tokens` (`id`, `value`, `expired_at`, `created_at`, `accessTokenId`) VALUES ('e620ccc1-9e40-4387-9f21-f0722e535a63', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNE5WdmFIc2hWaU05ZFh0QnVBaHNsIiwiaWF0IjoxNzA3NTI3OTA1fQ.zzyGX0mOJe6KWpTzIi7We9d9c0MRuDeGC86DMB0Vubs', '2024-03-11 09:18:26', '2024-02-10 09:18:25.664251', '9d1ba8e9-dffc-4b15-b21f-4a90f196e39c');
INSERT INTO `user_refresh_tokens` (`id`, `value`, `expired_at`, `created_at`, `accessTokenId`) VALUES ('f9a003e8-91b7-41ee-979e-e39cca3534ec', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiWGJQdl9SVjFtUl80N0o0TGF0QlV5IiwiaWF0IjoxNzA3NTA5MTU3fQ.oEVdWSigTpAQY7F8MlwBnedldH0sJT1YF1Mt0ZUbIw4', '2024-03-11 04:05:58', '2024-02-10 04:05:57.706763', '09cf7b0a-62e0-45ee-96b0-e31de32361e0');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
