CREATE TABLE `az_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nickname` varchar(255) NOT NULL COMMENT '用户昵称',
  `level` tinyint(4) NOT NULL COMMENT '用户等级',
  `password` char(64) NOT NULL COMMENT '密码',
  `create_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `delele_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


CREATE TABLE `az_room` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '房间标题',
  `des` varchar(255) NOT NULL COMMENT '房间简介',
  `open` ENUM('1', '2') DEFAULT '1' COMMENT '1为公开房间, 2为私密房间',
  `from` tinyint(4) NOT NULL COMMENT '媒体来源',
  `from_id` int(11) unsigned NOT NULL COMMENT '媒体来源的id',
  `master_id` int(11) unsigned NOT NULL COMMENT '创建者的用户id',
  `create_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


CREATE TABLE `az_online` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `li` text COMMENT '以逗号分隔的数组',
  `create_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;