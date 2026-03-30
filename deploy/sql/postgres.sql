/*
 Nest Admin PostgreSQL Database - Final Version
 
 结合TypeORM生成的正确表结构和完整初始化数据
 Source Server Type    : PostgreSQL
 Target Server Type    : PostgreSQL
 File Encoding         : UTF8
 
 Date: 17/06/2025
*/

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

-- ----------------------------
-- Table structure for sys_captcha_log
-- ----------------------------
DROP TABLE IF EXISTS public.sys_captcha_log CASCADE;
CREATE TABLE public.sys_captcha_log (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	user_id int4 NULL,
	account varchar NULL,
	code varchar NULL,
	provider varchar NULL,
	CONSTRAINT "PK_f9bbb657efa0008a34349f0b685" PRIMARY KEY (id)
);

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS public.sys_config CASCADE;
CREATE TABLE public.sys_config (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	"name" varchar(50) NOT NULL,
	"key" varchar(50) NOT NULL,
	value varchar NULL,
	remark varchar NULL,
	CONSTRAINT "PK_8791cee36df4c4d04a9acffed27" PRIMARY KEY (id),
	CONSTRAINT "UQ_2c363c25cf99bcaab3a7f389ba6" UNIQUE (key)
);

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS public.sys_dict_type CASCADE;
CREATE TABLE public.sys_dict_type (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	create_by int4 NULL,
	update_by int4 NULL,
	"name" varchar(50) NOT NULL,
	code varchar(50) NOT NULL,
	status int2 DEFAULT '1'::smallint NOT NULL,
	remark varchar NULL,
	CONSTRAINT "PK_d19dd3a7b82c198dc6fe86bfaf1" PRIMARY KEY (id),
	CONSTRAINT "UQ_74d0045ff7fab9f67adc0b1bda9" UNIQUE (code)
);

-- ----------------------------
-- Table structure for sys_dict_item
-- ----------------------------
DROP TABLE IF EXISTS public.sys_dict_item CASCADE;
CREATE TABLE public.sys_dict_item (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	create_by int4 NULL,
	update_by int4 NULL,
	"label" varchar(50) NOT NULL,
	value varchar(50) NOT NULL,
	"orderNo" int4 NULL,
	status int2 DEFAULT '1'::smallint NOT NULL,
	remark varchar NULL,
	type_id int4 NULL,
	CONSTRAINT "PK_88f1e2a3113ea467e938dfb8af3" PRIMARY KEY (id)
);

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS public.sys_dept CASCADE;
CREATE TABLE public.sys_dept (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	create_by int4 NULL,
	update_by int4 NULL,
	"name" varchar NOT NULL,
	"orderNo" int4 DEFAULT 0 NULL,
	mpath varchar DEFAULT ''::character varying NULL,
	"parentId" int4 NULL,
	CONSTRAINT "PK_bcff95950c9e1012cf91f2d3134" PRIMARY KEY (id),
	CONSTRAINT "FK_c75280b01c49779f2323536db67" FOREIGN KEY ("parentId") REFERENCES public.sys_dept(id) ON DELETE SET NULL
);

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS public.sys_menu CASCADE;
CREATE TABLE public.sys_menu (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	create_by int4 NULL,
	update_by int4 NULL,
	parent_id int4 NULL,
	"name" varchar NOT NULL,
	"path" varchar NULL,
	"permission" varchar NULL,
	"type" int2 DEFAULT '0'::smallint NOT NULL,
	icon varchar DEFAULT ''::character varying NULL,
	order_no int4 DEFAULT 0 NULL,
	component varchar NULL,
	is_ext bool DEFAULT false NOT NULL,
	ext_open_mode int2 DEFAULT '1'::smallint NOT NULL,
	keep_alive int2 DEFAULT '1'::smallint NOT NULL,
	"show" int2 DEFAULT '1'::smallint NOT NULL,
	active_menu varchar NULL,
	status int2 DEFAULT '1'::smallint NOT NULL,
	CONSTRAINT "PK_8b22e66a03950819c40639e58f8" PRIMARY KEY (id)
);

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS public.sys_role CASCADE;
CREATE TABLE public.sys_role (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	create_by int4 NULL,
	update_by int4 NULL,
	"name" varchar(50) NOT NULL,
	value varchar NOT NULL,
	remark varchar NULL,
	status int2 DEFAULT '1'::smallint NULL,
	"default" bool NULL,
	CONSTRAINT "PK_12875ba0686cf845f353704dc7b" PRIMARY KEY (id),
	CONSTRAINT "UQ_05edc0a51f41bb16b7d8137da94" UNIQUE (value),
	CONSTRAINT "UQ_223de54d6badbe43a5490450c30" UNIQUE (name)
);

