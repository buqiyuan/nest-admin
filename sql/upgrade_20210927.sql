-- `sf-admin`.sys_config definition

DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_2c363c25cf99bcaab3a7f389ba` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

BEGIN;
--
-- 转存表中的数据 `sys_menu`
--
INSERT INTO `sys_menu` (`created_at`, `updated_at`, `id`, `parent_id`, `name`, `router`, `perms`, `type`, `icon`, `order_num`, `view_path`, `keepalive`, `is_show`) VALUES
('2021-09-28 03:22:42.570291', '2021-09-28 03:22:42.570291', 85, 1, '参数配置', '/sys/param-config', NULL, 0, 'param-config', 255, NULL, 1, 1),
('2021-09-28 03:25:47.197582', '2021-09-28 03:25:47.197582', 86, 85, '参数列表', '/sys/param-config/list', NULL, 1, 'param-config-list', 255, 'views/system/param-config/config-list', 1, 1),
('2021-09-28 03:26:27.243134', '2021-09-28 07:55:44.000000', 87, 86, '查询', NULL, 'sys:param-config:page,sys:param-config:info', 2, NULL, 255, NULL, 1, 1),
('2021-09-28 07:56:03.132765', '2021-09-28 07:56:03.132765', 88, 86, '新增', NULL, 'sys:param-config:add', 2, NULL, 255, NULL, 1, 1),
('2021-09-28 07:56:26.180445', '2021-09-28 07:56:26.180445', 89, 86, '删除', NULL, 'sys:param-config:delete', 2, NULL, 255, NULL, 1, 1),
('2021-09-28 07:56:47.269451', '2021-09-28 07:56:47.269451', 90, 86, '更新', NULL, 'sys:param-config:update', 2, NULL, 255, NULL, 1, 1),
('2021-10-11 09:53:38.305927', '2021-10-12 07:20:18.000000', 91, 37, '服务监控', '/sys/monitor/serve', NULL, 1, 'serve', 255, 'views/system/monitor/serve', 1, 1);

--
-- 转存表中的数据 `sys_config`
--
INSERT INTO `sys_config` (created_at,updated_at,`key`,name,value,remark) VALUES
	 ('2021-09-28 03:14:05.256120000','2021-09-28 03:14:05.256120000','sys_user_initPassword','初始密码','123456','创建管理员账号的初始密码');
COMMIT;