-- ----------------------------
-- Table structure for sys_task
-- ----------------------------
DROP TABLE IF EXISTS public.sys_task CASCADE;
CREATE TABLE public.sys_task (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	"name" varchar(50) NOT NULL,
	service varchar NOT NULL,
	"type" int2 DEFAULT '0'::smallint NOT NULL,
	status int2 DEFAULT '1'::smallint NOT NULL,
	start_time timestamp NULL,
	end_time timestamp NULL,
	"limit" int4 DEFAULT 0 NULL,
	cron varchar NULL,
	"every" int4 NULL,
	"data" text NULL,
	job_opts text NULL,
	remark varchar NULL,
	CONSTRAINT "PK_3d937a6cf6a18816271f8bea8bf" PRIMARY KEY (id),
	CONSTRAINT "UQ_ef8e5ab5ef2fe0ddb1428439ef4" UNIQUE (name)
);

-- ----------------------------
-- Table structure for tool_storage
-- ----------------------------
DROP TABLE IF EXISTS public.tool_storage CASCADE;
CREATE TABLE public.tool_storage (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	"name" varchar(200) NOT NULL,
	"fileName" varchar(200) NULL,
	ext_name varchar NULL,
	"path" varchar NOT NULL,
	"type" varchar NULL,
	"size" varchar NULL,
	user_id int4 NULL,
	CONSTRAINT "PK_359622b58f376fc270d8d379ba9" PRIMARY KEY (id)
);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS public.sys_user CASCADE;
CREATE TABLE public.sys_user (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	username varchar NOT NULL,
	"password" varchar NOT NULL,
	psalt varchar(32) NOT NULL,
	nickname varchar NULL,
	avatar varchar NULL,
	qq varchar NULL,
	email varchar NULL,
	phone varchar NULL,
	remark varchar NULL,
	status int2 DEFAULT '1'::smallint NULL,
	dept_id int4 NULL,
	CONSTRAINT "PK_b286272b5d723fa76dca97a159e" PRIMARY KEY (id),
	CONSTRAINT "UQ_9e7164b2f1ea1348bc0eb0a7da4" UNIQUE (username),
	CONSTRAINT "FK_96bde34263e2ae3b46f011124ac" FOREIGN KEY (dept_id) REFERENCES public.sys_dept(id)
);

-- ----------------------------
-- Table structure for sys_role_menus
-- ----------------------------
DROP TABLE IF EXISTS public.sys_role_menus CASCADE;
CREATE TABLE public.sys_role_menus (
	role_id int4 NOT NULL,
	menu_id int4 NOT NULL,
	CONSTRAINT "PK_9eac9bab0f67d718d7e23685c81" PRIMARY KEY (role_id, menu_id),
	CONSTRAINT "FK_2b95fdc95b329d66c18f5baed6d" FOREIGN KEY (menu_id) REFERENCES public.sys_menu(id) ON DELETE CASCADE,
	CONSTRAINT "FK_35ce749b04d57e226d059e0f633" FOREIGN KEY (role_id) REFERENCES public.sys_role(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------
-- Table structure for sys_task_log
-- ----------------------------
DROP TABLE IF EXISTS public.sys_task_log CASCADE;
CREATE TABLE public.sys_task_log (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	status int2 DEFAULT '0'::smallint NOT NULL,
	detail text NULL,
	consume_time int4 DEFAULT 0 NULL,
	task_id int4 NULL,
	CONSTRAINT "PK_9baa420f823a571788fc60da9e4" PRIMARY KEY (id),
	CONSTRAINT "FK_f4d9c36052fdb188ff5c089454b" FOREIGN KEY (task_id) REFERENCES public.sys_task(id)
);

-- ----------------------------
-- Table structure for sys_user_roles
-- ----------------------------
DROP TABLE IF EXISTS public.sys_user_roles CASCADE;
CREATE TABLE public.sys_user_roles (
	user_id int4 NOT NULL,
	role_id int4 NOT NULL,
	CONSTRAINT "PK_a86802699e6dfa8e45f2219cb39" PRIMARY KEY (user_id, role_id),
	CONSTRAINT "FK_6d61c5b3f76a3419d93a4216695" FOREIGN KEY (role_id) REFERENCES public.sys_role(id),
	CONSTRAINT "FK_96311d970191a044ec048011f44" FOREIGN KEY (user_id) REFERENCES public.sys_user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------
-- Table structure for todo
-- ----------------------------
DROP TABLE IF EXISTS public.todo CASCADE;
CREATE TABLE public.todo (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	value varchar NOT NULL,
	status int2 DEFAULT '0'::smallint NOT NULL,
	user_id int4 NULL,
	CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY (id),
	CONSTRAINT "FK_9cb7989853c4cb7fe427db4b260" FOREIGN KEY (user_id) REFERENCES public.sys_user(id)
);

-- ----------------------------
-- Table structure for user_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS public.user_access_tokens CASCADE;
CREATE TABLE public.user_access_tokens (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	value varchar(500) NOT NULL,
	expired_at timestamp NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	user_id int4 NULL,
	CONSTRAINT "PK_f07c49baf74e5d699c83e2ec2bd" PRIMARY KEY (id),
	CONSTRAINT "FK_e9d9d0c303432e4e5e48c1c3e90" FOREIGN KEY (user_id) REFERENCES public.sys_user(id) ON DELETE CASCADE
);

-- ----------------------------
-- Table structure for user_refresh_tokens
-- ----------------------------
DROP TABLE IF EXISTS public.user_refresh_tokens CASCADE;
CREATE TABLE public.user_refresh_tokens (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	value varchar(500) NOT NULL,
	expired_at timestamp NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	"accessTokenId" uuid NULL,
	CONSTRAINT "PK_c5f5cf35bd8aabd1ebe9bb13409" PRIMARY KEY (id),
	CONSTRAINT "REL_1dfd080c2abf42198691b60ae3" UNIQUE ("accessTokenId"),
	CONSTRAINT "FK_1dfd080c2abf42198691b60ae39" FOREIGN KEY ("accessTokenId") REFERENCES public.user_access_tokens(id) ON DELETE CASCADE
);

-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
DROP TABLE IF EXISTS public.sys_login_log CASCADE;
CREATE TABLE public.sys_login_log (
	id serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	ip varchar NULL,
	address varchar NULL,
	provider varchar NULL,
	ua varchar(500) NULL,
	user_id int4 NULL,
	CONSTRAINT "PK_58546a7f24713923b02c0a7e252" PRIMARY KEY (id),
	CONSTRAINT "FK_3029712e0df6a28edaee46fd470" FOREIGN KEY (user_id) REFERENCES public.sys_user(id) ON DELETE CASCADE
);

-- ----------------------------
-- 添加外键约束
-- ----------------------------
ALTER TABLE public.sys_dict_item ADD CONSTRAINT "FK_sys_dict_item_type" FOREIGN KEY (type_id) REFERENCES public.sys_dict_type(id) ON DELETE CASCADE;

-- ----------------------------
-- 创建索引
-- ----------------------------
CREATE INDEX "IDX_2b95fdc95b329d66c18f5baed6" ON public.sys_role_menus USING btree (menu_id);
CREATE INDEX "IDX_35ce749b04d57e226d059e0f63" ON public.sys_role_menus USING btree (role_id);
CREATE INDEX "IDX_6d61c5b3f76a3419d93a421669" ON public.sys_user_roles USING btree (role_id);
CREATE INDEX "IDX_96311d970191a044ec048011f4" ON public.sys_user_roles USING btree (user_id);

-- ----------------------------
-- 插入初始数据
-- ----------------------------

-- Records of sys_config
INSERT INTO sys_config (id, key, name, value, remark, created_at, updated_at) VALUES 
(1, 'sys_user_initPassword', '初始密码', '123456', '创建管理员账号的初始密码', '2023-11-10 00:31:44.154921', '2023-11-10 00:31:44.161263'),
(2, 'sys_api_token', 'API Token', 'nest-admin', '用于请求 @ApiToken 的控制器', '2023-11-10 00:31:44.154921', '2024-01-29 09:52:27.000000');

-- Records of sys_dept
INSERT INTO sys_dept (id, name, "orderNo", mpath, "parentId", created_at, updated_at) VALUES 
(1, '华东分部', 1, '1.', NULL, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(2, '研发部', 1, '1.2.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(3, '市场部', 2, '1.3.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(4, '商务部', 3, '1.4.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(5, '财务部', 4, '1.5.', 1, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(6, '华南分部', 2, '6.', NULL, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(7, '西北分部', 3, '7.', NULL, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(8, '研发部', 1, '6.8.', 6, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709'),
(9, '市场部', 1, '6.9.', 6, '2023-11-10 00:31:43.996025', '2023-11-10 00:31:44.008709');

-- Records of sys_dict_type
INSERT INTO sys_dict_type (id, created_at, updated_at, create_by, update_by, name, status, remark, code) VALUES 
(1, '2024-01-28 08:19:12.777447', '2024-02-08 13:05:10.000000', 1, 1, '性别', 1, '性别单选', 'sys_user_gender'),
(2, '2024-01-28 08:38:41.235185', '2024-01-29 02:11:33.000000', 1, 1, '菜单显示状态', 1, '菜单显示状态', 'sys_show_hide');

-- Records of sys_dict_item
INSERT INTO sys_dict_item (id, created_at, updated_at, create_by, update_by, label, value, "orderNo", status, remark, type_id) VALUES 
(1, '2024-01-29 01:24:51.846135', '2024-01-29 02:23:19.000000', 1, 1, '男', '1', 3, 1, '性别男', 1),
(2, '2024-01-29 01:32:58.458741', '2024-01-29 01:58:20.000000', 1, 1, '女', '0', 2, 1, '性别女', 1),
(3, '2024-01-29 01:59:17.805394', '2024-01-29 14:37:18.000000', 1, 1, '人妖王', '3', 0, 1, '安布里奥·伊万科夫', 1),
(5, '2024-01-29 02:13:01.782466', '2024-01-29 02:13:01.782466', 1, 1, '显示', '1', 0, 1, '显示菜单', 2),
(6, '2024-01-29 02:13:31.134721', '2024-01-29 02:13:31.134721', 1, 1, '隐藏', '0', 0, 1, '隐藏菜单', 2);

-- Records of sys_user
INSERT INTO sys_user (id, username, password, avatar, email, phone, remark, psalt, status, qq, created_at, updated_at, nickname, dept_id) VALUES 
(1, 'admin', 'a11571e778ee85e82caae2d980952546', 'https://thirdqq.qlogo.cn/g?b=qq&s=100&nk=1743369777', '1743369777@qq.com', '10086', '管理员', 'xQYCspvFb8cAW6GG1pOoUGTLqsuUSO3d', 1, '1743369777', '2023-11-10 00:31:44.104382', '2024-01-29 09:49:43.000000', 'bqy', 1),
(2, 'user', 'dbd89546dec743f82bb9073d6ac39361', 'https://thirdqq.qlogo.cn/g?b=qq&s=100&nk=1743369777', 'luffy@qq.com', '10010', '王路飞', 'qlovDV7pL5dPYPI3QgFFo1HH74nP6sJe', 1, '1743369777', '2023-11-10 00:31:44.104382', '2024-01-29 09:49:57.000000', 'luffy', 8),
(8, 'developer', 'f03fa2a99595127b9a39587421d471f6', '/upload/cfd0d14459bc1a47-202402032141838.jpeg', 'nami@qq.com', '10000', '小贼猫', 'NbGM1z9Vhgo7f4dd2I7JGaGP12RidZdE', 1, '1743369777', '2023-11-10 00:31:44.104382', '2024-02-03 21:41:18.000000', '娜美', 7);

-- Records of sys_role
INSERT INTO sys_role (id, value, name, remark, status, created_at, updated_at, "default") VALUES 
(1, 'admin', '管理员', '超级管理员', 1, '2023-11-10 00:31:44.058463', '2024-01-28 21:08:39.000000', NULL),
(2, 'user', '用户', '', 1, '2023-11-10 00:31:44.058463', '2024-01-30 18:44:45.000000', true),
(9, 'test', '测试', NULL, 1, '2024-01-23 22:46:52.408827', '2024-01-30 01:04:52.000000', NULL);

-- Records of sys_user_roles
INSERT INTO sys_user_roles (user_id, role_id) VALUES 
(1, 1),
(2, 2),
(8, 2);

-- Records of sys_menu
INSERT INTO sys_menu (id, parent_id, path, name, permission, type, icon, order_no, component, is_ext, ext_open_mode, keep_alive, show, active_menu, status, created_at, updated_at) VALUES 
(1, NULL, '/system', '系统管理', '', 0, 'ant-design:setting-outlined', 254, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(2, 1, '/system/user', '用户管理', 'system:user:list', 1, 'ant-design:user-outlined', 0, 'system/user/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(3, 1, '/system/role', '角色管理', 'system:role:list', 1, 'ep:user', 1, 'system/role/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(4, 1, '/system/menu', '菜单管理', 'system:menu:list', 1, 'ep:menu', 2, 'system/menu/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(5, 1, '/system/monitor', '系统监控', '', 0, 'ep:monitor', 5, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(6, 5, '/system/monitor/online', '在线用户', 'system:online:list', 1, '', 0, 'system/monitor/online/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(7, 5, '/sys/monitor/login-log', '登录日志', 'system:log:login:list', 1, '', 0, 'system/monitor/log/login/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(8, 5, '/system/monitor/serve', '服务监控', 'system:serve:stat', 1, '', 4, 'system/monitor/serve/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(9, 1, '/system/schedule', '任务调度', '', 0, 'ant-design:schedule-filled', 6, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(10, 9, '/system/task', '任务管理', '', 1, '', 0, 'system/schedule/task/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(11, 9, '/system/task/log', '任务日志', 'system:task:list', 1, '', 0, 'system/schedule/log/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(12, NULL, '/document', '文档', '', 0, 'ion:tv-outline', 2, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(14, 12, 'https://www.typeorm.org/', 'Typeorm中文文档(外链)', NULL, 1, '', 3, NULL, true, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(15, 12, 'https://docs.nestjs.cn/', 'Nest.js中文文档(内嵌)', '', 1, '', 4, NULL, true, 2, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(20, 2, NULL, '新增', 'system:user:create', 2, '', 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(21, 2, '', '删除', 'system:user:delete', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(22, 2, '', '更新', 'system:user:update', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(23, 2, '', '查询', 'system:user:read', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(24, 3, '', '新增', 'system:role:create', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(25, 3, '', '删除', 'system:role:delete', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(26, 3, '', '修改', 'system:role:update', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(27, 3, '', '查询', 'system:role:read', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(28, 4, NULL, '新增', 'system:menu:create', 2, NULL, 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(29, 4, NULL, '删除', 'system:menu:delete', 2, NULL, 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(30, 4, '', '修改', 'system:menu:update', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(31, 4, NULL, '查询', 'system:menu:read', 2, NULL, 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(32, 6, '', '下线', 'system:online:kick', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(34, 10, '', '新增', 'system:task:create', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(35, 10, '', '删除', 'system:task:delete', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(36, 10, '', '执行一次', 'system:task:once', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(37, 10, '', '查询', 'system:task:read', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(38, 10, '', '运行', 'system:task:start', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(39, 10, '', '暂停', 'system:task:stop', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(40, 10, '', '更新', 'system:task:update', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(41, 7, '', '查询登录日志', 'system:log:login:list', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(42, 7, '', '查询任务日志', 'system:log:task:list', 2, '', 0, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(43, NULL, '/about', '关于', '', 1, 'ant-design:info-circle-outlined', 260, 'account/about', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(48, NULL, '/tool', '系统工具', NULL, 0, 'ant-design:tool-outlined', 254, '', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(49, 48, '/tool/email', '邮件工具', 'system:tools:email', 1, 'ant-design:send-outlined', 1, 'tool/email/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(50, 49, NULL, '发送邮件', 'tools:email:send', 2, '', 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(51, 48, '/tool/storage', '存储管理', 'tool:storage:list', 1, 'ant-design:appstore-outlined', 2, 'tool/storage/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(52, 51, NULL, '文件上传', 'upload:upload', 2, '', 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(53, 51, NULL, '文件删除', 'tool:storage:delete', 2, '', 2, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(54, 2, NULL, '修改密码', 'system:user:password', 2, '', 5, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(56, 1, '/system/dict-type', '字典管理', 'system:dict-type:list', 1, 'ant-design:book-outlined', 4, 'system/dict-type/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(57, 56, NULL, '新增', 'system:dict-type:create', 2, '', 1, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(58, 56, NULL, '更新', 'system:dict-type:update', 2, '', 2, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(59, 56, NULL, '删除', 'system:dict-type:delete', 2, '', 3, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(60, 56, NULL, '查询', 'system:dict-type:info', 2, '', 4, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(61, 1, '/system/dept', '部门管理', 'system:dept:list', 1, 'ant-design:deployment-unit-outlined', 3, 'system/dept/index', false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(62, 61, NULL, '新增', 'system:dept:create', 2, '', 1, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(63, 61, NULL, '更新', 'system:dept:update', 2, '', 2, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(64, 61, NULL, '删除', 'system:dept:delete', 2, '', 3, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(65, 61, NULL, '查询', 'system:dept:read', 2, '', 4, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(68, 5, '/health', '健康检查', '', 1, '', 4, '', false, 1, 0, 0, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(69, 68, NULL, '网络', 'app:health:network', 2, '', 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(70, 68, NULL, '数据库', 'app:health: database', 2, '', 0, NULL, false, 1, 0, 1, NULL, 1, '2023-11-10 00:31:44.023393', '2024-02-28 22:05:52.102649'),
(86, 1, '/param-config', '参数配置', 'system:param-config:list', 1, 'ep:edit', 255, 'system/param-config/index', false, 1, 0, 1, NULL, 1, '2024-01-10 17:34:52.569663', '2024-01-19 02:11:27.000000'),
(87, 86, NULL, '查询', 'system:param-config:read', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-10 17:39:20.983241', '2024-02-28 22:05:52.102649'),
(88, 86, NULL, '新增', 'system:param-config:create', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-10 17:39:57.543510', '2024-02-28 22:05:52.102649'),
(89, 86, NULL, '更新', 'system:param-config:update', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-10 17:40:27.355944', '2024-02-28 22:05:52.102649'),
(92, 86, NULL, '删除', 'system:param-config:delete', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-10 17:57:32.059887', '2024-02-28 22:05:52.102649'),
(107, 1, 'system/dict-item/:id', '字典项管理', 'system:dict-item:list', 1, 'ant-design:facebook-outlined', 255, 'system/dict-item/index', false, 1, 0, 0, '字典管理', 1, '2024-01-28 09:21:17.409532', '2024-01-30 13:09:47.000000'),
(108, 107, NULL, '新增', 'system:dict-item:create', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-28 09:22:39.401758', '2024-02-28 22:05:52.102649'),
(109, 107, NULL, '更新', 'system:dict-item:update', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-28 09:26:43.911886', '2024-02-28 22:05:52.102649'),
(110, 107, NULL, '删除', 'system:dict-item:delete', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-28 09:27:28.535225', '2024-02-28 22:05:52.102649'),
(111, 107, NULL, '查询', 'system:dict-item:info', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-01-28 09:27:43.894820', '2024-02-28 22:05:52.102649'),
(112, 12, 'https://antdv.com/components/overview-cn', 'antdv文档(内嵌)', NULL, 1, '', 255, NULL, true, 2, 0, 1, NULL, 1, '2024-01-29 09:23:08.407723', '2024-02-28 22:05:52.102649'),
(115, NULL, 'netdisk', '网盘管理', NULL, 0, 'ant-design:cloud-server-outlined', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:00:02.394616', '2024-02-28 22:05:52.102649'),
(116, 115, 'manage', '文件管理', 'netdisk:manage:list', 1, '', 252, 'netdisk/manage', false, 1, 0, 1, NULL, 1, '2024-02-10 08:03:49.837348', '2024-02-10 09:34:41.000000'),
(117, 116, NULL, '创建文件或文件夹', 'netdisk:manage:create', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:40:22.317257', '2024-02-28 22:05:52.102649'),
(118, 116, NULL, '查看文件', 'netdisk:manage:read', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:41:22.008015', '2024-02-28 22:05:52.102649'),
(119, 116, NULL, '更新', 'netdisk:manage:update', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:41:50.691643', '2024-02-28 22:05:52.102649'),
(120, 116, NULL, '删除', 'netdisk:manage:delete', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:42:09.480601', '2024-02-28 22:05:52.102649'),
(121, 116, NULL, '获取文件上传token', 'netdisk:manage:token', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:42:57.688104', '2024-02-28 22:05:52.102649'),
(122, 116, NULL, '添加文件备注', 'netdisk:manage:mark', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:43:40.117321', '2024-02-28 22:05:52.102649'),
(123, 116, NULL, '下载文件', 'netdisk:manage:download', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:44:01.338984', '2024-02-28 22:05:52.102649'),
(124, 116, NULL, '重命名文件或文件夹', 'netdisk:manage:rename', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:44:27.233379', '2024-02-28 22:05:52.102649'),
(125, 116, NULL, '复制文件或文件夹', 'netdisk:manage:copy', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:44:44.725391', '2024-02-28 22:05:52.102649'),
(126, 116, NULL, '剪切文件或文件夹', 'netdisk:manage:cut', 2, '', 255, NULL, false, 1, 0, 1, NULL, 1, '2024-02-10 08:45:21.660511', '2024-02-28 22:05:52.102649'),
(127, 115, 'overview', '网盘概览', 'netdisk:overview:desc', 1, '', 254, 'netdisk/overview', false, 1, 0, 1, NULL, 1, '2024-02-10 09:32:56.981190', '2024-02-10 09:34:18.000000');

-- Records of sys_role_menus
INSERT INTO sys_role_menus (role_id, menu_id) VALUES 
(1, 1),(1, 2),(1, 3),(1, 4),(1, 5),(1, 6),(1, 7),(1, 8),(1, 9),(1, 10),
(1, 11),(1, 12),(1, 14),(1, 15),(1, 20),(1, 21),(1, 22),(1, 23),(1, 24),(1, 25),
(1, 26),(1, 27),(1, 28),(1, 29),(1, 30),(1, 31),(1, 32),(1, 34),(1, 35),(1, 36),
(1, 37),(1, 38),(1, 39),(1, 40),(1, 41),(1, 42),(1, 43),(1, 48),(1, 49),(1, 50),
(1, 51),(1, 52),(1, 53),(1, 54),(1, 56),(1, 57),(1, 58),(1, 59),(1, 60),(1, 61),
(1, 62),(1, 63),(1, 64),(1, 65),(1, 68),(1, 69),(1, 70),(1, 86),(1, 87),(1, 88),
(1, 89),(1, 92),(1, 107),(1, 108),(1, 109),(1, 110),(1, 111),(1, 115),(1, 116),
(1, 117),(1, 118),(1, 119),(1, 120),(1, 121),(1, 122),(1, 123),(1, 124),(1, 125),
(1, 126),(1, 127),
(2, 1),(2, 5),(2, 6),(2, 7),(2, 8),(2, 9),(2, 10),(2, 11),(2, 12),(2, 14),
(2, 15),(2, 32),(2, 34),(2, 35),(2, 36),(2, 37),(2, 38),(2, 39),(2, 40),(2, 41),
(2, 42),(2, 43),(2, 48),(2, 49),(2, 50),(2, 51),(2, 52),(2, 53),(2, 56),(2, 57),
(2, 58),(2, 59),(2, 60),(2, 68),(2, 69),(2, 70),(2, 86),(2, 87),(2, 88),(2, 89),
(2, 92),(2, 107),(2, 108),(2, 109),(2, 110),(2, 111),(2, 112),
(9, 1),(9, 2),(9, 3),(9, 4),(9, 5),(9, 6),(9, 7),(9, 8),(9, 9),(9, 10),
(9, 11),(9, 20),(9, 21),(9, 22),(9, 23),(9, 24),(9, 25),(9, 26),(9, 27),(9, 28),
(9, 29),(9, 30),(9, 31),(9, 32),(9, 34),(9, 35),(9, 36),(9, 37),(9, 38),(9, 39),
(9, 40),(9, 41),(9, 42),(9, 54),(9, 56),(9, 57),(9, 58),(9, 59),(9, 60),(9, 61),
(9, 62),(9, 63),(9, 64),(9, 65),(9, 68),(9, 69),(9, 70),(9, 86),(9, 87),(9, 88),
(9, 89),(9, 92);

-- Records of sys_task
INSERT INTO sys_task (id, name, service, type, status, start_time, end_time, "limit", cron, every, data, job_opts, remark, created_at, updated_at) VALUES 
(2, '定时清空登录日志', 'LogClearJob.clearLoginLog', 0, 1, NULL, NULL, 0, '0 0 3 ? * 1', 0, '', '{"count":1,"key":"__default__:2:::0 0 3 ? * 1","cron":"0 0 3 ? * 1","jobId":2}', '定时清空登录日志', '2023-11-10 00:31:44.197779', '2024-02-28 22:34:53.000000'),
(3, '定时清空任务日志', 'LogClearJob.clearTaskLog', 0, 1, NULL, NULL, 0, '0 0 3 ? * 1', 0, '', '{"count":1,"key":"__default__:3:::0 0 3 ? * 1","cron":"0 0 3 ? * 1","jobId":3}', '定时清空任务日志', '2023-11-10 00:31:44.197779', '2024-02-28 22:34:53.000000'),
(4, '访问百度首页', 'HttpRequestJob.handle', 0, 0, NULL, NULL, 1, '* * * * * ?', NULL, '{"url":"https://www.baidu.com","method":"get"}', NULL, '访问百度首页', '2023-11-10 00:31:44.197779', '2023-11-10 00:31:44.206935'),
(5, '发送邮箱', 'EmailJob.send', 0, 0, NULL, NULL, -1, '0 0 0 1 * ?', NULL, '{"subject":"这是标题","to":"zeyu57@163.com","content":"这是正文"}', NULL, '每月发送邮箱', '2023-11-10 00:31:44.197779', '2023-11-10 00:31:44.206935');

-- Records of sys_task_log
INSERT INTO sys_task_log (id, task_id, status, detail, consume_time, created_at, updated_at) VALUES 
(1, 3, 1, NULL, 0, '2024-02-05 03:06:22.037448', '2024-02-05 03:06:22.037448'),
(2, 2, 1, NULL, 0, '2024-02-10 09:42:21.738712', '2024-02-10 09:42:21.738712');

-- Records of tool_storage
INSERT INTO tool_storage (id, created_at, updated_at, name, "fileName", ext_name, path, type, size, user_id) VALUES 
(78, '2024-02-03 21:41:16.851178', '2024-02-03 21:41:16.851178', 'cfd0d14459bc1a47-202402032141838.jpeg', 'cfd0d14459bc1a47.jpeg', 'jpeg', '/upload/cfd0d14459bc1a47-202402032141838.jpeg', '图片', '33.92 KB', 1);

-- Records of user_access_tokens
INSERT INTO user_access_tokens (id, value, expired_at, created_at, user_id) VALUES 
('09cf7b0a-62e0-45ee-96b0-e31de32361e0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDc1MDkxNTd9.0gtKlcxrxQ-TarEai2lsBnfMc852ZDYHeSjjhpo5Fn8', '2024-02-11 04:05:58', '2024-02-10 04:05:57.696509', 1),
('3f7dffae-db1f-47dc-9677-5c956c3de39e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDczMTEzMDJ9.D5Qpht1RquKor8WtgfGAcCp8LwG7z3FZhIwbyQzhDmE', '2024-02-08 21:08:22', '2024-02-07 21:08:22.130066', 1),
('40342c3e-194c-42eb-adee-189389839195', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDczNzIxNjF9.tRQOxhB-01Pcut5MXm4L5D1OrbMJfS4LfUys0XB4kWs', '2024-02-09 14:02:41', '2024-02-08 14:02:41.081164', 1),
('9d1ba8e9-dffc-4b15-b21f-4a90f196e39c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDc1Mjc5MDV9.7LeiS3LBBdiAc7YrULWpmnI1oNSvR79K-qjEOlBYOnI', '2024-02-11 09:18:26', '2024-02-10 09:18:25.656695', 1),
('edbed8fb-bfc7-4fc7-a012-e9fca8ef93fb', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDczNzIxMjd9.VRuJHGca2IPrdfTyW09wfhht4x8JX207pKG-0aZyF60', '2024-02-09 14:02:07', '2024-02-08 14:02:07.390658', 1);

-- Records of user_refresh_tokens
INSERT INTO user_refresh_tokens (id, value, expired_at, created_at, "accessTokenId") VALUES 
('202d0969-6721-4f6f-bf34-f0d1931d4d01', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiRTRpOXVYei1TdldjdWRnclFXVmFXIiwiaWF0IjoxNzA3MzcyMTYxfQ.NOQufR5EAPE2uZoyenmAj9H7S7qo4d6W1aW2ojDxZQc', '2024-03-09 14:02:41', '2024-02-08 14:02:41.091492', '40342c3e-194c-42eb-adee-189389839195'),
('461f9b7c-e500-4762-a6d9-f9ea47163064', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoicXJvTWNYMnhNRW5uRmZGWkQtaUx0IiwiaWF0IjoxNzA3MzcxMzAyfQ.dFIWCePZnn2z2Qv1D5PKBKXUwVDI0Gp091MIOi9jiIo', '2024-03-08 21:08:22', '2024-02-07 21:08:22.145464', '3f7dffae-db1f-47dc-9677-5c956c3de39e'),
('b375e623-2d82-48f0-9b7a-9058e3850cc6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoicDhUMzdGNFFaUDJHLU5yNGVha21wIiwiaWF0IjoxNzA3MzcyMTI3fQ.fn3It6RKIxXlKmqixg0BMmY_YsQmAxtetueqW-0y1IM', '2024-03-09 14:02:07', '2024-02-08 14:02:07.410008', 'edbed8fb-bfc7-4fc7-a012-e9fca8ef93fb'),
('e620ccc1-9e40-4387-9f21-f0722e535a63', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNE5WdmFIc2hWaU05ZFh0QnVBaHNsIiwiaWF0IjoxNzA3NTI3OTA1fQ.zzyGX0mOJe6KWpTzIi7We9d9c0MRuDeGC86DMB0Vubs', '2024-03-11 09:18:26', '2024-02-10 09:18:25.664251', '9d1ba8e9-dffc-4b15-b21f-4a90f196e39c'),
('f9a003e8-91b7-41ee-979e-e39cca3534ec', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiWGJQdl9SVjFtUl80N0o0TGF0QlV5IiwiaWF0IjoxNzA3NTA5MTU3fQ.oEVdWSigTpAQY7F8MlwBnedldH0sJT1YF1Mt0ZUbIw4', '2024-03-11 04:05:58', '2024-02-10 04:05:57.706763', '09cf7b0a-62e0-45ee-96b0-e31de32361e0');

-- ----------------------------
-- 重置序列
-- ----------------------------
SELECT setval('sys_config_id_seq', 2, true);
SELECT setval('sys_dept_id_seq', 9, true);
SELECT setval('sys_dict_type_id_seq', 2, true);
SELECT setval('sys_dict_item_id_seq', 6, true);
SELECT setval('sys_user_id_seq', 8, true);
SELECT setval('sys_role_id_seq', 9, true);
SELECT setval('sys_menu_id_seq', 127, true);
SELECT setval('sys_task_id_seq', 5, true);
SELECT setval('sys_task_log_id_seq', 2, true);
SELECT setval('tool_storage_id_seq', 78, true);
SELECT setval('todo_id_seq', 1, true); 